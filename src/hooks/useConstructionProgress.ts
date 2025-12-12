import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type ConstructionPhase =
  | 'PREPARATION'
  | 'GROS_OEUVRE'
  | 'HORS_EAU'
  | 'HORS_AIR'
  | 'SECOND_OEUVRE'
  | 'FINITIONS'
  | 'RECEPTION'
  | 'LIVRAISON';

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface ConstructionMilestone {
  id: string;
  phase: ConstructionPhase;
  name: string;
  description: string;
  plannedDate: string | null;
  actualDate: string | null;
  status: MilestoneStatus;
  order: number;
}

export interface LotProgress {
  lotId: string;
  lotNumber: string;
  lotType: string;
  floor: string | null;
  buyerId: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  // Progress percentages
  globalProgress: number;
  grosOeuvreProgress: number;
  horsEauProgress: number;
  horsAirProgress: number;
  secondOeuvreProgress: number;
  finitionsProgress: number;
  // Phase info
  currentPhase: ConstructionPhase;
  currentMilestone: string | null;
  // Dates
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  estimatedEndDate: string | null;
  // Status
  daysAheadOrBehind: number;
  isOnTrack: boolean;
  isDelayed: boolean;
  lastUpdateDate: string;
  notes: string | null;
  // History
  progressHistory: ProgressSnapshot[];
}

export interface ProgressSnapshot {
  id: string;
  date: string;
  globalProgress: number;
  phase: ConstructionPhase;
  notes: string | null;
}

export interface ConstructionSummary {
  totalLots: number;
  lotsWithProgress: number;
  avgGlobalProgress: number;
  avgPhaseProgress: Record<ConstructionPhase, number>;
  lotsOnTrack: number;
  lotsDelayed: number;
  lotsCompleted: number;
  phaseDistribution: Record<ConstructionPhase, number>;
  progressThisMonth: number;
  estimatedCompletionDate: string | null;
  criticalDelays: LotProgress[];
}

export interface UpdateProgressData {
  globalProgress?: number;
  grosOeuvreProgress?: number;
  horsEauProgress?: number;
  horsAirProgress?: number;
  secondOeuvreProgress?: number;
  finitionsProgress?: number;
  currentPhase?: ConstructionPhase;
  currentMilestone?: string;
  notes?: string;
}

export interface BatchUpdateData {
  lotIds: string[];
  updates: UpdateProgressData;
}

// ============================================================================
// Configuration
// ============================================================================

export const PHASE_CONFIG: Record<ConstructionPhase, {
  label: string;
  description: string;
  color: string;
  order: number;
  typicalDurationDays: number;
}> = {
  PREPARATION: {
    label: 'Preparation',
    description: 'Terrassement, fondations',
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    order: 1,
    typicalDurationDays: 30,
  },
  GROS_OEUVRE: {
    label: 'Gros oeuvre',
    description: 'Structure, murs porteurs, dalles',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    order: 2,
    typicalDurationDays: 90,
  },
  HORS_EAU: {
    label: 'Hors d\'eau',
    description: 'Toiture, etancheite',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    order: 3,
    typicalDurationDays: 30,
  },
  HORS_AIR: {
    label: 'Hors d\'air',
    description: 'Fenetres, portes exterieures',
    color: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
    order: 4,
    typicalDurationDays: 21,
  },
  SECOND_OEUVRE: {
    label: 'Second oeuvre',
    description: 'Electricite, plomberie, chauffage',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    order: 5,
    typicalDurationDays: 60,
  },
  FINITIONS: {
    label: 'Finitions',
    description: 'Peinture, sols, equipements',
    color: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30',
    order: 6,
    typicalDurationDays: 45,
  },
  RECEPTION: {
    label: 'Reception',
    description: 'Controle qualite, reserve',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    order: 7,
    typicalDurationDays: 14,
  },
  LIVRAISON: {
    label: 'Livraison',
    description: 'Remise des cles',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    order: 8,
    typicalDurationDays: 7,
  },
};

