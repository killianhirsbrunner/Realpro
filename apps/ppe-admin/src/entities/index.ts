/**
 * RealPro PPE-Admin | Domain Entities
 *
 * Types et entités spécifiques au domaine Administration de PPE.
 *
 * ⚠️ USAGE EXCLUSIF: Ces types sont réservés à l'app PPE-Admin.
 * Interdit d'importer dans apps/promoteur ou apps/regie.
 */

// All PPE domain types
export * from './types';

// Re-export shared types for convenience
export type {
  User,
  Organization,
  LanguageCode,
  SwissCanton,
} from '@realpro/entities/shared';
