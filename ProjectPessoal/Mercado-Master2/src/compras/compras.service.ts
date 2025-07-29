import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { ItemCompra } from './entities/item-compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    private dataSource: DataSource, // Injetado para usar transações
  ) {}

  // Cria uma nova compra e seus itens de forma transacional.
  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    const { fornecedorId, itens, ...compraData } = createCompraDto;

    // Calcula o valor total da compra a partir dos itens
    const valorTotal = itens.reduce((total, item) => {
        return total + (item.quantidade * item.preco_custo_unitario);
    }, 0);

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const compra = queryRunner.manager.create(Compra, {
            ...compraData,
            fornecedor: { id: fornecedorId } as Fornecedor,
            valor_total_compra: valorTotal,
            itens: itens.map(itemDto => queryRunner.manager.create(ItemCompra, {
                produto: { id: itemDto.produtoId },
                quantidade: itemDto.quantidade,
                preco_custo_unitario: itemDto.preco_custo_unitario,
            })),
        });

        const savedCompra = await queryRunner.manager.save(compra);
        await queryRunner.commitTransaction();
        return this.findOne(savedCompra.id); // Retorna a compra com todas as relações

    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err; // Lança o erro para ser tratado pelo NestJS
    } finally {
        await queryRunner.release();
    }
  }

  // Busca todas as compras com seus itens.
  findAll(): Promise<Compra[]> {
    return this.compraRepository.find({ 
        relations: ['itens', 'fornecedor'],
        order: { data_compra: 'DESC' } 
    });
  }

  // Busca uma compra específica.
  async findOne(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { id },
      relations: ['itens', 'fornecedor', 'itens.produto'],
    });
    if (!compra) {
      throw new NotFoundException(`Compra com o ID #${id} não encontrada.`);
    }
    return compra;
  }
  
  // Atualiza dados da nota principal da compra.
  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.compraRepository.preload({
      id: id,
      ...updateCompraDto,
    });
    if (!compra) {
      throw new NotFoundException(`Compra com o ID #${id} não encontrada.`);
    }
    return this.compraRepository.save(compra);
  }

  // Remove uma compra (e seus itens, devido ao onDelete: 'CASCADE').
  async remove(id: number): Promise<void> {
    const result = await this.compraRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Compra com o ID #${id} não encontrada.`);
    }
  }

  async findReport(data_inicio: string, data_fim: string, fornecedorId?: number): Promise<Compra[]> {
    const query = this.compraRepository.createQueryBuilder('compra')
      .leftJoinAndSelect('compra.fornecedor', 'fornecedor')
      .leftJoinAndSelect('compra.itens', 'itens')
      .leftJoinAndSelect('itens.produto', 'produto')
      .where('compra.data_compra >= :data_inicio', { data_inicio })
      .andWhere('compra.data_compra <= :data_fim', { data_fim });
    if (fornecedorId) {
      query.andWhere('compra.fornecedor = :fornecedorId', { fornecedorId });
    }
    return query.orderBy('compra.data_compra', 'DESC').getMany();
  }
}