export const DEFAULT_MILESTONES: Omit<ConstructionMilestone, 'id' | 'plannedDate' | 'actualDate' | 'status'>[] = [
  { phase: 'PREPARATION', name: 'Terrassement termine', description: 'Excavation et preparation du terrain', order: 1 },
  { phase: 'PREPARATION', name: 'Fondations coulees', description: 'Beton des fondations', order: 2 },
  { phase: 'GROS_OEUVRE', name: 'Dalle RDC coulee', description: 'Dalle du rez-de-chaussee', order: 3 },
  { phase: 'GROS_OEUVRE', name: 'Murs porteurs montes', description: 'Structure verticale', order: 4 },
  { phase: 'GROS_OEUVRE', name: 'Dalle etage coulee', description: 'Dalle de l\'etage', order: 5 },
  { phase: 'HORS_EAU', name: 'Charpente posee', description: 'Structure de toiture', order: 6 },
  { phase: 'HORS_EAU', name: 'Couverture terminee', description: 'Toiture etanche', order: 7 },
  { phase: 'HORS_AIR', name: 'Menuiseries exterieures', description: 'Fenetres et portes', order: 8 },
  { phase: 'SECOND_OEUVRE', name: 'Electricite tiree', description: 'Cables et gaines', order: 9 },
  { phase: 'SECOND_OEUVRE', name: 'Plomberie posee', description: 'Tuyauterie', order: 10 },
  { phase: 'SECOND_OEUVRE', name: 'Chauffage installe', description: 'Radiateurs ou plancher chauffant', order: 11 },
  { phase: 'FINITIONS', name: 'Peinture terminee', description: 'Murs et plafonds', order: 12 },
  { phase: 'FINITIONS', name: 'Sols poses', description: 'Parquet, carrelage', order: 13 },
  { phase: 'FINITIONS', name: 'Cuisine equipee', description: 'Meubles et electromenager', order: 14 },
  { phase: 'RECEPTION', name: 'Pre-reception effectuee', description: 'Controle avant livraison', order: 15 },
  { phase: 'LIVRAISON', name: 'Cles remises', description: 'Livraison finale', order: 16 },
];

// ============================================================================
// Hook: useConstructionProgress
// ============================================================================

