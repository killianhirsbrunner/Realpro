import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface FinanceSummary {
  totalInvoiced: number;
  totalPaid: number;
  totalLate: number;
  totalDue: number;
  percentPaid: number;
  percentLate: number;
}

export interface BuyerFinance {
  id: string;
  name: string;
  lotNumber: string;
  invoiced: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'pending' | 'late';
}

export interface Invoice {
  id: string;
  label: string;
  amount: number;
  amount_paid: number;
  status: 'paid' | 'partial' | 'pending' | 'late';
  due_date?: string;
  payment_date?: string;
  invoice_number?: string;
  invoice_type: string;
  qr_reference?: string;
  created_at: string;
}

export interface BuyerFinanceDetail {
  id: string;
  name: string;
  email: string;
  lotNumber: string;
  lotPrice: number;
  totalInvoiced: number;
  totalPaid: number;
  totalRemaining: number;
  invoices: Invoice[];
}

export function useFinance(projectId: string | undefined) {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [buyers, setBuyers] = useState<BuyerFinance[]>([]);
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

        const { data: invoicesData, error: invoicesError } = await supabase
          .from('buyer_invoices')
          .select(`
            *,
            buyer:buyer_id (
              id,
              first_name,
              last_name,
              email,
              lot:lot_id (
                lot_number,
                price_chf
              )
            )
          `)
          .eq('project_id', projectId);

        if (invoicesError) throw invoicesError;

        const invoices = invoicesData || [];

        const buyerMap = new Map<string, BuyerFinance>();

        invoices.forEach((invoice: any) => {
          if (!invoice.buyer) return;

          const buyerId = invoice.buyer.id;
          const buyerName = `${invoice.buyer.first_name} ${invoice.buyer.last_name}`;
          const lotNumber = invoice.buyer.lot?.lot_number || 'N/A';

          if (!buyerMap.has(buyerId)) {
            buyerMap.set(buyerId, {
              id: buyerId,
              name: buyerName,
              lotNumber,
              invoiced: 0,
              paid: 0,
              remaining: 0,
              status: 'paid',
            });
          }

          const buyer = buyerMap.get(buyerId)!;
          buyer.invoiced += invoice.amount || 0;
          buyer.paid += invoice.amount_paid || 0;
          buyer.remaining = buyer.invoiced - buyer.paid;

          if (buyer.remaining > 0) {
            if (invoice.status === 'late') {
              buyer.status = 'late';
            } else if (buyer.status !== 'late') {
              buyer.status = buyer.paid > 0 ? 'partial' : 'pending';
            }
          } else {
            if (buyer.status !== 'late') {
              buyer.status = 'paid';
            }
          }
        });

        const buyersList = Array.from(buyerMap.values());
        setBuyers(buyersList);

        const calculatedSummary: FinanceSummary = {
          totalInvoiced: buyersList.reduce((sum, b) => sum + b.invoiced, 0),
          totalPaid: buyersList.reduce((sum, b) => sum + b.paid, 0),
          totalLate: buyersList
            .filter(b => b.status === 'late')
            .reduce((sum, b) => sum + b.remaining, 0),
          totalDue: buyersList.reduce((sum, b) => sum + b.remaining, 0),
          percentPaid: 0,
          percentLate: 0,
        };

        calculatedSummary.percentPaid = calculatedSummary.totalInvoiced > 0
          ? (calculatedSummary.totalPaid / calculatedSummary.totalInvoiced) * 100
          : 0;
        calculatedSummary.percentLate = calculatedSummary.totalInvoiced > 0
          ? (calculatedSummary.totalLate / calculatedSummary.totalInvoiced) * 100
          : 0;

        setSummary(calculatedSummary);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching finance data:', err);
        setError('Erreur lors du chargement des données financières');
        setLoading(false);
      }
    }

    fetchFinance();
  }, [projectId]);

  return { summary, buyers, loading, error };
}

export function useBuyerFinance(buyerId: string | undefined) {
  const [buyerFinance, setBuyerFinance] = useState<BuyerFinanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buyerId) {
      setLoading(false);
      return;
    }

    async function fetchBuyerFinance() {
      try {
        setLoading(true);
        setError(null);

        const { data: buyerData, error: buyerError } = await supabase
          .from('buyers')
          .select(`
            *,
            lot:lot_id (
              lot_number,
              price_chf
            )
          `)
          .eq('id', buyerId)
          .maybeSingle();

        if (buyerError) throw buyerError;
        if (!buyerData) throw new Error('Acheteur non trouvé');

        const { data: invoicesData, error: invoicesError } = await supabase
          .from('buyer_invoices')
          .select('*')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        if (invoicesError) throw invoicesError;

        const invoices = invoicesData || [];

        const detail: BuyerFinanceDetail = {
          id: buyerData.id,
          name: `${buyerData.first_name} ${buyerData.last_name}`,
          email: buyerData.email || '',
          lotNumber: buyerData.lot?.lot_number || 'N/A',
          lotPrice: buyerData.lot?.price_chf || 0,
          totalInvoiced: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
          totalPaid: invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0),
          totalRemaining: 0,
          invoices,
        };

        detail.totalRemaining = detail.totalInvoiced - detail.totalPaid;

        setBuyerFinance(detail);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching buyer finance:', err);
        setError('Erreur lors du chargement des données financières');
        setLoading(false);
      }
    }

    fetchBuyerFinance();
  }, [buyerId]);

  return { buyerFinance, loading, error };
}
