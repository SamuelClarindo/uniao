import { useState, useEffect } from "react";
import { Card, Title } from "@tremor/react";
import { Button } from "flowbite-react";
import { useApi } from "../../hooks/useApi";
import { getDashboardKPIs } from "../../services/api";

export function DashboardV2() {
  const { data: kpisData, loading: kpisLoading, error: kpisError, request: fetchKPIs } = useApi(getDashboardKPIs);

  useEffect(() => {
    fetchKPIs({ periodo: 'ano' });
  }, []);

  const formatCurrency = (value: number) => 
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-[#fcfdfd] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#2b3034]">Dashboard V2</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2b3034] text-white border-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Lucro Bruto</span>
            </div>
            <div className="text-3xl font-bold">
              {kpisLoading ? "Carregando..." : formatCurrency(kpisData?.lucroBruto || 0)}
            </div>
          </Card>

          <Card className="bg-[#e6f1fd] border-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#615e83]">Despesas</span>
            </div>
            <div className="text-3xl font-bold text-[#2b3034]">
              {kpisLoading ? "Carregando..." : formatCurrency(kpisData?.despesas || 0)}
            </div>
          </Card>

          <Card className="bg-[#2b3034] text-white border-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Compras</span>
            </div>
            <div className="text-3xl font-bold">
              {kpisLoading ? "Carregando..." : kpisData?.compras || 0}
            </div>
          </Card>

          <Card className="bg-[#e6f1fd] border-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#615e83]">Lucro Líquido</span>
            </div>
            <div className="text-3xl font-bold text-[#2b3034]">
              {kpisLoading ? "Carregando..." : formatCurrency(kpisData?.lucroLiquido || 0)}
            </div>
          </Card>
        </div>

        {kpisError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erro ao carregar dados: {kpisError}
          </div>
        )}

        <div className="text-center text-[#9291a5] mt-8">
          <p>Dashboard V2 - Integração em andamento</p>
          <p>Dados carregados da API do back-end</p>
        </div>
      </div>
    </div>
  );
} 