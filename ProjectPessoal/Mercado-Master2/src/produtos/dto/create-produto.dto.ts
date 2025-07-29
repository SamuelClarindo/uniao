// ARQUIVO: src/produtos/dto/create-produto.dto.ts (ATUALIZADO)
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber } from 'class-validator';

export class CreateProdutoDto {
  // ===== CAMPO ADICIONADO =====
  // Adicionamos o campo 'codigo' e validadores para ele.
  @IsString()
  @IsNotEmpty()
  codigo: string;
  // ============================

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  unidade_medida: string;

  // ID do fornecedor principal associado a este produto.
  @IsNumber()
  @IsNotEmpty()
  fornecedorId: number;
}
