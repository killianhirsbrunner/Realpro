import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type PipelineStage = 'prospect' | 'qualified' | 'visit' | 'offer' | 'reserved' | 'in_progress' | 'signed';
export type ProspectStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VISIT_SCHEDULED' | 'VISIT_DONE' | 'OFFER_SENT' | 'LOST';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';
export type BuyerStatus = 'ACTIVE' | 'DOCUMENTS_PENDING' | 'READY_FOR_SIGNING' | 'SIGNED' | 'COMPLETED';

export interface PipelineContact {
  id: string;
  type: 'prospect' | 'reservation' | 'buyer';
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  stage: PipelineStage;
  lotId: string | null;
  lotNumber: string | null;
  lotPrice: number | null;
  daysInStage: number;
  lastActivityDate: string | null;
  createdAt: string;
  updatedAt: string;
  source: string | null;
  notes: string | null;
  assignedToId: string | null;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface PipelineStageData {
  stage: PipelineStage;
  label: string;
  contacts: PipelineContact[];
  count: number;
  value: number;
  avgDaysInStage: number;
}

export interface ConversionMetrics {
  prospectToQualified: number;
  qualifiedToVisit: number;
  visitToOffer: number;
  offerToReserved: number;
  reservedToSigned: number;
  overallConversion: number;
  avgSalesCycle: number;
}

export interface PipelineAnalytics {
  totalContacts: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  avgDealValue: number;
  conversionMetrics: ConversionMetrics;
  stageDistribution: Record<PipelineStage, number>;
  sourceDistribution: Record<string, number>;
  lostReasons: Record<string, number>;
  monthlyTrend: {
    month: string;
    newProspects: number;
    conversions: number;
    lostDeals: number;
  }[];
  performanceByAgent: {
    agentId: string;
    agentName: string;
    contacts: number;
    conversions: number;
    conversionRate: number;
    avgDaysToClose: number;
  }[];
}

export interface ActivityLog {
  id: string;
  contactId: string;
  contactType: 'prospect' | 'reservation' | 'buyer';
  activityType: 'call' | 'email' | 'meeting' | 'visit' | 'note' | 'status_change' | 'document';
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface PipelineSummary {
  totalProspects: number;
  totalReservations: number;
  totalBuyers: number;
  signedThisMonth: number;
  lostThisMonth: number;
  pipelineValue: number;
  conversionRate: number;
  avgTimeToClose: number;
  hottestDeals: PipelineContact[];
  stalledDeals: PipelineContact[];
}

// ============================================================================
// Configuration
// ============================================================================

export const STAGE_CONFIG: Record<PipelineStage, {
  label: string;
  color: string;
  probability: number;
  order: number;
}> = {
  prospect: {
    label: 'Prospect',
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    probability: 0.1,
    order: 1,
  },
  qualified: {
    label: 'Qualifie',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    probability: 0.2,
    order: 2,
  },
  visit: {
    label: 'Visite',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    probability: 0.35,
    order: 3,
  },
  offer: {
    label: 'Offre',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    probability: 0.5,
    order: 4,
  },
  reserved: {
    label: 'Reserve',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    probability: 0.75,
    order: 5,
  },
  in_progress: {
    label: 'En cours',
    color: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
    probability: 0.9,
    order: 6,
  },
  signed: {
    label: 'Signe',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    probability: 1.0,
    order: 7,
  },
};

export const PROSPECT_STATUS_TO_STAGE: Record<ProspectStatus, PipelineStage> = {
  NEW: 'prospect',
  CONTACTED: 'prospect',
  QUALIFIED: 'qualified',
  VISIT_SCHEDULED: 'visit',
  VISIT_DONE: 'visit',
  OFFER_SENT: 'offer',
  LOST: 'prospect',
};

export const ACTIVITY_TYPE_CONFIG: Record<string, {
  label: string;
  icon: string;
  color: string;
}> = {
  call: { label: 'Appel', icon: 'Phone', color: 'text-blue-600' },
  email: { label: 'Email', icon: 'Mail', color: 'text-purple-600' },
  meeting: { label: 'Reunion', icon: 'Users', color: 'text-green-600' },
  visit: { label: 'Visite', icon: 'Home', color: 'text-amber-600' },
  note: { label: 'Note', icon: 'FileText', color: 'text-gray-600' },
  status_change: { label: 'Changement', icon: 'ArrowRight', color: 'text-cyan-600' },
  document: { label: 'Document', icon: 'File', color: 'text-red-600' },
};

// ============================================================================
// Hook: useCRMPipelineManagement
// ============================================================================

export function useCRMPipelineManagement(projectId: string) {
  const [contacts, setContacts] = useState<PipelineContact[]>([]);
  const [analytics, setAnalytics] = useState<PipelineAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPipeline = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [prospectsResult, reservationsResult, buyersResult, lotsResult] = await Promise.all([
        supabase
          .from('prospects')
          .select(`
            *,
            assigned_to:assigned_to_id(id, first_name, last_name)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false }),

        supabase
          .from('reservations')
          .select(`
            *,
            lot:lot_id(id, lot_number, price_chf)
          `)
          .eq('project_id', projectId)
          .order('reserved_at', { ascending: false }),

        supabase
          .from('buyers')
          .select(`
            *,
            lot:lot_id(id, lot_number, price_chf),
            assigned_to:assigned_to_id(id, first_name, last_name)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false }),

        supabase
          .from('lots')
          .select('id, lot_number, price_chf')
          .eq('project_id', projectId),
      ]);

