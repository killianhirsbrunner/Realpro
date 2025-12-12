/**
 * useLotManagement - Hook complet pour la gestion des lots immobiliers
 *
 * Fonctionnalités:
 * - CRUD complet avec workflow de statuts
 * - Gestion des surfaces PPE suisse
 * - Timeline d'activités
 * - Documents et plans
 * - Prix et finances
 * - Communications et notes
 * - Validation des étapes clés
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type LotStatus =
  | 'AVAILABLE'
  | 'OPTION'
  | 'RESERVED'
  | 'SOLD'
  | 'DELIVERED'
  | 'BLOCKED';

export type LotType =
  | 'APARTMENT'
  | 'STUDIO'
  | 'PENTHOUSE'
  | 'DUPLEX'
  | 'ATTIC'
  | 'COMMERCIAL'
  | 'PARKING'
  | 'CELLAR';

export type DocumentType =
  | 'plan'
  | 'contract'
  | 'specification'
  | 'certificate'
  | 'photo'
  | 'other';

export type ActivityType =
  | 'status_change'
  | 'price_update'
  | 'document_added'
  | 'note_added'
  | 'visit_scheduled'
  | 'contract_signed'
  | 'milestone';

export interface LotSurfaces {
  surface_total: number;
  surface_habitable: number;
  surface_balcon?: number;
  surface_terrasse?: number;
  surface_jardin?: number;
  surface_cave?: number;
  surface_parking?: number;
  ppe_milliemes?: number;
}

export interface LotPricing {
  price_base: number;
  price_parking?: number;
  price_cave?: number;
  price_options?: number;
  price_modifications?: number;
  price_total: number;
  price_per_m2: number;
  tva_included: boolean;
}

export interface LotBuyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  contract_id?: string;
  contract_status?: string;
  signed_at?: string;
}

export interface LotDocument {
  id: string;
  name: string;
  type: DocumentType;
  storage_path: string;
  size?: number;
  mime_type?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface LotActivity {
  id: string;
  type: ActivityType;
  description: string;
  details?: Record<string, unknown>;
  user_id?: string;
  user_name?: string;
  created_at: string;
}

export interface LotNote {
  id: string;
  content: string;
  is_private: boolean;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface LotMilestone {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at?: string;
  due_date?: string;
  order: number;
}

export interface LotFull {
  id: string;
  project_id: string;
  code: string;
  type: LotType;
  status: LotStatus;
  building_id?: string;
  building_name?: string;
  floor_id?: string;
  floor_level?: number;
  floor_name?: string;
  rooms_count: number;
  orientation?: string;
  description?: string;
  surfaces: LotSurfaces;
  pricing: LotPricing;
  buyer?: LotBuyer;
  documents: LotDocument[];
  activities: LotActivity[];
  notes: LotNote[];
  milestones: LotMilestone[];
  annexes: {
    parking_ids: string[];
    cave_ids: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface LotSummary {
  total_documents: number;
  total_activities: number;
  total_notes: number;
  days_on_market: number;
  visits_count: number;
  last_activity_at?: string;
  next_milestone?: LotMilestone;
  completion_percentage: number;
}

// ============================================================================
// Status Workflow Configuration
// ============================================================================

export const LOT_STATUS_CONFIG: Record<LotStatus, {
  label: string;
  color: string;
  bgColor: string;
  allowedTransitions: LotStatus[];
  requiresConfirmation: boolean;
}> = {
  AVAILABLE: {
    label: 'Disponible',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    allowedTransitions: ['OPTION', 'RESERVED', 'BLOCKED'],
    requiresConfirmation: false,
  },
  OPTION: {
    label: 'Option',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    allowedTransitions: ['AVAILABLE', 'RESERVED', 'BLOCKED'],
    requiresConfirmation: true,
  },
  RESERVED: {
    label: 'Réservé',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    allowedTransitions: ['AVAILABLE', 'OPTION', 'SOLD', 'BLOCKED'],
    requiresConfirmation: true,
  },
  SOLD: {
    label: 'Vendu',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    allowedTransitions: ['RESERVED', 'DELIVERED'],
    requiresConfirmation: true,
  },
  DELIVERED: {
    label: 'Livré',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    allowedTransitions: [],
    requiresConfirmation: true,
  },
  BLOCKED: {
    label: 'Bloqué',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    allowedTransitions: ['AVAILABLE', 'OPTION', 'RESERVED'],
    requiresConfirmation: true,
  },
};

export const LOT_TYPE_CONFIG: Record<LotType, {
  label: string;
  icon: string;
}> = {
  APARTMENT: { label: 'Appartement', icon: '🏢' },
  STUDIO: { label: 'Studio', icon: '🏠' },
  PENTHOUSE: { label: 'Penthouse', icon: '🌆' },
  DUPLEX: { label: 'Duplex', icon: '🏡' },
  ATTIC: { label: 'Attique', icon: '⬆️' },
  COMMERCIAL: { label: 'Commercial', icon: '🏪' },
  PARKING: { label: 'Parking', icon: '🅿️' },
  CELLAR: { label: 'Cave', icon: '📦' },
};

export const DEFAULT_MILESTONES: Omit<LotMilestone, 'id'>[] = [
  { name: 'Mise en vente', status: 'pending', order: 1 },
  { name: 'Premier contact', status: 'pending', order: 2 },
  { name: 'Visite effectuée', status: 'pending', order: 3 },
  { name: 'Option posée', status: 'pending', order: 4 },
  { name: 'Réservation signée', status: 'pending', order: 5 },
  { name: 'Contrat notaire signé', status: 'pending', order: 6 },
  { name: 'Choix matériaux finalisés', status: 'pending', order: 7 },
  { name: 'Livraison effectuée', status: 'pending', order: 8 },
];

// ============================================================================
// Main Hook
// ============================================================================

export function useLotManagement(projectId: string | undefined, lotId: string | undefined) {
  const [lot, setLot] = useState<LotFull | null>(null);
  const [summary, setSummary] = useState<LotSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch lot details
  // -------------------------------------------------------------------------
  const fetchLot = useCallback(async () => {
    if (!projectId || !lotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch lot with relations
      const { data: lotData, error: lotError } = await supabase
        .from('lots')
        .select(`
          *,
          building:buildings(id, name, code),
          floor:floors(id, name, level),
          sales_contracts(
            id,
            status,
            signed_at,
            buyer:buyers(
              id,
              first_name,
              last_name,
              email,
              phone,
              address
            )
          )
        `)
        .eq('id', lotId)
        .eq('project_id', projectId)
        .maybeSingle();

      if (lotError) throw lotError;
      if (!lotData) {
        setError(new Error('Lot non trouvé'));
        setLoading(false);
        return;
      }

      // Fetch documents
      const { data: documents } = await supabase
        .from('documents')
        .select('id, name, type, storage_path, size, mime_type, created_at, user_id')
        .eq('lot_id', lotId)
        .order('created_at', { ascending: false });

      // Fetch activities
      const { data: activities } = await supabase
        .from('audit_logs')
        .select('id, action, details, user_id, created_at')
        .eq('resource_type', 'lot')
        .eq('resource_id', lotId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select(`
          id,
          content,
          is_private,
          user_id,
          created_at,
          updated_at,
          author:users(first_name, last_name)
        `)
        .eq('entity_type', 'lot')
        .eq('entity_id', lotId)
        .order('created_at', { ascending: false });

      // Fetch milestones
      const { data: milestones } = await supabase
        .from('lot_milestones')
        .select('*')
        .eq('lot_id', lotId)
        .order('order', { ascending: true });

      // Build lot object
      const contract = lotData.sales_contracts?.[0];
      const buyer = contract?.buyer;

      const fullLot: LotFull = {
        id: lotData.id,
        project_id: lotData.project_id,
        code: lotData.code,
        type: lotData.type as LotType,
        status: lotData.status as LotStatus,
        building_id: lotData.building_id,
        building_name: (lotData.building as any)?.name,
        floor_id: lotData.floor_id,
        floor_level: (lotData.floor as any)?.level,
        floor_name: (lotData.floor as any)?.name,
        rooms_count: lotData.rooms_count || 0,
        orientation: lotData.orientation,
        description: lotData.description,
        surfaces: {
          surface_total: lotData.surface_total || 0,
          surface_habitable: lotData.surface_habitable || lotData.surface_total || 0,
          surface_balcon: lotData.surface_balcon,
          surface_terrasse: lotData.surface_terrasse,
          surface_jardin: lotData.surface_jardin,
          surface_cave: lotData.surface_cave,
          surface_parking: lotData.surface_parking,
          ppe_milliemes: lotData.ppe_milliemes,
        },
        pricing: {
          price_base: lotData.price_base || lotData.price_total || 0,
          price_parking: lotData.price_parking,
          price_cave: lotData.price_cave,
          price_options: lotData.price_options || 0,
          price_modifications: lotData.price_modifications || 0,
          price_total: lotData.price_total || 0,
          price_per_m2: lotData.surface_total
            ? Math.round((lotData.price_total || 0) / lotData.surface_total)
            : 0,
          tva_included: lotData.tva_included ?? true,
        },
        buyer: buyer ? {
          id: buyer.id,
          first_name: buyer.first_name,
          last_name: buyer.last_name,
          email: buyer.email,
          phone: buyer.phone,
          address: buyer.address,
          contract_id: contract?.id,
          contract_status: contract?.status,
          signed_at: contract?.signed_at,
        } : undefined,
        documents: (documents || []).map(doc => ({
          id: doc.id,
          name: doc.name,
          type: (doc.type || 'other') as DocumentType,
          storage_path: doc.storage_path,
          size: doc.size,
          mime_type: doc.mime_type,
          uploaded_at: doc.created_at,
          uploaded_by: doc.user_id,
        })),
        activities: (activities || []).map(act => ({
          id: act.id,
          type: mapActionToActivityType(act.action),
          description: formatActivityDescription(act.action, act.details),
          details: act.details,
          user_id: act.user_id,
          created_at: act.created_at,
        })),
        notes: (notes || []).map(note => ({
          id: note.id,
          content: note.content,
          is_private: note.is_private,
          author_id: note.user_id,
          author_name: note.author
            ? `${(note.author as any).first_name} ${(note.author as any).last_name}`
            : 'Utilisateur',
          created_at: note.created_at,
          updated_at: note.updated_at,
        })),
        milestones: (milestones || []).map(m => ({
          id: m.id,
          name: m.name,
          status: m.status,
          completed_at: m.completed_at,
          due_date: m.due_date,
          order: m.order,
        })),
        annexes: {
          parking_ids: lotData.parking_ids || [],
          cave_ids: lotData.cave_ids || [],
        },
        created_at: lotData.created_at,
        updated_at: lotData.updated_at,
      };

      setLot(fullLot);

      // Calculate summary
      const completedMilestones = fullLot.milestones.filter(m => m.status === 'completed').length;
      const totalMilestones = fullLot.milestones.length || 1;
      const nextMilestone = fullLot.milestones.find(m => m.status !== 'completed');

      const daysOnMarket = Math.floor(
        (new Date().getTime() - new Date(lotData.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      setSummary({
        total_documents: fullLot.documents.length,
        total_activities: fullLot.activities.length,
        total_notes: fullLot.notes.length,
        days_on_market: daysOnMarket,
        visits_count: (activities || []).filter(a => a.action === 'visit_scheduled').length,
        last_activity_at: fullLot.activities[0]?.created_at,
        next_milestone: nextMilestone,
        completion_percentage: Math.round((completedMilestones / totalMilestones) * 100),
      });

    } catch (err) {
      console.error('Error fetching lot:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, lotId]);

  useEffect(() => {
    fetchLot();
  }, [fetchLot]);

  // -------------------------------------------------------------------------
  // Update lot
  // -------------------------------------------------------------------------
  const updateLot = async (updates: Partial<{
    code: string;
    type: LotType;
    rooms_count: number;
    orientation: string;
    description: string;
    surface_total: number;
    surface_habitable: number;
    surface_balcon: number;
    surface_terrasse: number;
    surface_jardin: number;
    surface_cave: number;
    price_base: number;
    price_parking: number;
    price_cave: number;
    price_total: number;
    ppe_milliemes: number;
  }>) => {
    if (!lotId) return { error: new Error('Lot ID manquant') };

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('lots')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lotId);

      if (updateError) throw updateError;

      await logActivity('lot_updated', { changes: Object.keys(updates) });
      await fetchLot();

      return { error: null };
    } catch (err) {
      console.error('Error updating lot:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Change status with workflow validation
  // -------------------------------------------------------------------------
  const changeStatus = async (
    newStatus: LotStatus,
    reason?: string,
    options?: {
      buyer_id?: string;
      contract_id?: string;
    }
  ) => {
    if (!lot || !lotId) return { error: new Error('Lot non chargé') };

    const currentConfig = LOT_STATUS_CONFIG[lot.status];
    if (!currentConfig.allowedTransitions.includes(newStatus)) {
      return {
        error: new Error(`Transition de ${lot.status} vers ${newStatus} non autorisée`)
      };
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('lots')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lotId);

      if (updateError) throw updateError;

      await logActivity('status_change', {
        from: lot.status,
        to: newStatus,
        reason,
        ...options,
      });

      // Auto-update milestones based on status
      await autoUpdateMilestones(newStatus);

      await fetchLot();

      return { error: null };
    } catch (err) {
      console.error('Error changing status:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Auto-update milestones based on status
  // -------------------------------------------------------------------------
  const autoUpdateMilestones = async (status: LotStatus) => {
    const milestoneMapping: Record<LotStatus, string[]> = {
      AVAILABLE: ['Mise en vente'],
      OPTION: ['Mise en vente', 'Premier contact', 'Visite effectuée', 'Option posée'],
      RESERVED: ['Mise en vente', 'Premier contact', 'Visite effectuée', 'Option posée', 'Réservation signée'],
      SOLD: ['Mise en vente', 'Premier contact', 'Visite effectuée', 'Option posée', 'Réservation signée', 'Contrat notaire signé'],
      DELIVERED: ['Mise en vente', 'Premier contact', 'Visite effectuée', 'Option posée', 'Réservation signée', 'Contrat notaire signé', 'Choix matériaux finalisés', 'Livraison effectuée'],
      BLOCKED: [],
    };

    const milestonesToComplete = milestoneMapping[status] || [];

    for (const milestoneName of milestonesToComplete) {
      await supabase
        .from('lot_milestones')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('lot_id', lotId)
        .eq('name', milestoneName)
        .neq('status', 'completed');
    }
  };

  // -------------------------------------------------------------------------
  // Add note
  // -------------------------------------------------------------------------
  const addNote = async (content: string, isPrivate: boolean = false) => {
    if (!lotId) return { error: new Error('Lot ID manquant') };

    try {
      setSaving(true);

      const { data: userData } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('notes')
        .insert({
          entity_type: 'lot',
          entity_id: lotId,
          content,
          is_private: isPrivate,
          user_id: userData.user?.id,
        });

      if (insertError) throw insertError;

      await logActivity('note_added', { is_private: isPrivate });
      await fetchLot();

      return { error: null };
    } catch (err) {
      console.error('Error adding note:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Delete note
  // -------------------------------------------------------------------------
  const deleteNote = async (noteId: string) => {
    try {
      setSaving(true);

      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (deleteError) throw deleteError;

      await fetchLot();
      return { error: null };
    } catch (err) {
      console.error('Error deleting note:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Update milestone
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
        .from('lot_milestones')
        .update(updateData)
        .eq('id', milestoneId);

      if (updateError) throw updateError;

      await logActivity('milestone', { milestone_id: milestoneId, status });
      await fetchLot();

      return { error: null };
    } catch (err) {
      console.error('Error updating milestone:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Initialize milestones for lot
  // -------------------------------------------------------------------------
  const initializeMilestones = async () => {
    if (!lotId) return { error: new Error('Lot ID manquant') };

    try {
      setSaving(true);

      // Check if milestones already exist
      const { data: existing } = await supabase
        .from('lot_milestones')
        .select('id')
        .eq('lot_id', lotId)
        .limit(1);

      if (existing && existing.length > 0) {
        return { error: null }; // Already initialized
      }

      const milestonesToInsert = DEFAULT_MILESTONES.map(m => ({
        lot_id: lotId,
        ...m,
      }));

      const { error: insertError } = await supabase
        .from('lot_milestones')
        .insert(milestonesToInsert);

      if (insertError) throw insertError;

      await fetchLot();
      return { error: null };
    } catch (err) {
      console.error('Error initializing milestones:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Upload document
  // -------------------------------------------------------------------------
  const uploadDocument = async (
    file: File,
    type: DocumentType,
    name?: string
  ) => {
    if (!lotId || !projectId) return { error: new Error('IDs manquants') };

    try {
      setSaving(true);

      const fileName = `${Date.now()}-${file.name}`;
      const storagePath = `projects/${projectId}/lots/${lotId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          lot_id: lotId,
          name: name || file.name,
          type,
          storage_path: storagePath,
          size: file.size,
          mime_type: file.type,
        });

      if (insertError) throw insertError;

      await logActivity('document_added', { type, name: name || file.name });
      await fetchLot();

      return { error: null };
    } catch (err) {
      console.error('Error uploading document:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Delete document
  // -------------------------------------------------------------------------
  const deleteDocument = async (documentId: string, storagePath: string) => {
    try {
      setSaving(true);

      // Delete from storage
      await supabase.storage.from('documents').remove([storagePath]);

      // Delete from database
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      await fetchLot();
      return { error: null };
    } catch (err) {
      console.error('Error deleting document:', err);
      return { error: err as Error };
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Log activity
  // -------------------------------------------------------------------------
  const logActivity = async (action: string, details?: Record<string, unknown>) => {
    if (!lotId) return;

    try {
      const { data: userData } = await supabase.auth.getUser();

      await supabase.from('audit_logs').insert({
        resource_type: 'lot',
        resource_id: lotId,
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
  const getAllowedTransitions = (): LotStatus[] => {
    if (!lot) return [];
    return LOT_STATUS_CONFIG[lot.status].allowedTransitions;
  };

  // -------------------------------------------------------------------------
  // Calculate price breakdown
  // -------------------------------------------------------------------------
  const getPriceBreakdown = () => {
    if (!lot) return null;

    const { pricing } = lot;
    return {
      base: pricing.price_base,
      parking: pricing.price_parking || 0,
      cave: pricing.price_cave || 0,
      options: pricing.price_options || 0,
      modifications: pricing.price_modifications || 0,
      subtotal: pricing.price_total,
      tva: pricing.tva_included ? 0 : Math.round(pricing.price_total * 0.081),
      total: pricing.tva_included
        ? pricing.price_total
        : Math.round(pricing.price_total * 1.081),
    };
  };

  return {
    // Data
    lot,
    summary,
    loading,
    error,
    saving,

    // Actions
    refresh: fetchLot,
    updateLot,
    changeStatus,
    getAllowedTransitions,

    // Notes
    addNote,
    deleteNote,

    // Milestones
    updateMilestone,
    initializeMilestones,

    // Documents
    uploadDocument,
    deleteDocument,

    // Helpers
    getPriceBreakdown,

    // Config
    statusConfig: LOT_STATUS_CONFIG,
    typeConfig: LOT_TYPE_CONFIG,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function mapActionToActivityType(action: string): ActivityType {
  const mapping: Record<string, ActivityType> = {
    status_change: 'status_change',
    lot_updated: 'price_update',
    document_added: 'document_added',
    note_added: 'note_added',
    visit_scheduled: 'visit_scheduled',
    contract_signed: 'contract_signed',
    milestone: 'milestone',
  };
  return mapping[action] || 'status_change';
}

function formatActivityDescription(action: string, details?: Record<string, unknown>): string {
  switch (action) {
    case 'status_change':
      return `Statut changé de ${details?.from || '?'} à ${details?.to || '?'}`;
    case 'lot_updated':
      return `Lot mis à jour: ${(details?.changes as string[])?.join(', ') || 'modifications'}`;
    case 'document_added':
      return `Document ajouté: ${details?.name || 'document'}`;
    case 'note_added':
      return `Note ajoutée${details?.is_private ? ' (privée)' : ''}`;
    case 'visit_scheduled':
      return 'Visite programmée';
    case 'contract_signed':
      return 'Contrat signé';
    case 'milestone':
      return `Étape mise à jour: ${details?.status || '?'}`;
    default:
      return action;
  }
}

// ============================================================================
// Additional Hook: useLotComparison
// ============================================================================

export function useLotComparison(projectId: string, lotIds: string[]) {
  const [lots, setLots] = useState<LotFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId || lotIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchLots = async () => {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('lots')
          .select(`
            *,
            building:buildings(id, name, code),
            floor:floors(id, name, level)
          `)
          .eq('project_id', projectId)
          .in('id', lotIds);

        if (fetchError) throw fetchError;

        const mappedLots: LotFull[] = (data || []).map(lotData => ({
          id: lotData.id,
          project_id: lotData.project_id,
          code: lotData.code,
          type: lotData.type as LotType,
          status: lotData.status as LotStatus,
          building_id: lotData.building_id,
          building_name: (lotData.building as any)?.name,
          floor_id: lotData.floor_id,
          floor_level: (lotData.floor as any)?.level,
          floor_name: (lotData.floor as any)?.name,
          rooms_count: lotData.rooms_count || 0,
          orientation: lotData.orientation,
          description: lotData.description,
          surfaces: {
            surface_total: lotData.surface_total || 0,
            surface_habitable: lotData.surface_habitable || lotData.surface_total || 0,
            surface_balcon: lotData.surface_balcon,
            surface_terrasse: lotData.surface_terrasse,
            surface_jardin: lotData.surface_jardin,
            surface_cave: lotData.surface_cave,
            surface_parking: lotData.surface_parking,
            ppe_milliemes: lotData.ppe_milliemes,
          },
          pricing: {
            price_base: lotData.price_base || lotData.price_total || 0,
            price_parking: lotData.price_parking,
            price_cave: lotData.price_cave,
            price_options: lotData.price_options || 0,
            price_modifications: lotData.price_modifications || 0,
            price_total: lotData.price_total || 0,
            price_per_m2: lotData.surface_total
              ? Math.round((lotData.price_total || 0) / lotData.surface_total)
              : 0,
            tva_included: lotData.tva_included ?? true,
          },
          documents: [],
          activities: [],
          notes: [],
          milestones: [],
          annexes: {
            parking_ids: lotData.parking_ids || [],
            cave_ids: lotData.cave_ids || [],
          },
          created_at: lotData.created_at,
          updated_at: lotData.updated_at,
        }));

        setLots(mappedLots);
      } catch (err) {
        console.error('Error fetching lots for comparison:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [projectId, lotIds.join(',')]);

  const getComparisonTable = () => {
    if (lots.length === 0) return null;

    return {
      codes: lots.map(l => l.code),
      types: lots.map(l => LOT_TYPE_CONFIG[l.type]?.label || l.type),
      statuses: lots.map(l => LOT_STATUS_CONFIG[l.status]?.label || l.status),
      rooms: lots.map(l => l.rooms_count),
      surfaces: lots.map(l => l.surfaces.surface_total),
      prices: lots.map(l => l.pricing.price_total),
      pricesPerM2: lots.map(l => l.pricing.price_per_m2),
      floors: lots.map(l => l.floor_level),
      orientations: lots.map(l => l.orientation || '-'),
    };
  };

  return {
    lots,
    loading,
    error,
    getComparisonTable,
  };
}
