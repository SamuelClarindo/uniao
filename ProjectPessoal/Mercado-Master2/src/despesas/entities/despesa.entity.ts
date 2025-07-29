import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn 
} from 'typeorm';

@Entity('despesas')
export class Despesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descricao: string;

  @Column({ name: 'plano_contas', type: 'varchar', length: 100, nullable: false })
  plano_contas: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date', nullable: false })
  data_vencimento: Date;

  @Column({ name: 'data_pagamento', type: 'date', nullable: true })
  data_pagamento: Date;

  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;
}
