import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn 
} from 'typeorm';

@Entity('fornecedores')
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 18, unique: true, nullable: true })
  cnpj: string;

  @Column({ name: 'contato_nome', type: 'varchar', length: 100, nullable: true })
  contato_nome: string;

  @Column({ name: 'contato_telefone', type: 'varchar', length: 20, nullable: true })
  contato_telefone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  data_atualizacao: Date;
}