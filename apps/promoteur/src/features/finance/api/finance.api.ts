/**
 * Finance API - Supabase data access layer
 */

import { supabase } from '@/lib/supabase';
import type {
  Invoice,
  InvoiceWithBuyer,
  InvoiceStatus,
  InvoiceType,
  BuyerFinanceSummary,
  FinanceSummary,
  CFCBudgetLine,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  RecordPaymentInput,
} from '@realpro/entities';

// Types for Supabase query results
interface InvoiceBuyerRow {
  id: string;
  project_id: string;
  buyer_id: string;
  label: string;
  invoice_number: string | null;
  invoice_type: InvoiceType;
  amount: number;
  amount_paid: number;
  status: InvoiceStatus;
  due_date: string | null;
  payment_date: string | null;
  qr_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    sales_contracts?: Array<{
      lot: { code: string; price_total: number | null } | null;
    }>;
  } | null;
}

interface CFCLineRow {
  id: string;
  code: string;
  label: string;
  amount_budgeted: string | number | null;
  amount_committed: string | number | null;
  amount_spent: string | number | null;
}

export interface FinanceQueryFilters {
  status?: InvoiceStatus;
  buyerId?: string;
  search?: string;
}

export async function fetchProjectFinance(projectId: string): Promise<{
  summary: FinanceSummary;
  buyers: BuyerFinanceSummary[];
}> {
  // Fetch all invoices with buyer info for the project
  const { data: invoicesData, error } = await supabase
    .from('buyer_invoices')
    .select(`
      *,
      buyer:buyer_id (
        id,
        first_name,
        last_name,
        email,
        sales_contracts (
          lot:lot_id (
            code,
            price_total
          )
        )
      )
    `)
    .eq('project_id', projectId);

  if (error) throw error;

  const invoices = (invoicesData || []) as InvoiceBuyerRow[];

  // Aggregate by buyer
  const buyerMap = new Map<string, BuyerFinanceSummary>();

  invoices.forEach((invoice: InvoiceBuyerRow) => {
    if (!invoice.buyer) return;

    const buyerId = invoice.buyer.id;
    const buyerName = `${invoice.buyer.first_name} ${invoice.buyer.last_name}`;
    const lotInfo = invoice.buyer.sales_contracts?.[0]?.lot;

    if (!buyerMap.has(buyerId)) {
      buyerMap.set(buyerId, {
        id: buyerId,
        name: buyerName,
        email: invoice.buyer.email,
        lot_code: lotInfo?.code || null,
        lot_price: lotInfo?.price_total || null,
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

    // Determine status
    if (buyer.remaining > 0) {
      if (invoice.status === 'LATE') {
        buyer.status = 'late';
      } else if (buyer.status !== 'late') {
        buyer.status = buyer.paid > 0 ? 'partial' : 'pending';
      }
    } else if (buyer.status !== 'late') {
      buyer.status = 'paid';
    }
  });

  const buyers = Array.from(buyerMap.values());
  const summary: FinanceSummary = {
    totalInvoiced: buyers.reduce((sum, b) => sum + b.invoiced, 0),
    totalPaid: buyers.reduce((sum, b) => sum + b.paid, 0),
    totalDue: buyers.reduce((sum, b) => sum + b.remaining, 0),
    totalLate: buyers.filter((b) => b.status === 'late').reduce((sum, b) => sum + b.remaining, 0),
    percentPaid: 0,
    percentLate: 0,
  };

  summary.percentPaid = summary.totalInvoiced > 0
    ? (summary.totalPaid / summary.totalInvoiced) * 100
    : 0;
  summary.percentLate = summary.totalInvoiced > 0
    ? (summary.totalLate / summary.totalInvoiced) * 100
    : 0;

  return { summary, buyers };
}

export async function fetchInvoices(
  projectId: string,
  filters?: FinanceQueryFilters
): Promise<InvoiceWithBuyer[]> {
  let query = supabase
    .from('buyer_invoices')
    .select(`
      *,
      buyer:buyer_id (
        id,
        first_name,
        last_name,
        email,
        sales_contracts (
          lot:lot_id (
            code
          )
        )
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.buyerId) {
    query = query.eq('buyer_id', filters.buyerId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const invoiceRows = (data || []) as InvoiceBuyerRow[];
  let invoices: InvoiceWithBuyer[] = invoiceRows.map((inv: InvoiceBuyerRow) => ({
    ...inv,
    buyer_name: inv.buyer
      ? `${inv.buyer.first_name} ${inv.buyer.last_name}`
      : 'Inconnu',
    buyer_email: inv.buyer?.email || null,
    lot_code: inv.buyer?.sales_contracts?.[0]?.lot?.code || null,
  }));

  // Apply client-side search
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    invoices = invoices.filter(
      (inv) =>
        inv.buyer_name.toLowerCase().includes(searchLower) ||
        inv.label.toLowerCase().includes(searchLower) ||
        inv.invoice_number?.toLowerCase().includes(searchLower) ||
        inv.lot_code?.toLowerCase().includes(searchLower)
    );
  }

  return invoices;
}

export async function fetchInvoice(invoiceId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('buyer_invoices')
    .select('*')
    .eq('id', invoiceId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchBuyerInvoices(buyerId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('buyer_invoices')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchCFCBudgets(projectId: string): Promise<CFCBudgetLine[]> {
  // First get the budget for this project
  const { data: budgetData } = await supabase
    .from('cfc_budgets')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (!budgetData) return [];

  // Then get all lines for this budget
  const { data: linesData, error } = await supabase
    .from('cfc_lines')
    .select('*')
    .eq('budget_id', budgetData.id)
    .order('code');

  if (error) throw error;

  const cfcLines = (linesData || []) as CFCLineRow[];
  return cfcLines.map((line: CFCLineRow) => ({
    id: line.id,
    code: line.code,
    name: line.label,
    budgeted_amount: parseFloat(String(line.amount_budgeted)) || 0,
    engaged_amount: parseFloat(String(line.amount_committed)) || 0,
    billed_amount: parseFloat(String(line.amount_committed)) || 0,
    paid_amount: parseFloat(String(line.amount_spent)) || 0,
  }));
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const { data, error } = await supabase
    .from('buyer_invoices')
    .insert({
      ...input,
      status: 'PENDING',
      amount_paid: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput
): Promise<Invoice> {
  const { data, error } = await supabase
    .from('buyer_invoices')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function recordPayment(input: RecordPaymentInput): Promise<Invoice> {
  // First get the current invoice
  const { data: currentInvoice, error: fetchError } = await supabase
    .from('buyer_invoices')
    .select('*')
    .eq('id', input.invoice_id)
    .single();

  if (fetchError) throw fetchError;

  const newAmountPaid = (currentInvoice.amount_paid || 0) + input.amount;
  const isFullyPaid = newAmountPaid >= currentInvoice.amount;

  const { data, error } = await supabase
    .from('buyer_invoices')
    .update({
      amount_paid: newAmountPaid,
      status: isFullyPaid ? 'PAID' : 'PARTIAL',
      payment_date: isFullyPaid ? (input.payment_date || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.invoice_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInvoice(id: string): Promise<void> {
  const { error } = await supabase.from('buyer_invoices').delete().eq('id', id);

  if (error) throw error;
}
