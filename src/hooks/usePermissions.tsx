import { useCurrentUser } from './useCurrentUser';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessModule,
  UserRole,
  Permission,
} from '../lib/permissions';

export function usePermissions() {
  const { user, loading } = useCurrentUser();

  const userRole = user?.role as UserRole | undefined;

  const can = (permission: Permission): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return hasAnyPermission(userRole, permissions);
  };

  const canAll = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return hasAllPermissions(userRole, permissions);
  };

  const canAccess = (module: string): boolean => {
    if (!userRole) return false;
    return canAccessModule(userRole, module);
  };

  const isRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAnyRole = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return {
    user,
    userRole,
    loading,
    can,
    canAny,
    canAll,
    canAccess,
    isRole,
    isAnyRole,
  };
}
