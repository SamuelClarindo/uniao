// Conteúdo completo e modificado para: src/vendas/entities/venda.entity.ts

import { HistoricoImportacao } from '../../importacao/entities/historico-importacao.entity';
import { Produto } from '../../produtos/entities/produto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vendas')
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @ManyToOne(() => HistoricoImportacao, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'historico_importacao_id' })
  historico_importacao: HistoricoImportacao;

  @Column({ name: 'quantidade_vendida', type: 'numeric', precision: 10, scale: 3 })
  quantidade_vendida: number;

  @Column({ name: 'custo_unitario', type: 'numeric', precision: 10, scale: 2 })
  custo_unitario: number;

  @Column({ name: 'custo_total', type: 'numeric', precision: 10, scale: 2 })
  custo_total: number;

  @Column({ name: 'preco_venda_unitario', type: 'numeric', precision: 10, scale: 2 })
  preco_venda_unitario: number;

  @Column({ name: 'preco_venda_total', type: 'numeric', precision: 10, scale: 2 })
  preco_venda_total: number;
  
  // <-- ALTERAÇÃO: Trocado de @CreateDateColumn para @Column para permitir inserção manual da data -->
  @Column({ name: 'data_venda', type: 'date' })
  data_venda: Date;
}