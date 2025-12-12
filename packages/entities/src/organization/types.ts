/**
 * RealPro | Organization Entity Types
 */

import type { Json, LanguageCode } from '../database/types';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  default_language: LanguageCode;
  logo_url: string | null;
  settings: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  default_language?: LanguageCode;
  logo_url?: string;
  settings?: Json;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  default_language?: LanguageCode;
  logo_url?: string | null;
  settings?: Json;
  is_active?: boolean;
}
