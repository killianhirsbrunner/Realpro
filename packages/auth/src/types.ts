import type { Session, User } from '@supabase/supabase-js';

/**
 * Auth session type
 */
export type AuthSession = Session;

/**
 * Auth user type
 */
export type AuthUser = User;

/**
 * Auth error type
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials extends LoginCredentials {
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Auth response type
 */
export interface AuthResponse<T = unknown> {
  data: T | null;
  error: AuthError | null;
}
