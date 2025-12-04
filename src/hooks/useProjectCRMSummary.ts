import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CRMSummary {
  prospects: {
    total: number;
    new: number;
    qualified: number;
    visitScheduled: number;
  };
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
  };
  buyers: {
    total: number;
    active: number;
    documentsPending: number;
    readyForSigning: number;
    signed: number;
  };
}

export function useProjectCRMSummary(projectId: string | undefined) {
  const [data, setData] = useState<CRMSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchCRMSummary() {
      try {
        setLoading(true);
        setError(null);

        const [prospectsResult, reservationsResult, buyersResult] = await Promise.all([
          supabase.from('prospects').select('status').eq('project_id', projectId),
          supabase.from('reservations').select('status').eq('project_id', projectId),
          supabase.from('buyers').select('status').eq('project_id', projectId),
        ]);

        if (prospectsResult.error) throw prospectsResult.error;
        if (reservationsResult.error) throw reservationsResult.error;
        if (buyersResult.error) throw buyersResult.error;

        const prospects = prospectsResult.data || [];
        const reservations = reservationsResult.data || [];
        const buyers = buyersResult.data || [];

        setData({
          prospects: {
            total: prospects.length,
            new: prospects.filter(p => p.status === 'NEW').length,
            qualified: prospects.filter(p => p.status === 'QUALIFIED').length,
            visitScheduled: prospects.filter(p => p.status === 'VISIT_SCHEDULED').length,
          },
          reservations: {
            total: reservations.length,
            pending: reservations.filter(r => r.status === 'PENDING').length,
            confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
          },
          buyers: {
            total: buyers.length,
            active: buyers.filter(b => b.status === 'ACTIVE').length,
            documentsPending: buyers.filter(b => b.status === 'DOCUMENTS_PENDING').length,
            readyForSigning: buyers.filter(b => b.status === 'READY_FOR_SIGNING').length,
            signed: buyers.filter(b => b.status === 'SIGNED').length,
          },
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCRMSummary();
  }, [projectId]);

  return { data, loading, error };
}
