import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from './entities/venda.entity';

@Controller('vendas')
export class VendasController {
  constructor(
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
  ) {}

  @Get()
  async findAll(
    @Query('data_inicio') data_inicio?: string,
    @Query('data_fim') data_fim?: string
  ): Promise<Venda[]> {
    const query = this.vendaRepository.createQueryBuilder('venda')
      .leftJoinAndSelect('venda.produto', 'produto');
    if (data_inicio) {
      query.andWhere('venda.data_venda >= :data_inicio', { data_inicio });
    }
    if (data_fim) {
      query.andWhere('venda.data_venda <= :data_fim', { data_fim });
    }
    return query.orderBy('venda.data_venda', 'DESC').getMany();
  }
} 