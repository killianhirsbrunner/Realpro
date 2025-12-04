import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Payment {
  id: string;
  buyer_name: string;
  lot_number: string;
  amount: number;
  due_date: string;
  status: string;
  payment_date?: string;
}

interface FinanceSummary {
  total_expected: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
}

export function useFinance(projectId: string | undefined) {
  const [finances, setFinances] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    total_expected: 0,
    total_paid: 0,
    total_pending: 0,
    total_overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchFinance() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            due_date,
            status,
            payment_date,
            sales_contracts (
              lots (number),
              buyers:buyer_id (first_name, last_name)
            )
          `)
          .eq('project_id', projectId)
          .order('due_date', { ascending: true });

        if (fetchError) throw fetchError;

        const paymentsData: Payment[] = (data || []).map(payment => ({
          id: payment.id,
          buyer_name: payment.sales_contracts?.buyers
            ? `${payment.sales_contracts.buyers.first_name} ${payment.sales_contracts.buyers.last_name}`
            : 'N/A',
          lot_number: payment.sales_contracts?.lots?.number || 'N/A',
          amount: payment.amount,
          due_date: payment.due_date,
          status: payment.status,
          payment_date: payment.payment_date,
        }));

        const summaryData: FinanceSummary = {
          total_expected: paymentsData.reduce((sum, p) => sum + p.amount, 0),
          total_paid: paymentsData.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
          total_pending: paymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
          total_overdue: paymentsData.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
        };

        setFinances(paymentsData);
        setSummary(summaryData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching finance data:', err);
        setError('Erreur lors du chargement des finances');
        setLoading(false);
      }
    }

    fetchFinance();
  }, [projectId]);

  return { finances, summary, loading, error };
}
