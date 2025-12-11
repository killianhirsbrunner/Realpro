/**
 * RealPro | User Permissions
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import type { UserRole } from '../model';

export enum Permission {
  // Projects
  VIEW_PROJECTS = 'view_projects',
  CREATE_PROJECTS = 'create_projects',
  EDIT_PROJECTS = 'edit_projects',
  DELETE_PROJECTS = 'delete_projects',

  // Lots
  VIEW_LOTS = 'view_lots',
  CREATE_LOTS = 'create_lots',
  EDIT_LOTS = 'edit_lots',
  SELL_LOTS = 'sell_lots',

  // Buyers
  VIEW_BUYERS = 'view_buyers',
  MANAGE_BUYERS = 'manage_buyers',
  VIEW_BUYER_DETAILS = 'view_buyer_details',

  // Documents
  VIEW_DOCUMENTS = 'view_documents',
  UPLOAD_DOCUMENTS = 'upload_documents',
  SIGN_DOCUMENTS = 'sign_documents',

  // Submissions
  VIEW_SUBMISSIONS = 'view_submissions',
  CREATE_SUBMISSIONS = 'create_submissions',
  COMPARE_SUBMISSIONS = 'compare_submissions',

  // Construction
  VIEW_CONSTRUCTION = 'view_construction',
  MANAGE_CONSTRUCTION = 'manage_construction',

  // SAV
  VIEW_SAV = 'view_sav',
  MANAGE_SAV = 'manage_sav',

  // Billing
  VIEW_BILLING = 'view_billing',
  MANAGE_BILLING = 'manage_billing',

  // Reporting
  VIEW_REPORTING = 'view_reporting',
  EXPORT_DATA = 'export_data',

  // Admin
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: Object.values(Permission),

  promoteur: [
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

  eg: [
    Permission.VIEW_PROJECTS,
    Permission.EDIT_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_CONSTRUCTION,
    Permission.MANAGE_CONSTRUCTION,
    Permission.VIEW_REPORTING,
  ],

  architecte: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_CONSTRUCTION,
    Permission.VIEW_REPORTING,
  ],

  notaire: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.VIEW_BUYERS,
    Permission.VIEW_BUYER_DETAILS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.SIGN_DOCUMENTS,
  ],

  courtier: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_LOTS,
    Permission.SELL_LOTS,
    Permission.VIEW_BUYERS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  acheteur: [
    Permission.VIEW_DOCUMENTS,
    Permission.SIGN_DOCUMENTS,
    Permission.VIEW_SAV,
  ],

  fournisseur: [
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function canAccessModule(role: UserRole, module: string): boolean {
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
  return requiredPermissions ? hasAnyPermission(role, requiredPermissions) : false;
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    admin: 'Administrateur',
    promoteur: 'Promoteur',
    eg: 'Entreprise Générale',
    architecte: 'Architecte',
    notaire: 'Notaire',
    courtier: 'Courtier',
    acheteur: 'Acheteur',
    fournisseur: 'Fournisseur',
  };

  return displayNames[role] || role;
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    promoteur: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
    eg: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
    architecte: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    notaire: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    courtier: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
    acheteur: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
    fournisseur: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30',
  };

  return colors[role] || 'text-gray-600 bg-gray-100';
}
