import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateFornecedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  cnpj?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contato_nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contato_telefone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}