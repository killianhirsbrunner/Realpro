/**
 * useLots - React Query hooks for lots management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateLotInput, UpdateLotInput, LotStatus, Lot } from '@realpro/entities';
import * as lotsApi from '../api/lots.api';
import { projectKeys } from '../../projects';

// Query keys
export const lotKeys = {
  all: ['lots'] as const,
  lists: () => [...lotKeys.all, 'list'] as const,
  list: (projectId: string, filters?: lotsApi.LotsQueryFilters) =>
    [...lotKeys.lists(), projectId, filters] as const,
  details: () => [...lotKeys.all, 'detail'] as const,
  detail: (id: string) => [...lotKeys.details(), id] as const,
};

/**
 * Fetch lots for a project with optional filters
 */
export function useLots(projectId: string | undefined, filters?: lotsApi.LotsQueryFilters) {
  const queryResult = useQuery({
    queryKey: lotKeys.list(projectId || '', filters),
    queryFn: () => lotsApi.fetchLots(projectId!, filters),
    enabled: !!projectId,
  });

  // Calculate stats from the data
  const stats = queryResult.data
    ? lotsApi.calculateLotStats(queryResult.data)
    : null;

  return {
    ...queryResult,
    lots: queryResult.data || [],
    stats,
  };
}

/**
 * Fetch a single lot by ID
 */
export function useLot(lotId: string | undefined) {
  return useQuery({
    queryKey: lotKeys.detail(lotId || ''),
    queryFn: () => lotsApi.fetchLot(lotId!),
    enabled: !!lotId,
  });
}

/**
 * Create a new lot
 */
export function useCreateLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLotInput) => lotsApi.createLot(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lotKeys.lists() });
      // Also invalidate project stats
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Update an existing lot
 */
export function useUpdateLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLotInput }) =>
      lotsApi.updateLot(id, input),
    onSuccess: (data: Lot) => {
      queryClient.invalidateQueries({ queryKey: lotKeys.lists() });
      queryClient.setQueryData(lotKeys.detail(data.id), data);
      // Also invalidate project stats if status changed
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Delete a lot
 */
export function useDeleteLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lotsApi.deleteLot(id),
    onSuccess: (_: void, deletedId: string) => {
      queryClient.invalidateQueries({ queryKey: lotKeys.lists() });
      queryClient.removeQueries({ queryKey: lotKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Update lot status
 */
export function useUpdateLotStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LotStatus }) =>
      lotsApi.updateLotStatus(id, status),
    onSuccess: (data: Lot) => {
      queryClient.invalidateQueries({ queryKey: lotKeys.lists() });
      queryClient.setQueryData(lotKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Bulk update lot statuses
 */
export function useBulkUpdateLotStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: LotStatus }) =>
      lotsApi.bulkUpdateLotStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
