import { Outlet } from 'react-router-dom';
import { AppSidebar } from './Sidebar';

export function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* O conteúdo da rota atual será renderizado aqui */}
      </main>
    </div>
  );
}