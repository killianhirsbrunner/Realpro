// Shared Supabase Client Utilities for Edge Functions

import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';

/**
 * Create a Supabase client with service role key
 * Use for server-side operations that bypass RLS
 */
export function createServiceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Create a Supabase client from request authorization header
 * Use for operations that should respect RLS
 */
export function createClientFromRequest(req: Request): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const authHeader = req.headers.get('Authorization');

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

/**
 * Get user from request
 */
export async function getUserFromRequest(
  supabase: SupabaseClient,
  req: Request
): Promise<{ id: string; email: string } | null> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
  };
}
