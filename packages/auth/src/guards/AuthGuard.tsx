import { type ReactNode } from 'react';
import { useSession } from '../hooks/useSession';

export interface AuthGuardProps {
  /**
   * Content to render when authenticated
   */
  children: ReactNode;
  /**
   * Component to render while loading
   */
  loadingFallback?: ReactNode;
  /**
   * Component to render when not authenticated
   */
  unauthenticatedFallback?: ReactNode;
  /**
   * Callback when user is not authenticated
   * Use this to redirect to login page
   */
  onUnauthenticated?: () => void;
}

/**
 * Generic auth guard component
 * Apps should wrap this with their own routing/redirect logic
 */
export function AuthGuard({
  children,
  loadingFallback,
  unauthenticatedFallback,
  onUnauthenticated,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useSession();

  // Loading state
  if (isLoading) {
    return (
      <>
        {loadingFallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-400" />
          </div>
        )}
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (onUnauthenticated) {
      onUnauthenticated();
    }
    return <>{unauthenticatedFallback || null}</>;
  }

  // Authenticated - render children
  return <>{children}</>;
}
