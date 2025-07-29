// src/pages/relatorios/RelatorioCompras.tsx (VERSÃO COM EXPORTAÇÃO)
import { useEffect, useState } from 'react';
import { Button, Table, Spinner, TextInput, Card, Accordion, Label, Select } from 'flowbite-react';
import { HiDocumentDownload } from 'react-icons/hi';
import { useApi } from '../../hooks/useApi';
import { getComprasReport, getAllFornecedores, apiClient } from '../../services/api';
import { Compra, Fornecedor } from '../../types/entities';
import { useForm, SubmitHandler } from 'react-hook-form';
import { saveAs } from 'file-saver';

interface FiltrosCompras {
  data_inicio: string;
  data_fim: string;
  fornecedorId: number;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export function RelatorioCompras() {
  const { data: compras, loading, error, request: fetchCompras } = useApi<Compra[]>(getComprasReport);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  
  const hoje = new Date();
  const dataInicialPadrao = new Date(new Date().setDate(hoje.getDate() - 30)).toISOString().split('T')[0];
  const dataFinalPadrao = hoje.toISOString().split('T')[0];

  const { register, handleSubmit, getValues } = useForm<FiltrosCompras>({
      defaultValues: {
          data_inicio: dataInicialPadrao,
          data_fim: dataFinalPadrao,
          fornecedorId: 0,
      }
  });
  
  useEffect(() => {
    fetchCompras({ data_inicio: dataInicialPadrao, data_fim: dataFinalPadrao });
    getAllFornecedores().then(setFornecedores);
  }, [fetchCompras]);

  const onFiltrar: SubmitHandler<FiltrosCompras> = (filtros) => {
    const filtrosApi = {
        ...filtros,
        fornecedorId: Number(filtros.fornecedorId) === 0 ? undefined : Number(filtros.fornecedorId)
    }
    fetchCompras(filtrosApi);
  };

  const handleExport = async () => {
    const filtros = getValues();
    const url = '/export/compras/excel';
    
    try {
        const response = await apiClient.get(url, {
            params: {
                ...filtros,
                fornecedorId: Number(filtros.fornecedorId) === 0 ? undefined : Number(filtros.fornecedorId)
            },
            responseType: 'blob'
        });
        
        saveAs(response.data, 'relatorio_compras.xlsx');

    } catch (err) {
        console.error(`Erro ao exportar para Excel`, err);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatório de Compras</h1>
      </header>
      
      <Card>
          <form onSubmit={handleSubmit(onFiltrar)} className="flex flex-col md:flex-row items-end gap-4">
              <div>
                  <Label htmlFor="data_inicio">Data Início</Label>
                  <TextInput id="data_inicio" type="date" {...register('data_inicio')} />
              </div>
              <div>
                  <Label htmlFor="data_fim">Data Fim</Label>
                  <TextInput id="data_fim" type="date" {...register('data_fim')} />
              </div>
               <div>
                  <Label htmlFor="fornecedorId">Fornecedor</Label>
                  <Select id="fornecedorId" {...register('fornecedorId')}>
                      <option value={0}>Todos</option>
                      {fornecedores?.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </Select>
              </div>
              <Button type="submit" isProcessing={loading}>Filtrar</Button>
              <div className="flex-grow"></div>
              <Button color="gray" onClick={handleExport} disabled={loading}>
                  <HiDocumentDownload className="mr-2 h-5 w-5" /> Excel
              </Button>
          </form>
      </Card>

      <div className="overflow-x-auto">
        {loading && <div className="text-center py-8"><Spinner size="xl" /></div>}
        {error && <p className="text-red-600 text-center py-8">Erro ao carregar relatório: {error}</p>}
        
        {!loading && !error && (
            <Accordion collapseAll>
              {(compras || []).map((compra) => (
                <Accordion.Panel key={compra.id}>
                  <Accordion.Title>
                    <div className="flex justify-between w-full pr-4">
                        <span>{`Compra de ${formatDate(compra.data_compra)} - ${compra.fornecedor?.nome || 'Fornecedor não informado'}`}</span>
                        <span className="font-bold">{formatCurrency(compra.valor_total_compra)}</span>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>Produto</Table.HeadCell>
                            <Table.HeadCell>Qtd.</Table.HeadCell>
                            <Table.HeadCell>Custo Unit.</Table.HeadCell>
                            <Table.HeadCell>Subtotal</Table.HeadCell>
                        </Table.Head>
                         <Table.Body>
                            {compra.itens.map(item => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.produto.nome}</Table.Cell>
                                    <Table.Cell>{item.quantidade}</Table.Cell>
                                    <Table.Cell>{formatCurrency(item.preco_custo_unitario)}</Table.Cell>
                                    <Table.Cell>{formatCurrency(item.quantidade * item.preco_custo_unitario)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
        )}
      </div>
    </div>
  );
}