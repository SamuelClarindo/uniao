import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ProdutosModule } from './produtos/produtos.module';
import { DespesasModule } from './despesas/despesas.module';
import { ComprasModule } from './compras/compras.module';
import { ImportacaoModule } from './importacao/importacao.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Fornecedor } from './fornecedores/entities/fornecedor.entity';
import { Produto } from './produtos/entities/produto.entity';
import { Despesa } from './despesas/entities/despesa.entity';
import { Compra } from './compras/entities/compra.entity';
import { ItemCompra } from './compras/entities/item-compra.entity';
import { HistoricoImportacao } from './importacao/entities/historico-importacao.entity';
import { VendasModule } from './vendas/vendas.module'; 
import { Venda } from './vendas/entities/venda.entity';   


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234', // Verifique sua senha
      database: 'hortifruti_db',
      entities: [Fornecedor, Produto, Despesa, Compra, ItemCompra, HistoricoImportacao, Venda], // <-- ADICIONADO
      synchronize: false,
    }),
    FornecedoresModule,
    ProdutosModule,
    DespesasModule,
    ComprasModule,
    VendasModule,
    ImportacaoModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}