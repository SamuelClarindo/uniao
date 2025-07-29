// src/services/api.ts (VERSÃO CORRIGIDA E COMPLETA)
import axios from 'axios';
import { 
    DashboardData, 
    Produto, 
    CreateProdutoDto, 
    UpdateProdutoDto 
} from '../types/entities';

// Crie uma instância do axios com a URL base do seu back-end
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL do seu back-end NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock da função que o back-end precisaria ter para consolidar os dados do Dashboard.
export const getDashboardData = async (periodo: 'dia' | 'mes' | 'ano'): Promise<DashboardData> => {
    console.log(`Buscando dados para o período: ${periodo}`);
    // No futuro, isso pode ser uma única chamada: const { data } = await apiClient.get(`/dashboard?periodo=${periodo}`);
    
    // Simulação de dados para o propósito do front-end
    const faturamentoTotal = 55789.75;
    const totalDespesas = 12540.30;
    const totalCompras = 25100.00;
    const custoProdutosVendidos = 32450.50;
    const lucroBruto = faturamentoTotal - custoProdutosVendidos;
    const lucroReal = faturamentoTotal - custoProdutosVendidos - totalDespesas - totalCompras;

    const faturamentoPorDia = [
        { data: '01/07', faturamento: 4000 }, { data: '02/07', faturamento: 3000 },
        { data: '03/07', faturamento: 2000 }, { data: '04/07', faturamento: 2780 },
        { data: '05/07', faturamento: 1890 }, { data: '06/07', faturamento: 2390 },
        { data: '07/07', faturamento: 3490 },
    ];
    const topDespesas = [
        { plano_contas: 'Aluguel', total: 1200 }, { plano_contas: 'Salários', total: 2500 },
        { plano_contas: 'Energia', total: 450 }, { plano_contas: 'Água', total: 200 },
        { plano_contas: 'Marketing', total: 300 },
    ];
    const topProdutos = [
        { nome: 'Banana Prata', total_vendido: 1250.50, quantidade_vendida: 500 },
        { nome: 'Tomate Italiano', total_vendido: 980.00, quantidade_vendida: 200 },
        { nome: 'Alface Crespa', total_vendido: 750.75, quantidade_vendida: 1000 },
    ];

    return Promise.resolve({
        faturamentoTotal,
        totalDespesas,
        totalCompras,
        lucroBruto,
        lucroReal,
        faturamentoPorDia,
        topDespesas,
        topProdutos
    });
};

// --- Funções do CRUD de Produtos ---

export const getProdutos = async (page = 1, limit = 30): Promise<{ data: Produto[], total: number }> => {
  const { data } = await apiClient.get('/produtos', {
    params: { page, limit }
  });
  return data;
};

export const createProduto = async (produto: CreateProdutoDto): Promise<Produto> => {
  const { data } = await apiClient.post('/produtos', produto);
  return data;
};

export const updateProduto = async (id: number, produto: UpdateProdutoDto): Promise<Produto> => {
  const { data } = await apiClient.patch(`/produtos/${id}`, produto);
  return data;
};

export const deleteProduto = async (id: number): Promise<void> => {
  await apiClient.delete(`/produtos/${id}`);
};

// src/services/api.ts (adicionar ao final)
import { Fornecedor, CreateFornecedorDto, UpdateFornecedorDto } from '../types/entities'; // Adicione os DTOs de Fornecedor

// ... (todo o código existente)

// --- Funções do CRUD de Fornecedores ---

export const getFornecedores = async (page = 1, limit = 30): Promise<{ data: Fornecedor[], total: number }> => {
  const { data } = await apiClient.get('/fornecedores', {
    params: { page, limit }
  });
  return data;
};

export const createFornecedor = async (fornecedor: CreateFornecedorDto): Promise<Fornecedor> => {
  const { data } = await apiClient.post('/fornecedores', fornecedor);
  return data;
};

export const updateFornecedor = async (id: number, fornecedor: UpdateFornecedorDto): Promise<Fornecedor> => {
  const { data } = await apiClient.patch(`/fornecedores/${id}`, fornecedor);
  return data;
};

export const deleteFornecedor = async (id: number): Promise<void> => {
  await apiClient.delete(`/fornecedores/${id}`);
};

// src/services/api.ts (adicionar ao final)
import { Despesa, CreateDespesaDto, UpdateDespesaDto } from '../types/entities'; // Adicione os DTOs de Despesa

// ... (todo o código existente)

