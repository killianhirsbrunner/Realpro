import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Lock } from 'lucide-react';

type Permission =
  | 'FINANCE_VIEW'
  | 'FINANCE_EDIT'
  | 'SAV_VIEW'
  | 'SAV_MANAGE'
  | 'PROJECTS_CREATE'
  | 'PROJECTS_EDIT'
  | 'PROJECTS_DELETE'
  | 'LOTS_MANAGE'
  | 'BUYERS_MANAGE'
  | 'CONTRACTS_MANAGE'
  | 'SUBMISSIONS_MANAGE'
  | 'MATERIALS_MANAGE'
  | 'PLANNING_MANAGE'
  | 'USERS_MANAGE'
  | 'SETTINGS_MANAGE'
  | 'SUPER_ADMIN';

type PermissionGateProps = {
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  organizationId?: string;
  requireAll?: boolean;
};

export function PermissionGate({
  permission,
  children,
  fallback,
  organizationId,
  requireAll = false,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions(organizationId);

  if (loading) {
    return null;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <Lock className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">
          Accès restreint
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Vous n'avez pas les permissions nécessaires pour accéder à cette section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

type PermissionToggleProps = {
  permission: Permission | Permission[];
  children: React.ReactNode;
  organizationId?: string;
  requireAll?: boolean;
};

export function PermissionToggle({
  permission,
  children,
  organizationId,
  requireAll = false,
}: PermissionToggleProps) {
  const { hasAnyPermission, hasAllPermissions, loading } = usePermissions(organizationId);

  if (loading) {
    return null;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
