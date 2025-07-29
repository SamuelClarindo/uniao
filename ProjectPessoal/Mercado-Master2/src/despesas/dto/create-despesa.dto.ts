import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  plano_contas: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsDateString()
  data_vencimento: string;

  @IsOptional()
  @IsDateString()
  data_pagamento?: string;
}