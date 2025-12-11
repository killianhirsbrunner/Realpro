import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type SAVStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'FIXED' | 'VALIDATED' | 'CLOSED' | 'REJECTED' | 'EXPIRED';
export type SAVSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL' | 'BLOCKING';
export type SAVCategory = 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'CARPENTRY' | 'PAINTING' | 'FLOORING' | 'FACADE' | 'ROOF' | 'OTHER';

export interface SAVTicket {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string | null;
  buyer_id: string | null;
  title: string;
  description: string | null;
  location: string | null;
  category: SAVCategory | null;
  status: SAVStatus;
  severity: SAVSeverity;
  warranty_type: string | null;
  warranty_end_date: string | null;
  due_date: string | null;
  assigned_to_company_id: string | null;
  assigned_to_user_id: string | null;
  reported_by_id: string | null;
  internal_notes: string | null;
  fixed_at: string | null;
  validated_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  lot?: {
    lot_number: string;
  };
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
  assigned_company?: {
    id: string;
    name: string;
  };
  assigned_user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  reported_by?: {
    first_name: string;
    last_name: string;
  };
  messages_count?: number;
  attachments_count?: number;
}

export interface SAVMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface SAVAttachment {
  id: string;
  ticket_id: string;
  message_id: string | null;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by_id: string;
  created_at: string;
}

export interface SAVHistory {
  id: string;
  ticket_id: string;
  action: string;
  details: string | null;
  old_value: string | null;
  new_value: string | null;
  created_by_id: string;
  created_at: string;
  created_by?: {
    first_name: string;
    last_name: string;
  };
}

export interface SAVSummary {
  total: number;
  new: number;
  assigned: number;
  inProgress: number;
  fixed: number;
  validated: number;
  closed: number;
  rejected: number;
  expired: number;
  bySeverity: {
    minor: number;
    major: number;
    critical: number;
    blocking: number;
  };
  avgResolutionDays: number;
  overdueCount: number;
  thisWeekCreated: number;
  thisWeekClosed: number;
}

export interface CreateTicketData {
  projectId: string;
  lotId?: string;
  buyerId?: string;
  title: string;
  description?: string;
  location?: string;
  category?: SAVCategory;
  severity: SAVSeverity;
  warrantyType?: string;
  dueDate?: Date;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  location?: string;
  category?: SAVCategory;
  severity?: SAVSeverity;
  dueDate?: Date;
  internalNotes?: string;
}

// ============================================================================
// Status Configuration
// ============================================================================

export const SAV_STATUS_CONFIG: Record<SAVStatus, { label: string; color: string; icon: string; nextStatuses: SAVStatus[] }> = {
  NEW: {
    label: 'Nouveau',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    icon: 'AlertCircle',
    nextStatuses: ['ASSIGNED', 'REJECTED'],
  },
  ASSIGNED: {
    label: 'Assigne',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    icon: 'UserCheck',
    nextStatuses: ['IN_PROGRESS', 'REJECTED'],
  },
  IN_PROGRESS: {
    label: 'En cours',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    icon: 'Wrench',
    nextStatuses: ['FIXED', 'ASSIGNED'],
  },
  FIXED: {
    label: 'Repare',
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
    icon: 'CheckCircle',
    nextStatuses: ['VALIDATED', 'IN_PROGRESS'],
  },
  VALIDATED: {
    label: 'Valide',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    icon: 'CheckCircle2',
    nextStatuses: ['CLOSED'],
  },
  CLOSED: {
    label: 'Cloture',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
    icon: 'Archive',
    nextStatuses: [],
  },
  REJECTED: {
    label: 'Rejete',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    icon: 'XCircle',
    nextStatuses: ['NEW'],
  },
  EXPIRED: {
    label: 'Expire',
    color: 'text-neutral-500 bg-neutral-100 dark:text-neutral-500 dark:bg-neutral-800',
    icon: 'Clock',
    nextStatuses: [],
  },
};

export const SAV_SEVERITY_CONFIG: Record<SAVSeverity, { label: string; color: string; priority: number }> = {
  MINOR: {
    label: 'Mineur',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    priority: 1,
  },
  MAJOR: {
    label: 'Majeur',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    priority: 2,
  },
  CRITICAL: {
    label: 'Critique',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    priority: 3,
  },
  BLOCKING: {
    label: 'Bloquant',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    priority: 4,
  },
};

