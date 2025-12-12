/**
 * useBuyers - React Query hooks for buyers management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBuyerInput, UpdateBuyerInput, BuyerStatus } from '@realpro/entities';
import * as buyersApi from '../api/buyers.api';
import { projectKeys } from '../../projects';

// Query keys
export const buyerKeys = {
  all: ['buyers'] as const,
  lists: () => [...buyerKeys.all, 'list'] as const,
  list: (projectId: string, filters?: buyersApi.BuyersQueryFilters) =>
    [...buyerKeys.lists(), projectId, filters] as const,
  details: () => [...buyerKeys.all, 'detail'] as const,
  detail: (id: string) => [...buyerKeys.details(), id] as const,
};

/**
 * Fetch buyers for a project with optional filters
 */
export function useBuyers(
  projectId: string | undefined,
  filters?: buyersApi.BuyersQueryFilters
) {
  const queryResult = useQuery({
    queryKey: buyerKeys.list(projectId || '', filters),
    queryFn: () => buyersApi.fetchBuyers(projectId!, filters),
    enabled: !!projectId,
  });

  // Calculate stats from the data
  const stats = queryResult.data
    ? buyersApi.calculateBuyerStats(queryResult.data)
    : null;

  return {
    ...queryResult,
    buyers: queryResult.data || [],
    stats,
  };
}

/**
 * Fetch a single buyer by ID
 */
export function useBuyer(buyerId: string | undefined) {
  return useQuery({
    queryKey: buyerKeys.detail(buyerId || ''),
    queryFn: () => buyersApi.fetchBuyer(buyerId!),
    enabled: !!buyerId,
  });
}

/**
 * Fetch buyer details including documents and payments
 */
export function useBuyerDetails(buyerId: string | undefined) {
  return useQuery({
    queryKey: [...buyerKeys.detail(buyerId || ''), 'details'] as const,
    queryFn: () => buyersApi.fetchBuyerDetails(buyerId!),
    enabled: !!buyerId,
  });
}

/**
 * Create a new buyer
 */
export function useCreateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBuyerInput) => buyersApi.createBuyer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
    },
  });
}

/**
 * Update an existing buyer
 */
export function useUpdateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBuyerInput }) =>
      buyersApi.updateBuyer(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      queryClient.setQueryData(buyerKeys.detail(data.id), data);
    },
  });
}

/**
 * Delete a buyer
 */
export function useDeleteBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => buyersApi.deleteBuyer(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      queryClient.removeQueries({ queryKey: buyerKeys.detail(deletedId) });
      // Also invalidate project stats as buyer count might affect it
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/**
 * Update buyer status
 */
export function useUpdateBuyerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BuyerStatus }) =>
      buyersApi.updateBuyer(id, { status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      queryClient.setQueryData(buyerKeys.detail(data.id), data);
    },
  });
}
