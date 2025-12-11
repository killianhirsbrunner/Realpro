import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type InstallmentType = 'RESERVATION' | 'ACOMPTE_1' | 'ACOMPTE_2' | 'ACOMPTE_3' | 'ACOMPTE_FINAL' | 'SOLDE';
export type InstallmentStatus = 'PENDING' | 'INVOICED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface BuyerInstallment {
  id: string;
  buyer_id: string;
  lot_id: string;
  project_id: string;
  installment_type: InstallmentType;
  installment_number: number;
  percentage: number;
  amount: number;
  due_date: string;
  status: InstallmentStatus;
  invoice_id: string | null;
  paid_at: string | null;
  created_at: string;
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  lot?: {
    lot_number: string;
    price_chf: number;
  };
  invoice?: BuyerInvoice;
}

export interface BuyerInvoice {
  id: string;
  buyer_id: string;
  project_id: string;
  lot_id: string;
  label: string;
  type: string;
  amount_total_cents: number;
  amount_paid_cents: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string;
  qr_iban: string | null;
  qr_reference: string | null;
  creditor_name: string | null;
  qr_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstallmentSchedule {
  type: InstallmentType;
  label: string;
  percentage: number;
  dueDaysAfterSigning: number;
}

export interface BuyerFinanceSummary {
  buyerId: string;
  buyerName: string;
  lotNumber: string;
  lotPrice: number;
  totalInvoiced: number;
  totalPaid: number;
  totalRemaining: number;
  totalOverdue: number;
  installmentsCount: number;
  paidCount: number;
  overdueCount: number;
  nextDueDate: string | null;
  nextDueAmount: number | null;
  percentPaid: number;
}

export interface ProjectInstallmentsSummary {
  totalExpected: number;
  totalInvoiced: number;
  totalPaid: number;
  totalOverdue: number;
  totalRemaining: number;
  buyersCount: number;
  overdueCount: number;
  percentCollected: number;
}

// ============================================================================
// Standard Swiss Payment Schedules
// ============================================================================

export const STANDARD_PPE_SCHEDULE: InstallmentSchedule[] = [
  { type: 'RESERVATION', label: 'Reservation', percentage: 5, dueDaysAfterSigning: 0 },
  { type: 'ACOMPTE_1', label: '1er Acompte', percentage: 15, dueDaysAfterSigning: 30 },
  { type: 'ACOMPTE_2', label: '2eme Acompte', percentage: 30, dueDaysAfterSigning: 90 },
  { type: 'ACOMPTE_3', label: '3eme Acompte', percentage: 30, dueDaysAfterSigning: 180 },
  { type: 'SOLDE', label: 'Solde a la livraison', percentage: 20, dueDaysAfterSigning: 365 },
];

export const STANDARD_VEFA_SCHEDULE: InstallmentSchedule[] = [
  { type: 'RESERVATION', label: 'Reservation', percentage: 5, dueDaysAfterSigning: 0 },
  { type: 'ACOMPTE_1', label: 'Fondations achevees', percentage: 10, dueDaysAfterSigning: 60 },
  { type: 'ACOMPTE_2', label: 'Gros oeuvre acheve', percentage: 25, dueDaysAfterSigning: 120 },
  { type: 'ACOMPTE_3', label: 'Mise hors d\'eau', percentage: 25, dueDaysAfterSigning: 180 },
  { type: 'ACOMPTE_FINAL', label: 'Travaux interieurs acheves', percentage: 25, dueDaysAfterSigning: 300 },
  { type: 'SOLDE', label: 'Livraison', percentage: 10, dueDaysAfterSigning: 365 },
];

// ============================================================================
// Status Configuration
// ============================================================================

export const INSTALLMENT_STATUS_CONFIG: Record<InstallmentStatus, { label: string; color: string }> = {
  PENDING: {
    label: 'En attente',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
  },
  INVOICED: {
    label: 'Facture',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  PAID: {
    label: 'Paye',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  },
  OVERDUE: {
    label: 'En retard',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  },
  CANCELLED: {
    label: 'Annule',
    color: 'text-neutral-500 bg-neutral-100 dark:text-neutral-500 dark:bg-neutral-800',
  },
};

export const INSTALLMENT_TYPE_LABELS: Record<InstallmentType, string> = {
  RESERVATION: 'Reservation',
  ACOMPTE_1: '1er Acompte',
  ACOMPTE_2: '2eme Acompte',
  ACOMPTE_3: '3eme Acompte',
  ACOMPTE_FINAL: 'Acompte Final',
  SOLDE: 'Solde',
};

// ============================================================================
// Hook: useBuyerInstallments
// ============================================================================

export function useBuyerInstallments(projectId: string) {
  const [installments, setInstallments] = useState<BuyerInstallment[]>([]);
  const [buyerSummaries, setBuyerSummaries] = useState<BuyerFinanceSummary[]>([]);
  const [projectSummary, setProjectSummary] = useState<ProjectInstallmentsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInstallments = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Load all invoices for the project with buyer info
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('buyer_invoices')
        .select(`
          *,
          buyer:buyer_id(
            id,
            first_name,
            last_name,
            email,
            lot:lot_id(
              lot_number,
              price_chf
            )
          )
        `)
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (invoicesError) throw invoicesError;

      const invoices = invoicesData || [];
      const now = new Date();

      // Map to installments format
      const mappedInstallments: BuyerInstallment[] = invoices.map((inv: any, index: number) => {
        const dueDate = new Date(inv.due_date);
        const isPaid = inv.status === 'PAID' || inv.amount_paid_cents >= inv.amount_total_cents;
        const isOverdue = !isPaid && dueDate < now;

        return {
          id: inv.id,
          buyer_id: inv.buyer_id,
          lot_id: inv.lot_id,
          project_id: inv.project_id,
          installment_type: (inv.type as InstallmentType) || 'ACOMPTE_1',
          installment_number: index + 1,
          percentage: 0, // Would need lot price to calculate
          amount: (inv.amount_total_cents || 0) / 100,
          due_date: inv.due_date,
          status: isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'INVOICED',
          invoice_id: inv.id,
          paid_at: inv.paid_at,
          created_at: inv.created_at,
          buyer: inv.buyer
            ? {
                id: inv.buyer.id,
                first_name: inv.buyer.first_name,
                last_name: inv.buyer.last_name,
                email: inv.buyer.email,
              }
            : undefined,
          lot: inv.buyer?.lot
            ? {
                lot_number: inv.buyer.lot.lot_number,
                price_chf: inv.buyer.lot.price_chf,
              }
            : undefined,
          invoice: {
            ...inv,
            amount_total_cents: inv.amount_total_cents || 0,
            amount_paid_cents: inv.amount_paid_cents || 0,
          },
        };
      });

      setInstallments(mappedInstallments);

      // Calculate per-buyer summaries
      const buyerMap = new Map<string, BuyerFinanceSummary>();

      mappedInstallments.forEach((inst) => {
        if (!inst.buyer) return;

        const buyerId = inst.buyer_id;
        if (!buyerMap.has(buyerId)) {
          buyerMap.set(buyerId, {
            buyerId,
            buyerName: `${inst.buyer.first_name} ${inst.buyer.last_name}`,
            lotNumber: inst.lot?.lot_number || 'N/A',
            lotPrice: inst.lot?.price_chf || 0,
            totalInvoiced: 0,
            totalPaid: 0,
            totalRemaining: 0,
            totalOverdue: 0,
            installmentsCount: 0,
            paidCount: 0,
            overdueCount: 0,
            nextDueDate: null,
            nextDueAmount: null,
            percentPaid: 0,
          });
        }

        const summary = buyerMap.get(buyerId)!;
        summary.totalInvoiced += inst.amount;
        summary.installmentsCount++;

        if (inst.status === 'PAID') {
          summary.totalPaid += inst.amount;
          summary.paidCount++;
        } else if (inst.status === 'OVERDUE') {
          summary.totalOverdue += inst.amount;
          summary.overdueCount++;
          summary.totalRemaining += inst.amount;
        } else {
          summary.totalRemaining += inst.amount;
        }

        // Track next due
        if (inst.status !== 'PAID' && inst.status !== 'CANCELLED') {
          if (!summary.nextDueDate || new Date(inst.due_date) < new Date(summary.nextDueDate)) {
            summary.nextDueDate = inst.due_date;
            summary.nextDueAmount = inst.amount;
          }
        }
      });

      // Calculate percentages
      buyerMap.forEach((summary) => {
        summary.percentPaid =
          summary.totalInvoiced > 0 ? (summary.totalPaid / summary.totalInvoiced) * 100 : 0;
      });

      setBuyerSummaries(Array.from(buyerMap.values()));

      // Calculate project summary
      const projectSum: ProjectInstallmentsSummary = {
        totalExpected: Array.from(buyerMap.values()).reduce((sum, b) => sum + b.lotPrice, 0),
        totalInvoiced: mappedInstallments.reduce((sum, i) => sum + i.amount, 0),
        totalPaid: mappedInstallments
          .filter((i) => i.status === 'PAID')
          .reduce((sum, i) => sum + i.amount, 0),
        totalOverdue: mappedInstallments
          .filter((i) => i.status === 'OVERDUE')
          .reduce((sum, i) => sum + i.amount, 0),
        totalRemaining: 0,
        buyersCount: buyerMap.size,
        overdueCount: mappedInstallments.filter((i) => i.status === 'OVERDUE').length,
        percentCollected: 0,
      };

      projectSum.totalRemaining = projectSum.totalInvoiced - projectSum.totalPaid;
      projectSum.percentCollected =
        projectSum.totalInvoiced > 0 ? (projectSum.totalPaid / projectSum.totalInvoiced) * 100 : 0;

      setProjectSummary(projectSum);
    } catch (err) {
      console.error('Error loading installments:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  /**
   * Create installment schedule for a buyer
   */
  const createScheduleForBuyer = useCallback(
    async (
      buyerId: string,
      lotId: string,
      lotPrice: number,
      schedule: InstallmentSchedule[],
      signingDate: Date
    ) => {
      try {
        const invoicesToCreate = schedule.map((item, index) => {
          const dueDate = new Date(signingDate);
          dueDate.setDate(dueDate.getDate() + item.dueDaysAfterSigning);

          const amount = Math.round(lotPrice * (item.percentage / 100) * 100); // in cents

          return {
            buyer_id: buyerId,
            project_id: projectId,
            lot_id: lotId,
            label: item.label,
            type: item.type,
            amount_total_cents: amount,
            amount_paid_cents: 0,
            currency: 'CHF',
            status: 'PENDING',
            due_date: dueDate.toISOString().split('T')[0],
          };
        });

        const { error: insertError } = await supabase.from('buyer_invoices').insert(invoicesToCreate);

        if (insertError) throw insertError;

        await loadInstallments();
      } catch (err) {
        console.error('Error creating schedule:', err);
        throw err;
      }
    },
    [projectId, loadInstallments]
  );

  /**
   * Create a single invoice/acompte
   */
  const createInvoice = useCallback(
    async (data: {
      buyerId: string;
      lotId: string;
      label: string;
      type: InstallmentType;
      amountCents: number;
      dueDate: Date;
      qrIban?: string;
      creditorName?: string;
    }) => {
      try {
        const { data: newInvoice, error: insertError } = await supabase
          .from('buyer_invoices')
          .insert({
            buyer_id: data.buyerId,
            project_id: projectId,
            lot_id: data.lotId,
            label: data.label,
            type: data.type,
            amount_total_cents: data.amountCents,
            amount_paid_cents: 0,
            currency: 'CHF',
            status: 'PENDING',
            due_date: data.dueDate.toISOString().split('T')[0],
            qr_iban: data.qrIban || null,
            creditor_name: data.creditorName || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadInstallments();
        return newInvoice;
      } catch (err) {
        console.error('Error creating invoice:', err);
        throw err;
      }
    },
    [projectId, loadInstallments]
  );

  /**
   * Record a payment
   */
  const recordPayment = useCallback(
    async (invoiceId: string, amountCents: number, paymentDate?: Date) => {
      try {
        // Get current invoice
        const { data: invoice, error: fetchError } = await supabase
          .from('buyer_invoices')
          .select('amount_paid_cents, amount_total_cents')
          .eq('id', invoiceId)
          .single();

        if (fetchError) throw fetchError;

        const newPaidAmount = (invoice.amount_paid_cents || 0) + amountCents;
        const isPaid = newPaidAmount >= invoice.amount_total_cents;

        const { error: updateError } = await supabase
          .from('buyer_invoices')
          .update({
            amount_paid_cents: newPaidAmount,
            status: isPaid ? 'PAID' : 'PENDING',
            paid_at: isPaid ? (paymentDate || new Date()).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId);

        if (updateError) throw updateError;

        await loadInstallments();
      } catch (err) {
        console.error('Error recording payment:', err);
        throw err;
      }
    },
    [loadInstallments]
  );

  /**
   * Mark invoice as fully paid
   */
  const markAsPaid = useCallback(
    async (invoiceId: string, paymentDate?: Date) => {
      try {
        const { data: invoice, error: fetchError } = await supabase
          .from('buyer_invoices')
          .select('amount_total_cents')
          .eq('id', invoiceId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('buyer_invoices')
          .update({
            amount_paid_cents: invoice.amount_total_cents,
            status: 'PAID',
            paid_at: (paymentDate || new Date()).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId);

        if (updateError) throw updateError;

        await loadInstallments();
      } catch (err) {
        console.error('Error marking as paid:', err);
        throw err;
      }
    },
    [loadInstallments]
  );

  /**
   * Send reminder for overdue payment
   */
  const sendReminder = useCallback(async (invoiceId: string) => {
    // TODO: Implement email sending via edge function
    console.log('Sending reminder for invoice:', invoiceId);
    // For now, just log. Would call an edge function to send email
  }, []);

  /**
   * Cancel an invoice
   */
  const cancelInvoice = useCallback(
    async (invoiceId: string, reason?: string) => {
      try {
        const { error: updateError } = await supabase
          .from('buyer_invoices')
          .update({
            status: 'CANCELLED',
            notes: reason,
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId);

        if (updateError) throw updateError;

        await loadInstallments();
      } catch (err) {
        console.error('Error cancelling invoice:', err);
        throw err;
      }
    },
    [loadInstallments]
  );

  /**
   * Get overdue installments
   */
  const getOverdueInstallments = useCallback(() => {
    return installments.filter((i) => i.status === 'OVERDUE');
  }, [installments]);

  /**
   * Get upcoming installments (next 30 days)
   */
  const getUpcomingInstallments = useCallback(() => {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    return installments.filter((i) => {
      if (i.status === 'PAID' || i.status === 'CANCELLED') return false;
      const dueDate = new Date(i.due_date);
      return dueDate >= now && dueDate <= in30Days;
    });
  }, [installments]);

  return {
    installments,
    buyerSummaries,
    projectSummary,
    loading,
    error,
    refresh: loadInstallments,
    createScheduleForBuyer,
    createInvoice,
    recordPayment,
    markAsPaid,
    sendReminder,
    cancelInvoice,
    getOverdueInstallments,
    getUpcomingInstallments,
  };
}

// ============================================================================
// Hook: useBuyerInvoiceDetail
// ============================================================================

export function useBuyerInvoiceDetail(invoiceId: string | undefined) {
  const [invoice, setInvoice] = useState<BuyerInvoice | null>(null);
  const [buyer, setBuyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoice = useCallback(async () => {
    if (!invoiceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('buyer_invoices')
        .select(`
          *,
          buyer:buyer_id(
            id,
            first_name,
            last_name,
            email,
            phone,
            address,
            lot:lot_id(
              lot_number,
              price_chf,
              project:project_id(name)
            )
          )
        `)
        .eq('id', invoiceId)
        .single();

      if (fetchError) throw fetchError;

      setInvoice(data);
      setBuyer(data.buyer);
    } catch (err) {
      console.error('Error loading invoice:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  return { invoice, buyer, loading, error, refresh: loadInvoice };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format amount from cents to CHF string
 */
export function formatCentsToChf(cents: number | null | undefined): string {
  if (cents == null) return '-';
  const amount = cents / 100;
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Generate QR reference (Swiss standard)
 */
export function generateQRReference(invoiceId: string): string {
  // Simplified QR reference generation
  // Real implementation would follow ISO 11649 standard
  const base = invoiceId.replace(/-/g, '').substring(0, 20).toUpperCase();
  const paddedRef = base.padStart(26, '0');
  // Add check digit (simplified)
  const checkDigit = calculateMod97CheckDigit(paddedRef);
  return paddedRef + checkDigit;
}

function calculateMod97CheckDigit(reference: string): string {
  // Simplified mod 97 check digit calculation
  let num = '';
  for (const char of reference) {
    if (char >= '0' && char <= '9') {
      num += char;
    } else {
      num += (char.charCodeAt(0) - 55).toString();
    }
  }
  const remainder = BigInt(num) % 97n;
  const checkDigit = (98n - remainder).toString().padStart(2, '0');
  return checkDigit;
}

/**
 * Calculate days until due or days overdue
 */
export function getDueDaysInfo(dueDate: string): { days: number; isOverdue: boolean; label: string } {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days: Math.abs(days), isOverdue: true, label: `${Math.abs(days)}j de retard` };
  } else if (days === 0) {
    return { days: 0, isOverdue: false, label: "Aujourd'hui" };
  } else if (days <= 7) {
    return { days, isOverdue: false, label: `Dans ${days}j` };
  } else {
    return { days, isOverdue: false, label: `${days}j restants` };
  }
}
