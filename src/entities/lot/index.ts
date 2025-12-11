/**
 * RealPro | Lot Entity Public API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

// Types
export type {
  Lot,
  LotType,
  LotStatus,
  LotWithBuyer,
  CreateLotInput,
  UpdateLotInput,
  LotFilters,
} from './model';

// API
export { lotApi } from './api';

// UI Components
export { LotStatusBadge, LotCard } from './ui';
export type { LotStatusBadgeProps, LotCardProps } from './ui';
