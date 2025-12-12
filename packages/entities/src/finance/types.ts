/**
 * RealPro | Finance Entity Types
 */

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PARTIAL' | 'PAID' | 'LATE' | 'CANCELLED';

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  PARTIAL: 'Partiel',
  PAID: 'Payé',
  LATE: 'En retard',
  CANCELLED: 'Annulé',
};

export type InvoiceType =
  | 'DEPOSIT'
  | 'PROGRESS'
  | 'MILESTONE'
  | 'FINAL'
  | 'MODIFICATION'
  | 'OTHER';

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  DEPOSIT: 'Acompte',
  PROGRESS: 'Avancement',
  MILESTONE: 'Étape',
  FINAL: 'Solde final',
  MODIFICATION: 'Plus-value',
  OTHER: 'Autre',
};

export interface Invoice {
  id: string;
  project_id: string;
  buyer_id: string;
  invoice_number: string | null;
  invoice_type: InvoiceType;
  label: string;
  amount: number;
  amount_paid: number;
  status: InvoiceStatus;
  due_date: string | null;
  payment_date: string | null;
  qr_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithBuyer extends Invoice {
  buyer_name: string;
  buyer_email: string | null;
  lot_code: string | null;
}

export interface PaymentSchedule {
  id: string;
  project_id: string;
  buyer_id: string;
  description: string;
  amount: number;
  due_date: string | null;
  paid_date: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
}

export interface FinanceSummary {
  totalInvoiced: number;
  totalPaid: number;
  totalDue: number;
  totalLate: number;
  percentPaid: number;
  percentLate: number;
}

export interface BuyerFinanceSummary {
  id: string;
  name: string;
  email: string | null;
  lot_code: string | null;
  lot_price: number | null;
  invoiced: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'pending' | 'late';
}

export interface CFCBudgetLine {
  id: string;
  code: string;
  name: string;
  budgeted_amount: number;
  engaged_amount: number;
  billed_amount: number;
  paid_amount: number;
}

export interface CreateInvoiceInput {
  project_id: string;
  buyer_id: string;
  invoice_type: InvoiceType;
  label: string;
  amount: number;
  due_date?: string;
  notes?: string;
}

export interface UpdateInvoiceInput {
  invoice_number?: string | null;
  invoice_type?: InvoiceType;
  label?: string;
  amount?: number;
  amount_paid?: number;
  status?: InvoiceStatus;
  due_date?: string | null;
  payment_date?: string | null;
  qr_reference?: string | null;
  notes?: string | null;
}

export interface RecordPaymentInput {
  invoice_id: string;
  amount: number;
  payment_date?: string;
}

// Utility functions
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'PARTIAL':
      return 'info';
    case 'PENDING':
    case 'DRAFT':
      return 'warning';
    case 'LATE':
      return 'error';
    case 'CANCELLED':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function calculateFinanceSummary(buyers: BuyerFinanceSummary[]): FinanceSummary {
  const totalInvoiced = buyers.reduce((sum, b) => sum + b.invoiced, 0);
  const totalPaid = buyers.reduce((sum, b) => sum + b.paid, 0);
  const totalDue = buyers.reduce((sum, b) => sum + b.remaining, 0);
  const totalLate = buyers
    .filter((b) => b.status === 'late')
    .reduce((sum, b) => sum + b.remaining, 0);

  return {
    totalInvoiced,
    totalPaid,
    totalDue,
    totalLate,
    percentPaid: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
    percentLate: totalInvoiced > 0 ? (totalLate / totalInvoiced) * 100 : 0,
  };
}
