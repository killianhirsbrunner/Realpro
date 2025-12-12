/**
 * CRM API - Supabase data access layer for prospects
 */

import { supabase } from '@/lib/supabase';
import type {
  Prospect,
  ProspectWithProject,
  ProspectStatus,
  CreateProspectInput,
  UpdateProspectInput,
  CRMActivity,
} from '@realpro/entities';
import { calculateDaysInStage } from '@realpro/entities';

export interface ProspectsQueryFilters {
  status?: ProspectStatus | ProspectStatus[];
  source?: string;
  search?: string;
  assignedTo?: string;
}

export async function fetchProspects(
  projectId: string,
  filters?: ProspectsQueryFilters
): Promise<ProspectWithProject[]> {
  let query = supabase
    .from('prospects')
    .select(`
      *,
      project:project_id (
        id,
        name
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  // Apply status filter
  if (filters?.status) {
    if (Array.isArray(filters.status)) {
      query = query.in('status', filters.status);
    } else {
      query = query.eq('status', filters.status);
    }
  }

  // Apply source filter
  if (filters?.source) {
    query = query.eq('source', filters.source);
  }

  // Apply assigned filter
  if (filters?.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Transform to ProspectWithProject and apply client-side search
  let prospects: ProspectWithProject[] = (data || []).map((p) => ({
    ...p,
    project_name: p.project?.name || '',
    days_in_stage: calculateDaysInStage(p.created_at),
    interested_lots_info: [], // Would need separate query for lot details
  }));

  // Apply client-side search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    prospects = prospects.filter(
      (p) =>
        p.first_name.toLowerCase().includes(searchLower) ||
        p.last_name.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.phone?.includes(searchLower)
    );
  }

  return prospects;
}

export async function fetchProspect(prospectId: string): Promise<Prospect | null> {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchProspectActivities(prospectId: string): Promise<CRMActivity[]> {
  const { data, error } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('prospect_id', prospectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProspect(input: CreateProspectInput): Promise<Prospect> {
  const { data, error } = await supabase
    .from('prospects')
    .insert({
      ...input,
      status: input.status || 'NEW',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProspect(id: string, input: UpdateProspectInput): Promise<Prospect> {
  const { data, error } = await supabase
    .from('prospects')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProspectStatus(
  id: string,
  status: ProspectStatus
): Promise<Prospect> {
  return updateProspect(id, { status });
}

export async function deleteProspect(id: string): Promise<void> {
  const { error } = await supabase.from('prospects').delete().eq('id', id);

  if (error) throw error;
}

export async function createActivity(
  prospectId: string,
  activity: Omit<CRMActivity, 'id' | 'prospect_id' | 'created_at'>
): Promise<CRMActivity> {
  const { data, error } = await supabase
    .from('crm_activities')
    .insert({
      ...activity,
      prospect_id: prospectId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Pipeline data for Kanban view
export interface PipelineData {
  NEW: ProspectWithProject[];
  CONTACTED: ProspectWithProject[];
  QUALIFIED: ProspectWithProject[];
  VISIT_SCHEDULED: ProspectWithProject[];
  VISIT_DONE: ProspectWithProject[];
  OFFER_SENT: ProspectWithProject[];
  NEGOTIATION: ProspectWithProject[];
}

export async function fetchPipeline(projectId: string): Promise<PipelineData> {
  const activeStatuses: ProspectStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'VISIT_SCHEDULED',
    'VISIT_DONE',
    'OFFER_SENT',
    'NEGOTIATION',
  ];

  const prospects = await fetchProspects(projectId, { status: activeStatuses });

  const pipeline: PipelineData = {
    NEW: [],
    CONTACTED: [],
    QUALIFIED: [],
    VISIT_SCHEDULED: [],
    VISIT_DONE: [],
    OFFER_SENT: [],
    NEGOTIATION: [],
  };

  prospects.forEach((prospect) => {
    if (prospect.status in pipeline) {
      pipeline[prospect.status as keyof PipelineData].push(prospect);
    }
  });

  return pipeline;
}

// Stats calculation
export interface ProspectStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  newThisWeek: number;
  conversionRate: number;
}

export function calculateProspectStats(prospects: ProspectWithProject[]): ProspectStats {
  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let newThisWeek = 0;
  let converted = 0;

  prospects.forEach((prospect) => {
    byStatus[prospect.status] = (byStatus[prospect.status] || 0) + 1;

    if (prospect.source) {
      bySource[prospect.source] = (bySource[prospect.source] || 0) + 1;
    }

    if (new Date(prospect.created_at).getTime() > oneWeekAgo) {
      newThisWeek++;
    }

    if (prospect.status === 'CONVERTED') {
      converted++;
    }
  });

  return {
    total: prospects.length,
    byStatus,
    bySource,
    newThisWeek,
    conversionRate: prospects.length > 0 ? (converted / prospects.length) * 100 : 0,
  };
}
