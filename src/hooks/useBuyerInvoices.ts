import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BuyerInvoice {
  id: string;
  buyer_id: string;
  project_id: string;
  lot_id: string | null;
  label: string | null;
  type: string | null;
  amount_total_cents: number;
  amount_paid_cents: number;
  currency: string;
  status: string;
  due_date: string | null;
  qr_iban: string | null;
  creditor_name: string | null;
  reference: string | null;
  qr_pdf_url: string | null;
  buyer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  lot?: {
    code: string;
  };
}

export function useBuyerInvoices(projectId: string) {
  const [invoices, setInvoices] = useState<BuyerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [projectId]);

  async function fetchInvoices() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('buyer_invoices')
        .select(`
          *,
          buyer:buyers(first_name, last_name, email),
          lot:lots(code)
        `)
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;

      setInvoices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch buyer invoices'));
    } finally {
      setLoading(false);
    }
  }

  async function createInvoice(invoiceData: Partial<BuyerInvoice>) {
    try {
      const { error } = await supabase.from('buyer_invoices').insert({
        buyer_id: invoiceData.buyer_id,
        project_id: projectId,
        lot_id: invoiceData.lot_id,
        label: invoiceData.label,
        type: invoiceData.type || 'ACOMPTE',
        amount_total_cents: invoiceData.amount_total_cents || 0,
        amount_paid_cents: 0,
        currency: invoiceData.currency || 'CHF',
        status: 'PENDING',
        due_date: invoiceData.due_date,
        qr_iban: invoiceData.qr_iban,
        creditor_name: invoiceData.creditor_name,
        reference: invoiceData.reference,
      });

      if (error) throw error;

      await fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create invoice'));
      throw err;
    }
  }

  async function updateInvoiceStatus(invoiceId: string, status: string) {
    try {
      const { error } = await supabase
        .from('buyer_invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;

      await fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update invoice status'));
      throw err;
    }
  }

  async function markAsPaid(invoiceId: string, amountCents: number) {
    try {
      const { error } = await supabase
        .from('buyer_invoices')
        .update({
          status: 'PAID',
          amount_paid_cents: amountCents,
        })
        .eq('id', invoiceId);

      if (error) throw error;

      await fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark invoice as paid'));
      throw err;
    }
  }

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoiceStatus,
    markAsPaid,
    refresh: fetchInvoices,
  };
}
