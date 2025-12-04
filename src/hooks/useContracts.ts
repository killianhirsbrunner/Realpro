import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Contract {
  id: string;
  project_id: string;
  company_id: string;
  number: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  signed_at: string | null;
  start_date: string | null;
  end_date: string | null;
  cfc_line_id: string | null;
  company?: {
    name: string;
    type: string;
  };
  cfc_line?: {
    code: string;
    label: string;
  };
}

export function useContracts(projectId: string) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContracts();
  }, [projectId]);

  async function fetchContracts() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select(`
          *,
          company:companies(name, type),
          cfc_line:cfc_lines(code, label)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setContracts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contracts'));
    } finally {
      setLoading(false);
    }
  }

  async function createContract(contractData: Partial<Contract>) {
    try {
      const { error } = await supabase.from('contracts').insert({
        project_id: projectId,
        company_id: contractData.company_id,
        number: contractData.number,
        name: contractData.name,
        type: contractData.type || 'EG',
        amount: contractData.amount || 0,
        status: contractData.status || 'DRAFT',
        cfc_line_id: contractData.cfc_line_id,
        signed_at: contractData.signed_at,
        start_date: contractData.start_date,
        end_date: contractData.end_date,
      });

      if (error) throw error;

      await fetchContracts();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create contract'));
      throw err;
    }
  }

  async function updateContract(contractId: string, updates: Partial<Contract>) {
    try {
      const { error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', contractId);

      if (error) throw error;

      await fetchContracts();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update contract'));
      throw err;
    }
  }

  async function deleteContract(contractId: string) {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (error) throw error;

      await fetchContracts();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete contract'));
      throw err;
    }
  }

  return {
    contracts,
    loading,
    error,
    createContract,
    updateContract,
    deleteContract,
    refresh: fetchContracts,
  };
}
