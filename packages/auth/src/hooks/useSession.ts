import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../client';
import type { AuthSession } from '../types';

/**
 * Hook for accessing the current auth session
 */
export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
}