      if (prospectsResult.error) throw prospectsResult.error;
      if (reservationsResult.error) throw reservationsResult.error;
      if (buyersResult.error) throw buyersResult.error;

      const now = new Date();

      // Map prospects to pipeline contacts
      const prospectContacts: PipelineContact[] = (prospectsResult.data || [])
        .filter((p: any) => p.status !== 'LOST')
        .map((p: any) => ({
          id: p.id,
          type: 'prospect' as const,
          firstName: p.first_name,
          lastName: p.last_name,
          fullName: `${p.first_name} ${p.last_name}`,
          email: p.email,
          phone: p.phone || null,
          status: p.status,
          stage: PROSPECT_STATUS_TO_STAGE[p.status as ProspectStatus] || 'prospect',
          lotId: null,
          lotNumber: null,
          lotPrice: null,
          daysInStage: Math.floor((now.getTime() - new Date(p.updated_at || p.created_at).getTime()) / (1000 * 60 * 60 * 24)),
          lastActivityDate: p.last_contact_at || null,
          createdAt: p.created_at,
          updatedAt: p.updated_at || p.created_at,
          source: p.source || null,
          notes: p.notes || null,
          assignedToId: p.assigned_to_id || null,
          assignedTo: p.assigned_to ? {
            id: p.assigned_to.id,
            firstName: p.assigned_to.first_name,
            lastName: p.assigned_to.last_name,
          } : null,
        }));

      // Map reservations to pipeline contacts
      const reservationContacts: PipelineContact[] = (reservationsResult.data || [])
        .filter((r: any) => r.status !== 'CANCELLED' && r.status !== 'EXPIRED')
        .map((r: any) => ({
          id: r.id,
          type: 'reservation' as const,
          firstName: r.buyer_first_name,
          lastName: r.buyer_last_name,
          fullName: `${r.buyer_first_name} ${r.buyer_last_name}`,
          email: r.buyer_email,
          phone: r.buyer_phone || null,
          status: r.status,
          stage: 'reserved' as PipelineStage,
          lotId: r.lot_id,
          lotNumber: r.lot?.lot_number || null,
          lotPrice: r.lot?.price_chf || null,
          daysInStage: Math.floor((now.getTime() - new Date(r.reserved_at).getTime()) / (1000 * 60 * 60 * 24)),
          lastActivityDate: r.updated_at || null,
          createdAt: r.reserved_at,
          updatedAt: r.updated_at || r.reserved_at,
          source: null,
          notes: r.notes || null,
          assignedToId: null,
          assignedTo: null,
        }));

      // Map buyers to pipeline contacts
      const buyerContacts: PipelineContact[] = (buyersResult.data || []).map((b: any) => {
        let stage: PipelineStage = 'in_progress';
        if (b.status === 'SIGNED' || b.status === 'COMPLETED') {
          stage = 'signed';
        }

        return {
          id: b.id,
          type: 'buyer' as const,
          firstName: b.first_name,
          lastName: b.last_name,
          fullName: `${b.first_name} ${b.last_name}`,
          email: b.email,
          phone: b.phone || null,
          status: b.status,
          stage,
          lotId: b.lot_id,
          lotNumber: b.lot?.lot_number || null,
          lotPrice: b.lot?.price_chf || null,
          daysInStage: Math.floor((now.getTime() - new Date(b.updated_at || b.created_at).getTime()) / (1000 * 60 * 60 * 24)),
          lastActivityDate: b.updated_at || null,
          createdAt: b.created_at,
          updatedAt: b.updated_at || b.created_at,
          source: null,
          notes: b.notes || null,
          assignedToId: b.assigned_to_id || null,
          assignedTo: b.assigned_to ? {
            id: b.assigned_to.id,
            firstName: b.assigned_to.first_name,
            lastName: b.assigned_to.last_name,
          } : null,
        };
      });

