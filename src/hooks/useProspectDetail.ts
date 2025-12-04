import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  source: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
  budget?: number;
  targetLot?: string;
}

export function useProspectDetail(projectId: string, prospectId: string) {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspect = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('crm_prospects')
        .select('*')
        .eq('id', prospectId)
        .eq('project_id', projectId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Prospect non trouvé');

      const transformedData: Prospect = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        source: data.source || 'website',
        createdAt: data.created_at,
        lastContact: data.last_contact_date,
        notes: data.notes,
        budget: data.budget,
        targetLot: data.target_lot,
      };

      setProspect(transformedData);
    } catch (err) {
      console.error('Error fetching prospect:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && prospectId) {
      fetchProspect();
    }
  }, [projectId, prospectId]);

  return {
    prospect,
    loading,
    error,
    refetch: fetchProspect,
  };
}
