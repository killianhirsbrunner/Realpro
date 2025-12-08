import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface ContractMilestone {
  id: string;
  contract_id: string;
  name: string;
  description?: string;
  planned_start_date?: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  completion_percentage: number;
  payment_percentage?: number;
  amount?: number;
  dependencies?: string[];
  created_at: string;
  updated_at: string;
}

export interface ContractWorkProgress {
  id: string;
  contract_id: string;
  milestone_id?: string;
  progress_date: string;
  work_description: string;
  completion_percentage: number;
  quantity_completed?: number;
  quantity_unit?: string;
  photos?: string[];
  notes?: string;
  reported_by: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface ContractInvoice {
  id: string;
  contract_id: string;
  milestone_id?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description?: string;
  file_url?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractPayment {
  id: string;
  contract_id: string;
  invoice_id?: string;
  payment_date: string;
  amount: number;
  payment_method: 'BANK_TRANSFER' | 'CHECK' | 'CASH' | 'CREDIT_CARD' | 'OTHER';
  reference: string;
  notes?: string;
  created_at: string;
}

export interface ContractChangeOrder {
  id: string;
  contract_id: string;
  change_number: string;
  title: string;
  description: string;
  reason: string;
  original_amount: number;
  change_amount: number;
  new_total_amount: number;
  time_impact_days?: number;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  requested_by: string;
  approved_by?: string;
  requested_at: string;
  approved_at?: string;
  implemented_at?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export function useContractProgress(projectId?: string, contractId?: string) {
  const { currentOrganization } = useOrganization();
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [workProgress, setWorkProgress] = useState<ContractWorkProgress[]>([]);
  const [invoices, setInvoices] = useState<ContractInvoice[]>([]);
  const [payments, setPayments] = useState<ContractPayment[]>([]);
  const [changeOrders, setChangeOrders] = useState<ContractChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (contractId && currentOrganization?.id) {
      fetchContractData();
    }
  }, [contractId, currentOrganization?.id]);

  const fetchContractData = async () => {
    if (!contractId) return;

    try {
      setLoading(true);
      await Promise.all([
        fetchMilestones(),
        fetchWorkProgress(),
        fetchInvoices(),
        fetchPayments(),
        fetchChangeOrders(),
      ]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    if (!contractId) return;

    const { data, error: fetchError } = await supabase
      .from('contract_milestones')
      .select('*')
      .eq('contract_id', contractId)
      .order('planned_end_date');

    if (fetchError) throw fetchError;
    setMilestones(data || []);
  };

  const fetchWorkProgress = async () => {
    if (!contractId) return;

    const { data, error: fetchError } = await supabase
      .from('contract_work_progresses')
      .select('*')
      .eq('contract_id', contractId)
      .order('progress_date', { ascending: false });

    if (fetchError) throw fetchError;
    setWorkProgress(data || []);
  };

  const fetchInvoices = async () => {
    if (!contractId) return;

    const { data, error: fetchError } = await supabase
      .from('contract_invoices')
      .select('*')
      .eq('contract_id', contractId)
      .order('invoice_date', { ascending: false });

    if (fetchError) throw fetchError;
    setInvoices(data || []);
  };

  const fetchPayments = async () => {
    if (!contractId) return;

    const { data, error: fetchError } = await supabase
      .from('contract_payments')
      .select('*')
      .eq('contract_id', contractId)
      .order('payment_date', { ascending: false });

    if (fetchError) throw fetchError;
    setPayments(data || []);
  };

  const fetchChangeOrders = async () => {
    if (!contractId) return;

    const { data, error: fetchError } = await supabase
      .from('contract_change_orders')
      .select('*')
      .eq('contract_id', contractId)
      .order('requested_at', { ascending: false });

    if (fetchError) throw fetchError;
    setChangeOrders(data || []);
  };

  const createMilestone = async (milestone: Partial<ContractMilestone>) => {
    if (!contractId) throw new Error('No contract ID provided');

    const { data, error: insertError } = await supabase
      .from('contract_milestones')
      .insert({
        ...milestone,
        contract_id: contractId,
        status: milestone.status || 'PENDING',
        completion_percentage: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setMilestones([...milestones, data]);
    return data;
  };

  const updateMilestone = async (
    milestoneId: string,
    updates: Partial<ContractMilestone>
  ) => {
    const { data, error: updateError } = await supabase
      .from('contract_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();

    if (updateError) throw updateError;
    setMilestones(
      milestones.map((m) => (m.id === milestoneId ? data : m))
    );
    return data;
  };

  const reportWorkProgress = async (progress: Partial<ContractWorkProgress>) => {
    if (!contractId) throw new Error('No contract ID provided');

    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('contract_work_progresses')
      .insert({
        ...progress,
        contract_id: contractId,
        reported_by: currentUser.user?.id,
        verified: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setWorkProgress([data, ...workProgress]);

    if (progress.milestone_id && progress.completion_percentage) {
      await updateMilestone(progress.milestone_id, {
        completion_percentage: progress.completion_percentage,
        status:
          progress.completion_percentage === 100
            ? 'COMPLETED'
            : progress.completion_percentage > 0
            ? 'IN_PROGRESS'
            : 'PENDING',
      });
    }

    return data;
  };

  const verifyWorkProgress = async (progressId: string) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: updateError } = await supabase
      .from('contract_work_progresses')
      .update({
        verified: true,
        verified_by: currentUser.user?.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', progressId)
      .select()
      .single();

    if (updateError) throw updateError;
    setWorkProgress(
      workProgress.map((wp) => (wp.id === progressId ? data : wp))
    );
    return data;
  };

  const createInvoice = async (invoice: Partial<ContractInvoice>) => {
    if (!contractId) throw new Error('No contract ID provided');

    const vatAmount = (invoice.amount || 0) * ((invoice.vat_rate || 0) / 100);
    const totalAmount = (invoice.amount || 0) + vatAmount;

    const { data, error: insertError } = await supabase
      .from('contract_invoices')
      .insert({
        ...invoice,
        contract_id: contractId,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        status: invoice.status || 'DRAFT',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setInvoices([data, ...invoices]);
    return data;
  };

  const updateInvoiceStatus = async (
    invoiceId: string,
    status: ContractInvoice['status']
  ) => {
    const updates: Partial<ContractInvoice> = { status };

    if (status === 'PAID') {
      updates.paid_date = new Date().toISOString();
    }

    const { data, error: updateError } = await supabase
      .from('contract_invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single();

    if (updateError) throw updateError;
    setInvoices(invoices.map((inv) => (inv.id === invoiceId ? data : inv)));
    return data;
  };

  const recordPayment = async (payment: Partial<ContractPayment>) => {
    if (!contractId) throw new Error('No contract ID provided');

    const { data, error: insertError } = await supabase
      .from('contract_payments')
      .insert({
        ...payment,
        contract_id: contractId,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setPayments([data, ...payments]);

    if (payment.invoice_id) {
      const invoice = invoices.find((inv) => inv.id === payment.invoice_id);
      if (invoice) {
        const totalPaid =
          payments
            .filter((p) => p.invoice_id === payment.invoice_id)
            .reduce((sum, p) => sum + p.amount, 0) + (payment.amount || 0);

        if (totalPaid >= invoice.total_amount) {
          await updateInvoiceStatus(payment.invoice_id, 'PAID');
        }
      }
    }

    return data;
  };

  const createChangeOrder = async (changeOrder: Partial<ContractChangeOrder>) => {
    if (!contractId) throw new Error('No contract ID provided');

    const { data: currentUser } = await supabase.auth.getUser();

    const { data: latestCO } = await supabase
      .from('contract_change_orders')
      .select('change_number')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let changeNumber = `CO-${contractId.slice(0, 8)}-001`;
    if (latestCO?.change_number) {
      const lastNumber = parseInt(
        latestCO.change_number.split('-').pop() || '0'
      );
      changeNumber = `CO-${contractId.slice(0, 8)}-${String(
        lastNumber + 1
      ).padStart(3, '0')}`;
    }

    const newTotalAmount =
      (changeOrder.original_amount || 0) + (changeOrder.change_amount || 0);

    const { data, error: insertError } = await supabase
      .from('contract_change_orders')
      .insert({
        ...changeOrder,
        contract_id: contractId,
        change_number: changeNumber,
        new_total_amount: newTotalAmount,
        requested_by: currentUser.user?.id,
        requested_at: new Date().toISOString(),
        status: 'REQUESTED',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setChangeOrders([data, ...changeOrders]);
    return data;
  };

  const approveChangeOrder = async (changeOrderId: string) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: updateError } = await supabase
      .from('contract_change_orders')
      .update({
        status: 'APPROVED',
        approved_by: currentUser.user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', changeOrderId)
      .select()
      .single();

    if (updateError) throw updateError;
    setChangeOrders(
      changeOrders.map((co) => (co.id === changeOrderId ? data : co))
    );
    return data;
  };

  const getContractStats = () => {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (m) => m.status === 'COMPLETED'
    ).length;
    const delayedMilestones = milestones.filter(
      (m) => m.status === 'DELAYED'
    ).length;

    const averageProgress =
      totalMilestones > 0
        ? milestones.reduce((sum, m) => sum + m.completion_percentage, 0) /
          totalMilestones
        : 0;

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingAmount = totalInvoiced - totalPaid;

    const changeOrdersTotal = changeOrders
      .filter((co) => co.status === 'APPROVED' || co.status === 'IMPLEMENTED')
      .reduce((sum, co) => sum + co.change_amount, 0);

    return {
      totalMilestones,
      completedMilestones,
      delayedMilestones,
      averageProgress,
      totalInvoiced,
      totalPaid,
      outstandingAmount,
      changeOrdersTotal,
      changeOrdersCount: changeOrders.length,
    };
  };

  return {
    milestones,
    workProgress,
    invoices,
    payments,
    changeOrders,
    loading,
    error,
    createMilestone,
    updateMilestone,
    reportWorkProgress,
    verifyWorkProgress,
    createInvoice,
    updateInvoiceStatus,
    recordPayment,
    createChangeOrder,
    approveChangeOrder,
    getContractStats,
    refetch: fetchContractData,
  };
}
