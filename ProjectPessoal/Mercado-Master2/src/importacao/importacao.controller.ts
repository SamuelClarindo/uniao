// Conteúdo completo e corrigido para: src/importacao/importacao.controller.ts

import { Controller, Post, UploadedFile, UseInterceptors, Body, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImportacaoService } from './importacao.service';
import { HistoricoImportacao } from './entities/historico-importacao.entity';
import { IsDateString, IsNotEmpty } from 'class-validator';

// DTO para validar a data recebida no corpo da requisição
class ImportVendasDto {
  @IsDateString()
  @IsNotEmpty()
  data: string;
}

@Controller('importacao')
export class ImportacaoController {
    constructor(private readonly importacaoService: ImportacaoService) {}

    @Post('vendas')
    @UseInterceptors(FileInterceptor('relatorio', { storage: memoryStorage() }))
    async uploadRelatorioVendas(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: ImportVendasDto,
    ): Promise<HistoricoImportacao> {
        if (!file) {
            throw new BadRequestException('O arquivo do relatório é obrigatório.');
        }

        // <-- CORREÇÃO APLICADA AQUI -->
        // Em vez de passar a string diretamente para new Date(), nós a quebramos
        // para evitar problemas de fuso horário, garantindo que a data seja criada corretamente.
        const [year, month, day] = body.data.split('-').map(num => parseInt(num, 10));
        // O mês no construtor do Date é 0-indexado (Janeiro=0, Fevereiro=1...), por isso subtraímos 1.
        const dataVendas = new Date(year, month - 1, day);
        
        return this.importacaoService.processarArquivoVendas(file, dataVendas);
    }

    @Get('historico')
    async getHistorico() {
        return this.importacaoService.getHistorico();
    }
}