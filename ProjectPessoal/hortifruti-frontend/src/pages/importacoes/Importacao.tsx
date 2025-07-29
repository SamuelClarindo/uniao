// src/pages/importacoes/Importacao.tsx (VERSÃO FINAL COM INTERVALO DE DATAS)
import { useEffect, useState } from 'react';
import { Button, Table, Spinner, FileInput, Label, Modal, Badge, Toast, TextInput } from 'flowbite-react';
import { HiPlus, HiCheck, HiExclamation, HiOutlineCloudUpload } from 'react-icons/hi';
import { useApi } from '../../hooks/useApi';
import { getHistoricoImportacoes, uploadRelatorioVendas } from '../../services/api';
import { HistoricoImportacao, StatusImportacao } from '../../types/entities';

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;


export function Importacao() {
  const { data: historico, loading, error, request: fetchHistorico } = useApi<HistoricoImportacao[]>(getHistoricoImportacoes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const [dataInicio, setDataInicio] = useState(today);
  const [dataFim, setDataFim] = useState(today);
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setNotification(null); // Limpa notificação anterior

    if (!arquivo || !dataInicio || !dataFim) {
        setNotification({ type: 'error', message: 'Por favor, selecione um arquivo e o intervalo de datas.' });
        return;
    }
    
    // Validação para garantir que a data final não seja anterior à inicial
    if (new Date(dataFim) < new Date(dataInicio)) {
        setNotification({ type: 'error', message: 'A data de fim não pode ser anterior à data de início.' });
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        await uploadRelatorioVendas(arquivo, dataInicio, dataFim); 
        setNotification({ type: 'success', message: 'Relatório importado com sucesso!' });
        fetchHistorico();
        setIsModalOpen(false);
        setArquivo(null);
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Erro ao processar o arquivo.';
        setNotification({ type: 'error', message: `Falha na importação: ${errorMessage}` });
    } finally {
        setIsSubmitting(false);
    }
  };

  const StatusBadge = ({ status }: { status: StatusImportacao }) => {
    switch (status) {
        case StatusImportacao.CONCLUIDA:
            return <Badge color="success" icon={HiCheck}>Concluída</Badge>;
        case StatusImportacao.ERRO:
            return <Badge color="failure" icon={HiExclamation}>Erro</Badge>;
        default:
            return <Badge color="gray">Pendente</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Toast className="fixed top-5 right-5 z-50">
          <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
            {notification.type === 'success' ? <HiCheck className="h-5 w-5" /> : <HiExclamation className="h-5 w-5" />}
          </div>
          <div className="ml-3 text-sm font-normal">{notification.message}</div>
          <Toast.Toggle onDismiss={() => setNotification(null)} />
        </Toast>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Importar Relatório de Vendas</h1>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0">
          <HiPlus className="mr-2 h-5 w-5" />
          Nova Importação
        </Button>
      </header>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Histórico de Importações</h2>
        {loading && <div className="text-center"><Spinner size="xl" /></div>}
        {error && <p className="text-red-600 text-center">Erro ao carregar histórico: {error}</p>}
        
        {!loading && !error && (
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Arquivo</Table.HeadCell>
                    <Table.HeadCell>Data da Importação</Table.HeadCell>
                    <Table.HeadCell>Faturamento Total</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {historico?.map((item) => (
                        <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="font-medium text-gray-900 dark:text-white">{item.nome_arquivo_origem}</Table.Cell>
                            <Table.Cell>{formatDate(item.data_importacao)}</Table.Cell>
                            <Table.Cell>{formatCurrency(item.faturamento_total)}</Table.Cell>
                            <Table.Cell><StatusBadge status={item.status} /></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )}
      </div>
      
      {/* Modal de Upload */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Importar Novo Relatório de Vendas</Modal.Header>
        <Modal.Body>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="data-inicio" value="Data de Início do Relatório" />
                      <TextInput id="data-inicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
                  </div>
                  <div>
                      <Label htmlFor="data-fim" value="Data de Fim do Relatório" />
                      <TextInput id="data-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
                  </div>
                </div>
                <div>
                    <Label
                        htmlFor="file-upload"
                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100"
                    >
                        <HiOutlineCloudUpload className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                         {arquivo && <p className="text-sm text-green-600 mt-2">{arquivo.name}</p>}
                        <FileInput id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </Label>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpload} isProcessing={isSubmitting} disabled={isSubmitting || !arquivo}>
            Enviar e Processar
          </Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}