import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiInbox, HiShoppingBag, HiArrowSmRight, HiTable, HiUserGroup, HiDocumentReport, HiCreditCard } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar aria-label="Sidebar principal" className="h-full">
      <Sidebar.Logo href="/dashboard" img="/logo-hortifruti.png" imgAlt="Hortifruti+ Logo">
        Hortifruti+
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/dashboard"
            icon={HiChartPie}
            active={location.pathname === '/dashboard'}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Collapse icon={HiShoppingBag} label="Cadastros">
            <Sidebar.Item as={Link} to="/produtos" active={location.pathname.startsWith('/produtos')}>
              Produtos
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/fornecedores" active={location.pathname.startsWith('/fornecedores')}>
              Fornecedores
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/despesas" active={location.pathname.startsWith('/despesas')}>
              Despesas
            </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiInbox} label="Operacional">
            <Sidebar.Item as={Link} to="/importacoes" active={location.pathname.startsWith('/importacoes')}>
              Importar Vendas
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/compras" active={location.pathname.startsWith('/compras')}>
              Lançar Compras
            </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiDocumentReport} label="Relatórios">
            <Sidebar.Item as={Link} to="/relatorios/vendas">Vendas</Sidebar.Item>
            <Sidebar.Item as={Link} to="/relatorios/compras">Compras</Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
           <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sair
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}