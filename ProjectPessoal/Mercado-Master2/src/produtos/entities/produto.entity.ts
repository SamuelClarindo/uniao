// Conteúdo completo e corrigido para: src/produtos/entities/produto.entity.ts

import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo: string;

  // ===== CORREÇÃO APLICADA AQUI =====
  // Removemos o { unique: true } para permitir nomes duplicados
  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;
  // ===================================

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'unidade_medida', type: 'varchar', length: 10, nullable: false })
  unidade_medida: string;
  
  @ManyToOne(() => Fornecedor, { eager: false })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  data_atualizacao: Date;
}