import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LotsSummary {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  delivered: number;
  totalValue: number;
  soldValue: number;
  salesRate: number;
}

export function useProjectLotsSummary(projectId: string | undefined) {
  const [data, setData] = useState<LotsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchLotsSummary() {
      try {
        setLoading(true);
        setError(null);

        const { data: lots, error: lotsError } = await supabase
          .from('lots')
          .select('status, price_total')
          .eq('project_id', projectId);

        if (lotsError) throw lotsError;

        const total = lots?.length || 0;
        const available = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
        const reserved = lots?.filter(l => l.status === 'RESERVED' || l.status === 'OPTION').length || 0;
        const sold = lots?.filter(l => l.status === 'SOLD').length || 0;
        const delivered = lots?.filter(l => l.status === 'DELIVERED').length || 0;

        const totalValue = lots?.reduce((sum, lot) => sum + (lot.price_total || 0), 0) || 0;
        const soldValue = lots?.filter(l => l.status === 'SOLD' || l.status === 'DELIVERED')
          .reduce((sum, lot) => sum + (lot.price_total || 0), 0) || 0;

        const salesRate = total > 0 ? Math.round(((sold + delivered) / total) * 100) : 0;

        setData({
          total,
          available,
          reserved,
          sold,
          delivered,
          totalValue,
          soldValue,
          salesRate,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchLotsSummary();
  }, [projectId]);

  return { data, loading, error };
}
