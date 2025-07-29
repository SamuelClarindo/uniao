import { Produto } from '../../produtos/entities/produto.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Compra } from './compra.entity';

@Entity('itens_compra')
export class ItemCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Compra, (compra) => compra.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @ManyToOne(() => Produto, { eager: true, onDelete: 'RESTRICT' }) // Eager para carregar produto sempre
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ type: 'numeric', precision: 10, scale: 3, nullable: false })
  quantidade: number;

  @Column({ name: 'preco_custo_unitario', type: 'numeric', precision: 10, scale: 2, nullable: false })
  preco_custo_unitario: number;
  
  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;
}