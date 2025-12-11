/**
 * RealPro | Application Constants
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

// Project statuses
export const PROJECT_STATUSES = {
  PLANNING: 'PLANNING',
  CONSTRUCTION: 'CONSTRUCTION',
  SELLING: 'SELLING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: 'En planification',
  CONSTRUCTION: 'En construction',
  SELLING: 'En vente',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  PLANNING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  CONSTRUCTION: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  SELLING: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  ARCHIVED: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-500',
};

// Lot statuses
export const LOT_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OPTION: 'OPTION',
  SOLD: 'SOLD',
  DELIVERED: 'DELIVERED',
} as const;

export const LOT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  OPTION: 'En option',
  SOLD: 'Vendu',
  DELIVERED: 'Livré',
};

export const LOT_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  RESERVED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  OPTION: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  SOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DELIVERED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

// Lot types
export const LOT_TYPES = {
  APARTMENT: 'APARTMENT',
  COMMERCIAL: 'COMMERCIAL',
  PARKING: 'PARKING',
  STORAGE: 'STORAGE',
  VILLA: 'VILLA',
  HOUSE: 'HOUSE',
} as const;

export const LOT_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  COMMERCIAL: 'Commercial',
  PARKING: 'Parking',
  STORAGE: 'Cave/Dépôt',
  VILLA: 'Villa',
  HOUSE: 'Maison',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PROMOTEUR: 'promoteur',
  EG: 'eg',
  ARCHITECTE: 'architecte',
  NOTAIRE: 'notaire',
  COURTIER: 'courtier',
  ACHETEUR: 'acheteur',
  FOURNISSEUR: 'fournisseur',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  promoteur: 'Promoteur',
  eg: 'Entreprise Générale',
  architecte: 'Architecte',
  notaire: 'Notaire',
  courtier: 'Courtier',
  acheteur: 'Acheteur',
  fournisseur: 'Fournisseur',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  promoteur: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
  eg: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
  architecte: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  notaire: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  courtier: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
  acheteur: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
  fournisseur: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30',
};

// Languages
export const LANGUAGES = {
  FR: 'FR',
  DE: 'DE',
  EN: 'EN',
  IT: 'IT',
} as const;

export const LANGUAGE_LABELS: Record<string, string> = {
  FR: 'Français',
  DE: 'Deutsch',
  EN: 'English',
  IT: 'Italiano',
};

// Subscription statuses
export const SUBSCRIPTION_STATUSES = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

// Swiss cantons
export const SWISS_CANTONS: Record<string, string> = {
  'AG': 'Argovie',
  'AI': 'Appenzell Rhodes-Intérieures',
  'AR': 'Appenzell Rhodes-Extérieures',
  'BE': 'Berne',
  'BL': 'Bâle-Campagne',
  'BS': 'Bâle-Ville',
  'FR': 'Fribourg',
  'GE': 'Genève',
  'GL': 'Glaris',
  'GR': 'Grisons',
  'JU': 'Jura',
  'LU': 'Lucerne',
  'NE': 'Neuchâtel',
  'NW': 'Nidwald',
  'OW': 'Obwald',
  'SG': 'Saint-Gall',
  'SH': 'Schaffhouse',
  'SO': 'Soleure',
  'SZ': 'Schwyz',
  'TG': 'Thurgovie',
  'TI': 'Tessin',
  'UR': 'Uri',
  'VD': 'Vaud',
  'VS': 'Valais',
  'ZG': 'Zoug',
  'ZH': 'Zurich',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Trial
export const TRIAL_DAYS = 14;
