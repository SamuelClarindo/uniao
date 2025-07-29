// Conteúdo para: src/vendas/vendas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venda } from './entities/venda.entity';
import { VendasController } from './vendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  controllers: [VendasController],
  exports: [TypeOrmModule], // Exporta o repositório para ser usado em outros módulos
})
export class VendasModule {}