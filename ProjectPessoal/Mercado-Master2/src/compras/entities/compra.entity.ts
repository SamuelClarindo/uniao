import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCompra } from './item-compra.entity';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Fornecedor, { eager: true, onDelete: 'SET NULL' }) // Eager para carregar fornecedor sempre
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @Column({ name: 'data_compra', type: 'date', nullable: false })
  data_compra: Date;

  @Column({ name: 'nota_fiscal', type: 'varchar', length: 100, nullable: true })
  nota_fiscal: string;

  @Column({ name: 'valor_total_compra', type: 'numeric', precision: 10, scale: 2, nullable: false })
  valor_total_compra: number;

  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;

  @OneToMany(() => ItemCompra, (item) => item.compra, { cascade: true }) // Cascade para salvar itens junto
  itens: ItemCompra[];
}
