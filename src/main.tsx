import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from '@presentation/App';
import './index.css';

// =============================================================================
// React entry point — provider ağacı + QueryClient instance
// =============================================================================
// Provider sırası:
//   QueryClientProvider (server state) ← BrowserRouter (URL state) ← App
//
// QueryClient ayarları:
//   - retry 1: ağ hatası gibi durumlarda tek deneme yeter (kullanıcı aktif beklemede,
//     uzun retry zinciri UX'i bozar). Auth refresh mekanizması interceptor'da.
//   - staleTime 30s: hızlı navigasyonda gereksiz refetch'i azaltır.
//   - refetchOnWindowFocus false: dev sırasında tab değiştirmek ağ trafiğini patlatmasın.
// =============================================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
