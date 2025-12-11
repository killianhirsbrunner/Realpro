/**
 * RealPro | User Entity Public API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

// Types
export type {
  User,
  UserRole,
  UserWithRole,
  UserOrganization,
  CreateUserInput,
  UpdateUserInput,
} from './model';

// API
export { userApi } from './api';

// UI Components
export { UserAvatar, UserBadge } from './ui';
export type { UserAvatarProps, UserBadgeProps } from './ui';

// Lib
export {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessModule,
  getRoleDisplayName,
  getRoleColor,
} from './lib';
