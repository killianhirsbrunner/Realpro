/**
 * useBuyerManagement - Hook complet pour la gestion des acheteurs
 *
 * Fonctionnalités:
 * - CRUD complet avec workflow de statuts
 * - Gestion des documents avec validation
 * - Échéancier de paiements avec suivi
 * - Communications et messages
 * - Dossier notaire
 * - Timeline d'activités
 * - Progression d'achat
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type BuyerStatus =
  | 'PROSPECT'
  | 'INTERESTED'
  | 'RESERVED'
  | 'CONTRACT_PENDING'
  | 'CONTRACT_SIGNED'
  | 'NOTARY_IN_PROGRESS'
  | 'ACTE_SIGNED'
  | 'COMPLETED';

export type DocumentStatus =
  | 'requested'
  | 'pending'
  | 'received'
  | 'validated'
  | 'rejected';

export type PaymentStatus =
  | 'pending'
  | 'invoiced'
  | 'partially_paid'
  | 'paid'
  | 'overdue';

export type SaleType =
  | 'PPE'
  | 'RESIDENCE_PRINCIPALE'
  | 'RESIDENCE_SECONDAIRE'
  | 'INVESTISSEMENT';

export interface BuyerAddress {
  street?: string;
  postal_code?: string;
  city?: string;
  canton?: string;
  country?: string;
}

export interface BuyerContact {
  type: 'email' | 'phone' | 'mobile' | 'fax';
  value: string;
  is_primary: boolean;
}

export interface BuyerDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  storage_path?: string;
  size?: number;
  uploaded_at?: string;
  validated_at?: string;
  validated_by?: string;
  rejection_reason?: string;
  is_required: boolean;
}

export interface BuyerPayment {
  id: string;
  label: string;
  description?: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: PaymentStatus;
  invoice_number?: string;
  percentage?: number;
  milestone?: string;
}

export interface BuyerMessage {
  id: string;
  subject?: string;
  content: string;
  sender_id: string;
  sender_name: string;
  is_internal: boolean;
  read_at?: string;
  created_at: string;
}

export interface BuyerActivity {
  id: string;
  type: string;
  description: string;
  details?: Record<string, unknown>;
  user_id?: string;
  user_name?: string;
  created_at: string;
}

export interface BuyerNotaryDossier {
  id: string;
  notary_id?: string;
  notary_name?: string;
  notary_email?: string;
  status: 'not_started' | 'documents_pending' | 'review' | 'appointment_set' | 'signed' | 'completed';
  appointment_date?: string;
  acte_date?: string;
  documents: Array<{
    id: string;
    name: string;
    status: DocumentStatus;
    required: boolean;
  }>;
}

export interface BuyerMilestone {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at?: string;
  due_date?: string;
  order: number;
}

export interface BuyerLot {
  id: string;
  code: string;
  type: string;
  rooms_count: number;
  surface_total: number;
  price_total: number;
  building_name?: string;
  floor_level?: number;
}

export interface BuyerContract {
  id: string;
  status: string;
  sale_type: SaleType;
  signed_at?: string;
  total_amount: number;
  deposit_amount?: number;
  deposit_paid?: boolean;
}

export interface BuyerFull {
  id: string;
  project_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  civility?: string;
  birth_date?: string;
  nationality?: string;
  profession?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address: BuyerAddress;
  contacts: BuyerContact[];
  status: BuyerStatus;
  source?: string;
  assigned_to?: string;
  assigned_name?: string;
  lot?: BuyerLot;
  contract?: BuyerContract;
  documents: BuyerDocument[];
  payments: BuyerPayment[];
  messages: BuyerMessage[];
  activities: BuyerActivity[];
  notary_dossier?: BuyerNotaryDossier;
  milestones: BuyerMilestone[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BuyerSummary {
  total_documents: number;
  validated_documents: number;
  pending_documents: number;
  total_payments: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  unread_messages: number;
  days_since_creation: number;
  completion_percentage: number;
  next_milestone?: BuyerMilestone;
  next_payment?: BuyerPayment;
}

// ============================================================================
// Status Workflow Configuration
// ============================================================================

export const BUYER_STATUS_CONFIG: Record<BuyerStatus, {
  label: string;
  color: string;
  bgColor: string;
  allowedTransitions: BuyerStatus[];
  order: number;
}> = {
  PROSPECT: {
    label: 'Prospect',
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-100',
    allowedTransitions: ['INTERESTED', 'RESERVED'],
    order: 1,
  },
  INTERESTED: {
    label: 'Intéressé',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    allowedTransitions: ['PROSPECT', 'RESERVED'],
    order: 2,
  },
  RESERVED: {
    label: 'Réservé',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    allowedTransitions: ['PROSPECT', 'CONTRACT_PENDING'],
    order: 3,
  },
  CONTRACT_PENDING: {
    label: 'Contrat en attente',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    allowedTransitions: ['RESERVED', 'CONTRACT_SIGNED'],
    order: 4,
  },
  CONTRACT_SIGNED: {
    label: 'Contrat signé',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    allowedTransitions: ['CONTRACT_PENDING', 'NOTARY_IN_PROGRESS'],
    order: 5,
  },
  NOTARY_IN_PROGRESS: {
    label: 'Chez notaire',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    allowedTransitions: ['CONTRACT_SIGNED', 'ACTE_SIGNED'],
    order: 6,
  },
  ACTE_SIGNED: {
    label: 'Acte signé',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    allowedTransitions: ['NOTARY_IN_PROGRESS', 'COMPLETED'],
    order: 7,
  },
  COMPLETED: {
    label: 'Finalisé',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    allowedTransitions: [],
    order: 8,
  },
};

export const SALE_TYPE_CONFIG: Record<SaleType, {
  label: string;
  description: string;
}> = {
  PPE: { label: 'PPE', description: 'Propriété par étages' },
  RESIDENCE_PRINCIPALE: { label: 'Résidence principale', description: 'Usage personnel' },
  RESIDENCE_SECONDAIRE: { label: 'Résidence secondaire', description: 'Usage occasionnel' },
  INVESTISSEMENT: { label: 'Investissement', description: 'Mise en location' },
};

export const REQUIRED_DOCUMENTS = [
  { name: 'Pièce d\'identité', type: 'identity' },
  { name: 'Justificatif de domicile', type: 'address_proof' },
  { name: 'Attestation de financement', type: 'financing' },
  { name: 'Extrait registre des poursuites', type: 'debt_register' },
  { name: 'Déclaration fiscale', type: 'tax_return' },
];

export const DEFAULT_BUYER_MILESTONES: Omit<BuyerMilestone, 'id'>[] = [
  { name: 'Premier contact', status: 'pending', order: 1 },
  { name: 'Visite effectuée', status: 'pending', order: 2 },
  { name: 'Réservation signée', status: 'pending', order: 3 },
  { name: 'Documents fournis', status: 'pending', order: 4 },
  { name: 'Financement validé', status: 'pending', order: 5 },
  { name: 'Contrat de vente signé', status: 'pending', order: 6 },
  { name: 'Dossier notaire complet', status: 'pending', order: 7 },
  { name: 'Acte notarié signé', status: 'pending', order: 8 },
  { name: 'Choix matériaux finalisés', status: 'pending', order: 9 },
  { name: 'Livraison effectuée', status: 'pending', order: 10 },
];

// ============================================================================
// Main Hook
// ============================================================================

export function useBuyerManagement(projectId: string | undefined, buyerId: string | undefined) {
  const [buyer, setBuyer] = useState<BuyerFull | null>(null);
  const [summary, setSummary] = useState<BuyerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch buyer details
  // -------------------------------------------------------------------------
  const fetchBuyer = useCallback(async () => {
    if (!projectId || !buyerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch buyer with relations
      const { data: buyerData, error: buyerError } = await supabase
        .from('buyers')
        .select(`
          *,
          assigned_user:assigned_to(id, first_name, last_name),
          sales_contracts(
            id,
            status,
            sale_type,
            signed_at,
            total_amount,
            deposit_amount,
            deposit_paid,
            lot:lots(
              id,
              code,
              type,
              rooms_count,
              surface_total,
              price_total,
              building:buildings(name),
              floor:floors(level)
            )
          )
        `)
        .eq('id', buyerId)
        .maybeSingle();

      if (buyerError) throw buyerError;
      if (!buyerData) {
        setError(new Error('Acheteur non trouvé'));
        setLoading(false);
        return;
      }

      // Fetch documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      // Fetch payments
      const { data: payments } = await supabase
        .from('payment_schedules')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('due_date', { ascending: true });

      // Fetch messages
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          subject,
          content,
          sender_id,
          is_internal,
          read_at,
          created_at,
          sender:sender_id(first_name, last_name)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch activities
      const { data: activities } = await supabase
        .from('audit_logs')
        .select('id, action, details, user_id, created_at')
        .eq('resource_type', 'buyer')
        .eq('resource_id', buyerId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch notary dossier
      const { data: notaryDossier } = await supabase
        .from('notary_dossiers')
        .select(`
          *,
          notary:notary_id(id, name, email),
          documents:notary_files(id, name, status, required)
        `)
        .eq('buyer_id', buyerId)
        .maybeSingle();

      // Fetch milestones
      const { data: milestones } = await supabase
        .from('buyer_milestones')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('order', { ascending: true });

      // Build buyer object
      const contract = buyerData.sales_contracts?.[0];
      const lotData = contract?.lot;

      const fullBuyer: BuyerFull = {
        id: buyerData.id,
        project_id: buyerData.project_id || projectId,
        first_name: buyerData.first_name,
        last_name: buyerData.last_name,
        full_name: `${buyerData.first_name} ${buyerData.last_name}`,
        civility: buyerData.civility,
        birth_date: buyerData.birth_date,
        nationality: buyerData.nationality,
        profession: buyerData.profession,
        email: buyerData.email,
        phone: buyerData.phone,
        mobile: buyerData.mobile,
        address: {
          street: buyerData.address,
          postal_code: buyerData.postal_code,
          city: buyerData.city,
          canton: buyerData.canton,
          country: buyerData.country || 'Suisse',
        },
        contacts: buildContacts(buyerData),
        status: buyerData.status as BuyerStatus,
        source: buyerData.source,
        assigned_to: buyerData.assigned_to,
        assigned_name: buyerData.assigned_user
          ? `${(buyerData.assigned_user as any).first_name} ${(buyerData.assigned_user as any).last_name}`
          : undefined,
        lot: lotData ? {
          id: lotData.id,
          code: lotData.code,
          type: lotData.type,
          rooms_count: lotData.rooms_count,
          surface_total: lotData.surface_total,
          price_total: lotData.price_total,
          building_name: (lotData.building as any)?.name,
          floor_level: (lotData.floor as any)?.level,
        } : undefined,
        contract: contract ? {
          id: contract.id,
          status: contract.status,
          sale_type: contract.sale_type as SaleType,
          signed_at: contract.signed_at,
          total_amount: contract.total_amount,
          deposit_amount: contract.deposit_amount,
          deposit_paid: contract.deposit_paid,
        } : undefined,
        documents: (documents || []).map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          status: doc.status as DocumentStatus,
          storage_path: doc.storage_path,
          size: doc.size,
          uploaded_at: doc.created_at,
          validated_at: doc.validated_at,
          validated_by: doc.validated_by,
          rejection_reason: doc.rejection_reason,
          is_required: doc.is_required ?? true,
        })),
        payments: (payments || []).map(p => ({
          id: p.id,
          label: p.label || p.description,
          description: p.description,
          amount: p.amount,
          due_date: p.due_date,
          paid_date: p.paid_date,
          status: p.status as PaymentStatus,
          invoice_number: p.invoice_number,
          percentage: p.percentage,
          milestone: p.milestone,
        })),
        messages: (messages || []).map(msg => ({
          id: msg.id,
          subject: msg.subject,
          content: msg.content,
          sender_id: msg.sender_id,
          sender_name: msg.sender
            ? `${(msg.sender as any).first_name} ${(msg.sender as any).last_name}`
            : 'Système',
          is_internal: msg.is_internal,
          read_at: msg.read_at,
          created_at: msg.created_at,
        })),
        activities: (activities || []).map(act => ({
          id: act.id,
          type: act.action,
          description: formatActivityDescription(act.action, act.details),
          details: act.details,
          user_id: act.user_id,
          created_at: act.created_at,
        })),
        notary_dossier: notaryDossier ? {
          id: notaryDossier.id,
          notary_id: notaryDossier.notary_id,
          notary_name: (notaryDossier.notary as any)?.name,
          notary_email: (notaryDossier.notary as any)?.email,
          status: notaryDossier.status,
          appointment_date: notaryDossier.appointment_date,
          acte_date: notaryDossier.acte_date,
          documents: (notaryDossier.documents || []).map((d: any) => ({
            id: d.id,
            name: d.name,
            status: d.status,
            required: d.required,
          })),
        } : undefined,
        milestones: (milestones || []).map(m => ({
          id: m.id,
          name: m.name,
          status: m.status,
          completed_at: m.completed_at,
          due_date: m.due_date,
          order: m.order,
        })),
        notes: buyerData.notes,
        created_at: buyerData.created_at,
        updated_at: buyerData.updated_at,
      };

      setBuyer(fullBuyer);

      // Calculate summary
      const validatedDocs = fullBuyer.documents.filter(d => d.status === 'validated').length;
      const pendingDocs = fullBuyer.documents.filter(d => ['requested', 'pending', 'received'].includes(d.status)).length;
      const paidPayments = fullBuyer.payments.filter(p => p.status === 'paid');
      const overduePayments = fullBuyer.payments.filter(p => p.status === 'overdue');
      const pendingPayments = fullBuyer.payments.filter(p => ['pending', 'invoiced'].includes(p.status));
      const unreadMessages = fullBuyer.messages.filter(m => !m.read_at && !m.is_internal).length;
      const completedMilestones = fullBuyer.milestones.filter(m => m.status === 'completed').length;
      const totalMilestones = fullBuyer.milestones.length || 1;
      const nextMilestone = fullBuyer.milestones.find(m => m.status !== 'completed');
      const nextPayment = fullBuyer.payments.find(p => ['pending', 'invoiced'].includes(p.status));
      const daysSinceCreation = Math.floor(
        (new Date().getTime() - new Date(buyerData.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      setSummary({
        total_documents: fullBuyer.documents.length,
        validated_documents: validatedDocs,
        pending_documents: pendingDocs,
        total_payments: fullBuyer.payments.reduce((sum, p) => sum + p.amount, 0),
        paid_amount: paidPayments.reduce((sum, p) => sum + p.amount, 0),
        pending_amount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
        overdue_amount: overduePayments.reduce((sum, p) => sum + p.amount, 0),
        unread_messages: unreadMessages,
        days_since_creation: daysSinceCreation,
        completion_percentage: Math.round((completedMilestones / totalMilestones) * 100),
        next_milestone: nextMilestone,
        next_payment: nextPayment,
      });

    } catch (err) {
      console.error('Error fetching buyer:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, buyerId]);

  useEffect(() => {
    fetchBuyer();
  }, [fetchBuyer]);

  // -------------------------------------------------------------------------
  // Update buyer info
  // -------------------------------------------------------------------------
  const updateBuyer = async (updates: Partial<{
    first_name: string;
    last_name: string;
    civility: string;
    birth_date: string;
    nationality: string;
    profession: string;
    email: string;
    phone: string;
    mobile: string;
    address: string;
    postal_code: string;
    city: string;
    canton: string;
    country: string;
    notes: string;
    source: string;
  }>) => {
    if (!buyerId) return { error: new Error('Buyer ID manquant') };

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('buyers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', buyerId);

      if (updateError) throw updateError;

      await logActivity('buyer_updated', { changes: Object.keys(updates) });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error updating buyer:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Change status
  // -------------------------------------------------------------------------
  const changeStatus = async (newStatus: BuyerStatus, reason?: string) => {
    if (!buyer || !buyerId) return { error: new Error('Buyer non chargé') };

    const currentConfig = BUYER_STATUS_CONFIG[buyer.status];
    if (!currentConfig.allowedTransitions.includes(newStatus)) {
      return {
        error: new Error(`Transition de ${buyer.status} vers ${newStatus} non autorisée`)
      };
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('buyers')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', buyerId);

      if (updateError) throw updateError;

      await logActivity('status_change', {
        from: buyer.status,
        to: newStatus,
        reason,
      });

      await autoUpdateMilestones(newStatus);
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error changing status:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Auto-update milestones
  // -------------------------------------------------------------------------
  const autoUpdateMilestones = async (status: BuyerStatus) => {
    const milestoneMapping: Record<BuyerStatus, string[]> = {
      PROSPECT: ['Premier contact'],
      INTERESTED: ['Premier contact', 'Visite effectuée'],
      RESERVED: ['Premier contact', 'Visite effectuée', 'Réservation signée'],
      CONTRACT_PENDING: ['Premier contact', 'Visite effectuée', 'Réservation signée', 'Documents fournis'],
      CONTRACT_SIGNED: ['Premier contact', 'Visite effectuée', 'Réservation signée', 'Documents fournis', 'Financement validé', 'Contrat de vente signé'],
      NOTARY_IN_PROGRESS: ['Premier contact', 'Visite effectuée', 'Réservation signée', 'Documents fournis', 'Financement validé', 'Contrat de vente signé', 'Dossier notaire complet'],
      ACTE_SIGNED: ['Premier contact', 'Visite effectuée', 'Réservation signée', 'Documents fournis', 'Financement validé', 'Contrat de vente signé', 'Dossier notaire complet', 'Acte notarié signé'],
      COMPLETED: ['Premier contact', 'Visite effectuée', 'Réservation signée', 'Documents fournis', 'Financement validé', 'Contrat de vente signé', 'Dossier notaire complet', 'Acte notarié signé', 'Choix matériaux finalisés', 'Livraison effectuée'],
    };

    const milestonesToComplete = milestoneMapping[status] || [];

    for (const milestoneName of milestonesToComplete) {
      await supabase
        .from('buyer_milestones')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('buyer_id', buyerId)
        .eq('name', milestoneName)
        .neq('status', 'completed');
    }
  };

  // -------------------------------------------------------------------------
  // Document management
  // -------------------------------------------------------------------------
  const uploadDocument = async (file: File, type: string, name?: string) => {
    if (!buyerId || !projectId) return { error: new Error('IDs manquants') };

    try {
      setSaving(true);

      const fileName = `${Date.now()}-${file.name}`;
      const storagePath = `projects/${projectId}/buyers/${buyerId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          buyer_id: buyerId,
          name: name || file.name,
          type,
          storage_path: storagePath,
          size: file.size,
          status: 'received',
          is_required: REQUIRED_DOCUMENTS.some(d => d.type === type),
        });

      if (insertError) throw insertError;

      await logActivity('document_uploaded', { type, name: name || file.name });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error uploading document:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  const validateDocument = async (documentId: string, approved: boolean, reason?: string) => {
    try {
      setSaving(true);

      const { data: userData } = await supabase.auth.getUser();

      const updateData: Record<string, unknown> = {
        status: approved ? 'validated' : 'rejected',
      };

      if (approved) {
        updateData.validated_at = new Date().toISOString();
        updateData.validated_by = userData.user?.id;
      } else {
        updateData.rejection_reason = reason;
      }

      const { error: updateError } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', documentId);

      if (updateError) throw updateError;

      await logActivity('document_validated', { document_id: documentId, approved, reason });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error validating document:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (documentId: string, storagePath?: string) => {
    try {
      setSaving(true);

      if (storagePath) {
        await supabase.storage.from('documents').remove([storagePath]);
      }

      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      await fetchBuyer();
      return { error: null };
    } catch (err) {
      console.error('Error deleting document:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Payment management
  // -------------------------------------------------------------------------
  const recordPayment = async (paymentId: string, paidDate: string) => {
    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('payment_schedules')
        .update({
          status: 'paid',
          paid_date: paidDate,
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      await logActivity('payment_recorded', { payment_id: paymentId, paid_date: paidDate });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error recording payment:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  const sendPaymentReminder = async (paymentId: string) => {
    try {
      setSaving(true);

      // Log reminder sent
      await logActivity('payment_reminder_sent', { payment_id: paymentId });

      // Here you would typically trigger an email/notification
      // For now, we just log the action

      return { error: null };
    } catch (err) {
      console.error('Error sending reminder:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Message management
  // -------------------------------------------------------------------------
  const sendMessage = async (content: string, subject?: string, isInternal: boolean = false) => {
    if (!buyerId) return { error: new Error('Buyer ID manquant') };

    try {
      setSaving(true);

      const { data: userData } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          buyer_id: buyerId,
          sender_id: userData.user?.id,
          subject,
          content,
          is_internal: isInternal,
        });

      if (insertError) throw insertError;

      await logActivity('message_sent', { is_internal: isInternal });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error sending message:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  const markMessageRead = async (messageId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (updateError) throw updateError;

      await fetchBuyer();
      return { error: null };
    } catch (err) {
      console.error('Error marking message read:', err);
      return { error: err as Error };
    }
  };

  // -------------------------------------------------------------------------
  // Milestone management
  // -------------------------------------------------------------------------
  const updateMilestone = async (
    milestoneId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  ) => {
    try {
      setSaving(true);

      const updateData: Record<string, unknown> = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('buyer_milestones')
        .update(updateData)
        .eq('id', milestoneId);

      if (updateError) throw updateError;

      await logActivity('milestone_updated', { milestone_id: milestoneId, status });
      await fetchBuyer();

      return { error: null };
    } catch (err) {
      console.error('Error updating milestone:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  const initializeMilestones = async () => {
    if (!buyerId) return { error: new Error('Buyer ID manquant') };

    try {
      setSaving(true);

      const { data: existing } = await supabase
        .from('buyer_milestones')
        .select('id')
        .eq('buyer_id', buyerId)
        .limit(1);

      if (existing && existing.length > 0) {
        return { error: null };
      }

      const milestonesToInsert = DEFAULT_BUYER_MILESTONES.map(m => ({
        buyer_id: buyerId,
        ...m,
      }));

      const { error: insertError } = await supabase
        .from('buyer_milestones')
        .insert(milestonesToInsert);

      if (insertError) throw insertError;

      await fetchBuyer();
      return { error: null };
    } catch (err) {
      console.error('Error initializing milestones:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Log activity
  // -------------------------------------------------------------------------
  const logActivity = async (action: string, details?: Record<string, unknown>) => {
    if (!buyerId) return;

    try {
      const { data: userData } = await supabase.auth.getUser();

      await supabase.from('audit_logs').insert({
        resource_type: 'buyer',
        resource_id: buyerId,
        action,
        details,
        user_id: userData.user?.id,
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  // -------------------------------------------------------------------------
  // Get allowed status transitions
  // -------------------------------------------------------------------------
  const getAllowedTransitions = (): BuyerStatus[] => {
    if (!buyer) return [];
    return BUYER_STATUS_CONFIG[buyer.status].allowedTransitions;
  };

  // -------------------------------------------------------------------------
  // Get payment summary
  // -------------------------------------------------------------------------
  const getPaymentSummary = () => {
    if (!buyer) return null;

    const total = buyer.payments.reduce((sum, p) => sum + p.amount, 0);
    const paid = buyer.payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = buyer.payments
      .filter(p => ['pending', 'invoiced'].includes(p.status))
      .reduce((sum, p) => sum + p.amount, 0);
    const overdue = buyer.payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total,
      paid,
      pending,
      overdue,
      remaining: total - paid,
      percentagePaid: total > 0 ? Math.round((paid / total) * 100) : 0,
    };
  };

  // -------------------------------------------------------------------------
  // Get document completion
  // -------------------------------------------------------------------------
  const getDocumentCompletion = () => {
    if (!buyer) return null;

    const required = buyer.documents.filter(d => d.is_required);
    const validated = required.filter(d => d.status === 'validated').length;
    const total = required.length;

    return {
      validated,
      total,
      percentage: total > 0 ? Math.round((validated / total) * 100) : 0,
      missing: REQUIRED_DOCUMENTS.filter(
        rd => !buyer.documents.some(d => d.type === rd.type && d.status === 'validated')
      ),
    };
  };

  return {
    // Data
    buyer,
    summary,
    loading,
    error,
    saving,

    // Actions
    refresh: fetchBuyer,
    updateBuyer,
    changeStatus,
    getAllowedTransitions,

    // Documents
    uploadDocument,
    validateDocument,
    deleteDocument,
    getDocumentCompletion,

    // Payments
    recordPayment,
    sendPaymentReminder,
    getPaymentSummary,

    // Messages
    sendMessage,
    markMessageRead,

    // Milestones
    updateMilestone,
    initializeMilestones,

    // Config
    statusConfig: BUYER_STATUS_CONFIG,
    saleTypeConfig: SALE_TYPE_CONFIG,
    requiredDocuments: REQUIRED_DOCUMENTS,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildContacts(buyerData: any): BuyerContact[] {
  const contacts: BuyerContact[] = [];

  if (buyerData.email) {
    contacts.push({ type: 'email', value: buyerData.email, is_primary: true });
  }
  if (buyerData.phone) {
    contacts.push({ type: 'phone', value: buyerData.phone, is_primary: !buyerData.email });
  }
  if (buyerData.mobile) {
    contacts.push({ type: 'mobile', value: buyerData.mobile, is_primary: false });
  }

  return contacts;
}

function formatActivityDescription(action: string, details?: Record<string, unknown>): string {
  switch (action) {
    case 'status_change':
      return `Statut changé de ${details?.from || '?'} à ${details?.to || '?'}`;
    case 'buyer_updated':
      return `Informations mises à jour: ${(details?.changes as string[])?.join(', ') || 'modifications'}`;
    case 'document_uploaded':
      return `Document ajouté: ${details?.name || 'document'}`;
    case 'document_validated':
      return `Document ${details?.approved ? 'validé' : 'refusé'}: ${details?.reason || ''}`;
    case 'payment_recorded':
      return `Paiement enregistré`;
    case 'payment_reminder_sent':
      return 'Rappel de paiement envoyé';
    case 'message_sent':
      return `Message envoyé${details?.is_internal ? ' (interne)' : ''}`;
    case 'milestone_updated':
      return `Étape mise à jour: ${details?.status || '?'}`;
    default:
      return action;
  }
}
