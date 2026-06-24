import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { usePriceWebSocket } from './hooks/usePriceWebSocket';
import { useSignalEngine } from './hooks/useSignalEngine';

const Landing = lazy(() => import('./pages/Landing'));
const Terminal = lazy(() => import('./pages/Terminal'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  usePriceWebSocket();
  useSignalEngine();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void flex items-center justify-center">
          <div className="text-gold-bright font-mono text-sm animate-pulse-gold">
            ◈ ◈ ◈
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terminal/*" element={<Terminal />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
