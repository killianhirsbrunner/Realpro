import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetLot?: string;
  targetLotId?: string;
  source: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
}

export function useProspects(projectId: string) {
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('crm_prospects')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData = (data || []).map((p: any) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        email: p.email,
        phone: p.phone,
        targetLot: p.target_lot,
        targetLotId: p.target_lot_id,
        source: p.source || 'website',
        createdAt: p.created_at,
        lastContact: p.last_contact_date,
        notes: p.notes,
      }));

      setProspects(transformedData);
    } catch (err) {
      console.error('Error fetching prospects:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProspects();
    }
  }, [projectId]);

  return {
    prospects,
    loading,
    error,
    refetch: fetchProspects,
  };
}
