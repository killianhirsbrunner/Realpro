/**
 * useCRM - React Query hooks for CRM/prospects management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateProspectInput,
  UpdateProspectInput,
  ProspectStatus,
  CRMActivity,
} from '@realpro/entities';
import * as crmApi from '../api/crm.api';

// Query keys
export const crmKeys = {
  all: ['crm'] as const,
  prospects: () => [...crmKeys.all, 'prospects'] as const,
  prospectList: (projectId: string, filters?: crmApi.ProspectsQueryFilters) =>
    [...crmKeys.prospects(), projectId, filters] as const,
  prospectDetail: (id: string) => [...crmKeys.prospects(), 'detail', id] as const,
  pipeline: (projectId: string) => [...crmKeys.all, 'pipeline', projectId] as const,
  activities: (prospectId: string) => [...crmKeys.all, 'activities', prospectId] as const,
};

/**
 * Fetch prospects for a project with optional filters
 */
export function useProspects(
  projectId: string | undefined,
  filters?: crmApi.ProspectsQueryFilters
) {
  const queryResult = useQuery({
    queryKey: crmKeys.prospectList(projectId || '', filters),
    queryFn: () => crmApi.fetchProspects(projectId!, filters),
    enabled: !!projectId,
  });

  // Calculate stats from the data
  const stats = queryResult.data
    ? crmApi.calculateProspectStats(queryResult.data)
    : null;

  return {
    ...queryResult,
    prospects: queryResult.data || [],
    stats,
  };
}

/**
 * Fetch a single prospect by ID
 */
export function useProspect(prospectId: string | undefined) {
  return useQuery({
    queryKey: crmKeys.prospectDetail(prospectId || ''),
    queryFn: () => crmApi.fetchProspect(prospectId!),
    enabled: !!prospectId,
  });
}

/**
 * Fetch pipeline data for Kanban view
 */
export function usePipeline(projectId: string | undefined) {
  return useQuery({
    queryKey: crmKeys.pipeline(projectId || ''),
    queryFn: () => crmApi.fetchPipeline(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Fetch activities for a prospect
 */
export function useProspectActivities(prospectId: string | undefined) {
  return useQuery({
    queryKey: crmKeys.activities(prospectId || ''),
    queryFn: () => crmApi.fetchProspectActivities(prospectId!),
    enabled: !!prospectId,
  });
}

/**
 * Create a new prospect
 */
export function useCreateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProspectInput) => crmApi.createProspect(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.prospects() });
      queryClient.invalidateQueries({ queryKey: crmKeys.pipeline(data.project_id) });
    },
  });
}

/**
 * Update an existing prospect
 */
export function useUpdateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProspectInput }) =>
      crmApi.updateProspect(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.prospects() });
      queryClient.invalidateQueries({ queryKey: crmKeys.pipeline(data.project_id) });
      queryClient.setQueryData(crmKeys.prospectDetail(data.id), data);
    },
  });
}

/**
 * Update prospect status (for drag & drop in Kanban)
 */
export function useUpdateProspectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProspectStatus }) =>
      crmApi.updateProspectStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.prospects() });
      queryClient.invalidateQueries({ queryKey: crmKeys.pipeline(data.project_id) });
      queryClient.setQueryData(crmKeys.prospectDetail(data.id), data);
    },
  });
}

/**
 * Delete a prospect
 */
export function useDeleteProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crmApi.deleteProspect(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmKeys.prospects() });
      queryClient.invalidateQueries({ queryKey: crmKeys.all });
    },
  });
}

/**
 * Add activity to a prospect
 */
export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      prospectId,
      activity,
    }: {
      prospectId: string;
      activity: Omit<CRMActivity, 'id' | 'prospect_id' | 'created_at'>;
    }) => crmApi.createActivity(prospectId, activity),
    onSuccess: (_, { prospectId }) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.activities(prospectId) });
    },
  });
}
