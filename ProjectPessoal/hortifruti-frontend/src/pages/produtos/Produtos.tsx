// src/pages/produtos/Produtos.tsx (VERSÃO COM NOTIFICAÇÕES)
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, TextInput, Modal, Pagination } from 'flowbite-react';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { getProdutos, createProduto, updateProduto, deleteProduto, getAllFornecedores } from '../../services/api';
import { Produto, Fornecedor, CreateProdutoDto, UpdateProdutoDto } from '../../types/entities';
import { ProdutoForm } from './ProdutoForm';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import toast from 'react-hot-toast'; // <-- 1. IMPORTE O TOAST

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProdutos = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await getProdutos(page, itemsPerPage);
      setProdutos(response.data);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProdutos(currentPage);
  }, [fetchProdutos, currentPage]);

  useEffect(() => {
    getAllFornecedores().then(setFornecedores).catch(err => console.error("Erro ao buscar fornecedores para o form", err));
  }, []);

  const onPageChange = (page: number) => setCurrentPage(page);
  const handleOpenModal = (produto?: Produto) => { setProdutoSelecionado(produto || null); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setProdutoSelecionado(null); };
  const handleOpenDeleteModal = (produto: Produto) => { setProdutoSelecionado(produto); setIsDeleteModalOpen(true); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setProdutoSelecionado(null); };

  const handleSave = async (data: CreateProdutoDto | UpdateProdutoDto) => {
    setIsSubmitting(true);
    const toastId = toast.loading(produtoSelecionado ? 'Atualizando produto...' : 'Criando novo produto...');

    try {
      if (produtoSelecionado) {
        await updateProduto(produtoSelecionado.id, data as UpdateProdutoDto);
        toast.success('Produto atualizado com sucesso!', { id: toastId });
      } else {
        await createProduto(data as CreateProdutoDto);
        toast.success('Produto criado com sucesso!', { id: toastId });
      }
      fetchProdutos(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error('Ocorreu um erro ao salvar o produto.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!produtoSelecionado) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Excluindo produto...');

    try {
      await deleteProduto(produtoSelecionado.id);
      toast.success('Produto excluído com sucesso!', { id: toastId });

      if (produtos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProdutos(currentPage);
      }
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      toast.error('Ocorreu um erro ao excluir o produto.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const produtosFiltrados = produtos?.filter(p =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    p.codigo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ... O resto do JSX (header, tabela, modais) permanece exatamente o mesmo ... */}
      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Produtos</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 md:mt-0">
          <HiPlus className="mr-2 h-5 w-5" />
          Adicionar Produto
        </Button>
      </header>

      <div className="overflow-x-auto">
        <div className="mb-4">
          <TextInput
            placeholder="Buscar por nome ou código..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-center">Erro ao carregar produtos: {error}</p>}
        
        <Table hoverable>
            <Table.Head>
                <Table.HeadCell>Nome</Table.HeadCell>
                <Table.HeadCell>Código</Table.HeadCell>
                <Table.HeadCell>Unidade</Table.HeadCell>
                <Table.HeadCell>Fornecedor</Table.HeadCell>
                <Table.HeadCell><span className="sr-only">Ações</span></Table.HeadCell>
            </Table.Head>
            
            {loading ? (
                <TableSkeleton columns={5} rows={5}/>
            ) : (
                <Table.Body className="divide-y">
                    {produtosFiltrados?.map((produto) => (
                        <Table.Row key={produto.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="font-medium text-gray-900 dark:text-white">{produto.nome}</Table.Cell>
                            <Table.Cell>{produto.codigo}</Table.Cell>
                            <Table.Cell>{produto.unidade_medida}</Table.Cell>
                            <Table.Cell>{produto.fornecedor?.nome || 'N/A'}</Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center space-x-4">
                                    <Button size="sm" color="blue" onClick={() => handleOpenModal(produto)}><HiPencilAlt className="h-4 w-4"/></Button>
                                    <Button size="sm" color="red" onClick={() => handleOpenDeleteModal(produto)}><HiTrash className="h-4 w-4"/></Button>
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

      <ProdutoForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        produtoInicial={produtoSelecionado}
        fornecedores={fornecedores}
        isLoading={isSubmitting}
      />
      
      <Modal show={isDeleteModalOpen} size="md" onClose={handleCloseDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiTrash className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja excluir o produto "{produtoSelecionado?.nome}"?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Excluindo...' : "Sim, tenho certeza"}
              </Button>
              <Button color="gray" onClick={handleCloseDeleteModal}>Não, cancelar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}