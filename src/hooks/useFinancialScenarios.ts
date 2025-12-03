import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FinancialAssumptions {
  priceMultiplier?: number;
  costMultiplier?: number;
  interestRate?: number;
  vacancyRate?: number;
}

export interface FinancialResults {
  baseRevenue: number;
  adjustedRevenue: number;
  baseCost: number;
  adjustedCost: number;
  margin: number;
  marginPercent: number;
  actualCashIn: number;
  cashflowByYear: Array<{
    year: number;
    cashIn: number;
    cashOut: number;
  }>;
}

export interface FinancialScenario {
  id: string;
  organization_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  assumptions: FinancialAssumptions;
  results: FinancialResults | null;
  base_on_actuals: boolean;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export function useFinancialScenarios(organizationId: string, projectId?: string) {
  const [scenarios, setScenarios] = useState<FinancialScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('financial_scenarios')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setScenarios(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createScenario = async (
    name: string,
    assumptions: FinancialAssumptions,
    description?: string,
    targetProjectId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('financial_scenarios')
        .insert({
          organization_id: organizationId,
          project_id: targetProjectId || projectId || null,
          name,
          description: description || null,
          assumptions,
          created_by_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await loadScenarios();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateScenario = async (
    id: string,
    updates: Partial<Pick<FinancialScenario, 'name' | 'description' | 'assumptions' | 'results'>>
  ) => {
    try {
      const { error: updateError } = await supabase
        .from('financial_scenarios')
        .update(updates)
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (updateError) throw updateError;

      await loadScenarios();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('financial_scenarios')
        .delete()
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (deleteError) throw deleteError;

      await loadScenarios();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (organizationId) {
      loadScenarios();
    }
  }, [organizationId, projectId]);

  return {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
    refresh: loadScenarios,
  };
}