export function useConstructionProgress(projectId: string) {
  const [lots, setLots] = useState<LotProgress[]>([]);
  const [summary, setSummary] = useState<ConstructionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch lots with buyers
      const { data: lotsData, error: lotsError } = await supabase
        .from('lots')
        .select(`
          id,
          lot_number,
          type,
          floor,
          status,
          buyer:buyers(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('project_id', projectId)
        .in('status', ['sold', 'reserved', 'available'])
        .order('lot_number');

      if (lotsError) throw lotsError;

      const lotIds = (lotsData || []).map((l: any) => l.id);

      // Fetch progress snapshots
      let snapshotsData: any[] = [];
      if (lotIds.length > 0) {
        const { data, error: snapshotsError } = await supabase
          .from('buyer_progress_snapshots')
          .select('*')
          .in('lot_id', lotIds)
          .order('snapshot_date', { ascending: false });

        if (snapshotsError) throw snapshotsError;
        snapshotsData = data || [];
      }

      // Group snapshots by lot
      const snapshotsByLot = new Map<string, any[]>();
      snapshotsData.forEach((s: any) => {
        const existing = snapshotsByLot.get(s.lot_id) || [];
        existing.push(s);
        snapshotsByLot.set(s.lot_id, existing);
      });

      const now = new Date();

      // Map lots to progress objects
      const lotProgressList: LotProgress[] = (lotsData || []).map((lot: any) => {
        const snapshots = snapshotsByLot.get(lot.id) || [];
        const latestSnapshot = snapshots[0];
        const buyer = lot.buyer?.[0];

        // Determine current phase from progress
        let currentPhase: ConstructionPhase = 'PREPARATION';
        if (latestSnapshot) {
          if (latestSnapshot.finitions_progress >= 100) {
            currentPhase = 'LIVRAISON';
          } else if (latestSnapshot.finitions_progress > 0) {
            currentPhase = 'FINITIONS';
          } else if (latestSnapshot.second_oeuvre_progress > 0) {
            currentPhase = 'SECOND_OEUVRE';
          } else if (latestSnapshot.gros_oeuvre_progress >= 100) {
            currentPhase = 'HORS_AIR';
          } else if (latestSnapshot.gros_oeuvre_progress > 50) {
            currentPhase = 'HORS_EAU';
          } else if (latestSnapshot.gros_oeuvre_progress > 0) {
            currentPhase = 'GROS_OEUVRE';
          }
        }

        // Calculate if on track (simplified - would need planned dates)
        const globalProgress = latestSnapshot?.global_progress || 0;
        const isDelayed = latestSnapshot?.milestone_reached === 'DELAYED';
        const isOnTrack = !isDelayed && globalProgress > 0;

        // Progress history
        const progressHistory: ProgressSnapshot[] = snapshots.slice(0, 10).map((s: any) => ({
          id: s.id,
          date: s.snapshot_date,
          globalProgress: s.global_progress || 0,
          phase: s.current_phase || 'PREPARATION',
          notes: s.notes,
        }));

        return {
          lotId: lot.id,
          lotNumber: lot.lot_number,
          lotType: lot.type,
          floor: lot.floor,
          buyerId: buyer?.id || null,
          buyerName: buyer ? `${buyer.first_name} ${buyer.last_name}` : null,
          buyerEmail: buyer?.email || null,
          globalProgress,
          grosOeuvreProgress: latestSnapshot?.gros_oeuvre_progress || 0,
          horsEauProgress: 0, // Not in current schema, calculated
          horsAirProgress: 0,
          secondOeuvreProgress: latestSnapshot?.second_oeuvre_progress || 0,
          finitionsProgress: latestSnapshot?.finitions_progress || 0,
          currentPhase,
          currentMilestone: latestSnapshot?.milestone_reached || null,
          plannedStartDate: null,
          plannedEndDate: null,
          actualStartDate: snapshots.length > 0 ? snapshots[snapshots.length - 1].snapshot_date : null,
          estimatedEndDate: null,
          daysAheadOrBehind: 0,
          isOnTrack,
          isDelayed,
          lastUpdateDate: latestSnapshot?.snapshot_date || now.toISOString(),
          notes: latestSnapshot?.notes || null,
          progressHistory,
        };
      });

      setLots(lotProgressList);

      // Calculate summary
      const calculatedSummary = calculateSummary(lotProgressList);
      setSummary(calculatedSummary);

    } catch (err) {
      console.error('Error loading construction progress:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // ============================================================================
  // Summary Calculation
  // ============================================================================

  function calculateSummary(lotList: LotProgress[]): ConstructionSummary {
    const lotsWithProgress = lotList.filter((l) => l.globalProgress > 0);
    const lotsCompleted = lotList.filter((l) => l.globalProgress >= 100);
    const lotsDelayed = lotList.filter((l) => l.isDelayed);
    const lotsOnTrack = lotList.filter((l) => l.isOnTrack && !l.isDelayed);

    const avgGlobalProgress = lotsWithProgress.length > 0
      ? lotsWithProgress.reduce((sum, l) => sum + l.globalProgress, 0) / lotsWithProgress.length
      : 0;

    // Phase distribution
    const phaseDistribution: Record<ConstructionPhase, number> = {
      PREPARATION: 0,
      GROS_OEUVRE: 0,
      HORS_EAU: 0,
      HORS_AIR: 0,
      SECOND_OEUVRE: 0,
      FINITIONS: 0,
      RECEPTION: 0,
      LIVRAISON: 0,
    };
    lotList.forEach((l) => {
      phaseDistribution[l.currentPhase]++;
    });

    // Average phase progress
    const avgPhaseProgress: Record<ConstructionPhase, number> = {
      PREPARATION: 0,
      GROS_OEUVRE: lotsWithProgress.length > 0
        ? lotsWithProgress.reduce((sum, l) => sum + l.grosOeuvreProgress, 0) / lotsWithProgress.length
        : 0,
      HORS_EAU: 0,
      HORS_AIR: 0,
      SECOND_OEUVRE: lotsWithProgress.length > 0
        ? lotsWithProgress.reduce((sum, l) => sum + l.secondOeuvreProgress, 0) / lotsWithProgress.length
        : 0,
      FINITIONS: lotsWithProgress.length > 0
        ? lotsWithProgress.reduce((sum, l) => sum + l.finitionsProgress, 0) / lotsWithProgress.length
        : 0,
      RECEPTION: 0,
      LIVRAISON: 0,
    };

    // Critical delays
    const criticalDelays = lotList
      .filter((l) => l.isDelayed)
      .sort((a, b) => Math.abs(b.daysAheadOrBehind) - Math.abs(a.daysAheadOrBehind))
      .slice(0, 5);

    // Progress this month (would need more data)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalLots: lotList.length,
      lotsWithProgress: lotsWithProgress.length,
      avgGlobalProgress,
      avgPhaseProgress,
      lotsOnTrack: lotsOnTrack.length,
      lotsDelayed: lotsDelayed.length,
      lotsCompleted: lotsCompleted.length,
      phaseDistribution,
      progressThisMonth: 0, // Would need historical comparison
      estimatedCompletionDate: null,
      criticalDelays,
    };
  }

  // ============================================================================
  // Actions
  // ============================================================================

  const updateLotProgress = useCallback(
    async (lotId: string, updates: UpdateProgressData): Promise<void> => {
      try {
        // Map to database column names
        const dbUpdates: any = {
          lot_id: lotId,
          snapshot_date: new Date().toISOString().split('T')[0],
        };

        if (updates.globalProgress !== undefined) dbUpdates.global_progress = updates.globalProgress;
        if (updates.grosOeuvreProgress !== undefined) dbUpdates.gros_oeuvre_progress = updates.grosOeuvreProgress;
        if (updates.secondOeuvreProgress !== undefined) dbUpdates.second_oeuvre_progress = updates.secondOeuvreProgress;
        if (updates.finitionsProgress !== undefined) dbUpdates.finitions_progress = updates.finitionsProgress;
        if (updates.currentPhase !== undefined) dbUpdates.current_phase = updates.currentPhase;
        if (updates.currentMilestone !== undefined) dbUpdates.milestone_reached = updates.currentMilestone;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

        const { error: insertError } = await supabase
          .from('buyer_progress_snapshots')
          .insert(dbUpdates);

        if (insertError) throw insertError;

        await loadProgress();
      } catch (err) {
        console.error('Error updating lot progress:', err);
        throw err;
      }
    },
    [loadProgress]
  );

  const batchUpdateProgress = useCallback(
    async (data: BatchUpdateData): Promise<void> => {
      try {
        const today = new Date().toISOString().split('T')[0];

        const inserts = data.lotIds.map((lotId) => {
          const dbUpdates: any = {
            lot_id: lotId,
            snapshot_date: today,
          };

          if (data.updates.globalProgress !== undefined) dbUpdates.global_progress = data.updates.globalProgress;
          if (data.updates.grosOeuvreProgress !== undefined) dbUpdates.gros_oeuvre_progress = data.updates.grosOeuvreProgress;
          if (data.updates.secondOeuvreProgress !== undefined) dbUpdates.second_oeuvre_progress = data.updates.secondOeuvreProgress;
          if (data.updates.finitionsProgress !== undefined) dbUpdates.finitions_progress = data.updates.finitionsProgress;
          if (data.updates.currentPhase !== undefined) dbUpdates.current_phase = data.updates.currentPhase;
          if (data.updates.currentMilestone !== undefined) dbUpdates.milestone_reached = data.updates.currentMilestone;
          if (data.updates.notes !== undefined) dbUpdates.notes = data.updates.notes;

          return dbUpdates;
        });

        const { error: insertError } = await supabase
          .from('buyer_progress_snapshots')
          .insert(inserts);

        if (insertError) throw insertError;

        await loadProgress();
      } catch (err) {
        console.error('Error batch updating progress:', err);
        throw err;
      }
    },
    [loadProgress]
  );

  // ============================================================================
  // Filter Helpers
  // ============================================================================

  const getByPhase = useCallback(
    (phase: ConstructionPhase) => lots.filter((l) => l.currentPhase === phase),
    [lots]
  );

  const getDelayed = useCallback(
    () => lots.filter((l) => l.isDelayed),
    [lots]
  );

  const getCompleted = useCallback(
    () => lots.filter((l) => l.globalProgress >= 100),
    [lots]
  );

  const getByFloor = useCallback(
    (floor: string) => lots.filter((l) => l.floor === floor),
    [lots]
  );

  const getWithBuyer = useCallback(
    () => lots.filter((l) => l.buyerId !== null),
    [lots]
  );

  const getByProgressRange = useCallback(
    (min: number, max: number) => lots.filter((l) => l.globalProgress >= min && l.globalProgress <= max),
    [lots]
  );

  return {
    lots,
    summary,
    loading,
    error,
    refresh: loadProgress,
    // Actions
    updateLotProgress,
    batchUpdateProgress,
    // Filters
    getByPhase,
    getDelayed,
    getCompleted,
    getByFloor,
    getWithBuyer,
    getByProgressRange,
  };
}

// ============================================================================
// Hook: useLotProgressDetail
// ============================================================================

export function useLotProgressDetail(lotId: string | undefined) {
  const [lot, setLot] = useState<LotProgress | null>(null);
  const [milestones, setMilestones] = useState<ConstructionMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!lotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [lotResult, snapshotsResult] = await Promise.all([
        supabase
          .from('lots')
          .select(`
            id,
            lot_number,
            type,
            floor,
            buyer:buyers(
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', lotId)
          .single(),
        supabase
          .from('buyer_progress_snapshots')
          .select('*')
          .eq('lot_id', lotId)
          .order('snapshot_date', { ascending: false }),
      ]);

      if (lotResult.error) throw lotResult.error;

      const lotData = lotResult.data;
      const snapshots = snapshotsResult.data || [];
      const latestSnapshot = snapshots[0];
      const buyer = lotData.buyer?.[0];

      // Determine current phase
      let currentPhase: ConstructionPhase = 'PREPARATION';
      if (latestSnapshot) {
        if (latestSnapshot.finitions_progress >= 100) {
          currentPhase = 'LIVRAISON';
        } else if (latestSnapshot.finitions_progress > 0) {
          currentPhase = 'FINITIONS';
        } else if (latestSnapshot.second_oeuvre_progress > 0) {
          currentPhase = 'SECOND_OEUVRE';
        } else if (latestSnapshot.gros_oeuvre_progress >= 100) {
          currentPhase = 'HORS_AIR';
        } else if (latestSnapshot.gros_oeuvre_progress > 50) {
          currentPhase = 'HORS_EAU';
        } else if (latestSnapshot.gros_oeuvre_progress > 0) {
          currentPhase = 'GROS_OEUVRE';
        }
      }

      const progressHistory: ProgressSnapshot[] = snapshots.map((s: any) => ({
        id: s.id,
        date: s.snapshot_date,
        globalProgress: s.global_progress || 0,
        phase: s.current_phase || 'PREPARATION',
        notes: s.notes,
      }));

      const lotProgress: LotProgress = {
        lotId: lotData.id,
        lotNumber: lotData.lot_number,
        lotType: lotData.type,
        floor: lotData.floor,
        buyerId: buyer?.id || null,
        buyerName: buyer ? `${buyer.first_name} ${buyer.last_name}` : null,
        buyerEmail: buyer?.email || null,
        globalProgress: latestSnapshot?.global_progress || 0,
        grosOeuvreProgress: latestSnapshot?.gros_oeuvre_progress || 0,
        horsEauProgress: 0,
        horsAirProgress: 0,
        secondOeuvreProgress: latestSnapshot?.second_oeuvre_progress || 0,
        finitionsProgress: latestSnapshot?.finitions_progress || 0,
        currentPhase,
        currentMilestone: latestSnapshot?.milestone_reached || null,
        plannedStartDate: null,
        plannedEndDate: null,
        actualStartDate: snapshots.length > 0 ? snapshots[snapshots.length - 1].snapshot_date : null,
        estimatedEndDate: null,
        daysAheadOrBehind: 0,
        isOnTrack: true,
        isDelayed: latestSnapshot?.milestone_reached === 'DELAYED',
        lastUpdateDate: latestSnapshot?.snapshot_date || new Date().toISOString(),
        notes: latestSnapshot?.notes || null,
        progressHistory,
      };

      setLot(lotProgress);

      // Generate milestones from template
      const generatedMilestones: ConstructionMilestone[] = DEFAULT_MILESTONES.map((m, index) => ({
        id: `milestone-${index}`,
        ...m,
        plannedDate: null,
        actualDate: null,
        status: PHASE_CONFIG[m.phase].order < PHASE_CONFIG[currentPhase].order
          ? 'completed'
          : PHASE_CONFIG[m.phase].order === PHASE_CONFIG[currentPhase].order
          ? 'in_progress'
          : 'pending',
      }));

      setMilestones(generatedMilestones);

    } catch (err) {
      console.error('Error loading lot progress detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [lotId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return {
    lot,
    milestones,
    loading,
    error,
    refresh: loadDetail,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getPhaseProgress(phase: ConstructionPhase): number {
  return PHASE_CONFIG[phase].order / 8 * 100;
}

export function formatProgressDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-CH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'text-green-600 bg-green-100';
  if (progress >= 75) return 'text-blue-600 bg-blue-100';
  if (progress >= 50) return 'text-amber-600 bg-amber-100';
  if (progress >= 25) return 'text-orange-600 bg-orange-100';
  return 'text-gray-600 bg-gray-100';
}

export function getProgressStatus(lot: LotProgress): {
  label: string;
  color: string;
  icon: 'check' | 'clock' | 'alert';
} {
  if (lot.globalProgress >= 100) {
    return { label: 'Termine', color: 'text-green-600 bg-green-100', icon: 'check' };
  }
  if (lot.isDelayed) {
    return { label: 'En retard', color: 'text-red-600 bg-red-100', icon: 'alert' };
  }
  if (lot.globalProgress > 0) {
    return { label: 'En cours', color: 'text-blue-600 bg-blue-100', icon: 'clock' };
  }
  return { label: 'Non demarre', color: 'text-gray-600 bg-gray-100', icon: 'clock' };
}

export function calculateEstimatedCompletion(lot: LotProgress): Date | null {
  if (lot.globalProgress >= 100) return null;
  if (lot.globalProgress === 0 || !lot.actualStartDate) return null;

  const startDate = new Date(lot.actualStartDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceStart <= 0 || lot.globalProgress <= 0) return null;

  const progressPerDay = lot.globalProgress / daysSinceStart;
  const remainingProgress = 100 - lot.globalProgress;
  const estimatedDaysRemaining = Math.ceil(remainingProgress / progressPerDay);

  const estimatedDate = new Date(now);
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDaysRemaining);

  return estimatedDate;
}
