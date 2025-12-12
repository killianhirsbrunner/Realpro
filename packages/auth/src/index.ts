/**
 * @realpro/auth
 * Authentication package for Realpro Suite
 *
 * This package provides:
 * - Supabase client factory
 * - Auth hooks (useAuth, useSession, useUser)
 * - Auth guards (AuthGuard)
 * - Auth providers (AuthProvider)
 *
 * IMPORTANT: This package contains ONLY technical auth logic.
 * Business-specific permissions and roles must stay in individual apps.
 */

// Client
export { createSupabaseClient, getSupabaseClient } from './client';

// Types
export type {
  AuthSession,
  AuthUser,
  AuthError,
  LoginCredentials,
  SignUpCredentials,
} from './types';

// Hooks
export * from './hooks';

// Guards
export * from './guards';

// Providers
export * from './providers';

// UI Components (Auth screens)
export * from './components';
