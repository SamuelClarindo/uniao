"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Tooltip,
} from "recharts"
import {
  Search,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Home,
} from "lucide-react"

const CustomRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length && payload[0].value !== null) {
    const formatCurrency = (value: number) =>
      value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
      <div className="bg-white p-4 border border-[#e5e5ef] rounded-lg shadow-lg">
        <p className="text-sm font-medium text-[#2b3034] mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#2b3034] rounded-full"></div>
            <span className="text-sm text-[#615e83]">
              Lucro Bruto:{" "}
              <span className="font-bold text-[#2b3034]">
                {formatCurrency(payload[0].value)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#9291a5] rounded-full"></div>
            <span className="text-sm text-[#615e83]">
              Venda:{" "}
              <span className="font-bold text-[#2b3034]">
                {formatCurrency(payload[1].value)}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomSalesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#e5e5ef] rounded-lg shadow-lg">
        <p className="text-sm text-[#615e83]">{label}</p>
        <p className="text-sm font-medium text-[#2b3034]">{`Vendas: ${payload[0].value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}</p>
      </div>
    );
  }
  return null;
};

const CustomProductQuantityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#e5e5ef] rounded-lg shadow-lg">
        <p className="text-sm text-[#615e83]">{label}</p>
        <p className="text-sm font-medium text-[#2b3034]">{`Quantidade: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


export default function Dashboard() {
  const [activeRevenueTab, setActiveRevenueTab] = useState("Ano")
  const [activeTopProductsTab, setActiveTopProductsTab] = useState("Ano")
  const [activeProductQuantityTab, setActiveProductQuantityTab] = useState("Ano")
  const [activeExpenseTab, setActiveExpenseTab] = useState("Ano")
  const [activeSalesTab, setActiveSalesTab] = useState("Ano")

  const annualRevenueData = useMemo(() => [
    { month: "Jan", lucroBruto: 8000, venda: 7500 },
    { month: "Fev", lucroBruto: 7200, venda: 6800 },
    { month: "Mar", lucroBruto: 8500, venda: 8000 },
    { month: "Abr", lucroBruto: 9200, venda: 8700 },
    { month: "Mai", lucroBruto: 8800, venda: 8300 },
    { month: "Jun", lucroBruto: 9500, venda: 9000 },
    { month: "Jul", lucroBruto: 8900, venda: 8400 },
    { month: "Ago", lucroBruto: 9100, venda: 8600 },
    { month: "Set", lucroBruto: 9300, venda: 8800 },
    { month: "Out", lucroBruto: 9400, venda: 8900 },
    { month: "Nov", lucroBruto: 9600, venda: 9100 },
    { month: "Dez", lucroBruto: 9800, venda: 9300 },
  ], []);

  const monthlyRevenueData = useMemo(() => [
    { week: "Semana 1", lucroBruto: 2000, venda: 1800 },
    { week: "Semana 2", lucroBruto: 2200, venda: 2100 },
    { week: "Semana 3", lucroBruto: 1900, venda: 1850 },
    { week: "Semana 4", lucroBruto: 2300, venda: 2200 },
  ], []);

  const weeklyRevenueData = useMemo(() => ({
    lucroBruto: 2150,
    venda: 2050,
  }), []);

  const annualSalesData = useMemo(() => [
    { month: "Jan", value: 8500 },
    { month: "Fev", value: 7200 },
    { month: "Mar", value: 8800 },
    { month: "Abr", value: 9200 },
    { month: "Mai", value: 8600 },
    { month: "Jun", value: 9458 },
    { month: "Jul", value: 8900 },
    { month: "Ago", value: 9100 },
    { month: "Set", value: 8700 },
    { month: "Out", value: 9300 },
    { month: "Nov", value: 8800 },
    { month: "Dez", value: 9000 },
  ], []);

  const monthlySalesData = useMemo(() => [
    { week: "Semana 1", value: 2100 },
    { week: "Semana 2", value: 2300 },
    { week: "Semana 3", value: 2000 },
    { week: "Semana 4", value: 2400 },
  ], []);

  const weeklySalesData = useMemo(() => ({
    total: 2250,
  }), []);

  const productData = useMemo(() => [
    { name: "Maça", quantity: 180 },
    { name: "Laranja", quantity: 220 },
    { name: "Banana D", quantity: 190 },
    { name: "Banana P", quantity: 240 },
    { name: "Verdura", quantity: 260 },
    { name: "Coca-cola", quantity: 140 },
  ], []);

  const expenseData = useMemo(() => [
    { name: "Salário", value: 52.1, color: "#2b3034" },
    { name: "Conta de Luz", value: 22.8, color: "#92bfff" },
    { name: "Compras", value: 13.9, color: "#94e9b8" },
    { name: "Outros", value: 11.2, color: "#d5d5d5" },
  ], []);
  
  const topProducts = useMemo(() => [
    { name: "Verdura", value: 462.2, percentage: 100 },
    { name: "Banana P", value: 381.41, percentage: 85 },
    { name: "Laranja", value: 264.07, percentage: 60 },
    { name: "Bolo", value: 223.3, percentage: 50 },
    { name: "Tangerina", value: 182.9, percentage: 40 },
    { name: "Banana D", value: 130.43, percentage: 30 },
  ], []);
  
  const topProductsMonthly = useMemo(() => [
    { name: "Suco de Uva", value: 255.5, percentage: 100 },
    { name: "Pão de Queijo", value: 210.0, percentage: 88 },
    { name: "Café", value: 180.7, percentage: 75 },
    { name: "Leite", value: 150.3, percentage: 60 },
    { name: "Refrigerante", value: 95.9, percentage: 45 },
    { name: "Água", value: 80.0, percentage: 40 },
  ], []);


  return (
    <div className="min-h-screen bg-[#fcfdfd] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#e5e5ef] flex flex-col">
        <div className="flex items-center p-6 h-[89px] border-b border-[#e5e5ef]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2b3034] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="font-semibold text-[#2b3034]">BonsFrutos</span>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-medium text-[#9291a5] uppercase mb-3">Dashboards</h3>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-[#2b3034] bg-[#f9f9fa]">
                <Home className="w-4 h-4 mr-3" />
                Início
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <BarChart3 className="w-4 h-4 mr-3" />
                Gráficos
              </Button>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-medium text-[#9291a5] uppercase mb-3">Páginas</h3>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <Package className="w-4 h-4 mr-3" />
                Produtos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <Users className="w-4 h-4 mr-3" />
                Fornecedores
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <FileText className="w-4 h-4 mr-3" />
                Despesas
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <ShoppingCart className="w-4 h-4 mr-3" />
                Vendas
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <ShoppingCart className="w-4 h-4 mr-3" />
                Compras
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <FileText className="w-4 h-4 mr-3" />
                Relatório de Vendas
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#615e83]">
                <FileText className="w-4 h-4 mr-3" />
                Relatório de Compras
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#e5e5ef] p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 text-sm">
                <span className="text-[#9291a5]">Dashboards</span>
                <span className="text-[#9291a5]">/</span>
                <span className="text-[#2b3034] font-medium">Default</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9291a5]" />
                <Input placeholder="Search" className="pl-10 w-64 bg-[#f9f9fa] border-[#e5e5ef]" />
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4 text-[#9291a5]" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4 text-[#9291a5]" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#2b3034] text-white text-xs">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#2b3034]">Dashboard</h1>
            <Button variant="outline" className="text-[#615e83] bg-transparent">
              Hoje
              <MoreHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2b3034] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Lucro Bruto</span>
                  <div className="flex items-center text-[#04ce00] text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +11.01%
                  </div>
                </div>
                <div className="text-3xl font-bold">7,265</div>
              </CardContent>
            </Card>

            <Card className="bg-[#e6f1fd] border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#615e83]">Despesas</span>
                  <div className="flex items-center text-red-500 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    -0.03%
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#2b3034]">3,671</div>
              </CardContent>
            </Card>

            <Card className="bg-[#2b3034] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Compras</span>
                  <div className="flex items-center text-[#04ce00] text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15.03%
                  </div>
                </div>
                <div className="text-3xl font-bold">156</div>
              </CardContent>
            </Card>

            <Card className="bg-[#e6f1fd] border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#615e83]">Lucro Líquido</span>
                  <div className="flex items-center text-[#04ce00] text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +6.08%
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#2b3034]">2,318</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Revenue Comparison Chart */}
            <Card className="col-span-2 border-[#e5e5ef]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#2b3034]">Comparação da Receita</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveRevenueTab("Semana")}
                    variant={activeRevenueTab === "Semana" ? "default" : "ghost"}
                    size="sm"
                    className={activeRevenueTab === "Semana" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Semana
                  </Button>
                  <Button
                    onClick={() => setActiveRevenueTab("Mês")}
                    variant={activeRevenueTab === "Mês" ? "default" : "ghost"}
                    size="sm"
                    className={activeRevenueTab === "Mês" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Mês
                  </Button>
                  <Button
                    onClick={() => setActiveRevenueTab("Ano")}
                    variant={activeRevenueTab === "Ano" ? "default" : "ghost"}
                    size="sm"
                    className={activeRevenueTab === "Ano" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Ano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2b3034] rounded-full"></div>
                    <span className="text-sm text-[#615e83]">Lucro Bruto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#9291a5] rounded-full"></div>
                    <span className="text-sm text-[#615e83]">Venda</span>
                  </div>
                </div>

                {activeRevenueTab === 'Ano' && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={annualRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ef" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Line type="monotone" dataKey="lucroBruto" stroke="#2b3034" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="venda" stroke="#9291a5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeRevenueTab === 'Mês' && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ef" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Line type="monotone" dataKey="lucroBruto" stroke="#2b3034" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="venda" stroke="#9291a5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeRevenueTab === 'Semana' && (
                  <div className="h-[200px] flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-[#615e83]">Lucro Bruto da Semana</p>
                      <p className="text-3xl font-bold text-[#2b3034]">
                        {weeklyRevenueData.lucroBruto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#615e83]">Venda da Semana</p>
                      <p className="text-3xl font-bold text-[#2b3034]">
                        {weeklyRevenueData.venda.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1c1c1c] text-lg">Top Produtos</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTopProductsTab("Semana")}
                    variant={activeTopProductsTab === "Semana" ? "default" : "ghost"}
                    size="sm"
                    className={activeTopProductsTab === "Semana" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Semana
                  </Button>
                  <Button
                    onClick={() => setActiveTopProductsTab("Mês")}
                    variant={activeTopProductsTab === "Mês" ? "default" : "ghost"}
                    size="sm"
                    className={activeTopProductsTab === "Mês" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Mês
                  </Button>
                  <Button
                    onClick={() => setActiveTopProductsTab("Ano")}
                    variant={activeTopProductsTab === "Ano" ? "default" : "ghost"}
                    size="sm"
                    className={activeTopProductsTab === "Ano" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Ano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(activeTopProductsTab === 'Mês' ? topProductsMonthly : topProducts).map((product, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-[#1c1c1c] w-24 truncate">{product.name}</span>
                        <div className="flex-1 bg-[#edeefc] rounded-full h-2">
                          <div className="bg-[#2d2930] h-2 rounded-full" style={{ width: `${product.percentage}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#1c1c1c]">{product.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Product Quantity Chart */}
            <Card className="border-[#e5e5ef]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#2b3034]">
                  Top Quantidade de Produtos Vendidos
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveProductQuantityTab("Semana")}
                    variant={activeProductQuantityTab === "Semana" ? "default" : "ghost"}
                    size="sm"
                    className={activeProductQuantityTab === "Semana" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Semana
                  </Button>
                  <Button
                    onClick={() => setActiveProductQuantityTab("Mês")}
                    variant={activeProductQuantityTab === "Mês" ? "default" : "ghost"}
                    size="sm"
                    className={activeProductQuantityTab === "Mês" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Mês
                  </Button>
                  <Button
                    onClick={() => setActiveProductQuantityTab("Ano")}
                    variant={activeProductQuantityTab === "Ano" ? "default" : "ghost"}
                    size="sm"
                    className={activeProductQuantityTab === "Ano" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Ano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ef" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <Tooltip content={<CustomProductQuantityTooltip />} cursor={{ fill: 'rgba(43, 48, 52, 0.1)' }} />
                    <Bar dataKey="quantity" fill="#2b3034" radius={10} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expenses Pie Chart */}
            <Card className="border-[#e5e5ef]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#2b3034]">Despesas</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveExpenseTab("Semana")}
                    variant={activeExpenseTab === "Semana" ? "default" : "ghost"}
                    size="sm"
                    className={activeExpenseTab === "Semana" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Semana
                  </Button>
                  <Button
                    onClick={() => setActiveExpenseTab("Mês")}
                    variant={activeExpenseTab === "Mês" ? "default" : "ghost"}
                    size="sm"
                    className={activeExpenseTab === "Mês" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Mês
                  </Button>
                  <Button
                    onClick={() => setActiveExpenseTab("Ano")}
                    variant={activeExpenseTab === "Ano" ? "default" : "ghost"}
                    size="sm"
                    className={activeExpenseTab === "Ano" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Ano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value">
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {expenseData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-[#615e83]">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-[#2b3034]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Chart */}
          <Card className="border-[#e5e5ef]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-[#2b3034] mb-1">Vendas 2025</CardTitle>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#2b3034]">R$10.925,84</span>
                  <div className="flex items-center text-[#04ce00] text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    1.3% VS ÚLTIMO ANO
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveSalesTab("Semana")}
                  variant={activeSalesTab === "Semana" ? "default" : "ghost"}
                  size="sm"
                  className={activeSalesTab === "Semana" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                >
                  Semana
                </Button>
                <Button
                  onClick={() => setActiveSalesTab("Mês")}
                  variant={activeSalesTab === "Mês" ? "default" : "ghost"}
                  size="sm"
                  className={activeSalesTab === "Mês" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                >
                  Mês
                </Button>
                <Button
                  onClick={() => setActiveSalesTab("Ano")}
                  variant={activeSalesTab === "Ano" ? "default" : "ghost"}
                  size="sm"
                  className={activeSalesTab === "Ano" ? "bg-[#2b3034] text-white" : "text-[#9291a5]"}
                  >
                    Ano
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeSalesTab === 'Ano' && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={annualSalesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9291a5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9291a5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ef" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#2b3034" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {activeSalesTab === 'Mês' && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySalesData}>
                    <defs>
                      <linearGradient id="colorSalesMonth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9291a5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9291a5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ef" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9291a5" }} />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#2b3034" strokeWidth={2} fillOpacity={1} fill="url(#colorSalesMonth)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {activeSalesTab === 'Semana' && (
                <div className="h-[300px] flex flex-col items-center justify-center">
                   <p className="text-lg text-[#615e83]">Vendas da Semana</p>
                   <p className="text-4xl font-bold text-[#2b3034]">
                    {weeklySalesData.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
        <img src="/logoboaa.png" alt="Logo" style={{ height: '80px' }} />
      </div>
    </div>
  )
}