import { useState, useCallback } from 'react';
import { getSupabaseClient } from '../client';
import type { LoginCredentials, SignUpCredentials, AuthResponse, AuthSession } from '../types';

/**
 * Hook for authentication actions (login, logout, signup, password reset)
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseClient();

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse<AuthSession>> => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          return {
            data: null,
            error: { message: error.message, code: error.name },
          };
        }

        return { data: data.session, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: 'An unexpected error occurred' },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials): Promise<AuthResponse<AuthSession>> => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              ...credentials.metadata,
            },
          },
        });

        if (error) {
          return {
            data: null,
            error: { message: error.message, code: error.name },
          };
        }

        return { data: data.session, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: 'An unexpected error occurred' },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  const logout = useCallback(async (): Promise<AuthResponse<void>> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
        };
      }

      return { data: undefined, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: 'An unexpected error occurred' },
      };
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const sendPasswordResetEmail = useCallback(
    async (email: string, redirectTo?: string): Promise<AuthResponse<void>> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo || `${window.location.origin}/reset-password`,
        });

        if (error) {
          return {
            data: null,
            error: { message: error.message, code: error.name },
          };
        }

        return { data: undefined, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: 'An unexpected error occurred' },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResponse<void>> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          return {
            data: null,
            error: { message: error.message, code: error.name },
          };
        }

        return { data: undefined, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: 'An unexpected error occurred' },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  return {
    login,
    signUp,
    logout,
    sendPasswordResetEmail,
    updatePassword,
    isLoading,
  };
}
