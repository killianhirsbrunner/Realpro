import { useState, useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';

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

type Role = 'PROMOTER' | 'EG' | 'COURTIER' | 'BUYER' | 'SUPPLIER' | 'ADMIN';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  PROMOTER: [
    'FINANCE_VIEW',
    'FINANCE_EDIT',
    'SAV_VIEW',
    'SAV_MANAGE',
    'PROJECTS_CREATE',
    'PROJECTS_EDIT',
    'PROJECTS_DELETE',
    'LOTS_MANAGE',
    'BUYERS_MANAGE',
    'CONTRACTS_MANAGE',
    'SUBMISSIONS_MANAGE',
    'MATERIALS_MANAGE',
    'PLANNING_MANAGE',
    'USERS_MANAGE',
    'SETTINGS_MANAGE',
  ],
  EG: [
    'FINANCE_VIEW',
    'SAV_VIEW',
    'SAV_MANAGE',
    'PROJECTS_EDIT',
    'LOTS_MANAGE',
    'BUYERS_MANAGE',
    'CONTRACTS_MANAGE',
    'SUBMISSIONS_MANAGE',
    'MATERIALS_MANAGE',
    'PLANNING_MANAGE',
  ],
  COURTIER: [
    'FINANCE_VIEW',
    'LOTS_MANAGE',
    'BUYERS_MANAGE',
    'CONTRACTS_MANAGE',
  ],
  BUYER: [],
  SUPPLIER: [
    'MATERIALS_MANAGE',
  ],
  ADMIN: [
    'SUPER_ADMIN',
  ],
};

export function usePermissions(organizationId?: string) {
  const { user } = useCurrentUser();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    const userPerms: Permission[] = [];

    if (user.is_super_admin) {
      userPerms.push('SUPER_ADMIN');
    }

    if (organizationId && user.user_organizations) {
      const membership = user.user_organizations.find(
        (uo: any) => uo.organization_id === organizationId
      );

      if (membership) {
        const role = membership.role as Role;
        const rolePerms = ROLE_PERMISSIONS[role] || [];
        userPerms.push(...rolePerms);
      }
    } else if (user.user_organizations && user.user_organizations.length > 0) {
      const role = user.user_organizations[0].role as Role;
      const rolePerms = ROLE_PERMISSIONS[role] || [];
      userPerms.push(...rolePerms);
    }

    setPermissions([...new Set(userPerms)]);
    setLoading(false);
  }, [user, organizationId]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission) || permissions.includes('SUPER_ADMIN');
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (perms: Permission[]): boolean => {
    return perms.every((p) => hasPermission(p));
  };

  const isSuperAdmin = (): boolean => {
    return permissions.includes('SUPER_ADMIN');
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
  };
}
