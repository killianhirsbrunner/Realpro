import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BuyerDossier {
  id: string;
  buyer_id: string;
  project_id: string;
  status: 'incomplete' | 'waiting_notary' | 'act_v1' | 'act_v2' | 'final' | 'signed';
  missing_fields: string[];
  notary_id?: string;
  sent_to_notary_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  buyer?: any;
  notary?: any;
}

export function useNotaryDossiers(projectId: string) {
  const [dossiers, setDossiers] = useState<BuyerDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDossiers();
  }, [projectId]);

  async function fetchDossiers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buyer_dossiers')
        .select(`
          *,
          buyer:buyers(*),
          notary:users(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDossiers(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function createDossier(buyerId: string) {
    try {
      const { data, error } = await supabase
        .from('buyer_dossiers')
        .insert({
          buyer_id: buyerId,
          project_id: projectId,
          status: 'incomplete'
        })
        .select()
        .single();

      if (error) throw error;
      await fetchDossiers();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async function updateDossierStatus(dossierId: string, status: BuyerDossier['status']) {
    try {
      const { error } = await supabase
        .from('buyer_dossiers')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', dossierId);

      if (error) throw error;
      await fetchDossiers();
    } catch (err) {
      throw err;
    }
  }

  async function updateMissingFields(dossierId: string, missingFields: string[]) {
    try {
      const { error } = await supabase
        .from('buyer_dossiers')
        .update({
          missing_fields: missingFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', dossierId);

      if (error) throw error;
      await fetchDossiers();
    } catch (err) {
      throw err;
    }
  }

  async function assignNotary(dossierId: string, notaryId: string) {
    try {
      const { error } = await supabase
        .from('buyer_dossiers')
        .update({
          notary_id: notaryId,
          sent_to_notary_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', dossierId);

      if (error) throw error;
      await fetchDossiers();
    } catch (err) {
      throw err;
    }
  }

  return {
    dossiers,
    loading,
    error,
    createDossier,
    updateDossierStatus,
    updateMissingFields,
    assignNotary,
    refresh: fetchDossiers
  };
}
