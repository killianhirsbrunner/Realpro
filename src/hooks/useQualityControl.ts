import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type InspectionType = 'PRE_INSPECTION' | 'INSPECTION' | 'FINAL_INSPECTION' | 'HANDOVER';
export type InspectionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type IssueSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL' | 'BLOCKING';
export type IssueCategory = 'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'FINISHING' | 'EXTERIOR' | 'OTHER';

export interface Inspection {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string | null;
  type: InspectionType;
  status: InspectionStatus;
  scheduled_date: string;
  completed_date: string | null;
  inspector_id: string | null;
  notes: string | null;
  overall_rating: number | null;
  report_url: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  lot?: {
    lot_number: string;
    floor: string | null;
  };
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  inspector?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  issues_count?: number;
  resolved_count?: number;
}

export interface InspectionIssue {
  id: string;
  inspection_id: string;
  location: string | null;
  category: IssueCategory;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  assigned_to_id: string | null;
  photos: string[];
  resolution_notes: string | null;
  resolved_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  assigned_to?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface ChecklistItem {
  id: string;
  inspection_id: string;
  category: string;
  item: string;
  description: string | null;
  status: 'pending' | 'ok' | 'issue' | 'na';
  notes: string | null;
  photos: string[];
  order_index: number;
}

export interface QualityControlSummary {
  totalInspections: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
  avgResolutionDays: number;
  completionRate: number;
  byType: Record<InspectionType, number>;
  byLot: Record<string, { inspections: number; issues: number }>;
  thisMonthInspections: number;
  thisMonthIssuesResolved: number;
}

export interface CreateInspectionData {
  projectId: string;
  lotId?: string;
  type: InspectionType;
  scheduledDate: Date;
  inspectorId?: string;
  notes?: string;
}

export interface CreateIssueData {
  inspectionId: string;
  location?: string;
  category: IssueCategory;
  description: string;
  severity: IssueSeverity;
  assignedToId?: string;
  photos?: string[];
  dueDate?: Date;
}

// ============================================================================
// Configuration
// ============================================================================

export const INSPECTION_TYPE_CONFIG: Record<InspectionType, {
  label: string;
  color: string;
  description: string;
  icon: string;
}> = {
  PRE_INSPECTION: {
    label: 'Pre-reception',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    description: 'Inspection preliminaire avant reception',
    icon: 'Search',
  },
  INSPECTION: {
    label: 'Inspection',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    description: 'Inspection standard de controle qualite',
    icon: 'ClipboardCheck',
  },
  FINAL_INSPECTION: {
    label: 'Inspection finale',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    description: 'Inspection finale avant livraison',
    icon: 'Award',
  },
  HANDOVER: {
    label: 'Remise des cles',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    description: 'Remise officielle des cles a l\'acheteur',
    icon: 'Key',
  },
};

export const INSPECTION_STATUS_CONFIG: Record<InspectionStatus, {
  label: string;
  color: string;
}> = {
  SCHEDULED: { label: 'Planifiee', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' },
  IN_PROGRESS: { label: 'En cours', color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30' },
  COMPLETED: { label: 'Terminee', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' },
  CANCELLED: { label: 'Annulee', color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800' },
};

export const ISSUE_STATUS_CONFIG: Record<IssueStatus, {
  label: string;
  color: string;
  nextStatuses: IssueStatus[];
}> = {
  OPEN: {
    label: 'Ouvert',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    nextStatuses: ['IN_PROGRESS', 'REJECTED'],
  },
  IN_PROGRESS: {
    label: 'En cours',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    nextStatuses: ['RESOLVED', 'OPEN'],
  },
  RESOLVED: {
    label: 'Resolu',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    nextStatuses: ['OPEN'],
  },
  REJECTED: {
    label: 'Rejete',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
    nextStatuses: ['OPEN'],
  },
};

export const ISSUE_SEVERITY_CONFIG: Record<IssueSeverity, {
  label: string;
  color: string;
  priority: number;
}> = {
  MINOR: { label: 'Mineur', color: 'text-green-600 bg-green-100', priority: 1 },
  MAJOR: { label: 'Majeur', color: 'text-amber-600 bg-amber-100', priority: 2 },
  CRITICAL: { label: 'Critique', color: 'text-orange-600 bg-orange-100', priority: 3 },
  BLOCKING: { label: 'Bloquant', color: 'text-red-600 bg-red-100', priority: 4 },
};

export const ISSUE_CATEGORY_CONFIG: Record<IssueCategory, {
  label: string;
  icon: string;
}> = {
  STRUCTURAL: { label: 'Structure', icon: 'Building2' },
  ELECTRICAL: { label: 'Electricite', icon: 'Zap' },
  PLUMBING: { label: 'Plomberie', icon: 'Droplets' },
  HVAC: { label: 'Chauffage/Ventilation', icon: 'Thermometer' },
  FINISHING: { label: 'Finitions', icon: 'Paintbrush' },
  EXTERIOR: { label: 'Exterieur', icon: 'Trees' },
  OTHER: { label: 'Autre', icon: 'MoreHorizontal' },
};

// Default checklist template for Swiss construction
export const DEFAULT_CHECKLIST_TEMPLATE = [
  { category: 'Structure', items: ['Murs porteurs', 'Dalles', 'Escaliers', 'Balcons', 'Facade'] },
  { category: 'Electricite', items: ['Prises', 'Interrupteurs', 'Eclairage', 'Tableau electrique', 'Sonnette/Interphone'] },
  { category: 'Plomberie', items: ['Robinetterie', 'WC', 'Douche/Baignoire', 'Evacuation', 'Chauffe-eau'] },
  { category: 'Chauffage', items: ['Radiateurs', 'Thermostat', 'Ventilation', 'Climatisation'] },
  { category: 'Menuiserie', items: ['Portes interieures', 'Fenetres', 'Volets/Stores', 'Placards', 'Cuisine equipee'] },
  { category: 'Finitions', items: ['Peinture', 'Sols', 'Carrelage', 'Plinthes', 'Joints'] },
  { category: 'Exterieur', items: ['Terrasse', 'Jardin', 'Parking', 'Cave', 'Parties communes'] },
];

// ============================================================================
// Hook: useQualityControl
// ============================================================================

export function useQualityControl(projectId: string) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [summary, setSummary] = useState<QualityControlSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInspections = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('handover_inspections')
        .select(`
          *,
          lot:lot_id(lot_number, floor),
          inspector:inspector_id(id, first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('scheduled_date', { ascending: false });

      if (fetchError) throw fetchError;

      // Get issues count for each inspection
      const inspectionIds = (data || []).map((i: any) => i.id);

      let issuesMap: Record<string, { total: number; resolved: number }> = {};
      if (inspectionIds.length > 0) {
        const { data: issuesData } = await supabase
          .from('handover_issues')
          .select('inspection_id, status')
          .in('inspection_id', inspectionIds);

        (issuesData || []).forEach((issue: any) => {
          if (!issuesMap[issue.inspection_id]) {
            issuesMap[issue.inspection_id] = { total: 0, resolved: 0 };
          }
          issuesMap[issue.inspection_id].total++;
          if (issue.status === 'RESOLVED') {
            issuesMap[issue.inspection_id].resolved++;
          }
        });
      }

      const inspectionsData = (data || []).map((i: any) => ({
        ...i,
        lot: i.lot || undefined,
        inspector: i.inspector || undefined,
        issues_count: issuesMap[i.id]?.total || 0,
        resolved_count: issuesMap[i.id]?.resolved || 0,
      }));

      setInspections(inspectionsData);

      // Calculate summary
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all issues for this project
      const { data: allIssues } = await supabase
        .from('handover_issues')
        .select('*')
        .in('inspection_id', inspectionIds);

      const issues = allIssues || [];

      const resolvedIssues = issues.filter((i: any) => i.status === 'RESOLVED' && i.resolved_at);
      const avgResolution = resolvedIssues.length > 0
        ? resolvedIssues.reduce((sum: number, i: any) => {
            const created = new Date(i.created_at);
            const resolved = new Date(i.resolved_at);
            return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / resolvedIssues.length
        : 0;

      const byType: Record<InspectionType, number> = {
        PRE_INSPECTION: 0,
        INSPECTION: 0,
        FINAL_INSPECTION: 0,
        HANDOVER: 0,
      };
      inspectionsData.forEach((i: Inspection) => {
        if (byType[i.type] !== undefined) {
          byType[i.type]++;
        }
      });

      const byLot: Record<string, { inspections: number; issues: number }> = {};
      inspectionsData.forEach((i: Inspection) => {
        const lotKey = i.lot?.lot_number || 'Sans lot';
        if (!byLot[lotKey]) {
          byLot[lotKey] = { inspections: 0, issues: 0 };
        }
        byLot[lotKey].inspections++;
        byLot[lotKey].issues += i.issues_count || 0;
      });

      const completedInspections = inspectionsData.filter((i: Inspection) => i.status === 'COMPLETED');

      const calculatedSummary: QualityControlSummary = {
        totalInspections: inspectionsData.length,
        scheduled: inspectionsData.filter((i: Inspection) => i.status === 'SCHEDULED').length,
        inProgress: inspectionsData.filter((i: Inspection) => i.status === 'IN_PROGRESS').length,
        completed: completedInspections.length,
        cancelled: inspectionsData.filter((i: Inspection) => i.status === 'CANCELLED').length,
        totalIssues: issues.length,
        openIssues: issues.filter((i: any) => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
        resolvedIssues: resolvedIssues.length,
        criticalIssues: issues.filter((i: any) =>
          (i.severity === 'CRITICAL' || i.severity === 'BLOCKING') &&
          i.status !== 'RESOLVED'
        ).length,
        avgResolutionDays: Math.round(avgResolution),
        completionRate: inspectionsData.length > 0
          ? (completedInspections.length / inspectionsData.length) * 100
          : 0,
        byType,
        byLot,
        thisMonthInspections: inspectionsData.filter((i: Inspection) =>
          new Date(i.created_at) >= monthStart
        ).length,
        thisMonthIssuesResolved: issues.filter((i: any) =>
          i.resolved_at && new Date(i.resolved_at) >= monthStart
        ).length,
      };

      setSummary(calculatedSummary);
    } catch (err) {
      console.error('Error loading inspections:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadInspections();
  }, [loadInspections]);

  const createInspection = useCallback(
    async (data: CreateInspectionData): Promise<Inspection> => {
      try {
        const { data: project } = await supabase
          .from('projects')
          .select('organization_id')
          .eq('id', data.projectId)
          .single();

        const { data: inspection, error: insertError } = await supabase
          .from('handover_inspections')
          .insert({
            organization_id: project?.organization_id,
            project_id: data.projectId,
            lot_id: data.lotId || null,
            type: data.type,
            status: 'SCHEDULED',
            scheduled_date: data.scheduledDate.toISOString(),
            inspector_id: data.inspectorId || null,
            notes: data.notes || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadInspections();
        return inspection;
      } catch (err) {
        console.error('Error creating inspection:', err);
        throw err;
      }
    },
    [loadInspections]
  );

  const updateInspectionStatus = useCallback(
    async (inspectionId: string, status: InspectionStatus) => {
      try {
        const updateData: any = {
          status,
          updated_at: new Date().toISOString(),
        };

        if (status === 'COMPLETED') {
          updateData.completed_date = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('handover_inspections')
          .update(updateData)
          .eq('id', inspectionId);

        if (updateError) throw updateError;

        await loadInspections();
      } catch (err) {
        console.error('Error updating inspection status:', err);
        throw err;
      }
    },
    [loadInspections]
  );

  const deleteInspection = useCallback(
    async (inspectionId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('handover_inspections')
          .delete()
          .eq('id', inspectionId);

        if (deleteError) throw deleteError;

        await loadInspections();
      } catch (err) {
        console.error('Error deleting inspection:', err);
        throw err;
      }
    },
    [loadInspections]
  );

  // Filter helpers
  const getByStatus = useCallback(
    (status: InspectionStatus) => inspections.filter((i) => i.status === status),
    [inspections]
  );

  const getByType = useCallback(
    (type: InspectionType) => inspections.filter((i) => i.type === type),
    [inspections]
  );

  const getByLot = useCallback(
    (lotId: string) => inspections.filter((i) => i.lot_id === lotId),
    [inspections]
  );

  const getUpcoming = useCallback(
    () => inspections.filter((i) =>
      i.status === 'SCHEDULED' && new Date(i.scheduled_date) > new Date()
    ).sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()),
    [inspections]
  );

  const getWithIssues = useCallback(
    () => inspections.filter((i) => (i.issues_count || 0) > (i.resolved_count || 0)),
    [inspections]
  );

  return {
    inspections,
    summary,
    loading,
    error,
    refresh: loadInspections,
    createInspection,
    updateInspectionStatus,
    deleteInspection,
    getByStatus,
    getByType,
    getByLot,
    getUpcoming,
    getWithIssues,
  };
}

// ============================================================================
// Hook: useInspectionDetail
// ============================================================================

export function useInspectionDetail(inspectionId: string | undefined) {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [issues, setIssues] = useState<InspectionIssue[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!inspectionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [inspectionResult, issuesResult] = await Promise.all([
        supabase
          .from('handover_inspections')
          .select(`
            *,
            lot:lot_id(lot_number, floor),
            inspector:inspector_id(id, first_name, last_name)
          `)
          .eq('id', inspectionId)
          .single(),
        supabase
          .from('handover_issues')
          .select(`
            *,
            assigned_to:assigned_to_id(id, first_name, last_name)
          `)
          .eq('inspection_id', inspectionId)
          .order('created_at', { ascending: false }),
      ]);

      if (inspectionResult.error) throw inspectionResult.error;

      setInspection(inspectionResult.data);
      setIssues(issuesResult.data || []);

      // Load or create checklist items
      // For now, we'll use default template
      const defaultItems: ChecklistItem[] = [];
      let orderIndex = 0;
      DEFAULT_CHECKLIST_TEMPLATE.forEach((category) => {
        category.items.forEach((item) => {
          defaultItems.push({
            id: `${category.category}-${item}`.replace(/\s/g, '-').toLowerCase(),
            inspection_id: inspectionId,
            category: category.category,
            item: item,
            description: null,
            status: 'pending',
            notes: null,
            photos: [],
            order_index: orderIndex++,
          });
        });
      });
      setChecklist(defaultItems);
    } catch (err) {
      console.error('Error loading inspection detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [inspectionId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const createIssue = useCallback(
    async (data: CreateIssueData): Promise<InspectionIssue> => {
      try {
        const { data: issue, error: insertError } = await supabase
          .from('handover_issues')
          .insert({
            inspection_id: data.inspectionId,
            location: data.location || null,
            category: data.category,
            description: data.description,
            severity: data.severity,
            status: 'OPEN',
            assigned_to_id: data.assignedToId || null,
            photos: data.photos || [],
            due_date: data.dueDate?.toISOString() || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadDetail();
        return issue;
      } catch (err) {
        console.error('Error creating issue:', err);
        throw err;
      }
    },
    [loadDetail]
  );

  const updateIssueStatus = useCallback(
    async (issueId: string, status: IssueStatus, resolutionNotes?: string) => {
      try {
        const updateData: any = {
          status,
          updated_at: new Date().toISOString(),
        };

        if (status === 'RESOLVED') {
          updateData.resolved_at = new Date().toISOString();
          if (resolutionNotes) {
            updateData.resolution_notes = resolutionNotes;
          }
        }

        const { error: updateError } = await supabase
          .from('handover_issues')
          .update(updateData)
          .eq('id', issueId);

        if (updateError) throw updateError;

        await loadDetail();
      } catch (err) {
        console.error('Error updating issue status:', err);
        throw err;
      }
    },
    [loadDetail]
  );

  const deleteIssue = useCallback(
    async (issueId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('handover_issues')
          .delete()
          .eq('id', issueId);

        if (deleteError) throw deleteError;

        await loadDetail();
      } catch (err) {
        console.error('Error deleting issue:', err);
        throw err;
      }
    },
    [loadDetail]
  );

  // Computed values
  const openIssues = issues.filter((i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS');
  const resolvedIssues = issues.filter((i) => i.status === 'RESOLVED');
  const criticalIssues = issues.filter((i) =>
    (i.severity === 'CRITICAL' || i.severity === 'BLOCKING') && i.status !== 'RESOLVED'
  );
  const completionRate = checklist.length > 0
    ? (checklist.filter((c) => c.status !== 'pending').length / checklist.length) * 100
    : 0;

  return {
    inspection,
    issues,
    checklist,
    loading,
    error,
    refresh: loadDetail,
    createIssue,
    updateIssueStatus,
    deleteIssue,
    // Computed
    openIssues: openIssues.length,
    resolvedIssues: resolvedIssues.length,
    criticalIssues: criticalIssues.length,
    completionRate,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatInspectionDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-CH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntilInspection(scheduledDate: string): number {
  const now = new Date();
  const scheduled = new Date(scheduledDate);
  return Math.ceil((scheduled.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getInspectionUrgency(inspection: Inspection): {
  level: 'normal' | 'soon' | 'today' | 'overdue';
  label: string;
  color: string;
} {
  if (inspection.status !== 'SCHEDULED') {
    return { level: 'normal', label: '', color: '' };
  }

  const days = getDaysUntilInspection(inspection.scheduled_date);

  if (days < 0) {
    return { level: 'overdue', label: 'En retard', color: 'text-red-600 bg-red-100' };
  }
  if (days === 0) {
    return { level: 'today', label: "Aujourd'hui", color: 'text-orange-600 bg-orange-100' };
  }
  if (days <= 3) {
    return { level: 'soon', label: `Dans ${days}j`, color: 'text-amber-600 bg-amber-100' };
  }
  return { level: 'normal', label: `Dans ${days}j`, color: 'text-neutral-600 bg-neutral-100' };
}

export function calculateOverallRating(checklist: ChecklistItem[]): number {
  const items = checklist.filter((c) => c.status !== 'na' && c.status !== 'pending');
  if (items.length === 0) return 0;

  const okCount = items.filter((c) => c.status === 'ok').length;
  return Math.round((okCount / items.length) * 100);
}
