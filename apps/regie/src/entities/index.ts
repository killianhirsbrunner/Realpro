/**
 * RealPro Régie | Domain Entities
 *
 * Types et entités spécifiques au domaine Gestion Locative.
 *
 * ⚠️ USAGE EXCLUSIF: Ces types sont réservés à l'app Régie.
 * Interdit d'importer dans apps/promoteur ou apps/ppe-admin.
 */

// All Régie domain types
export * from './types';

// Re-export shared types for convenience
export type {
  User,
  Organization,
  LanguageCode,
  SwissCanton,
} from '@realpro/entities/shared';
