/**
 * RealPro | User Entity Types
 */

import type { LanguageCode, UserRole } from '../database/types';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  language: LanguageCode;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole extends User {
  role: UserRole;
  organization_id: string;
}

export interface UserOrganization {
  user_id: string;
  organization_id: string;
  role: UserRole;
  is_primary: boolean;
  created_at: string;
}

export interface CreateUserInput {
  email: string;
  first_name: string;
  last_name: string;
  language?: LanguageCode;
  phone?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  language?: LanguageCode;
  avatar_url?: string | null;
  phone?: string | null;
}

// Utility functions
export function getUserFullName(user: Pick<User, 'first_name' | 'last_name'>): string {
  return `${user.first_name} ${user.last_name}`.trim();
}

export function getUserInitials(user: Pick<User, 'first_name' | 'last_name'>): string {
  const first = user.first_name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase();
}
