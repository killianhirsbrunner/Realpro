/**
 * RealPro | User Entity Types
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import type { LanguageCode } from '@shared/lib/supabase';

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

export type UserRole =
  | 'admin'
  | 'promoteur'
  | 'eg'
  | 'architecte'
  | 'notaire'
  | 'courtier'
  | 'acheteur'
  | 'fournisseur';

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
