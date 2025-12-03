import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Lot = Database['public']['Tables']['lots']['Row'];

export function useLots(projectId: string | undefined) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchLots() {
      try {
        const { data, error: fetchError } = await supabase
          .from('lots')
          .select('*')
          .eq('project_id', projectId)
          .order('code', { ascending: true });

        if (fetchError) throw fetchError;

        if (isMounted) {
          setLots(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch lots'));
          setLoading(false);
        }
      }
    }

    fetchLots();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const getStatusCounts = () => {
    return {
      available: lots.filter((l) => l.status === 'AVAILABLE').length,
      reserved: lots.filter((l) => l.status === 'RESERVED').length,
      option: lots.filter((l) => l.status === 'OPTION').length,
      sold: lots.filter((l) => l.status === 'SOLD').length,
      delivered: lots.filter((l) => l.status === 'DELIVERED').length,
      total: lots.length,
    };
  };

  return { lots, loading, error, statusCounts: getStatusCounts() };
}
