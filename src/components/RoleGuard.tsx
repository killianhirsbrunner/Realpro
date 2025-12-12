import { ReactNode } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { canAccessModule, hasPermission, UserRole, Permission } from '../lib/permissions';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface RoleGuardProps {
  children: ReactNode;
  module?: string;
  permission?: Permission;
  roles?: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  module,
  permission,
  roles,
  fallback,
}: RoleGuardProps) {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return fallback || <UnauthorizedMessage />;
  }

  const userRole = user.role as UserRole;

  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    return fallback || <UnauthorizedMessage />;
  }

  if (module && !canAccessModule(userRole, module)) {
    return fallback || <UnauthorizedMessage />;
  }

  if (permission && !hasPermission(userRole, permission)) {
    return fallback || <UnauthorizedMessage />;
  }

  return <>{children}</>;
}

function UnauthorizedMessage() {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Accès refusé
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page ou fonctionnalité.
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour
        </button>
      </div>
    </div>
  );
}
