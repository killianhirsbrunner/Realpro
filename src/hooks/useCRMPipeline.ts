import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lotNumber?: string;
  lotId?: string;
  status: string;
  daysInStage?: number;
  lastContact?: string;
}

interface PipelineData {
  prospect: CRMContact[];
  reserved: CRMContact[];
  in_progress: CRMContact[];
  signed: CRMContact[];
}

export function useCRMPipeline(projectId: string) {
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      setError(null);

      const [prospectsResult, reservationsResult, buyersResult] = await Promise.all([
        supabase
          .from('prospects')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            status,
            interested_lots,
            created_at
          `)
          .eq('project_id', projectId)
          .in('status', ['NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'VISIT_DONE', 'OFFER_SENT'])
          .order('created_at', { ascending: false }),

        supabase
          .from('reservations')
          .select(`
            id,
            buyer_first_name,
            buyer_last_name,
            buyer_email,
            buyer_phone,
            status,
            lot:lots(lot_number),
            reserved_at
          `)
          .eq('project_id', projectId)
          .in('status', ['PENDING', 'CONFIRMED'])
          .order('reserved_at', { ascending: false }),

        supabase
          .from('buyers')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            status,
            lot:lots(lot_number, id),
            created_at
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
      ]);

      if (prospectsResult.error) throw prospectsResult.error;
      if (reservationsResult.error) throw reservationsResult.error;
      if (buyersResult.error) throw buyersResult.error;

      const prospects = (prospectsResult.data || []).map((p: any) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        email: p.email,
        phone: p.phone || undefined,
        status: p.status,
        daysInStage: Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }));

      const reserved = (reservationsResult.data || []).map((r: any) => ({
        id: r.id,
        name: `${r.buyer_first_name} ${r.buyer_last_name}`,
        email: r.buyer_email,
        phone: r.buyer_phone || undefined,
        lotNumber: r.lot?.lot_number,
        status: r.status,
        daysInStage: Math.floor((Date.now() - new Date(r.reserved_at).getTime()) / (1000 * 60 * 60 * 24))
      }));

      const buyersData = buyersResult.data || [];
      const inProgress = buyersData
        .filter((b: any) => ['ACTIVE', 'DOCUMENTS_PENDING', 'READY_FOR_SIGNING'].includes(b.status))
        .map((b: any) => ({
          id: b.id,
          name: `${b.first_name} ${b.last_name}`,
          email: b.email,
          phone: b.phone || undefined,
          lotNumber: b.lot?.lot_number,
          lotId: b.lot?.id,
          status: b.status,
          daysInStage: Math.floor((Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24))
        }));

      const signed = buyersData
        .filter((b: any) => ['SIGNED', 'COMPLETED'].includes(b.status))
        .map((b: any) => ({
          id: b.id,
          name: `${b.first_name} ${b.last_name}`,
          email: b.email,
          phone: b.phone || undefined,
          lotNumber: b.lot?.lot_number,
          lotId: b.lot?.id,
          status: b.status,
          daysInStage: Math.floor((Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24))
        }));

      setPipeline({
        prospect: prospects,
        reserved,
        in_progress: inProgress,
        signed
      });

    } catch (err) {
      console.error('Error fetching CRM pipeline:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchPipeline();
    }
  }, [projectId]);

  return {
    pipeline,
    loading,
    error,
    refetch: fetchPipeline,
  };
}
