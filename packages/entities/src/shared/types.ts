/**
 * RealPro | Shared Base Types
 * Types partagés entre toutes les applications Realpro Suite
 *
 * RÈGLE: Ce fichier contient UNIQUEMENT les types techniques communs.
 * Les types métier spécifiques doivent rester dans leur domaine respectif.
 */

// ============================================================================
// JSON Type
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================================
// Language & Localization
// ============================================================================

export type LanguageCode = 'FR' | 'DE' | 'EN' | 'IT';

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  FR: 'Français',
  DE: 'Deutsch',
  EN: 'English',
  IT: 'Italiano',
};

// ============================================================================
// Billing & Subscription (SaaS - technique)
// ============================================================================

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  TRIAL: 'Essai',
  ACTIVE: 'Actif',
  PAST_DUE: 'En retard',
  CANCELLED: 'Annulé',
  EXPIRED: 'Expiré',
};

// ============================================================================
// Base User Roles (communs à toutes les apps)
// ============================================================================

/**
 * Rôles de base partagés entre toutes les applications.
 * Chaque app peut définir des rôles additionnels spécifiques.
 */
export type BaseUserRole = 'admin' | 'member' | 'viewer';

export const BASE_ROLE_LABELS: Record<BaseUserRole, string> = {
  admin: 'Administrateur',
  member: 'Membre',
  viewer: 'Lecteur',
};

// ============================================================================
// Address (structure commune)
// ============================================================================

export interface Address {
  street: string | null;
  street_number: string | null;
  postal_code: string | null;
  city: string | null;
  canton: string | null;
  country: string;
}

export function formatFullAddress(address: Partial<Address>): string {
  const parts = [
    address.street && address.street_number
      ? `${address.street} ${address.street_number}`
      : address.street,
    address.postal_code && address.city
      ? `${address.postal_code} ${address.city}`
      : address.city,
    address.canton,
  ].filter(Boolean);
  return parts.join(', ');
}

// ============================================================================
// Swiss Cantons (référentiel)
// ============================================================================

export const SWISS_CANTONS = {
  AG: 'Argovie',
  AI: 'Appenzell Rhodes-Intérieures',
  AR: 'Appenzell Rhodes-Extérieures',
  BE: 'Berne',
  BL: 'Bâle-Campagne',
  BS: 'Bâle-Ville',
  FR: 'Fribourg',
  GE: 'Genève',
  GL: 'Glaris',
  GR: 'Grisons',
  JU: 'Jura',
  LU: 'Lucerne',
  NE: 'Neuchâtel',
  NW: 'Nidwald',
  OW: 'Obwald',
  SG: 'Saint-Gall',
  SH: 'Schaffhouse',
  SO: 'Soleure',
  SZ: 'Schwytz',
  TG: 'Thurgovie',
  TI: 'Tessin',
  UR: 'Uri',
  VD: 'Vaud',
  VS: 'Valais',
  ZG: 'Zoug',
  ZH: 'Zurich',
} as const;

export type SwissCanton = keyof typeof SWISS_CANTONS;
