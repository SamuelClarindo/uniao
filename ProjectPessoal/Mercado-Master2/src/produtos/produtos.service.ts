import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  // Cria um novo produto, associando-o a um fornecedor existente.
  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const { fornecedorId, ...produtoData } = createProdutoDto;

    const produto = this.produtoRepository.create({
      ...produtoData,
      fornecedor: { id: fornecedorId } as Fornecedor, // Associa o ID do fornecedor
    });
    
    // É uma boa prática verificar se o fornecedor existe antes de salvar,
    // mas o banco de dados já irá impor essa restrição via foreign key.
    
    return this.produtoRepository.save(produto);
  }

  // Busca todos os produtos e inclui os dados do fornecedor relacionado.
  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: ['fornecedor'],
    });
  }

  // Busca um produto pelo ID e inclui os dados do fornecedor relacionado.
  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['fornecedor'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto com o ID #${id} não encontrado.`);
    }
    return produto;
  }

  // Atualiza um produto.
  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const { fornecedorId, ...produtoData } = updateProdutoDto;

    const dataToUpdate: any = { ...produtoData };
    if (fornecedorId) {
      dataToUpdate.fornecedor = { id: fornecedorId };
    }

    const produto = await this.produtoRepository.preload({
      id: id,
      ...dataToUpdate,
    });
    
    if (!produto) {
      throw new NotFoundException(`Produto com o ID #${id} não encontrado.`);
    }
    
    return this.produtoRepository.save(produto);
  }

  // Remove um produto.
  async remove(id: number): Promise<void> {
    const result = await this.produtoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Produto com o ID #${id} não encontrado.`);
    }
  }
}