export const SAV_CATEGORY_CONFIG: Record<SAVCategory, { label: string; icon: string }> = {
  PLUMBING: { label: 'Plomberie', icon: 'Droplets' },
  ELECTRICAL: { label: 'Electricite', icon: 'Zap' },
  HVAC: { label: 'Chauffage/Ventilation', icon: 'Thermometer' },
  CARPENTRY: { label: 'Menuiserie', icon: 'DoorOpen' },
  PAINTING: { label: 'Peinture', icon: 'Paintbrush' },
  FLOORING: { label: 'Sol', icon: 'Square' },
  FACADE: { label: 'Facade', icon: 'Building2' },
  ROOF: { label: 'Toiture', icon: 'Home' },
  OTHER: { label: 'Autre', icon: 'MoreHorizontal' },
};

// ============================================================================
// Hook: useSAVManagement
// ============================================================================

export function useSAVManagement(projectId: string) {
  const [tickets, setTickets] = useState<SAVTicket[]>([]);
  const [summary, setSummary] = useState<SAVSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('sav_tickets')
        .select(`
          *,
          lot:lot_id(lot_number),
          buyer:buyer_id(id, first_name, last_name, email, phone),
          assigned_company:assigned_to_company_id(id, name),
          assigned_user:assigned_to_user_id(id, first_name, last_name),
          reported_by:reported_by_id(first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const ticketsData = (data || []).map((t: any) => ({
        ...t,
        lot: t.lot || undefined,
        buyer: t.buyer || undefined,
        assigned_company: t.assigned_company || undefined,
        assigned_user: t.assigned_user || undefined,
        reported_by: t.reported_by || undefined,
      }));

      setTickets(ticketsData);

      // Calculate summary
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const closedTickets = ticketsData.filter((t: SAVTicket) => t.status === 'CLOSED' && t.closed_at);
      const avgDays = closedTickets.length > 0
        ? closedTickets.reduce((sum: number, t: SAVTicket) => {
            const created = new Date(t.created_at);
            const closed = new Date(t.closed_at!);
            return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / closedTickets.length
        : 0;

      const calculatedSummary: SAVSummary = {
        total: ticketsData.length,
        new: ticketsData.filter((t: SAVTicket) => t.status === 'NEW').length,
        assigned: ticketsData.filter((t: SAVTicket) => t.status === 'ASSIGNED').length,
        inProgress: ticketsData.filter((t: SAVTicket) => t.status === 'IN_PROGRESS').length,
        fixed: ticketsData.filter((t: SAVTicket) => t.status === 'FIXED').length,
        validated: ticketsData.filter((t: SAVTicket) => t.status === 'VALIDATED').length,
        closed: ticketsData.filter((t: SAVTicket) => t.status === 'CLOSED').length,
        rejected: ticketsData.filter((t: SAVTicket) => t.status === 'REJECTED').length,
        expired: ticketsData.filter((t: SAVTicket) => t.status === 'EXPIRED').length,
        bySeverity: {
          minor: ticketsData.filter((t: SAVTicket) => t.severity === 'MINOR').length,
          major: ticketsData.filter((t: SAVTicket) => t.severity === 'MAJOR').length,
          critical: ticketsData.filter((t: SAVTicket) => t.severity === 'CRITICAL').length,
          blocking: ticketsData.filter((t: SAVTicket) => t.severity === 'BLOCKING').length,
        },
        avgResolutionDays: Math.round(avgDays),
        overdueCount: ticketsData.filter((t: SAVTicket) =>
          t.due_date && new Date(t.due_date) < now && !['CLOSED', 'REJECTED', 'EXPIRED'].includes(t.status)
        ).length,
        thisWeekCreated: ticketsData.filter((t: SAVTicket) => new Date(t.created_at) > weekAgo).length,
        thisWeekClosed: ticketsData.filter((t: SAVTicket) =>
          t.closed_at && new Date(t.closed_at) > weekAgo
        ).length,
      };

      setSummary(calculatedSummary);
    } catch (err) {
      console.error('Error loading SAV tickets:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  /**
   * Create a new ticket
   */
  const createTicket = useCallback(
    async (data: CreateTicketData) => {
      try {
        // Get organization ID from project
        const { data: project } = await supabase
          .from('projects')
          .select('organization_id')
          .eq('id', data.projectId)
          .single();

        const { data: newTicket, error: insertError } = await supabase
          .from('sav_tickets')
          .insert({
            organization_id: project?.organization_id,
            project_id: data.projectId,
            lot_id: data.lotId || null,
            buyer_id: data.buyerId || null,
            title: data.title,
            description: data.description || null,
            location: data.location || null,
            category: data.category || null,
            status: 'NEW',
            severity: data.severity,
            warranty_type: data.warrantyType || null,
            due_date: data.dueDate?.toISOString() || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadTickets();
        return newTicket;
      } catch (err) {
        console.error('Error creating ticket:', err);
        throw err;
      }
    },
    [loadTickets]
  );

  /**
   * Update a ticket
   */
  const updateTicket = useCallback(
    async (ticketId: string, data: UpdateTicketData) => {
      try {
        const updateData: any = { updated_at: new Date().toISOString() };

        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.location !== undefined) updateData.location = data.location;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.severity !== undefined) updateData.severity = data.severity;
        if (data.dueDate !== undefined) updateData.due_date = data.dueDate?.toISOString() || null;
        if (data.internalNotes !== undefined) updateData.internal_notes = data.internalNotes;

        const { error: updateError } = await supabase
          .from('sav_tickets')
          .update(updateData)
          .eq('id', ticketId);

        if (updateError) throw updateError;

        await loadTickets();
      } catch (err) {
        console.error('Error updating ticket:', err);
        throw err;
      }
    },
    [loadTickets]
  );

  /**
   * Update ticket status
   */
  const updateStatus = useCallback(
    async (ticketId: string, newStatus: SAVStatus) => {
      try {
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };

        // Set timestamps based on status
        if (newStatus === 'FIXED') {
          updateData.fixed_at = new Date().toISOString();
        } else if (newStatus === 'VALIDATED') {
          updateData.validated_at = new Date().toISOString();
        } else if (newStatus === 'CLOSED') {
          updateData.closed_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('sav_tickets')
          .update(updateData)
          .eq('id', ticketId);

        if (updateError) throw updateError;

        await loadTickets();
      } catch (err) {
        console.error('Error updating status:', err);
        throw err;
      }
    },
    [loadTickets]
  );

  /**
   * Assign ticket to company/user
   */
  const assignTicket = useCallback(
    async (ticketId: string, companyId: string, userId?: string) => {
      try {
        const { error: updateError } = await supabase
          .from('sav_tickets')
          .update({
            assigned_to_company_id: companyId,
            assigned_to_user_id: userId || null,
            status: 'ASSIGNED',
            updated_at: new Date().toISOString(),
          })
          .eq('id', ticketId);

        if (updateError) throw updateError;

        await loadTickets();
      } catch (err) {
        console.error('Error assigning ticket:', err);
        throw err;
      }
    },
    [loadTickets]
  );

  /**
   * Delete a ticket
   */
  const deleteTicket = useCallback(
    async (ticketId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('sav_tickets')
          .delete()
          .eq('id', ticketId);

        if (deleteError) throw deleteError;

        await loadTickets();
      } catch (err) {
        console.error('Error deleting ticket:', err);
        throw err;
      }
    },
    [loadTickets]
  );

  // Filter helpers
  const getOpenTickets = useCallback(() => {
    return tickets.filter((t) => !['CLOSED', 'REJECTED', 'EXPIRED'].includes(t.status));
  }, [tickets]);

  const getUrgentTickets = useCallback(() => {
    return tickets.filter(
      (t) =>
        (t.severity === 'CRITICAL' || t.severity === 'BLOCKING') &&
        !['CLOSED', 'REJECTED', 'EXPIRED'].includes(t.status)
    );
  }, [tickets]);

  const getOverdueTickets = useCallback(() => {
    const now = new Date();
    return tickets.filter(
      (t) =>
        t.due_date &&
        new Date(t.due_date) < now &&
        !['CLOSED', 'REJECTED', 'EXPIRED'].includes(t.status)
    );
  }, [tickets]);

  const getTicketsByStatus = useCallback(
    (status: SAVStatus) => {
      return tickets.filter((t) => t.status === status);
    },
    [tickets]
  );

  const getTicketsByBuyer = useCallback(
    (buyerId: string) => {
      return tickets.filter((t) => t.buyer_id === buyerId);
    },
    [tickets]
  );

  return {
    tickets,
    summary,
    loading,
    error,
    refresh: loadTickets,
    createTicket,
    updateTicket,
    updateStatus,
    assignTicket,
    deleteTicket,
    getOpenTickets,
    getUrgentTickets,
    getOverdueTickets,
    getTicketsByStatus,
    getTicketsByBuyer,
  };
}

// ============================================================================
// Hook: useSAVTicketDetail
// ============================================================================

export function useSAVTicketDetail(ticketId: string | undefined) {
  const [ticket, setTicket] = useState<SAVTicket | null>(null);
  const [messages, setMessages] = useState<SAVMessage[]>([]);
  const [attachments, setAttachments] = useState<SAVAttachment[]>([]);
  const [history, setHistory] = useState<SAVHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTicketDetail = useCallback(async () => {
    if (!ticketId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('sav_tickets')
        .select(`
          *,
          lot:lot_id(lot_number),
          buyer:buyer_id(id, first_name, last_name, email, phone),
          assigned_company:assigned_to_company_id(id, name),
          assigned_user:assigned_to_user_id(id, first_name, last_name),
          reported_by:reported_by_id(first_name, last_name)
        `)
        .eq('id', ticketId)
        .single();

      if (ticketError) throw ticketError;
      setTicket(ticketData);

      // Load messages
      const { data: messagesData } = await supabase
        .from('sav_messages')
        .select(`
          *,
          author:author_id(first_name, last_name, avatar_url)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);

      // Load attachments
      const { data: attachmentsData } = await supabase
        .from('sav_attachments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });

      setAttachments(attachmentsData || []);

      // Load history
      const { data: historyData } = await supabase
        .from('sav_history')
        .select(`
          *,
          created_by:created_by_id(first_name, last_name)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false })
        .limit(50);

      setHistory(historyData || []);
    } catch (err) {
      console.error('Error loading ticket detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicketDetail();
  }, [loadTicketDetail]);

  /**
   * Add a message to the ticket
   */
  const addMessage = useCallback(
    async (body: string, isInternal: boolean = false) => {
      if (!ticketId) return;

      try {
        const { data: userData } = await supabase.auth.getUser();

        const { error: insertError } = await supabase.from('sav_messages').insert({
          ticket_id: ticketId,
          author_id: userData.user?.id,
          body,
          is_internal: isInternal,
        });

        if (insertError) throw insertError;

        await loadTicketDetail();
      } catch (err) {
        console.error('Error adding message:', err);
        throw err;
      }
    },
    [ticketId, loadTicketDetail]
  );

  /**
   * Upload an attachment
   */
  const uploadAttachment = useCallback(
    async (file: File, messageId?: string) => {
      if (!ticketId) return;

      try {
        const { data: userData } = await supabase.auth.getUser();

        // Upload to storage
        const filePath = `sav/${ticketId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);

        // Create attachment record
        const { error: insertError } = await supabase.from('sav_attachments').insert({
          ticket_id: ticketId,
          message_id: messageId || null,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by_id: userData.user?.id,
        });

        if (insertError) throw insertError;

        await loadTicketDetail();
      } catch (err) {
        console.error('Error uploading attachment:', err);
        throw err;
      }
    },
    [ticketId, loadTicketDetail]
  );

  /**
   * Delete an attachment
   */
  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('sav_attachments')
          .delete()
          .eq('id', attachmentId);

        if (deleteError) throw deleteError;

        await loadTicketDetail();
      } catch (err) {
        console.error('Error deleting attachment:', err);
        throw err;
      }
    },
    [loadTicketDetail]
  );

  return {
    ticket,
    messages,
    attachments,
    history,
    loading,
    error,
    refresh: loadTicketDetail,
    addMessage,
    uploadAttachment,
    deleteAttachment,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get days since creation
 */
export function getDaysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check if ticket is overdue
 */
export function isTicketOverdue(ticket: SAVTicket): boolean {
  if (!ticket.due_date) return false;
  if (['CLOSED', 'REJECTED', 'EXPIRED'].includes(ticket.status)) return false;
  return new Date(ticket.due_date) < new Date();
}

/**
 * Get due date status
 */
export function getDueDateStatus(dueDate: string | null): { label: string; color: string; isOverdue: boolean } {
  if (!dueDate) return { label: 'Non defini', color: 'text-neutral-500', isOverdue: false };

  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}j de retard`, color: 'text-red-600', isOverdue: true };
  } else if (diffDays === 0) {
    return { label: "Aujourd'hui", color: 'text-amber-600', isOverdue: false };
  } else if (diffDays <= 3) {
    return { label: `Dans ${diffDays}j`, color: 'text-amber-600', isOverdue: false };
  } else {
    return { label: `Dans ${diffDays}j`, color: 'text-neutral-600', isOverdue: false };
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