// --- Funções do CRUD de Despesas ---

export const getDespesas = async (page = 1, limit = 10): Promise<{ data: Despesa[], total: number }> => {
  const { data } = await apiClient.get('/despesas', {
    params: { page, limit }
  });
  return data;
};

export const createDespesa = async (despesa: CreateDespesaDto): Promise<Despesa> => {
  const { data } = await apiClient.post('/despesas', despesa);
  return data;
};

export const updateDespesa = async (id: number, despesa: UpdateDespesaDto): Promise<Despesa> => {
  const { data } = await apiClient.patch(`/despesas/${id}`, despesa);
  return data;
};

export const deleteDespesa = async (id: number): Promise<void> => {
  await apiClient.delete(`/despesas/${id}`);
};

// src/services/api.ts (adicionar ao final)
import { HistoricoImportacao } from '../types/entities'; // Adicione o novo tipo

// ... (todo o código existente)

// --- Funções da Tela de Importação ---

export const getHistoricoImportacoes = async (): Promise<HistoricoImportacao[]> => {
  const { data } = await apiClient.get('/importacao/historico');
  return data;
};

// Modificada para aceitar data de início e fim
export const uploadRelatorioVendas = async (arquivo: File, dataInicio: string, dataFim: string): Promise<HistoricoImportacao> => {
  const formData = new FormData();
  formData.append('relatorio', arquivo);
  formData.append('data_inicio', dataInicio); // <-- MUDOU DE 'data' PARA 'data_inicio'
  formData.append('data_fim', dataFim);       // <-- NOVO CAMPO 'data_fim'

  const { data } = await apiClient.post('/importacao/vendas', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// src/services/api.ts (adicionar ao final)
 // Adicione os novos tipos

// ... (todo o código existente)

// --- Funções do CRUD de Compras ---

export const getCompras = async (page = 1, limit = 10): Promise<{ data: Compra[], total: number }> => {
  const { data } = await apiClient.get('/compras', {
    params: { page, limit }
  });
  return data;
};

// Substitua as duas linhas por esta única linha:
import { Compra, CreateCompraDto, ComprasReportFilter } from '../types/entities';
export const createCompra = async (compra: CreateCompraDto): Promise<Compra> => {
  const { data } = await apiClient.post('/compras', compra);
  return data;
};

// src/services/api.ts (adicionar ao final)
import { Venda, VendasReportFilter } from '../types/entities'; // Adicione os novos tipos

// ... (todo o código existente)

// --- Funções da Tela de Relatórios ---

export const getVendasReport = async (filtros: VendasReportFilter): Promise<Venda[]> => {
  // O endpoint deve aceitar os filtros como query params
  const { data } = await apiClient.get('/vendas', { 
    params: filtros 
  });
  return data;
};

// src/services/api.ts (adicionar ao final)

// ... (todo o código existente)

// --- Funções de Relatórios ---

export const getComprasReport = async (filtros: ComprasReportFilter): Promise<Compra[]> => {
  const { data } = await apiClient.get('/compras/report', { // <-- URL CORRIGIDA
    params: filtros 
  });
  return data;
};export const getAllProdutos = async (): Promise<Produto[]> => {
  const { data } = await apiClient.get('/produtos/all');
  return data;
};
export const getAllFornecedores = async (): Promise<Fornecedor[]> => {
  const { data } = await apiClient.get('/fornecedores/all');
  return data;
};

// --- Funções do Dashboard ---

export const getDashboardKPIs = async (params: { periodo?: string; data_inicio?: string; data_fim?: string }) => {
  const { data } = await apiClient.get('/dashboard/kpis', { params });
  return data;
};

export const getDashboardRevenue = async (params: { periodo?: string; data_inicio?: string; data_fim?: string }) => {
  const { data } = await apiClient.get('/dashboard/revenue', { params });
  return data;
};

export const getDashboardTopProducts = async (params: { tipo?: string; periodo?: string; data_inicio?: string; data_fim?: string; limit?: number }) => {
  const { data } = await apiClient.get('/dashboard/top-products', { params });
  return data;
};

export const getDashboardExpenses = async (params: { periodo?: string; data_inicio?: string; data_fim?: string }) => {
  const { data } = await apiClient.get('/dashboard/expenses', { params });
  return data;
};

export const getDashboardSales = async (params: { periodo?: string; data_inicio?: string; data_fim?: string }) => {
  const { data } = await apiClient.get('/dashboard/sales', { params });
  return data;
};


