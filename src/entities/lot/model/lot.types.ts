/**
 * RealPro | Lot Entity Types
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import type { LotType, LotStatus } from '@shared/lib/supabase';

export type { LotType, LotStatus } from '@shared/lib/supabase';

export interface Lot {
  id: string;
  project_id: string;
  building_id: string;
  floor_id: string | null;
  code: string;
  type: LotType;
  status: LotStatus;
  rooms_count: number | null;
  surface_living: number | null;
  surface_total: number | null;
  price_base: number | null;
  price_total: number | null;
  orientation: string | null;
  floor_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface LotWithBuyer extends Lot {
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface CreateLotInput {
  project_id: string;
  building_id: string;
  floor_id?: string;
  code: string;
  type: LotType;
  status?: LotStatus;
  rooms_count?: number;
  surface_living?: number;
  surface_total?: number;
  price_base?: number;
  price_total?: number;
  orientation?: string;
  floor_level?: number;
}

export interface UpdateLotInput {
  code?: string;
  type?: LotType;
  status?: LotStatus;
  rooms_count?: number | null;
  surface_living?: number | null;
  surface_total?: number | null;
  price_base?: number | null;
  price_total?: number | null;
  orientation?: string | null;
  floor_level?: number | null;
}

export interface LotFilters {
  project_id?: string;
  building_id?: string;
  type?: LotType;
  status?: LotStatus;
  min_price?: number;
  max_price?: number;
  min_rooms?: number;
  max_rooms?: number;
  min_surface?: number;
  max_surface?: number;
}
