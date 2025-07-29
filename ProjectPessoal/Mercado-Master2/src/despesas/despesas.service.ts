import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Despesa } from './entities/despesa.entity';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
  ) {}

  create(createDespesaDto: CreateDespesaDto): Promise<Despesa> {
    const despesa = this.despesaRepository.create(createDespesaDto);
    return this.despesaRepository.save(despesa);
  }

  findAll(): Promise<Despesa[]> {
    return this.despesaRepository.find({
        order: {
            data_vencimento: 'DESC'
        }
    });
  }

  async findOne(id: number): Promise<Despesa> {
    const despesa = await this.despesaRepository.findOneBy({ id });
    if (!despesa) {
      throw new NotFoundException(`Despesa com o ID #${id} não encontrada.`);
    }
    return despesa;
  }

  async update(id: number, updateDespesaDto: UpdateDespesaDto): Promise<Despesa> {
    const despesa = await this.despesaRepository.preload({
      id: id,
      ...updateDespesaDto,
    });
    if (!despesa) {
      throw new NotFoundException(`Despesa com o ID #${id} não encontrada.`);
    }
    return this.despesaRepository.save(despesa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.despesaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Despesa com o ID #${id} não encontrada.`);
    }
  }
}