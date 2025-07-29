// src/pages/despesas/Despesas.tsx (VERSÃO COM SKELETON)
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, TextInput, Modal, Badge, Pagination } from 'flowbite-react';
import { HiPlus, HiPencilAlt, HiTrash, HiCheckCircle, HiClock } from 'react-icons/hi';
import { useApi } from '../../hooks/useApi';
import { getDespesas, createDespesa, updateDespesa, deleteDespesa } from '../../services/api';
import { Despesa, CreateDespesaDto, UpdateDespesaDto } from '../../types/entities';
import { DespesaForm } from './DespesaForm';
import { TableSkeleton } from '../../components/common/TableSkeleton';

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export function Despesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [despesaSelecionada, setDespesaSelecionada] = useState<Despesa | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDespesas = useCallback(async (page: number) => {
    setLoading(true);
    try {
        const response = await getDespesas(page, itemsPerPage);
        setDespesas(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDespesas(currentPage);
  }, [fetchDespesas, currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (despesa?: Despesa) => {
    setDespesaSelecionada(despesa || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDespesaSelecionada(null);
  };
  
  const handleOpenDeleteModal = (despesa: Despesa) => {
    setDespesaSelecionada(despesa);
    setIsDeleteModalOpen(true);
  }
  
  const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setDespesaSelecionada(null);
  }

  const handleSave = async (data: CreateDespesaDto | UpdateDespesaDto) => {
      setIsSubmitting(true);
      try {
          const payload = { ...data, valor: Number(data.valor) };
          if(despesaSelecionada) {
              await updateDespesa(despesaSelecionada.id, payload as UpdateDespesaDto);
              fetchDespesas(currentPage);
          } else {
              await createDespesa(payload as CreateDespesaDto);
              if (currentPage !== 1) {
                  setCurrentPage(1);
              } else {
                  fetchDespesas(1);
              }
          }
          handleCloseModal();
      } catch (error) {
          console.error("Erro ao salvar despesa:", error);
      } finally {
          setIsSubmitting(false);
      }
  }
  
  const handleDelete = async () => {
      if(!despesaSelecionada) return;
      setIsSubmitting(true);
      try {
          await deleteDespesa(despesaSelecionada.id);
          if (despesas.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
          } else {
              fetchDespesas(currentPage);
          }
          handleCloseDeleteModal();
      } catch (error) {
           console.error("Erro ao deletar despesa:", error);
      } finally {
          setIsSubmitting(false);
      }
  }

  const despesasFiltradas = despesas?.filter(d => 
    d.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
    d.plano_contas.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Despesas</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 md:mt-0">
          <HiPlus className="mr-2 h-5 w-5" />
          Adicionar Despesa
        </Button>
      </header>

      <div className="overflow-x-auto">
        <div className="mb-4">
             <TextInput 
                placeholder="Buscar por descrição ou plano de contas..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
            />
        </div>
        
        {error && <p className="text-red-600 text-center">Erro ao carregar despesas: {error}</p>}
        
        <Table hoverable>
            <Table.Head>
                <Table.HeadCell>Descrição</Table.HeadCell>
                <Table.HeadCell>Valor</Table.HeadCell>
                <Table.HeadCell>Vencimento</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>
                    <span className="sr-only">Ações</span>
                </Table.HeadCell>
            </Table.Head>

            {loading ? (
                <TableSkeleton columns={5} />
            ) : (
                <Table.Body className="divide-y">
                    {despesasFiltradas?.map((despesa) => (
                        <Table.Row key={despesa.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="font-medium text-gray-900 dark:text-white">{despesa.descricao}</Table.Cell>
                            <Table.Cell>{formatCurrency(despesa.valor)}</Table.Cell>
                            <Table.Cell>{formatDate(despesa.data_vencimento)}</Table.Cell>
                            <Table.Cell>
                                {despesa.data_pagamento ? (
                                    <Badge color="success" icon={HiCheckCircle}>Paga</Badge>
                                ) : (
                                    <Badge color="warning" icon={HiClock}>Pendente</Badge>
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center space-x-4">
                                    <Button size="sm" color="blue" onClick={() => handleOpenModal(despesa)}>
                                        <HiPencilAlt className="h-4 w-4"/>
                                    </Button>
                                    <Button size="sm" color="red" onClick={() => handleOpenDeleteModal(despesa)}>
                                        <HiTrash className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            )}
        </Table>

        {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center text-center mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                />
            </div>
        )}
      </div>
      
      <DespesaForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        despesaInicial={despesaSelecionada}
        isLoading={isSubmitting}
      />
      
      <Modal show={isDeleteModalOpen} size="md" onClose={handleCloseDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiTrash className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja excluir a despesa "{despesaSelecionada?.descricao}"?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Excluindo...' : "Sim, tenho certeza"}
              </Button>
              <Button color="gray" onClick={handleCloseDeleteModal}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}