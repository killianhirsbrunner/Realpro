import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type AvenantStatus = 'draft' | 'pending_signature' | 'signed' | 'rejected' | 'cancelled';
export type AvenantType = 'simple' | 'detailed' | 'legal';
export type SignerRole = 'client' | 'promoter' | 'architect' | 'contractor';

export interface Avenant {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string | null;
  supplier_offer_id: string;
  reference: string;
  title: string;
  description: string | null;
  amount: number;
  vat_rate: number;
  vat_amount: number;
  total_with_vat: number;
  type: AvenantType;
  status: AvenantStatus;
  pdf_url: string | null;
  pdf_signed_url: string | null;
  generated_at: string | null;
  generated_by_user_id: string | null;
  requires_qualified_signature: boolean;
  created_at: string;
  updated_at: string;
  lot?: {
    lot_number: string;
    buyer_id: string | null;
  };
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  supplier_offer?: {
    id: string;
    supplier_name: string;
    price: number;
    status: string;
  };
  signatures?: AvenantSignature[];
  signatures_count?: number;
}

export interface AvenantSignature {
  id: string;
  avenant_id: string;
  signer_user_id: string;
  signer_name: string;
  signer_email: string;
  signer_role: SignerRole;
  signature_data: string;
  signature_method: 'electronic' | 'qualified' | 'simple';
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  signed_at: string;
  is_valid: boolean;
}

export interface AvenantVersion {
  id: string;
  avenant_id: string;
  version_number: number;
  changes_description: string | null;
  pdf_url: string | null;
  created_by_id: string;
  created_at: string;
  created_by?: {
    first_name: string;
    last_name: string;
  };
}

