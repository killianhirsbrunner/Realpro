/**
 * RealPro | Shared Lib Exports
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

// Supabase
export { supabase } from './supabase';
export type {
  Database,
  Json,
  LanguageCode,
  ProjectStatus,
  LotType,
  LotStatus,
  SubscriptionStatus,
  BillingCycle,
  Organization,
  User,
  Project,
  Lot,
  Buyer,
  Document,
  Notification,
  Plan,
  Subscription,
} from './supabase';

// Utils
export {
  formatCHF,
  formatAmount,
  formatDateCH,
  formatDateTimeCH,
  formatPercent,
  formatSurface,
  parseAmount,
  formatRelativeTime,
  formatDate,
  formatPhone,
  truncate,
  getInitials,
  cn,
} from './utils';
