import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Document {
  id: string;
  name: string;
  type?: string;
  size?: number;
  created_at: string;
  folder?: string;
}

export function useDocuments(projectId: string | undefined) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchDocuments() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('id, name, type, size, created_at, folder')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setDocuments(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Erreur lors du chargement des documents');
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [projectId]);

  return { documents, loading, error };
}
