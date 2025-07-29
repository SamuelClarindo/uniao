// src/pages/relatorios/RelatorioVendas.tsx (VERSÃO COM EXPORTAÇÃO)
import { useEffect, useState } from 'react';
import { Button, Table, Spinner, TextInput, Card, Label } from 'flowbite-react';
import { HiDocumentDownload, HiDocumentText } from 'react-icons/hi';
import { useApi } from '../../hooks/useApi';
import { getVendasReport } from '../../services/api';
import { Venda } from '../../types/entities';
import { useForm, SubmitHandler } from 'react-hook-form';
import { saveAs } from 'file-saver';
import { apiClient } from '../../services/api';

interface FiltrosVendas {
  data_inicio: string;
  data_fim: string;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export function RelatorioVendas() {
  const { data: vendas, loading, error, request: fetchVendas } = useApi<Venda[]>(getVendasReport);
  
  const hoje = new Date();
  const dataInicialPadrao = new Date(new Date().setDate(hoje.getDate() - 30)).toISOString().split('T')[0];
  const dataFinalPadrao = hoje.toISOString().split('T')[0];

  const { register, handleSubmit, getValues } = useForm<FiltrosVendas>({
      defaultValues: {
          data_inicio: dataInicialPadrao,
          data_fim: dataFinalPadrao,
      }
  });
  
  useEffect(() => {
    fetchVendas({ data_inicio: dataInicialPadrao, data_fim: dataFinalPadrao });
  }, [fetchVendas]);

  const onFiltrar: SubmitHandler<FiltrosVendas> = (filtros) => {
    fetchVendas(filtros);
  };
  
  const handleExport = async (format: 'excel' | 'pdf') => {
    const filtros = getValues();
    const url = `/export/vendas/${format}`;
    
    try {
        const response = await apiClient.get(url, {
            params: filtros,
            responseType: 'blob' // Importante para o navegador entender como um arquivo
        });
        
        const fileName = format === 'excel' ? 'relatorio_vendas.xlsx' : 'relatorio_vendas.pdf';
        saveAs(response.data, fileName);

    } catch (err) {
        console.error(`Erro ao exportar para ${format}`, err);
    }
  };

  const calcularMargem = (precoVenda: number, custo: number) => {
    if(custo === 0 || precoVenda === 0) return { valor: 0, percentual: 0, cor: 'text-gray-500' };
    const margemValor = precoVenda - custo;
    const margemPercentual = (margemValor / precoVenda) * 100;
    const cor = margemValor < 0 ? 'text-red-600' : 'text-green-600';
    return { valor: margemValor, percentual: margemPercentual, cor };
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatório de Vendas Detalhado</h1>
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
              <Button type="submit" isProcessing={loading}>Filtrar</Button>
              <div className="flex-grow"></div>
              <Button.Group>
                  <Button color="gray" onClick={() => handleExport('excel')} disabled={loading}>
                      <HiDocumentDownload className="mr-2 h-5 w-5" /> Excel
                  </Button>
                  <Button color="gray" onClick={() => handleExport('pdf')} disabled={loading}>
                      <HiDocumentText className="mr-2 h-5 w-5" /> PDF
                  </Button>
              </Button.Group>
          </form>
      </Card>

      <div className="overflow-x-auto">
        {loading && <div className="text-center py-8"><Spinner size="xl" /></div>}
        {error && <p className="text-red-600 text-center py-8">Erro ao carregar relatório: {error}</p>}
        
        {!loading && !error && (
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Data</Table.HeadCell>
                    <Table.HeadCell>Produto</Table.HeadCell>
                    <Table.HeadCell>Qtd.</Table.HeadCell>
                    <Table.HeadCell>Custo Unit.</Table.HeadCell>
                    <Table.HeadCell>Venda Unit.</Table.HeadCell>
                    <Table.HeadCell>Margem (R$)</Table.HeadCell>
                    <Table.HeadCell>Margem (%)</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {vendas?.map((venda) => {
                        const margem = calcularMargem(venda.preco_venda_unitario, venda.custo_unitario);
                        return(
                            <Table.Row key={venda.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{formatDate(venda.data_venda)}</Table.Cell>
                                <Table.Cell className="font-medium text-gray-900 dark:text-white">{venda.produto.nome}</Table.Cell>
                                <Table.Cell>{venda.quantidade_vendida}</Table.Cell>
                                <Table.Cell>{formatCurrency(venda.custo_unitario)}</Table.Cell>
                                <Table.Cell>{formatCurrency(venda.preco_venda_unitario)}</Table.Cell>
                                <Table.Cell className={margem.cor}>{formatCurrency(margem.valor)}</Table.Cell>
                                <Table.Cell className={margem.cor}>{margem.percentual.toFixed(2)}%</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        )}
      </div>
    </div>
  );
}