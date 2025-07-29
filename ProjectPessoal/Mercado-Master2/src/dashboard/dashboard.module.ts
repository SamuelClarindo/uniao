import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Venda } from '../vendas/entities/venda.entity';
import { Despesa } from '../despesas/entities/despesa.entity';
import { Compra } from '../compras/entities/compra.entity';
import { HistoricoImportacao } from '../importacao/entities/historico-importacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda, Despesa, Compra, HistoricoImportacao])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 