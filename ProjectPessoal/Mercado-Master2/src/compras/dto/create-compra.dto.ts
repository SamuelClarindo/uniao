import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

// DTO para cada item dentro da compra
class CreateItemCompraDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number;

  @IsNumber()
  @IsPositive()
  quantidade: number;

  @IsNumber()
  @IsPositive()
  preco_custo_unitario: number;
}

// DTO principal da compra
export class CreateCompraDto {
  @IsInt()
  @IsNotEmpty()
  fornecedorId: number;

  @IsOptional()
  @IsDateString()
  data_compra?: string;

  @IsOptional()
  @IsString()
  nota_fiscal?: string;

  // Validação aninhada para o array de itens
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemCompraDto)
  itens: CreateItemCompraDto[];
}