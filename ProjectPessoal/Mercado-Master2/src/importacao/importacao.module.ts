// Conteúdo completo e refatorado para: src/importacao/importacao.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportacaoController } from './importacao.controller';
import { ImportacaoService } from './importacao.service';
import { HistoricoImportacao } from './entities/historico-importacao.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { VendasModule } from '../vendas/vendas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoricoImportacao,
      Produto, // Repositório de Produto é necessário para a lógica de 'encontrar ou criar'
    ]),
    VendasModule,
  ],
  controllers: [ImportacaoController],
  providers: [ImportacaoService],
})
export class ImportacaoModule {}