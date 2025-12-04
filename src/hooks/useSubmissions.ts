import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  label: string;
  description?: string;
  deadline: string;
  status: string;
  offers_count?: number;
}

export function useSubmissions(projectId: string | undefined) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('submissions')
          .select('id, label, description, deadline, status')
          .eq('project_id', projectId)
          .order('deadline', { ascending: true });

        if (fetchError) throw fetchError;

        setSubmissions(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Erreur lors du chargement des soumissions');
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [projectId]);

  return { submissions, loading, error };
}
