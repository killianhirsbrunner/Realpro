/**
 * RealPro | Shared Organization Entity Types
 * Types organisation partagés entre toutes les applications
 */

import type { Json, LanguageCode } from './types';

// ============================================================================
// Organization Types
// ============================================================================

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

export interface OrganizationWithStats extends Organization {
  members_count: number;
  active_subscriptions: number;
}

// ============================================================================
// Organization Input Types
// ============================================================================

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

// ============================================================================
// Organization Utility Functions
// ============================================================================

export function getOrganizationInitials(org: Pick<Organization, 'name'>): string {
  return org.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isOrganizationActive(org: Pick<Organization, 'is_active'>): boolean {
  return org.is_active;
}
