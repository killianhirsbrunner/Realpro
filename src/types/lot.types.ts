// Lot Types - Shared type definitions for lots module

/**
 * Lot status enum
 */
export type LotStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'BLOCKED'
  | 'OPTION';

/**
 * Lot type enum
 */
export type LotType =
  | 'APARTMENT'
  | 'STUDIO'
  | 'PENTHOUSE'
  | 'DUPLEX'
  | 'COMMERCIAL'
  | 'PARKING'
  | 'STORAGE'
  | 'GARDEN'
  | 'OTHER';

/**
 * Core lot data
 */
export interface Lot {
  id: string;
  project_id: string;
  building_id: string;
  floor_id: string;
  code: string;
  name?: string;
  type: LotType;
  status: LotStatus;
  surface_living: number;
  surface_terrace?: number;
  surface_garden?: number;
  surface_total: number;
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  price_base: number;
  price_parking?: number;
  price_options?: number;
  price_total: number;
  floor_level: number;
  orientation?: string;
  view?: string;
  description?: string;
  features: string[];
  plan_url?: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Lot summary for lists
 */
export interface LotSummary {
  id: string;
  code: string;
  type: LotType;
  status: LotStatus;
  surface_total: number;
  rooms: number;
  price_total: number;
  floor_level: number;
  building_name?: string;
  buyer_name?: string;
}

/**
 * Lot with relations
 */
export interface LotWithRelations extends Lot {
  building: {
    id: string;
    name: string;
    code: string;
  };
  floor: {
    id: string;
    name: string;
    level: number;
  };
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reservation?: {
    id: string;
    date: string;
    expires_at?: string;
  };
}

/**
 * Lot surfaces breakdown
 */
export interface LotSurfaces {
  living: number;
  terrace: number;
  garden: number;
  balcony: number;
  loggia: number;
  cave: number;
  parking: number;
  total_weighted: number;
  total_gross: number;
}

/**
 * Lot price breakdown
 */
export interface LotPricing {
  base_price: number;
  parking_price: number;
  options_price: number;
  modifications_price: number;
  discounts: number;
  total_price: number;
  price_per_sqm: number;
}

/**
 * Lot modification/option
 */
export interface LotModification {
  id: string;
  lot_id: string;
  category: string;
  description: string;
  price_difference: number;
  status: 'requested' | 'approved' | 'rejected' | 'completed';
  requested_by?: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
}

/**
 * Lot document
 */
export interface LotDocument {
  id: string;
  lot_id: string;
  name: string;
  type: 'plan' | 'contract' | 'photo' | 'specification' | 'other';
  url: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

/**
 * Lot history entry
 */
export interface LotHistoryEntry {
  id: string;
  lot_id: string;
  action: string;
  description: string;
  old_value?: string;
  new_value?: string;
  user_name: string;
  created_at: string;
}

/**
 * Lot filter options
 */
export interface LotFilters {
  status?: LotStatus[];
  type?: LotType[];
  building_id?: string;
  floor_id?: string;
  rooms_min?: number;
  rooms_max?: number;
  surface_min?: number;
  surface_max?: number;
  price_min?: number;
  price_max?: number;
  search?: string;
}

/**
 * UseLots hook return type
 */
export interface UseLotsReturn {
  lots: LotSummary[];
  loading: boolean;
  error: string | null;
  filters: LotFilters;
  setFilters: (filters: LotFilters) => void;
  refetch: () => Promise<void>;
}

/**
 * UseLotDetails hook return type
 */
export interface UseLotDetailsReturn {
  lot: LotWithRelations | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateLot: (data: Partial<Lot>) => Promise<void>;
}
