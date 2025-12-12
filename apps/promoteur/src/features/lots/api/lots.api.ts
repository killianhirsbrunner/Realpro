/**
 * Lots API - Supabase data access layer
 */

import { supabase } from '@/lib/supabase';
import type { Lot, LotWithBuyer, CreateLotInput, UpdateLotInput, LotFilters, LotStatus } from '@realpro/entities';

export interface LotWithRelations extends Lot {
  building?: { id: string; name: string; code: string } | null;
  floor?: { id: string; name: string; level: number } | null;
  buyer?: { id: string; first_name: string; last_name: string; email: string } | null;
}

export interface LotsQueryFilters extends LotFilters {
  search?: string;
}

export async function fetchLots(projectId: string, filters?: LotsQueryFilters): Promise<LotWithRelations[]> {
  let query = supabase
    .from('lots')
    .select(`
      *,
      building:buildings(id, name, code),
      floor:floors(id, name, level)
    `)
    .eq('project_id', projectId);

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.building_id) {
    query = query.eq('building_id', filters.building_id);
  }

  if (filters?.min_price) {
    query = query.gte('price_total', filters.min_price);
  }

  if (filters?.max_price) {
    query = query.lte('price_total', filters.max_price);
  }

  if (filters?.min_surface) {
    query = query.gte('surface_total', filters.min_surface);
  }

  if (filters?.max_surface) {
    query = query.lte('surface_total', filters.max_surface);
  }

  if (filters?.min_rooms) {
    query = query.gte('rooms_count', filters.min_rooms);
  }

  if (filters?.max_rooms) {
    query = query.lte('rooms_count', filters.max_rooms);
  }

  query = query.order('code', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  let lots = (data || []) as LotWithRelations[];

  // Client-side search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    lots = lots.filter(
      (lot) =>
        lot.code.toLowerCase().includes(searchLower) ||
        lot.type.toLowerCase().includes(searchLower) ||
        lot.building?.name?.toLowerCase().includes(searchLower)
    );
  }

  return lots;
}

export async function fetchLot(lotId: string): Promise<LotWithRelations | null> {
  const { data, error } = await supabase
    .from('lots')
    .select(`
      *,
      building:buildings(id, name, code),
      floor:floors(id, name, level)
    `)
    .eq('id', lotId)
    .maybeSingle();

  if (error) throw error;
  return data as LotWithRelations | null;
}

export async function createLot(input: CreateLotInput): Promise<Lot> {
  const { data, error } = await supabase
    .from('lots')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLot(id: string, input: UpdateLotInput): Promise<Lot> {
  const { data, error } = await supabase
    .from('lots')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLot(id: string): Promise<void> {
  const { error } = await supabase
    .from('lots')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateLotStatus(id: string, status: LotStatus): Promise<Lot> {
  return updateLot(id, { status });
}

export async function bulkUpdateLotStatus(ids: string[], status: LotStatus): Promise<void> {
  const { error } = await supabase
    .from('lots')
    .update({ status })
    .in('id', ids);

  if (error) throw error;
}

// Stats helpers
export interface LotStats {
  total: number;
  available: number;
  reserved: number;
  option: number;
  sold: number;
  delivered: number;
  totalValue: number;
  soldValue: number;
  typeBreakdown: Record<string, number>;
}

export function calculateLotStats(lots: Lot[]): LotStats {
  const stats: LotStats = {
    total: lots.length,
    available: 0,
    reserved: 0,
    option: 0,
    sold: 0,
    delivered: 0,
    totalValue: 0,
    soldValue: 0,
    typeBreakdown: {},
  };

  lots.forEach((lot) => {
    // Status counts
    switch (lot.status) {
      case 'AVAILABLE':
        stats.available++;
        break;
      case 'RESERVED':
        stats.reserved++;
        break;
      case 'OPTION':
        stats.option++;
        break;
      case 'SOLD':
        stats.sold++;
        stats.soldValue += lot.price_total || 0;
        break;
      case 'DELIVERED':
        stats.delivered++;
        stats.soldValue += lot.price_total || 0;
        break;
    }

    // Total value
    stats.totalValue += lot.price_total || 0;

    // Type breakdown
    stats.typeBreakdown[lot.type] = (stats.typeBreakdown[lot.type] || 0) + 1;
  });

  return stats;
}