export interface AvenantInvoice {
  id: string;
  avenant_id: string;
  invoice_number: string;
  amount: number;
  vat_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface AvenantSummary {
  total: number;
  draft: number;
  pendingSignature: number;
  signed: number;
  rejected: number;
  cancelled: number;
  totalAmount: number;
  totalAmountSigned: number;
  totalAmountPending: number;
  byType: {
    simple: number;
    detailed: number;
    legal: number;
  };
  byLot: Record<string, { count: number; amount: number }>;
  avgAmount: number;
  thisMonthCount: number;
  thisMonthAmount: number;
}

export interface CreateAvenantData {
  projectId: string;
  supplierOfferId: string;
  title: string;
  description?: string;
  amount: number;
  lotId?: string;
  type?: AvenantType;
  vatRate?: number;
}

export interface UpdateAvenantData {
  title?: string;
  description?: string;
  amount?: number;
  type?: AvenantType;
  vatRate?: number;
}

// ============================================================================
// Status Configuration
// ============================================================================

export const AVENANT_STATUS_CONFIG: Record<AvenantStatus, {
  label: string;
  color: string;
  icon: string;
  nextStatuses: AvenantStatus[];
}> = {
  draft: {
    label: 'Brouillon',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
    icon: 'FileEdit',
    nextStatuses: ['pending_signature', 'cancelled'],
  },
  pending_signature: {
    label: 'En attente de signature',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    icon: 'Clock',
    nextStatuses: ['signed', 'rejected', 'cancelled'],
  },
  signed: {
    label: 'Signe',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    icon: 'CheckCircle',
    nextStatuses: [],
  },
  rejected: {
    label: 'Refuse',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    icon: 'XCircle',
    nextStatuses: ['draft'],
  },
  cancelled: {
    label: 'Annule',
    color: 'text-neutral-500 bg-neutral-100 dark:text-neutral-500 dark:bg-neutral-800',
    icon: 'Ban',
    nextStatuses: [],
  },
};

export const AVENANT_TYPE_CONFIG: Record<AvenantType, {
  label: string;
  color: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  requiresQualifiedSignature: boolean;
}> = {
  simple: {
    label: 'Simple',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    description: 'Modifications mineures < CHF 1\'000',
    minAmount: 0,
    maxAmount: 1000,
    requiresQualifiedSignature: false,
  },
  detailed: {
    label: 'Detaille',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    description: 'Modifications moyennes CHF 1\'000 - 10\'000',
    minAmount: 1000,
    maxAmount: 10000,
    requiresQualifiedSignature: false,
  },
  legal: {
    label: 'Juridique',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    description: 'Modifications importantes > CHF 10\'000',
    minAmount: 10000,
    maxAmount: null,
    requiresQualifiedSignature: true,
  },
};

export const SIGNER_ROLE_CONFIG: Record<SignerRole, { label: string; order: number }> = {
  client: { label: 'Client', order: 1 },
  promoter: { label: 'Promoteur', order: 2 },
  architect: { label: 'Architecte', order: 3 },
  contractor: { label: 'Entrepreneur', order: 4 },
};

// Swiss VAT Rate
export const SWISS_VAT_RATE = 8.1;

// ============================================================================
// Hook: useAvenantManagement
// ============================================================================

export function useAvenantManagement(projectId: string) {
  const [avenants, setAvenants] = useState<Avenant[]>([]);
  const [summary, setSummary] = useState<AvenantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvenants = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('avenants')
        .select(`
          *,
          lot:lot_id(lot_number, buyer_id),
          supplier_offer:supplier_offer_id(id, supplier_name, price, status)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const avenantIds = (data || []).map((a: any) => a.id);

      let signaturesMap: Record<string, number> = {};
      if (avenantIds.length > 0) {
        const { data: sigData } = await supabase
          .from('avenant_signatures')
          .select('avenant_id')
          .in('avenant_id', avenantIds);

        signaturesMap = (sigData || []).reduce((acc: Record<string, number>, sig: any) => {
          acc[sig.avenant_id] = (acc[sig.avenant_id] || 0) + 1;
          return acc;
        }, {});
      }

      const avenantsData = (data || []).map((a: any) => ({
        ...a,
        lot: a.lot || undefined,
        supplier_offer: a.supplier_offer || undefined,
        signatures_count: signaturesMap[a.id] || 0,
      }));

      setAvenants(avenantsData);

      // Calculate summary
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const byLot: Record<string, { count: number; amount: number }> = {};
      avenantsData.forEach((a: Avenant) => {
        const lotNum = a.lot?.lot_number || 'Sans lot';
        if (!byLot[lotNum]) {
          byLot[lotNum] = { count: 0, amount: 0 };
        }
        byLot[lotNum].count++;
        byLot[lotNum].amount += a.total_with_vat;
      });

      const thisMonth = avenantsData.filter((a: Avenant) => new Date(a.created_at) >= monthStart);

      const calculatedSummary: AvenantSummary = {
        total: avenantsData.length,
        draft: avenantsData.filter((a: Avenant) => a.status === 'draft').length,
        pendingSignature: avenantsData.filter((a: Avenant) => a.status === 'pending_signature').length,
        signed: avenantsData.filter((a: Avenant) => a.status === 'signed').length,
        rejected: avenantsData.filter((a: Avenant) => a.status === 'rejected').length,
        cancelled: avenantsData.filter((a: Avenant) => a.status === 'cancelled').length,
        totalAmount: avenantsData.reduce((sum: number, a: Avenant) => sum + a.total_with_vat, 0),
        totalAmountSigned: avenantsData
          .filter((a: Avenant) => a.status === 'signed')
          .reduce((sum: number, a: Avenant) => sum + a.total_with_vat, 0),
        totalAmountPending: avenantsData
          .filter((a: Avenant) => a.status === 'pending_signature')
          .reduce((sum: number, a: Avenant) => sum + a.total_with_vat, 0),
        byType: {
          simple: avenantsData.filter((a: Avenant) => a.type === 'simple').length,
          detailed: avenantsData.filter((a: Avenant) => a.type === 'detailed').length,
          legal: avenantsData.filter((a: Avenant) => a.type === 'legal').length,
        },
        byLot,
        avgAmount: avenantsData.length > 0
          ? avenantsData.reduce((sum: number, a: Avenant) => sum + a.total_with_vat, 0) / avenantsData.length
          : 0,
        thisMonthCount: thisMonth.length,
        thisMonthAmount: thisMonth.reduce((sum: number, a: Avenant) => sum + a.total_with_vat, 0),
      };

      setSummary(calculatedSummary);
    } catch (err) {
      console.error('Error loading avenants:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadAvenants();
  }, [loadAvenants]);

  const createAvenant = useCallback(
    async (data: CreateAvenantData): Promise<Avenant> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Non authentifie');

        const { data: project } = await supabase
          .from('projects')
          .select('organization_id')
          .eq('id', data.projectId)
          .single();

        const vatRate = data.vatRate ?? SWISS_VAT_RATE;
        const vatAmount = (data.amount * vatRate) / 100;
        const totalWithVat = data.amount + vatAmount;

        let avenantType = data.type;
        if (!avenantType) {
          if (data.amount > 10000) {
            avenantType = 'legal';
          } else if (data.amount > 1000) {
            avenantType = 'detailed';
          } else {
            avenantType = 'simple';
          }
        }

        const { data: avenant, error: insertError } = await supabase
          .from('avenants')
          .insert({
            organization_id: project?.organization_id,
            project_id: data.projectId,
            lot_id: data.lotId || null,
            supplier_offer_id: data.supplierOfferId,
            title: data.title,
            description: data.description || null,
            amount: data.amount,
            vat_rate: vatRate,
            vat_amount: vatAmount,
            total_with_vat: totalWithVat,
            type: avenantType,
            status: 'draft',
            generated_by_user_id: userData.user.id,
            requires_qualified_signature: avenantType === 'legal' || data.amount > 5000,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadAvenants();
        return avenant;
      } catch (err) {
        console.error('Error creating avenant:', err);
        throw err;
      }
    },
    [loadAvenants]
  );

  const updateAvenant = useCallback(
    async (avenantId: string, data: UpdateAvenantData) => {
      try {
        const updateData: any = { updated_at: new Date().toISOString() };

        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.type !== undefined) updateData.type = data.type;

        if (data.amount !== undefined || data.vatRate !== undefined) {
          const { data: currentAvenant } = await supabase
            .from('avenants')
            .select('amount, vat_rate')
            .eq('id', avenantId)
            .single();

          const newAmount = data.amount ?? currentAvenant?.amount ?? 0;
          const newVatRate = data.vatRate ?? currentAvenant?.vat_rate ?? SWISS_VAT_RATE;
          const newVatAmount = (newAmount * newVatRate) / 100;
          const newTotalWithVat = newAmount + newVatAmount;

          updateData.amount = newAmount;
          updateData.vat_rate = newVatRate;
          updateData.vat_amount = newVatAmount;
          updateData.total_with_vat = newTotalWithVat;
          updateData.requires_qualified_signature = newAmount > 5000 || data.type === 'legal';
        }

        const { error: updateError } = await supabase
          .from('avenants')
          .update(updateData)
          .eq('id', avenantId);

        if (updateError) throw updateError;

        await loadAvenants();
      } catch (err) {
        console.error('Error updating avenant:', err);
        throw err;
      }
    },
    [loadAvenants]
  );

  const updateStatus = useCallback(
    async (avenantId: string, newStatus: AvenantStatus) => {
      try {
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };

        if (newStatus === 'pending_signature') {
          updateData.generated_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('avenants')
          .update(updateData)
          .eq('id', avenantId);

        if (updateError) throw updateError;

        await loadAvenants();
      } catch (err) {
        console.error('Error updating status:', err);
        throw err;
      }
    },
    [loadAvenants]
  );

  const sendForSignature = useCallback(
    async (avenantId: string) => {
      return updateStatus(avenantId, 'pending_signature');
    },
    [updateStatus]
  );

  const cancelAvenant = useCallback(
    async (avenantId: string) => {
      return updateStatus(avenantId, 'cancelled');
    },
    [updateStatus]
  );

  const deleteAvenant = useCallback(
    async (avenantId: string) => {
      try {
        const { data: avenant } = await supabase
          .from('avenants')
          .select('status')
          .eq('id', avenantId)
          .single();

        if (avenant?.status !== 'draft') {
          throw new Error('Seuls les brouillons peuvent etre supprimes');
        }

        const { error: deleteError } = await supabase
          .from('avenants')
          .delete()
          .eq('id', avenantId);

        if (deleteError) throw deleteError;

        await loadAvenants();
      } catch (err) {
        console.error('Error deleting avenant:', err);
        throw err;
      }
    },
    [loadAvenants]
  );

  const getByStatus = useCallback(
    (status: AvenantStatus) => avenants.filter((a) => a.status === status),
    [avenants]
  );

  const getByType = useCallback(
    (type: AvenantType) => avenants.filter((a) => a.type === type),
    [avenants]
  );

  const getByLot = useCallback(
    (lotId: string) => avenants.filter((a) => a.lot_id === lotId),
    [avenants]
  );

  const getPendingSignature = useCallback(
    () => avenants.filter((a) => a.status === 'pending_signature'),
    [avenants]
  );

  const getActive = useCallback(
    () => avenants.filter((a) => !['cancelled', 'rejected'].includes(a.status)),
    [avenants]
  );

  return {
    avenants,
    summary,
    loading,
    error,
    refresh: loadAvenants,
    createAvenant,
    updateAvenant,
    updateStatus,
    sendForSignature,
    cancelAvenant,
    deleteAvenant,
    getByStatus,
    getByType,
    getByLot,
    getPendingSignature,
    getActive,
  };
}

// ============================================================================
// Hook: useAvenantDetailEnhanced
// ============================================================================

export function useAvenantDetailEnhanced(avenantId: string | undefined) {
  const [avenant, setAvenant] = useState<Avenant | null>(null);
  const [signatures, setSignatures] = useState<AvenantSignature[]>([]);
  const [versions, setVersions] = useState<AvenantVersion[]>([]);
  const [invoices, setInvoices] = useState<AvenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!avenantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [avenantResult, signaturesResult, versionsResult, invoicesResult] = await Promise.all([
        supabase
          .from('avenants')
          .select(`
            *,
            lot:lot_id(lot_number, buyer_id),
            supplier_offer:supplier_offer_id(id, supplier_name, price, status)
          `)
          .eq('id', avenantId)
          .single(),
        supabase
          .from('avenant_signatures')
          .select('*')
          .eq('avenant_id', avenantId)
          .order('signed_at', { ascending: true }),
        supabase
          .from('avenant_versions')
          .select(`
            *,
            created_by:created_by_id(first_name, last_name)
          `)
          .eq('avenant_id', avenantId)
          .order('version_number', { ascending: false }),
        supabase
          .from('avenant_invoices')
          .select('*')
          .eq('avenant_id', avenantId)
          .order('created_at', { ascending: false }),
      ]);

      if (avenantResult.error) throw avenantResult.error;

      setAvenant(avenantResult.data);
      setSignatures(signaturesResult.data || []);
      setVersions(versionsResult.data || []);
      setInvoices(invoicesResult.data || []);
    } catch (err) {
      console.error('Error loading avenant detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [avenantId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const signAvenant = useCallback(
    async (signatureData: string, signerName: string, signerEmail: string, signerRole: SignerRole = 'client') => {
      if (!avenantId) return;

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Non authentifie');

        let ipAddress = null;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        } catch {
          // Ignore IP fetch errors
        }

        const { error: signError } = await supabase.from('avenant_signatures').insert({
          avenant_id: avenantId,
          signer_user_id: userData.user.id,
          signer_name: signerName,
          signer_email: signerEmail,
          signer_role: signerRole,
          signature_data: signatureData,
          signature_method: 'electronic',
          ip_address: ipAddress,
          user_agent: navigator.userAgent,
          is_valid: true,
        });

        if (signError) throw signError;

        await supabase
          .from('avenants')
          .update({ status: 'signed', updated_at: new Date().toISOString() })
          .eq('id', avenantId);

        await loadDetail();
      } catch (err) {
        console.error('Error signing avenant:', err);
        throw err;
      }
    },
    [avenantId, loadDetail]
  );

  const createVersion = useCallback(
    async (changesDescription: string) => {
      if (!avenantId) return;

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Non authentifie');

        const maxVersion = versions.length > 0 ? Math.max(...versions.map((v) => v.version_number)) : 0;

        const { error: insertError } = await supabase.from('avenant_versions').insert({
          avenant_id: avenantId,
          version_number: maxVersion + 1,
          changes_description: changesDescription,
          created_by_id: userData.user.id,
        });

        if (insertError) throw insertError;

        await loadDetail();
      } catch (err) {
        console.error('Error creating version:', err);
        throw err;
      }
    },
    [avenantId, versions, loadDetail]
  );

  const createInvoice = useCallback(
    async (invoiceNumber: string, dueDate?: Date) => {
      if (!avenantId || !avenant) return;

      try {
        const { error: insertError } = await supabase.from('avenant_invoices').insert({
          avenant_id: avenantId,
          invoice_number: invoiceNumber,
          amount: avenant.amount,
          vat_amount: avenant.vat_amount,
          total_amount: avenant.total_with_vat,
          status: 'draft',
          due_date: dueDate?.toISOString() || null,
        });

        if (insertError) throw insertError;

        await loadDetail();
      } catch (err) {
        console.error('Error creating invoice:', err);
        throw err;
      }
    },
    [avenantId, avenant, loadDetail]
  );

  const updateInvoiceStatus = useCallback(
    async (invoiceId: string, status: 'draft' | 'sent' | 'paid' | 'cancelled') => {
      try {
        const updateData: any = { status };
        if (status === 'paid') {
          updateData.paid_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('avenant_invoices')
          .update(updateData)
          .eq('id', invoiceId);

        if (updateError) throw updateError;

        await loadDetail();
      } catch (err) {
        console.error('Error updating invoice:', err);
        throw err;
      }
    },
    [loadDetail]
  );

  const requiredSignatures = avenant?.requires_qualified_signature ? 2 : 1;
  const isFullySigned = signatures.length >= requiredSignatures;
  const canSign = avenant?.status === 'pending_signature' && !isFullySigned;
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  return {
    avenant,
    signatures,
    versions,
    invoices,
    loading,
    error,
    refresh: loadDetail,
    signAvenant,
    createVersion,
    createInvoice,
    updateInvoiceStatus,
    requiredSignatures,
    isFullySigned,
    canSign,
    totalInvoiced,
    totalPaid,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatCHF(amount: number): string {
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getSuggestedType(amount: number): AvenantType {
  if (amount > 10000) return 'legal';
  if (amount > 1000) return 'detailed';
  return 'simple';
}

export function canEditAvenant(avenant: Avenant): boolean {
  return avenant.status === 'draft';
}

export function canDeleteAvenant(avenant: Avenant): boolean {
  return avenant.status === 'draft';
}

export function getDaysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateReference(projectId: string, index: number): string {
  const year = new Date().getFullYear();
  const paddedIndex = String(index).padStart(3, '0');
  return `AVN-${year}-${paddedIndex}`;
}
