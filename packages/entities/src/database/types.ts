/**
 * RealPro | Database Base Types
 * Shared type definitions for Supabase database
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enums
export type LanguageCode = 'FR' | 'DE' | 'EN' | 'IT';

export type ProjectStatus = 'PLANNING' | 'CONSTRUCTION' | 'SELLING' | 'COMPLETED' | 'ARCHIVED';

export type LotType = 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';

export type LotStatus = 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export type UserRole =
  | 'admin'
  | 'promoteur'
  | 'eg'
  | 'architecte'
  | 'notaire'
  | 'courtier'
  | 'acheteur'
  | 'fournisseur';

// Status labels for UI
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planification',
  CONSTRUCTION: 'Construction',
  SELLING: 'Commercialisation',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
};

export const LOT_STATUS_LABELS: Record<LotStatus, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  OPTION: 'Option',
  SOLD: 'Vendu',
  DELIVERED: 'Livré',
};

export const LOT_TYPE_LABELS: Record<LotType, string> = {
  APARTMENT: 'Appartement',
  COMMERCIAL: 'Commercial',
  PARKING: 'Parking',
  STORAGE: 'Cave',
  VILLA: 'Villa',
  HOUSE: 'Maison',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  promoteur: 'Promoteur',
  eg: 'Entreprise Générale',
  architecte: 'Architecte',
  notaire: 'Notaire',
  courtier: 'Courtier',
  acheteur: 'Acheteur',
  fournisseur: 'Fournisseur',
};
