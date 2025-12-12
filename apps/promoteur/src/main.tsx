import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { RealProToaster } from '@realpro/ui';
import { ThemeProvider, OrganizationProvider } from '@realpro/core';
import App from './App';
import './index.css';

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <OrganizationProvider supabase={supabase}>
          <BrowserRouter>
            <App />
            <RealProToaster position="top-right" />
          </BrowserRouter>
        </OrganizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
