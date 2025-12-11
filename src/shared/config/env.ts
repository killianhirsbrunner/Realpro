/**
 * RealPro | Environment Configuration
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

export const env = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,

  // App
  APP_ENV: (import.meta.env.VITE_APP_ENV as string) || 'development',
  APP_URL: (import.meta.env.VITE_APP_URL as string) || 'http://localhost:5173',

  // Feature flags
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // Datatrans
  DATATRANS_MERCHANT_ID: import.meta.env.VITE_DATATRANS_MERCHANT_ID as string,
  DATATRANS_MODE: (import.meta.env.VITE_DATATRANS_MODE as string) || 'sandbox',
} as const;

export const isDev = env.APP_ENV === 'development';
export const isProd = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';
