import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Lot = Database['public']['Tables']['lots']['Row'];
type LotInsert = Database['public']['Tables']['lots']['Insert'];
type LotUpdate = Database['public']['Tables']['lots']['Update'];

interface UseLotsFilters {
  search?: string;
  status?: string;
  type?: string;
  buildingId?: string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
}

export function useLots(projectId: string | undefined, filters?: UseLotsFilters) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [filteredLots, setFilteredLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLots = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('lots')
        .select(`
          *,
          building:buildings(id, name, code),
          floor:floors(id, name, level)
        `)
        .eq('project_id', projectId);

      // Apply status filter
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply type filter
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      // Apply building filter
      if (filters?.buildingId && filters.buildingId !== 'all') {
        query = query.eq('building_id', filters.buildingId);
      }

      // Apply price filters
      if (filters?.minPrice) {
        query = query.gte('price_total', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price_total', filters.maxPrice);
      }

      // Apply surface filters
      if (filters?.minSurface) {
        query = query.gte('surface_total', filters.minSurface);
      }
      if (filters?.maxSurface) {
        query = query.lte('surface_total', filters.maxSurface);
      }

      query = query.order('code', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const lotsData = data || [];
      setLots(lotsData);

      // Apply search filter client-side
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        const filtered = lotsData.filter(
          (lot) =>
            lot.code.toLowerCase().includes(searchLower) ||
            lot.type.toLowerCase().includes(searchLower) ||
            (lot.building as any)?.name?.toLowerCase().includes(searchLower)
        );
        setFilteredLots(filtered);
      } else {
        setFilteredLots(lotsData);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lots'));
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  const createLot = async (lotData: LotInsert) => {
    try {
      const { data, error: createError } = await supabase
        .from('lots')
        .insert(lotData)
        .select()
        .single();

      if (createError) throw createError;

      await fetchLots();
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create lot'),
      };
    }
  };

  const updateLot = async (id: string, lotData: LotUpdate) => {
    try {
      const { data, error: updateError } = await supabase
        .from('lots')
        .update(lotData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchLots();
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update lot'),
      };
    }
  };

  const deleteLot = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('lots')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchLots();
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete lot'),
      };
    }
  };

  const updateStatus = async (id: string, status: string) => {
    return updateLot(id, { status });
  };

  const bulkUpdateStatus = async (ids: string[], status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('lots')
        .update({ status })
        .in('id', ids);

      if (updateError) throw updateError;

      await fetchLots();
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to update lots'),
      };
    }
  };

  const getStatusCounts = () => {
    return {
      available: lots.filter((l) => l.status === 'AVAILABLE').length,
      reserved: lots.filter((l) => l.status === 'RESERVED').length,
      option: lots.filter((l) => l.status === 'OPTION').length,
      sold: lots.filter((l) => l.status === 'SOLD').length,
      delivered: lots.filter((l) => l.status === 'DELIVERED').length,
      blocked: lots.filter((l) => l.status === 'BLOCKED').length,
      total: lots.length,
    };
  };

  const getTypeBreakdown = () => {
    const breakdown: Record<string, number> = {};
    lots.forEach((lot) => {
      breakdown[lot.type] = (breakdown[lot.type] || 0) + 1;
    });
    return breakdown;
  };

  const getTotalValue = () => {
    return lots.reduce((sum, lot) => sum + (Number(lot.price_total) || 0), 0);
  };

  const getSoldValue = () => {
    return lots
      .filter((l) => l.status === 'SOLD')
      .reduce((sum, lot) => sum + (Number(lot.price_total) || 0), 0);
  };

  return {
    lots: filteredLots,
    allLots: lots,
    loading,
    error,
    statusCounts: getStatusCounts(),
    typeBreakdown: getTypeBreakdown(),
    totalValue: getTotalValue(),
    soldValue: getSoldValue(),
    createLot,
    updateLot,
    deleteLot,
    updateStatus,
    bulkUpdateStatus,
    refresh: fetchLots,
  };
}
