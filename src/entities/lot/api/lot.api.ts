/**
 * RealPro | Lot API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { supabase } from '@shared/lib/supabase';
import type { Lot, CreateLotInput, UpdateLotInput, LotFilters } from '../model';

export const lotApi = {
  /**
   * Get all lots for a project
   */
  async getByProject(projectId: string): Promise<Lot[]> {
    const { data, error } = await supabase
      .from('lots')
      .select('*')
      .eq('project_id', projectId)
      .order('code', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a lot by ID
   */
  async getById(id: string): Promise<Lot> {
    const { data, error } = await supabase
      .from('lots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Search lots with filters
   */
  async search(filters: LotFilters): Promise<Lot[]> {
    let query = supabase.from('lots').select('*');

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters.building_id) {
      query = query.eq('building_id', filters.building_id);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.min_price !== undefined) {
      query = query.gte('price_total', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      query = query.lte('price_total', filters.max_price);
    }
    if (filters.min_rooms !== undefined) {
      query = query.gte('rooms_count', filters.min_rooms);
    }
    if (filters.max_rooms !== undefined) {
      query = query.lte('rooms_count', filters.max_rooms);
    }
    if (filters.min_surface !== undefined) {
      query = query.gte('surface_living', filters.min_surface);
    }
    if (filters.max_surface !== undefined) {
      query = query.lte('surface_living', filters.max_surface);
    }

    const { data, error } = await query.order('code', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new lot
   */
  async create(input: CreateLotInput): Promise<Lot> {
    const { data, error } = await supabase
      .from('lots')
      .insert({
        ...input,
        status: input.status || 'AVAILABLE',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create multiple lots at once
   */
  async createMany(inputs: CreateLotInput[]): Promise<Lot[]> {
    const { data, error } = await supabase
      .from('lots')
      .insert(
        inputs.map((input) => ({
          ...input,
          status: input.status || 'AVAILABLE',
        }))
      )
      .select();

    if (error) throw error;
    return data || [];
  },

  /**
   * Update a lot
   */
  async update(id: string, input: UpdateLotInput): Promise<Lot> {
    const { data, error } = await supabase
      .from('lots')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a lot
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('lots')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get lot statistics for a project
   */
  async getStats(projectId: string) {
    const { data, error } = await supabase
      .from('lots')
      .select('status, price_total')
      .eq('project_id', projectId);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      available: 0,
      reserved: 0,
      sold: 0,
      delivered: 0,
      total_value: 0,
      sold_value: 0,
    };

    data?.forEach((lot) => {
      switch (lot.status) {
        case 'AVAILABLE':
          stats.available++;
          break;
        case 'RESERVED':
        case 'OPTION':
          stats.reserved++;
          break;
        case 'SOLD':
          stats.sold++;
          stats.sold_value += lot.price_total || 0;
          break;
        case 'DELIVERED':
          stats.delivered++;
          stats.sold_value += lot.price_total || 0;
          break;
      }
      stats.total_value += lot.price_total || 0;
    });

    return stats;
  },
};
