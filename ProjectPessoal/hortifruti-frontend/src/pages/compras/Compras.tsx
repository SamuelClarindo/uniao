// src/pages/compras/Compras.tsx (VERSÃO COM PAGINAÇÃO)
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Spinner, Pagination } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { getCompras, createCompra, getAllFornecedores, getAllProdutos } from '../../services/api';
import { Compra, CreateCompraDto, Fornecedor, Produto } from '../../types/entities';
import { CompraForm } from './CompraForm';

const formatDate = (dateString?: string) => new Date(dateString!).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export function Compras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCompras = useCallback(async (page: number) => {
    setLoading(true);
    try {
        const response = await getCompras(page, itemsPerPage);
        setCompras(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompras(currentPage);
  }, [fetchCompras, currentPage]);
  
  useEffect(() => {
    getAllFornecedores().then(setFornecedores);
    getAllProdutos().then(setProdutos);
  }, []);
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = async (data: CreateCompraDto) => {
    setIsSubmitting(true);
    try {
      await createCompra(data);
      if (currentPage !== 1) {
          setCurrentPage(1);
      } else {
          fetchCompras(1);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Compras</h1>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">
          <HiPlus className="mr-2 h-5 w-5" />
          Lançar Nova Compra
        </Button>
      </header>

      <div className="overflow-x-auto">
        {loading && <div className="text-center"><Spinner size="xl" /></div>}
        {error && <p className="text-red-600 text-center">Erro ao carregar compras: {error}</p>}
        
        {!loading && !error && (
          <>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Data</Table.HeadCell>
                <Table.HeadCell>Fornecedor</Table.HeadCell>
                <Table.HeadCell>Nota Fiscal</Table.HeadCell>
                <Table.HeadCell>Valor Total</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {compras?.map((compra) => (
                  <Table.Row key={compra.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{formatDate(compra.data_compra)}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">{compra.fornecedor?.nome}</Table.Cell>
                    <Table.Cell>{compra.nota_fiscal}</Table.Cell>
                    <Table.Cell>{formatCurrency(compra.valor_total_compra)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {totalPages > 1 && (
                <div className="flex items-center justify-center text-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        showIcons
                    />
                </div>
            )}
          </>
        )}
      </div>

      <CompraForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        fornecedores={fornecedores || []}
        produtos={produtos || []}
        isLoading={isSubmitting}
      />
    </div>
  );
}