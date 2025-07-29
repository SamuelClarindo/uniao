import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Injectable()
export class FornecedoresService {
  // Injeta o repositório da entidade Fornecedor para interagir com o banco
  constructor(
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  // Cria um novo fornecedor no banco de dados
  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = this.fornecedorRepository.create(createFornecedorDto);
    return this.fornecedorRepository.save(fornecedor);
  }

  // Busca e retorna todos os fornecedores
  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedorRepository.find();
  }

  // Busca e retorna um fornecedor específico pelo ID
  async findOne(id: number): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository.findOneBy({ id });
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com o ID #${id} não encontrado.`);
    }
    return fornecedor;
  }

  // Atualiza um fornecedor específico pelo ID
  async update(id: number, updateFornecedorDto: UpdateFornecedorDto): Promise<Fornecedor> {
    // O método preload busca o fornecedor pelo ID e já aplica os dados do DTO.
    // Isso evita ter que buscar e depois atribuir os campos manualmente.
    const fornecedor = await this.fornecedorRepository.preload({
      id: id,
      ...updateFornecedorDto,
    });
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com o ID #${id} não encontrado.`);
    }
    return this.fornecedorRepository.save(fornecedor);
  }

  // Remove um fornecedor do banco de dados pelo ID
  async remove(id: number): Promise<void> {
    const result = await this.fornecedorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fornecedor com o ID #${id} não encontrado.`);
    }
  }
}
