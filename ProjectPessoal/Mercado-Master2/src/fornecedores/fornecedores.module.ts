import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedoresService } from './fornecedores.service';
import { FornecedoresController } from './fornecedores.controller';
import { Fornecedor } from './entities/fornecedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fornecedor]) // Disponibiliza o repositório Fornecedor para injeção
  ],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
})
export class FornecedoresModule {}