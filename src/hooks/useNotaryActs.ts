import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ActVersion {
  id: string;
  buyer_id: string;
  dossier_id: string;
  version_number: number;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  uploaded_by_role: 'notary' | 'promoter' | 'admin';
  notes?: string;
  created_at: string;
  uploader?: any;
}

export function useNotaryActs(dossierId: string) {
  const [acts, setActs] = useState<ActVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (dossierId) {
      fetchActs();
    }
  }, [dossierId]);

  async function fetchActs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('act_versions')
        .select(`
          *,
          uploader:users(*)
        `)
        .eq('dossier_id', dossierId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setActs(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAct(
    buyerId: string,
    fileUrl: string,
    fileName: string,
    uploadedByRole: ActVersion['uploaded_by_role'],
    notes?: string
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get next version number
      const { data: existingActs } = await supabase
        .from('act_versions')
        .select('version_number')
        .eq('dossier_id', dossierId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = existingActs && existingActs.length > 0
        ? existingActs[0].version_number + 1
        : 1;

      const { data, error } = await supabase
        .from('act_versions')
        .insert({
          buyer_id: buyerId,
          dossier_id: dossierId,
          version_number: nextVersion,
          file_url: fileUrl,
          file_name: fileName,
          uploaded_by: user.id,
          uploaded_by_role: uploadedByRole,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      await fetchActs();
      return data;
    } catch (err) {
      throw err;
    }
  }

  return {
    acts,
    loading,
    error,
    uploadAct,
    refresh: fetchActs
  };
}
