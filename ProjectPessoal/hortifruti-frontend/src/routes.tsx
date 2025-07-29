// src/routes.tsx (adicionar a rota de importações)
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard'; 
import { DashboardV2 } from './pages/Dashboard/DashboardV2';
import { Produtos } from './pages/produtos';
import { Fornecedores } from './pages/fornecedores/Fornecedores';
import { Despesas } from './pages/despesas/Despesas';
import { Importacao } from './pages/importacoes/Importacao';
import { Compras } from './pages/compras/Compras';
import { RelatorioVendas } from './pages/relatorios/RelatorioVendas';
import { RelatorioCompras } from './pages/relatorios/RelatorioCompras';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardV2 /> },
      { path: 'dashboard-old', element: <Dashboard /> },
      { path: 'produtos', element: <Produtos /> },
      { path: 'fornecedores', element: <Fornecedores /> },
      { path: 'despesas', element: <Despesas /> },
      {
        path: 'importacoes',
        element: <Importacao />,
      },
      {
        path: 'compras',
        element: <Compras />,
      },
      {
        path: 'relatorios/vendas',
        element: <RelatorioVendas />,
      },
      {
        path: 'relatorios/compras',
        element: <RelatorioCompras />,
      },
    ],
  },
]);

// ... (resto do arquivo sem alterações)
export function AppRoutes() {
  return <RouterProvider router={router} />;
}