import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Configuration for Supabase client
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Create a new Supabase client instance
 * Use this for custom configurations
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Get the singleton Supabase client instance
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }

  supabaseInstance = createSupabaseClient({ url, anonKey });
  return supabaseInstance;
}

/**
 * Reset the Supabase client instance (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseInstance = null;
}
