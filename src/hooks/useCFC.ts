import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CFCItem {
  id: string;
  code: string;
  label: string;
  budget: number;
  engaged?: number;
  spent?: number;
  paid?: number;
}

export function useCFC(projectId: string | undefined) {
  const [cfcData, setCfcData] = useState<CFCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchCFC() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('cfc_codes')
          .select('*')
          .eq('project_id', projectId)
          .order('code', { ascending: true });

        if (fetchError) throw fetchError;

        setCfcData(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CFC data:', err);
        setError('Erreur lors du chargement des données CFC');
        setLoading(false);
      }
    }

    fetchCFC();
  }, [projectId]);

  return { cfcData, loading, error };
}
