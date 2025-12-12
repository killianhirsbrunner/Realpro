/**
 * RealPro | Shared Entities
 *
 * Ce module exporte UNIQUEMENT les types techniques partagés entre
 * toutes les applications Realpro Suite (PPE-Admin, Promoteur, Régie).
 *
 * ⚠️ RÈGLE STRICTE: Ne jamais ajouter de logique métier ici.
 * Les types métier doivent rester dans leur domaine respectif.
 */

// Base types and utilities
export * from './types';

// User types
export * from './user';

// Organization types
export * from './organization';
