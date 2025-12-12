import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import { useUser } from '../hooks/useUser';
import type { AuthSession, AuthUser, LoginCredentials, SignUpCredentials, AuthResponse } from '../types';

export interface AuthContextValue {
  // Session state
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse<AuthSession>>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse<AuthSession>>;
  logout: () => Promise<AuthResponse<void>>;
  sendPasswordResetEmail: (email: string, redirectTo?: string) => Promise<AuthResponse<void>>;
  updatePassword: (newPassword: string) => Promise<AuthResponse<void>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component
 * Provides auth context to the entire app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { session, isLoading: sessionLoading } = useSession();
  const { user, isLoading: userLoading } = useUser();
  const { login, signUp, logout, sendPasswordResetEmail, updatePassword, isLoading: actionLoading } =
    useAuth();

  const value: AuthContextValue = {
    session,
    user,
    isAuthenticated: !!session && !!user,
    isLoading: sessionLoading || userLoading || actionLoading,
    login,
    signUp,
    logout,
    sendPasswordResetEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
