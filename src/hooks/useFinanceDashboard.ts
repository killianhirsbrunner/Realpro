import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FinanceKPIs {
  totalBudget: number;
  engaged: number;
  invoiced: number;
  paid: number;
  totalEngagements: number;
  totalInvoices: number;
  totalPaid: number;
  pendingPayments: number;
}

interface CFCSummary {
  id: string;
  cfcCode: string;
  designation: string;
  budget: number;
  engaged: number;
  invoiced: number;
  paid: number;
  engagedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidDate: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface FinanceDashboardData {
  kpis: FinanceKPIs;
  cfcs: CFCSummary[];
  invoices: InvoiceSummary[];
  recentPayments: any[];
}

export function useFinanceDashboard(projectId: string) {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchFinanceData = async () => {
      try {
        setLoading(true);

        const [cfcResult, invoicesResult, paymentsResult] = await Promise.all([
          supabase
            .from('cfc')
            .select(`
              id,
              cfc_code,
              designation,
              budget_initial,
              budget_actuel,
              montant_engage,
              montant_facture,
              montant_paye
            `)
            .eq('project_id', projectId)
            .order('cfc_code', { ascending: true }),

          supabase
            .from('buyer_invoices')
            .select(`
              id,
              invoice_number,
              montant_total,
              date_echeance,
              paid,
              paid_date,
              status,
              buyer:buyer_id (
                nom,
                prenom
              )
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(10),

          supabase
            .from('payments')
            .select(`
              id,
              amount,
              payment_date,
              method,
              buyer:buyer_id (
                nom,
                prenom
              )
            `)
            .eq('project_id', projectId)
            .order('payment_date', { ascending: false })
            .limit(5)
        ]);

        if (cfcResult.error) throw cfcResult.error;
        if (invoicesResult.error) throw invoicesResult.error;
        if (paymentsResult.error) throw paymentsResult.error;

        const cfcs: CFCSummary[] = (cfcResult.data || []).map(cfc => {
          const budget = cfc.budget_actuel || cfc.budget_initial || 0;
          const engagedAmount = cfc.montant_engage || 0;
          const invoicedAmount = cfc.montant_facture || 0;
          const paidAmount = cfc.montant_paye || 0;

          return {
            id: cfc.id,
            cfcCode: cfc.cfc_code,
            designation: cfc.designation,
            budget,
            engaged: budget > 0 ? (engagedAmount / budget) * 100 : 0,
            invoiced: budget > 0 ? (invoicedAmount / budget) * 100 : 0,
            paid: budget > 0 ? (paidAmount / budget) * 100 : 0,
            engagedAmount,
            invoicedAmount,
            paidAmount
          };
        });

        const totalBudget = cfcs.reduce((sum, cfc) => sum + cfc.budget, 0);
        const totalEngagements = cfcs.reduce((sum, cfc) => sum + cfc.engagedAmount, 0);
        const totalInvoices = cfcs.reduce((sum, cfc) => sum + cfc.invoicedAmount, 0);
        const totalPaid = cfcs.reduce((sum, cfc) => sum + cfc.paidAmount, 0);

        const invoices: InvoiceSummary[] = (invoicesResult.data || []).map(inv => ({
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          buyerName: inv.buyer ? `${inv.buyer.prenom} ${inv.buyer.nom}` : 'N/A',
          amount: inv.montant_total,
          dueDate: inv.date_echeance,
          paid: inv.paid,
          paidDate: inv.paid_date,
          status: inv.status || 'draft'
        }));

        const pendingInvoices = invoices.filter(inv => !inv.paid);

        const kpis: FinanceKPIs = {
          totalBudget,
          engaged: totalBudget > 0 ? (totalEngagements / totalBudget) * 100 : 0,
          invoiced: totalBudget > 0 ? (totalInvoices / totalBudget) * 100 : 0,
          paid: totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0,
          totalEngagements,
          totalInvoices,
          totalPaid,
          pendingPayments: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
        };

        setData({
          kpis,
          cfcs,
          invoices,
          recentPayments: paymentsResult.data || []
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [projectId]);

  return { data, loading, error };
}
