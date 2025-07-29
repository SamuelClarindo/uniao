// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { Card, Title, BarChart, LineChart, DonutChart } from '@tremor/react';
import { useApi } from '../../hooks/useApi';
import { getDashboardData } from '../../services/api';
import { DashboardData } from '../../types/entities';

// Componente para exibir o estado de carregamento
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    </div>
);

// Componente para exibir mensagens de erro
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg" role="alert">
        <span className="font-bold">Erro:</span> {message}
    </div>
);

const DashboardCard = ({ title, value, isLoading }) => (
    <Card className="max-w-xs mx-auto">
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{title}</p>
        {isLoading ? <div className="h-8 mt-1 bg-gray-200 rounded-md animate-pulse"></div> :
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{value}</p>
        }
    </Card>
);

const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function Dashboard() {
  const { data, loading, error, request: fetchDashboardData } = useApi<DashboardData>(getDashboardData);

  useEffect(() => {
    fetchDashboardData('mes');
  }, [fetchDashboardData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message="Nenhum dado encontrado." />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Visão geral do seu negócio.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
         <DashboardCard title="Faturamento Total" value={formatCurrency(data.faturamentoTotal)} isLoading={loading} />
         <DashboardCard title="Despesas (Mês)" value={formatCurrency(data.totalDespesas)} isLoading={loading} />
         <DashboardCard title="Compras (Mês)" value={formatCurrency(data.totalCompras)} isLoading={loading} />
         <DashboardCard title="Lucro Bruto" value={formatCurrency(data.lucroBruto)} isLoading={loading} />
         <Card className="max-w-xs mx-auto ring-2 ring-indigo-500">
             <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Lucro Real (Destaque)</p>
             <p className={`text-3xl font-semibold ${data.lucroReal < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(data.lucroReal)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Title>Faturamento por Dia</Title>
          <LineChart
            className="mt-6"
            data={data.faturamentoPorDia}
            index="data"
            categories={['faturamento']}
            colors={['blue']}
            yAxisWidth={40}
            valueFormatter={formatCurrency}
          />
        </Card>
        <Card>
          <Title>Top Despesas</Title>
           <DonutChart
            className="mt-6"
            data={data.topDespesas}
            category="total"
            index="plano_contas"
            valueFormatter={formatCurrency}
            colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
          />
        </Card>
      </div>

       <div className="grid grid-cols-1 gap-6">
          <Card>
            <Title>Top 10 Produtos Mais Vendidos (em Valor)</Title>
            <BarChart
                className="mt-6"
                data={data.topProdutos}
                index="nome"
                categories={['total_vendido']}
                colors={['blue']}
                valueFormatter={formatCurrency}
                yAxisWidth={100}
            />
        </Card>
      </div>
    </div>
  );
}