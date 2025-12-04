import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FinanceSummary {
  cfc: {
    totalBudget: number;
    committed: number;
    spent: number;
    remaining: number;
  };
  contracts: {
    total: number;
    active: number;
    totalValue: number;
  };
  invoices: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    totalAmount: number;
    paidAmount: number;
  };
  buyerInstallments: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    expectedAmount: number;
    receivedAmount: number;
  };
}

export function useProjectFinanceSummary(projectId: string | undefined) {
  const [data, setData] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchFinanceSummary() {
      try {
        setLoading(true);
        setError(null);

        const [cfcResult, contractsResult, invoicesResult, installmentsResult] = await Promise.all([
          supabase.from('cfc_budgets')
            .select('total_amount')
            .eq('project_id', projectId)
            .eq('status', 'ACTIVE')
            .maybeSingle(),
          supabase.from('contracts')
            .select('status, amount')
            .eq('project_id', projectId),
          supabase.from('invoices')
            .select('status, total_amount')
            .eq('project_id', projectId),
          supabase.from('buyer_installments')
            .select('status, amount, buyers!inner(project_id)')
            .eq('buyers.project_id', projectId),
        ]);

        if (cfcResult.error) throw cfcResult.error;
        if (contractsResult.error) throw contractsResult.error;
        if (invoicesResult.error) throw invoicesResult.error;
        if (installmentsResult.error) throw installmentsResult.error;

        const cfcBudget = cfcResult.data;
        const contracts = contractsResult.data || [];
        const invoices = invoicesResult.data || [];
        const installments = installmentsResult.data || [];

        const totalBudget = cfcBudget?.total_amount || 0;
        const committed = contracts.filter(c => c.status === 'ACTIVE').reduce((sum, c) => sum + (c.amount || 0), 0);
        const spent = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.total_amount || 0), 0);

        setData({
          cfc: {
            totalBudget,
            committed,
            spent,
            remaining: totalBudget - spent,
          },
          contracts: {
            total: contracts.length,
            active: contracts.filter(c => c.status === 'ACTIVE').length,
            totalValue: contracts.reduce((sum, c) => sum + (c.amount || 0), 0),
          },
          invoices: {
            total: invoices.length,
            pending: invoices.filter(i => i.status === 'SENT').length,
            paid: invoices.filter(i => i.status === 'PAID').length,
            overdue: invoices.filter(i => i.status === 'OVERDUE').length,
            totalAmount: invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0),
            paidAmount: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.total_amount || 0), 0),
          },
          buyerInstallments: {
            total: installments.length,
            pending: installments.filter(i => i.status === 'PENDING').length,
            paid: installments.filter(i => i.status === 'PAID').length,
            overdue: installments.filter(i => i.status === 'OVERDUE').length,
            expectedAmount: installments.reduce((sum, i) => sum + (i.amount || 0), 0),
            receivedAmount: installments.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.amount || 0), 0),
          },
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinanceSummary();
  }, [projectId]);

  return { data, loading, error };
}
