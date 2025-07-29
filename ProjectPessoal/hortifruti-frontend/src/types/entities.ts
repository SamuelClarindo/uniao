// src/types/entities.ts

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  contato_nome?: string;
  contato_telefone?: string;
  email?: string;
}

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade_medida: string;
  fornecedor: Fornecedor;
}

export interface Despesa {
    id: number;
    descricao: string;
    plano_contas: string;
    valor: number;
    data_vencimento: string;
    data_pagamento?: string;
}

// src/types/entities.ts

// ... (deixe todas as outras interfaces e tipos como estão)

// Substitua a interface ItemCompra por esta
export interface ItemCompra {
    id: number;
    produto: Produto;
    quantidade: number;
    preco_custo_unitario: number;
}

// Substitua a interface Compra por esta
export interface Compra {
    id: number;
    data_compra: string;
    nota_fiscal: string;
    valor_total_compra: number;
    fornecedor: Fornecedor;
    itens: ItemCompra[]; // Agora o TypeScript sabe que 'itens' é um array de ItemCompra
}

export interface Venda {
  id: number;
  produto: Produto;
  quantidade_vendida: number;
  custo_total: number;
  preco_venda_total: number;
  data_venda: string;
  // Campos que faltavam:
  custo_unitario: number;
  preco_venda_unitario: number;
}

// Para os dados agregados do dashboard
export interface DashboardData {
    faturamentoTotal: number;
    totalDespesas: number;
    totalCompras: number;
    lucroBruto: number;
    lucroReal: number;
    faturamentoPorDia: { data: string; faturamento: number }[];
    topDespesas: { plano_contas: string; total: number }[];
    topProdutos: { nome: string; total_vendido: number, quantidade_vendida: number }[];
}

// src/types/entities.ts (continuação)

// ... (interfaces de Produto, Fornecedor, etc. já existentes)

export interface CreateProdutoDto {
  codigo: string;
  nome: string;
  descricao?: string;
  unidade_medida: string;
  fornecedorId: number;
}

export type UpdateProdutoDto = Partial<CreateProdutoDto>;

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces e DTOs)

export interface CreateFornecedorDto {
  nome: string;
  cnpj?: string;
  contato_nome?: string;
  contato_telefone?: string;
  email?: string;
}

export type UpdateFornecedorDto = Partial<CreateFornecedorDto>;

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces e DTOs)

export interface CreateDespesaDto {
  descricao: string;
  plano_contas: string;
  valor: number;
  data_vencimento: string; // Manter como string para o input de data
  data_pagamento?: string;
}

export type UpdateDespesaDto = Partial<CreateDespesaDto>;

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces)

export enum StatusImportacao {
    PENDENTE = 'PENDENTE',
    CONCLUIDA = 'CONCLUIDA',
    ERRO = 'ERRO',
}

export interface HistoricoImportacao {
  id: number;
  nome_arquivo_origem: string;
  faturamento_total: number;
  data_importacao: string;
  status: StatusImportacao;
}

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces e DTOs)

// DTO para cada item da compra
export interface CreateItemCompraDto {
  produtoId: number;
  quantidade: number;
  preco_custo_unitario: number;
}

// DTO principal da compra
export interface CreateCompraDto {
  fornecedorId: number;
  data_compra?: string;
  nota_fiscal?: string;
  itens: CreateItemCompraDto[];
}

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces)

// O back-end já tem a entidade Venda, então não precisamos de um novo tipo de entidade,
// mas podemos definir a interface para os filtros do relatório.
export interface VendasReportFilter {
  data_inicio: string;
  data_fim: string;
}

// src/types/entities.ts (adicionar ao final)

// ... (outras interfaces)

export interface ComprasReportFilter {
  data_inicio?: string;
  data_fim?: string;
  fornecedorId?: number;
}