// Conteúdo completo e modificado para: src/importacao/importacao.service.ts

import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as pdfParse from 'pdf-parse';
import { HistoricoImportacao, StatusImportacao } from './entities/historico-importacao.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { ProdutoExtraidoDto } from './dto/produto-extraido.dto';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';
import { Venda } from '../vendas/entities/venda.entity';

@Injectable()
export class ImportacaoService {
  private readonly logger = new Logger(ImportacaoService.name);

  constructor(
    @InjectRepository(HistoricoImportacao)
    private readonly historicoRepository: Repository<HistoricoImportacao>,
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
    private readonly dataSource: DataSource,
  ) {}

  // <-- ALTERAÇÃO: A assinatura do método agora inclui o parâmetro 'dataDasVendas' -->
  async processarArquivoVendas(file: Express.Multer.File, dataDasVendas: Date): Promise<HistoricoImportacao> {
    this.logger.log(`Iniciando processamento do arquivo: ${file.originalname} para a data ${dataDasVendas.toISOString()}`);

    const textoExtraido = await this.extrairTextoDoPdf(file.buffer);
    const produtosExtraidos = this.analisarTextoDoRelatorio(textoExtraido);

    if (produtosExtraidos.length === 0) {
      throw new BadRequestException('Nenhum produto válido foi encontrado no relatório.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const historico = await queryRunner.manager.save(
        this.historicoRepository.create({
            nome_arquivo_origem: file.originalname,
            status: StatusImportacao.CONCLUIDA,
            // <-- ALTERAÇÃO: A data da importação agora é a data fornecida pelo usuário -->
            data_importacao: dataDasVendas,
        })
      );
      this.logger.log(`Histórico de importação #${historico.id} criado.`);

      const fornecedorPadrao = await this.garantirFornecedorPadrao(queryRunner);
      let faturamentoTotal = 0;

      for (const dto of produtosExtraidos) {
        let produto = await queryRunner.manager.findOneBy(Produto, { codigo: dto.codigo });

        if (!produto) {
          this.logger.log(`Produto com código '${dto.codigo}' não encontrado. Criando novo produto...`);
          
          const produtoComMesmoNome = await queryRunner.manager.findOneBy(Produto, { nome: dto.descricao });
          if(produtoComMesmoNome) {
             this.logger.warn(`Atenção: Criando produto com nome duplicado '${dto.descricao}', pois o código '${dto.codigo}' é novo.`);
          }

          produto = await queryRunner.manager.save(this.produtoRepository.create({
            codigo: dto.codigo,
            nome: dto.descricao,
            unidade_medida: 'UN',
            fornecedor: fornecedorPadrao,
          }));
          this.logger.log(`Novo produto '${produto.nome}' (ID: ${produto.id}) criado com sucesso.`);
        }

        const custoUnitario = parseFloat((dto.custo / dto.quantidade_vendida).toFixed(2));
        const precoVendaUnitario = parseFloat((dto.venda / dto.quantidade_vendida).toFixed(2));

        const novaVenda = this.vendaRepository.create({
            produto: produto,
            historico_importacao: historico,
            quantidade_vendida: dto.quantidade_vendida,
            custo_total: dto.custo, 
            preco_venda_total: dto.venda,
            custo_unitario: custoUnitario,
            preco_venda_unitario: precoVendaUnitario,
        });
        await queryRunner.manager.save(novaVenda);

        faturamentoTotal += dto.venda;
      }
      
      historico.faturamento_total = parseFloat(faturamentoTotal.toFixed(2));
      const historicoSalvo = await queryRunner.manager.save(historico);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Importação #${historicoSalvo.id} concluída com sucesso! Faturamento: ${historicoSalvo.faturamento_total}`);
      return historicoSalvo;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Falha catastrófica na transação da importação.`, error);
      if (error.code === '23505') {
          throw new InternalServerErrorException(`Erro de duplicidade no banco de dados. Detalhe: ${error.detail}`);
      }
      throw new InternalServerErrorException('Ocorreu um erro ao salvar os dados da importação.');
    } finally {
      await queryRunner.release();
    }
  }

  async getHistorico(): Promise<HistoricoImportacao[]> {
    return this.historicoRepository.find({ order: { data_importacao: 'DESC' } });
  }

  private async garantirFornecedorPadrao(queryRunner: any): Promise<Fornecedor> {
    const NOME_FORNECEDOR_PADRAO = 'FORNECEDOR DIVERSOS';
    let fornecedorPadrao = await queryRunner.manager.findOneBy(Fornecedor, { nome: NOME_FORNECEDOR_PADRAO });

    if (!fornecedorPadrao) {
      this.logger.log(`Fornecedor padrão não encontrado. Criando "${NOME_FORNECEDOR_PADRAO}"...`);
      fornecedorPadrao = await queryRunner.manager.save(
        queryRunner.manager.create(Fornecedor, {
          nome: NOME_FORNECEDOR_PADRAO,
          cnpj: '00.000.000/0000-00',
        })
      );
    }
    return fornecedorPadrao;
  }

  private async extrairTextoDoPdf(buffer: Buffer): Promise<string> {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch(error) {
        this.logger.error('Falha ao extrair texto do PDF', error);
        throw new Error('Não foi possível ler o conteúdo do arquivo PDF.');
    }
  }

  private analisarTextoDoRelatorio(texto: string): ProdutoExtraidoDto[] {
    const linhas = texto.split('\n');
    const produtosExtraidos: ProdutoExtraidoDto[] = [];

    for (const linha of linhas) {
        const linhaLimpa = linha.trim();
        if (!linhaLimpa || linhaLimpa.length < 10 || !/^\d/.test(linhaLimpa) || !/[a-zA-Z]/.test(linhaLimpa)) continue;
        const regexUniversal = /^(\d+)(.+?)(\d{1,3}(?:\.\d{3})*,\d{2})(\d{1,3}(?:\.\d{3})*,\d{2})(\d{1,3}(?:\.\d{3})*,\d{2})(\d{1,3}(?:\.\d{3})*,\d{2})(-?\d{1,3}(?:\.\d{3})*,\d{2})$/;
        const match = linhaLimpa.match(regexUniversal);

        if (match) {
            const [, codigo, descricao, qtdStr, custoStr, custoRealStr, vendaStr, markupStr] = match;
            const quantidade = parseFloat(qtdStr.replace(/\./g, '').replace(',', '.'));
            const custo = parseFloat(custoStr.replace(/\./g, '').replace(',', '.'));
            const custoReal = parseFloat(custoRealStr.replace(/\./g, '').replace(',', '.'));
            const venda = parseFloat(vendaStr.replace(/\./g, '').replace(',', '.'));
            const markup = parseFloat(markupStr.replace(/\./g, '').replace(',', '.'));
            const descricaoLimpa = descricao.trim().replace(/\s+/g, ' ');

            if (!isNaN(quantidade) && !isNaN(venda) && quantidade > 0) {
                produtosExtraidos.push({
                    codigo: codigo.trim(),
                    descricao: descricaoLimpa,
                    quantidade_vendida: quantidade,
                    custo,
                    custo_real: custoReal,
                    venda,
                    markup
                });
            }
        }
    }
    return produtosExtraidos;
  }
}