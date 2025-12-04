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

      // Fetch prospects
      const { data: prospectsData, error: prospectsError } = await supabase
        .from('crm_prospects')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'ACTIVE');

      if (prospectsError) throw prospectsError;

      // Fetch buyers with different stages
      const { data: buyersData, error: buyersError } = await supabase
        .from('buyers')
        .select(`
          *,
          lots:lot_id (
            lot_number
          )
        `)
        .eq('project_id', projectId);

      if (buyersError) throw buyersError;

      // Transform data into pipeline structure
      const pipelineData: PipelineData = {
        prospect: (prospectsData || []).map((p: any) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          email: p.email,
          phone: p.phone,
          lotNumber: p.target_lot,
          status: 'prospect',
          daysInStage: p.created_at ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
        })),
        reserved: (buyersData || [])
          .filter((b: any) => b.status === 'RESERVED')
          .map((b: any) => ({
            id: b.id,
            name: `${b.first_name} ${b.last_name}`,
            email: b.email,
            phone: b.phone,
            lotNumber: b.lots?.lot_number,
            lotId: b.lot_id,
            status: b.status,
            daysInStage: b.reservation_date ? Math.floor((Date.now() - new Date(b.reservation_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
          })),
        in_progress: (buyersData || [])
          .filter((b: any) => ['CONTRACT_SIGNED', 'NOTARY_IN_PROGRESS'].includes(b.status))
          .map((b: any) => ({
            id: b.id,
            name: `${b.first_name} ${b.last_name}`,
            email: b.email,
            phone: b.phone,
            lotNumber: b.lots?.lot_number,
            lotId: b.lot_id,
            status: b.status,
            daysInStage: b.contract_date ? Math.floor((Date.now() - new Date(b.contract_date).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
          })),
        signed: (buyersData || [])
          .filter((b: any) => b.status === 'COMPLETED')
          .map((b: any) => ({
            id: b.id,
            name: `${b.first_name} ${b.last_name}`,
            email: b.email,
            phone: b.phone,
            lotNumber: b.lots?.lot_number,
            lotId: b.lot_id,
            status: b.status,
          })),
      };

      setPipeline(pipelineData);
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
