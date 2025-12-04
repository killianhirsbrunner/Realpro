import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CfcLine {
  id: string;
  code: string;
  label: string;
  amount_budgeted: number;
  amount_committed: number;
  amount_spent: number;
  parent_id: string | null;
}

interface CfcTotals {
  budget: number;
  engaged: number;
  invoiced: number;
  paid: number;
}

export function useCfcTable(projectId: string) {
  const [lines, setLines] = useState<CfcLine[]>([]);
  const [totals, setTotals] = useState<CfcTotals>({
    budget: 0,
    engaged: 0,
    invoiced: 0,
    paid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCfcData();
  }, [projectId]);

  async function fetchCfcData() {
    try {
      setLoading(true);
      setError(null);

      const { data: budget, error: budgetError } = await supabase
        .from('cfc_budgets')
        .select('id')
        .eq('project_id', projectId)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (budgetError) throw budgetError;

      if (!budget) {
        setLines([]);
        return;
      }

      const { data: cfcLines, error: linesError } = await supabase
        .from('cfc_lines')
        .select('*')
        .eq('budget_id', budget.id)
        .order('code');

      if (linesError) throw linesError;

      setLines(cfcLines || []);

      const calculatedTotals = (cfcLines || []).reduce(
        (acc, line) => ({
          budget: acc.budget + Number(line.amount_budgeted || 0),
          engaged: acc.engaged + Number(line.amount_committed || 0),
          invoiced: acc.invoiced + Number(line.amount_spent || 0),
          paid: acc.paid + Number(line.amount_spent || 0),
        }),
        { budget: 0, engaged: 0, invoiced: 0, paid: 0 }
      );

      setTotals(calculatedTotals);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch CFC data'));
    } finally {
      setLoading(false);
    }
  }

  async function updateLine(lineId: string, field: string, value: number) {
    try {
      const { error } = await supabase
        .from('cfc_lines')
        .update({ [field]: value })
        .eq('id', lineId);

      if (error) throw error;

      await fetchCfcData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update CFC line'));
    }
  }

  async function createLine(data: Partial<CfcLine>) {
    try {
      const { data: budget } = await supabase
        .from('cfc_budgets')
        .select('id')
        .eq('project_id', projectId)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (!budget) throw new Error('No active budget found');

      const { error } = await supabase.from('cfc_lines').insert({
        budget_id: budget.id,
        code: data.code,
        label: data.label,
        amount_budgeted: data.amount_budgeted || 0,
        amount_committed: data.amount_committed || 0,
        amount_spent: data.amount_spent || 0,
        parent_id: data.parent_id,
      });

      if (error) throw error;

      await fetchCfcData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create CFC line'));
    }
  }

  return {
    lines,
    totals,
    loading,
    error,
    updateLine,
    createLine,
    refresh: fetchCfcData,
  };
}