      const allContacts = [...prospectContacts, ...reservationContacts, ...buyerContacts];
      setContacts(allContacts);

      // Calculate analytics
      const calculatedAnalytics = calculateAnalytics(allContacts, prospectsResult.data || []);
      setAnalytics(calculatedAnalytics);

    } catch (err) {
      console.error('Error loading CRM pipeline:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  // ============================================================================
  // Analytics Calculation
  // ============================================================================

  function calculateAnalytics(allContacts: PipelineContact[], rawProspects: any[]): PipelineAnalytics {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Stage distribution
    const stageDistribution: Record<PipelineStage, number> = {
      prospect: 0,
      qualified: 0,
      visit: 0,
      offer: 0,
      reserved: 0,
      in_progress: 0,
      signed: 0,
    };
    allContacts.forEach((c) => {
      stageDistribution[c.stage]++;
    });

    // Source distribution
    const sourceDistribution: Record<string, number> = {};
    allContacts.forEach((c) => {
      const source = c.source || 'Non defini';
      sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
    });

    // Lost reasons
    const lostReasons: Record<string, number> = {};
    const lostProspects = rawProspects.filter((p: any) => p.status === 'LOST');
    lostProspects.forEach((p: any) => {
      const reason = p.lost_reason || 'Non specifie';
      lostReasons[reason] = (lostReasons[reason] || 0) + 1;
    });

    // Pipeline value calculation
    const activeContacts = allContacts.filter((c) => c.stage !== 'signed');
    const totalPipelineValue = activeContacts.reduce((sum, c) => sum + (c.lotPrice || 0), 0);
    const weightedPipelineValue = activeContacts.reduce((sum, c) => {
      const probability = STAGE_CONFIG[c.stage].probability;
      return sum + (c.lotPrice || 0) * probability;
    }, 0);

    const signedContacts = allContacts.filter((c) => c.stage === 'signed');
    const avgDealValue = signedContacts.length > 0
      ? signedContacts.reduce((sum, c) => sum + (c.lotPrice || 0), 0) / signedContacts.length
      : 0;

    // Conversion metrics (simplified)
    const prospectCount = stageDistribution.prospect + stageDistribution.qualified + stageDistribution.visit + stageDistribution.offer;
    const signedCount = signedContacts.length;
    const overallConversion = prospectCount > 0 ? (signedCount / (prospectCount + signedCount)) * 100 : 0;

    // Avg sales cycle (days from prospect to signed)
    const signedWithDates = signedContacts.filter((c) => c.createdAt);
    const avgSalesCycle = signedWithDates.length > 0
      ? signedWithDates.reduce((sum, c) => {
          const days = Math.floor((now.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / signedWithDates.length
      : 0;

    // Monthly trend (last 3 months)
    const monthlyTrend: PipelineAnalytics['monthlyTrend'] = [];
    for (let i = 2; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthLabel = monthDate.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' });

      const newProspects = allContacts.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= monthDate && created <= monthEnd && c.type === 'prospect';
      }).length;

      const conversions = allContacts.filter((c) => {
        const updated = new Date(c.updatedAt);
        return updated >= monthDate && updated <= monthEnd && c.stage === 'signed';
      }).length;

      const lostDeals = lostProspects.filter((p: any) => {
        const updated = new Date(p.updated_at || p.created_at);
        return updated >= monthDate && updated <= monthEnd;
      }).length;

      monthlyTrend.push({ month: monthLabel, newProspects, conversions, lostDeals });
    }

    // Performance by agent (simplified)
    const agentMap = new Map<string, { name: string; contacts: number; signed: number; totalDays: number }>();
    allContacts.forEach((c) => {
      if (c.assignedToId && c.assignedTo) {
        const agentId = c.assignedToId;
        const existing = agentMap.get(agentId) || {
          name: `${c.assignedTo.firstName} ${c.assignedTo.lastName}`,
          contacts: 0,
          signed: 0,
          totalDays: 0,
        };
        existing.contacts++;
        if (c.stage === 'signed') {
          existing.signed++;
          existing.totalDays += c.daysInStage;
        }
        agentMap.set(agentId, existing);
      }
    });

    const performanceByAgent = Array.from(agentMap.entries()).map(([agentId, data]) => ({
      agentId,
      agentName: data.name,
      contacts: data.contacts,
      conversions: data.signed,
      conversionRate: data.contacts > 0 ? (data.signed / data.contacts) * 100 : 0,
      avgDaysToClose: data.signed > 0 ? data.totalDays / data.signed : 0,
    }));

    return {
      totalContacts: allContacts.length,
      totalPipelineValue,
      weightedPipelineValue,
      avgDealValue,
      conversionMetrics: {
        prospectToQualified: 0, // Would need historical data
        qualifiedToVisit: 0,
        visitToOffer: 0,
        offerToReserved: 0,
        reservedToSigned: 0,
        overallConversion,
        avgSalesCycle,
      },
      stageDistribution,
      sourceDistribution,
      lostReasons,
      monthlyTrend,
      performanceByAgent,
    };
  }

  // ============================================================================
  // Summary
  // ============================================================================

  const summary = useMemo<PipelineSummary | null>(() => {
    if (!analytics) return null;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const prospects = contacts.filter((c) => c.type === 'prospect');
    const reservations = contacts.filter((c) => c.type === 'reservation');
    const buyers = contacts.filter((c) => c.type === 'buyer');

    const signedThisMonth = contacts.filter((c) =>
      c.stage === 'signed' && new Date(c.updatedAt) >= monthStart
    ).length;

    // Hottest deals: high value, recent activity
    const hottestDeals = contacts
      .filter((c) => c.stage !== 'signed' && c.lotPrice)
      .sort((a, b) => (b.lotPrice || 0) - (a.lotPrice || 0))
      .slice(0, 5);

    // Stalled deals: more than 14 days in stage, not signed
    const stalledDeals = contacts
      .filter((c) => c.stage !== 'signed' && c.daysInStage > 14)
      .sort((a, b) => b.daysInStage - a.daysInStage)
      .slice(0, 5);

    return {
      totalProspects: prospects.length,
      totalReservations: reservations.length,
      totalBuyers: buyers.length,
      signedThisMonth,
      lostThisMonth: 0, // Would need historical data
      pipelineValue: analytics.totalPipelineValue,
      conversionRate: analytics.conversionMetrics.overallConversion,
      avgTimeToClose: analytics.conversionMetrics.avgSalesCycle,
      hottestDeals,
      stalledDeals,
    };
  }, [contacts, analytics]);

  // ============================================================================
  // Stage Data for Kanban
  // ============================================================================

  const stageData = useMemo<PipelineStageData[]>(() => {
    const stages: PipelineStage[] = ['prospect', 'qualified', 'visit', 'offer', 'reserved', 'in_progress', 'signed'];

    return stages.map((stage) => {
      const stageContacts = contacts.filter((c) => c.stage === stage);
      const value = stageContacts.reduce((sum, c) => sum + (c.lotPrice || 0), 0);
      const avgDays = stageContacts.length > 0
        ? stageContacts.reduce((sum, c) => sum + c.daysInStage, 0) / stageContacts.length
        : 0;

      return {
        stage,
        label: STAGE_CONFIG[stage].label,
        contacts: stageContacts,
        count: stageContacts.length,
        value,
        avgDaysInStage: Math.round(avgDays),
      };
    });
  }, [contacts]);

  // ============================================================================
  // Actions
  // ============================================================================

  const updateProspectStatus = useCallback(
    async (prospectId: string, newStatus: ProspectStatus) => {
      try {
        const { error: updateError } = await supabase
          .from('prospects')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', prospectId);

        if (updateError) throw updateError;
        await loadPipeline();
      } catch (err) {
        console.error('Error updating prospect status:', err);
        throw err;
      }
    },
    [loadPipeline]
  );

  const updateReservationStatus = useCallback(
    async (reservationId: string, newStatus: ReservationStatus) => {
      try {
        const { error: updateError } = await supabase
          .from('reservations')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reservationId);

        if (updateError) throw updateError;
        await loadPipeline();
      } catch (err) {
        console.error('Error updating reservation status:', err);
        throw err;
      }
    },
    [loadPipeline]
  );

  const markProspectAsLost = useCallback(
    async (prospectId: string, reason: string) => {
      try {
        const { error: updateError } = await supabase
          .from('prospects')
          .update({
            status: 'LOST',
            lost_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq('id', prospectId);

        if (updateError) throw updateError;
        await loadPipeline();
      } catch (err) {
        console.error('Error marking prospect as lost:', err);
        throw err;
      }
    },
    [loadPipeline]
  );

  const assignContact = useCallback(
    async (contactId: string, contactType: 'prospect' | 'buyer', assigneeId: string) => {
      try {
        const table = contactType === 'prospect' ? 'prospects' : 'buyers';
        const { error: updateError } = await supabase
          .from(table)
          .update({
            assigned_to_id: assigneeId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contactId);

        if (updateError) throw updateError;
        await loadPipeline();
      } catch (err) {
        console.error('Error assigning contact:', err);
        throw err;
      }
    },
    [loadPipeline]
  );

  const logActivity = useCallback(
    async (
      contactId: string,
      contactType: 'prospect' | 'reservation' | 'buyer',
      activityType: string,
      description: string
    ) => {
      try {
        // Update last contact date
        if (contactType === 'prospect') {
          await supabase
            .from('prospects')
            .update({
              last_contact_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);
        }

        // Note: Would need an activities table to properly store this
        await loadPipeline();
      } catch (err) {
        console.error('Error logging activity:', err);
        throw err;
      }
    },
    [loadPipeline]
  );

  // ============================================================================
  // Filter Helpers
  // ============================================================================

  const getContactsByStage = useCallback(
    (stage: PipelineStage) => contacts.filter((c) => c.stage === stage),
    [contacts]
  );

  const getContactsByType = useCallback(
    (type: 'prospect' | 'reservation' | 'buyer') => contacts.filter((c) => c.type === type),
    [contacts]
  );

  const getContactsByAgent = useCallback(
    (agentId: string) => contacts.filter((c) => c.assignedToId === agentId),
    [contacts]
  );

  const getStalledContacts = useCallback(
    (daysThreshold: number = 14) => contacts.filter(
      (c) => c.stage !== 'signed' && c.daysInStage > daysThreshold
    ),
    [contacts]
  );

  const getHotDeals = useCallback(
    (limit: number = 10) =>
      contacts
        .filter((c) => c.stage !== 'signed' && c.lotPrice)
        .sort((a, b) => (b.lotPrice || 0) - (a.lotPrice || 0))
        .slice(0, limit),
    [contacts]
  );

  return {
    contacts,
    stageData,
    analytics,
    summary,
    loading,
    error,
    refresh: loadPipeline,
    // Actions
    updateProspectStatus,
    updateReservationStatus,
    markProspectAsLost,
    assignContact,
    logActivity,
    // Filters
    getContactsByStage,
    getContactsByType,
    getContactsByAgent,
    getStalledContacts,
    getHotDeals,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatCHF(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStageProgress(stage: PipelineStage): number {
  const order = STAGE_CONFIG[stage].order;
  return Math.round((order / 7) * 100);
}

export function getContactUrgency(contact: PipelineContact): {
  level: 'normal' | 'attention' | 'urgent' | 'critical';
  label: string;
  color: string;
} {
  if (contact.stage === 'signed') {
    return { level: 'normal', label: '', color: '' };
  }

  if (contact.daysInStage > 30) {
    return { level: 'critical', label: 'Tres en retard', color: 'text-red-600 bg-red-100' };
  }
  if (contact.daysInStage > 14) {
    return { level: 'urgent', label: 'En retard', color: 'text-orange-600 bg-orange-100' };
  }
  if (contact.daysInStage > 7) {
    return { level: 'attention', label: 'A suivre', color: 'text-amber-600 bg-amber-100' };
  }
  return { level: 'normal', label: '', color: '' };
}

export function calculatePipelineForecast(stageData: PipelineStageData[]): {
  pessimistic: number;
  realistic: number;
  optimistic: number;
} {
  let pessimistic = 0;
  let realistic = 0;
  let optimistic = 0;

  stageData.forEach((stage) => {
    const config = STAGE_CONFIG[stage.stage];
    pessimistic += stage.value * (config.probability * 0.7);
    realistic += stage.value * config.probability;
    optimistic += stage.value * Math.min(config.probability * 1.3, 1);
  });

  return {
    pessimistic: Math.round(pessimistic),
    realistic: Math.round(realistic),
    optimistic: Math.round(optimistic),
  };
}
