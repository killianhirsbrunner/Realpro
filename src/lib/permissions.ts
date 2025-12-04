export enum UserRole {
  PROMOTEUR = 'promoteur',
  EG = 'eg',
  ARCHITECTE = 'architecte',
  NOTAIRE = 'notaire',
  COURTIER = 'courtier',
  ACHETEUR = 'acheteur',
  ADMIN = 'admin',
  FOURNISSEUR = 'fournisseur',
}

export enum Permission {
  VIEW_PROJECTS = 'view_projects',
  CREATE_PROJECTS = 'create_projects',
  EDIT_PROJECTS = 'edit_projects',
  DELETE_PROJECTS = 'delete_projects',

  VIEW_LOTS = 'view_lots',
  CREATE_LOTS = 'create_lots',
  EDIT_LOTS = 'edit_lots',
  SELL_LOTS = 'sell_lots',

  VIEW_BUYERS = 'view_buyers',
  MANAGE_BUYERS = 'manage_buyers',
  VIEW_BUYER_DETAILS = 'view_buyer_details',

  VIEW_DOCUMENTS = 'view_documents',
  UPLOAD_DOCUMENTS = 'upload_documents',
  SIGN_DOCUMENTS = 'sign_documents',

  VIEW_SUBMISSIONS = 'view_submissions',
  CREATE_SUBMISSIONS = 'create_submissions',
  COMPARE_SUBMISSIONS = 'compare_submissions',

  VIEW_CONSTRUCTION = 'view_construction',
  MANAGE_CONSTRUCTION = 'manage_construction',

  VIEW_SAV = 'view_sav',
  MANAGE_SAV = 'manage_sav',

  VIEW_BILLING = 'view_billing',
  MANAGE_BILLING = 'manage_billing',

  VIEW_REPORTING = 'view_reporting',
  EXPORT_DATA = 'export_data',

  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),

  [UserRole.PROMOTEUR]: [
    Permission.VIEW_PROJECTS,
    Permission.CREATE_PROJECTS,
    Permission.EDIT_PROJECTS,
    Permission.DELETE_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.CREATE_LOTS,
    Permission.EDIT_LOTS,
    Permission.SELL_LOTS,
    Permission.VIEW_BUYERS,
    Permission.MANAGE_BUYERS,
    Permission.VIEW_BUYER_DETAILS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_SUBMISSIONS,
    Permission.CREATE_SUBMISSIONS,
    Permission.COMPARE_SUBMISSIONS,
    Permission.VIEW_CONSTRUCTION,
    Permission.MANAGE_CONSTRUCTION,
    Permission.VIEW_SAV,
    Permission.MANAGE_SAV,
    Permission.VIEW_BILLING,
    Permission.MANAGE_BILLING,
    Permission.VIEW_REPORTING,
    Permission.EXPORT_DATA,
    Permission.MANAGE_SETTINGS,
  ],

  [UserRole.EG]: [
    Permission.VIEW_PROJECTS,
    Permission.EDIT_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_CONSTRUCTION,
    Permission.MANAGE_CONSTRUCTION,
    Permission.VIEW_REPORTING,
  ],

  [UserRole.ARCHITECTE]: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_CONSTRUCTION,
    Permission.VIEW_REPORTING,
  ],

  [UserRole.NOTAIRE]: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_BUYERS,
    Permission.VIEW_BUYER_DETAILS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.SIGN_DOCUMENTS,
  ],

  [UserRole.COURTIER]: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.SELL_LOTS,
    Permission.VIEW_BUYERS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.ACHETEUR]: [
    Permission.VIEW_DOCUMENTS,
    Permission.SIGN_DOCUMENTS,
    Permission.VIEW_SAV,
  ],

  [UserRole.FOURNISSEUR]: [
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],
};

export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const userRole = role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole];

  if (!permissions) {
    return false;
  }

  return permissions.includes(permission);
}

export function hasAnyPermission(
  role: UserRole | string,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(
  role: UserRole | string,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function canAccessModule(role: UserRole | string, module: string): boolean {
  const modulePermissions: Record<string, Permission[]> = {
    projects: [Permission.VIEW_PROJECTS],
    lots: [Permission.VIEW_LOTS],
    buyers: [Permission.VIEW_BUYERS],
    documents: [Permission.VIEW_DOCUMENTS],
    submissions: [Permission.VIEW_SUBMISSIONS],
    construction: [Permission.VIEW_CONSTRUCTION],
    sav: [Permission.VIEW_SAV],
    billing: [Permission.VIEW_BILLING],
    reporting: [Permission.VIEW_REPORTING],
  };

  const requiredPermissions = modulePermissions[module];
  if (!requiredPermissions) {
    return false;
  }

  return hasAnyPermission(role, requiredPermissions);
}

export function getRoleDisplayName(role: UserRole | string): string {
  const displayNames: Record<string, string> = {
    [UserRole.PROMOTEUR]: 'Promoteur',
    [UserRole.EG]: 'Entreprise Générale',
    [UserRole.ARCHITECTE]: 'Architecte',
    [UserRole.NOTAIRE]: 'Notaire',
    [UserRole.COURTIER]: 'Courtier',
    [UserRole.ACHETEUR]: 'Acheteur',
    [UserRole.ADMIN]: 'Administrateur',
    [UserRole.FOURNISSEUR]: 'Fournisseur',
  };

  return displayNames[role] || role;
}

export function getRoleColor(role: UserRole | string): string {
  const colors: Record<string, string> = {
    [UserRole.PROMOTEUR]: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
    [UserRole.EG]: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    [UserRole.ARCHITECTE]: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    [UserRole.NOTAIRE]: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    [UserRole.COURTIER]: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
    [UserRole.ACHETEUR]: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
    [UserRole.ADMIN]: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    [UserRole.FOURNISSEUR]: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30',
  };

  return colors[role] || 'text-gray-600 bg-gray-100';
}
