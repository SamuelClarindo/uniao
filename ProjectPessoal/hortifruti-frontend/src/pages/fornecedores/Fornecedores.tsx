// src/pages/fornecedores/Fornecedores.tsx (COM SKELETON)
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, TextInput, Modal, Pagination } from 'flowbite-react';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { getFornecedores, createFornecedor, updateFornecedor, deleteFornecedor } from '../../services/api';
import { Fornecedor, CreateFornecedorDto, UpdateFornecedorDto } from '../../types/entities';
import { FornecedorForm } from './FornecedorForm';
import { TableSkeleton } from '../../components/common/TableSkeleton';

export function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFornecedores = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await getFornecedores(page, itemsPerPage);
      setFornecedores(response.data);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores(currentPage);
  }, [fetchFornecedores, currentPage]);
  
  const onPageChange = (page: number) => setCurrentPage(page);
  
  const handleOpenModal = (fornecedor?: Fornecedor) => { setFornecedorSelecionado(fornecedor || null); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setFornecedorSelecionado(null); };
  const handleOpenDeleteModal = (fornecedor: Fornecedor) => { setFornecedorSelecionado(fornecedor); setIsDeleteModalOpen(true); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setFornecedorSelecionado(null); };

  const handleSave = async (data: CreateFornecedorDto | UpdateFornecedorDto) => {
      setIsSubmitting(true);
      try {
          if(fornecedorSelecionado) {
              await updateFornecedor(fornecedorSelecionado.id, data as UpdateFornecedorDto);
          } else {
              await createFornecedor(data as CreateFornecedorDto);
          }
          fetchFornecedores(currentPage);
          handleCloseModal();
      } catch (error) {
          console.error("Erro ao salvar fornecedor:", error);
      } finally {
          setIsSubmitting(false);
      }
  }
  
  const handleDelete = async () => {
      if(!fornecedorSelecionado) return;
      setIsSubmitting(true);
      try {
          await deleteFornecedor(fornecedorSelecionado.id);
          if (fornecedores.length === 1 && currentPage > 1) {
              setCurrentPage(currentPage - 1);
          } else {
              fetchFornecedores(currentPage);
          }
          handleCloseDeleteModal();
      } catch (error) {
           console.error("Erro ao deletar fornecedor:", error);
      } finally {
          setIsSubmitting(false);
      }
  }

  const fornecedoresFiltrados = fornecedores?.filter(f => 
    f.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    f.cnpj?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Fornecedores</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 md:mt-0">
          <HiPlus className="mr-2 h-5 w-5" />
          Adicionar Fornecedor
        </Button>
      </header>

      <div className="overflow-x-auto">
        <div className="mb-4">
             <TextInput 
                placeholder="Buscar por nome ou CNPJ..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
            />
        </div>
        
        {error && <p className="text-red-600 text-center">Erro ao carregar fornecedores: {error}</p>}
        
        <Table hoverable>
            <Table.Head>
                <Table.HeadCell>Nome</Table.HeadCell>
                <Table.HeadCell>CNPJ</Table.HeadCell>
                <Table.HeadCell>Contato</Table.HeadCell>
                <Table.HeadCell>Telefone</Table.HeadCell>
                <Table.HeadCell>
                <span className="sr-only">Ações</span>
                </Table.HeadCell>
            </Table.Head>

            {loading ? (
                <TableSkeleton columns={5} />
            ) : (
                <Table.Body className="divide-y">
                    {fornecedoresFiltrados?.map((fornecedor) => (
                        <Table.Row key={fornecedor.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="font-medium text-gray-900 dark:text-white">{fornecedor.nome}</Table.Cell>
                            <Table.Cell>{fornecedor.cnpj}</Table.Cell>
                            <Table.Cell>{fornecedor.contato_nome}</Table.Cell>
                            <Table.Cell>{fornecedor.contato_telefone}</Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center space-x-4">
                                    <Button size="sm" color="blue" onClick={() => handleOpenModal(fornecedor)}>
                                        <HiPencilAlt className="h-4 w-4"/>
                                    </Button>
                                    <Button size="sm" color="red" onClick={() => handleOpenDeleteModal(fornecedor)}>
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
      
      <FornecedorForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        fornecedorInicial={fornecedorSelecionado}
        isLoading={isSubmitting}
      />
      
      <Modal show={isDeleteModalOpen} size="md" onClose={handleCloseDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiTrash className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja excluir o fornecedor "{fornecedorSelecionado?.nome}"?
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