// src/App.tsx (VERSÃO COM NOTIFICAÇÕES)
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster 
        position="top-right" // Posição onde as notificações aparecerão
        toastOptions={{
          duration: 3000, // Duração padrão de 3 segundos
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;