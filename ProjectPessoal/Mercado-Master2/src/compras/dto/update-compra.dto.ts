import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateCompraDto {
    @IsOptional()
    @IsDateString()
    data_compra?: string;

    @IsOptional()
    @IsString()
    nota_fiscal?: string;
}
