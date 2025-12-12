/**
 * useFinance - React Query hooks for finance management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
  RecordPaymentInput,
  Invoice,
} from '@realpro/entities';
import * as financeApi from '../api/finance.api';
import { buyerKeys } from '../../buyers';

// Query keys
export const financeKeys = {
  all: ['finance'] as const,
  projectFinance: (projectId: string) => [...financeKeys.all, 'project', projectId] as const,
  invoices: () => [...financeKeys.all, 'invoices'] as const,
  invoiceList: (projectId: string, filters?: financeApi.FinanceQueryFilters) =>
    [...financeKeys.invoices(), projectId, filters] as const,
  invoiceDetail: (id: string) => [...financeKeys.invoices(), 'detail', id] as const,
  buyerInvoices: (buyerId: string) => [...financeKeys.all, 'buyer', buyerId] as const,
  cfcBudgets: (projectId: string) => [...financeKeys.all, 'cfc', projectId] as const,
};

/**
 * Fetch project finance summary and buyer breakdown
 */
export function useProjectFinance(projectId: string | undefined) {
  return useQuery({
    queryKey: financeKeys.projectFinance(projectId || ''),
    queryFn: () => financeApi.fetchProjectFinance(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Fetch invoices for a project with optional filters
 */
export function useInvoices(
  projectId: string | undefined,
  filters?: financeApi.FinanceQueryFilters
) {
  return useQuery({
    queryKey: financeKeys.invoiceList(projectId || '', filters),
    queryFn: () => financeApi.fetchInvoices(projectId!, filters),
    enabled: !!projectId,
  });
}

/**
 * Fetch a single invoice by ID
 */
export function useInvoice(invoiceId: string | undefined) {
  return useQuery({
    queryKey: financeKeys.invoiceDetail(invoiceId || ''),
    queryFn: () => financeApi.fetchInvoice(invoiceId!),
    enabled: !!invoiceId,
  });
}

/**
 * Fetch invoices for a specific buyer
 */
export function useBuyerInvoices(buyerId: string | undefined) {
  return useQuery({
    queryKey: financeKeys.buyerInvoices(buyerId || ''),
    queryFn: () => financeApi.fetchBuyerInvoices(buyerId!),
    enabled: !!buyerId,
  });
}

/**
 * Fetch CFC budget lines for a project
 */
export function useCFCBudgets(projectId: string | undefined) {
  return useQuery({
    queryKey: financeKeys.cfcBudgets(projectId || ''),
    queryFn: () => financeApi.fetchCFCBudgets(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Create a new invoice
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => financeApi.createInvoice(input),
    onSuccess: (data: Invoice) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financeKeys.projectFinance(data.project_id) });
      queryClient.invalidateQueries({ queryKey: financeKeys.buyerInvoices(data.buyer_id) });
    },
  });
}

/**
 * Update an existing invoice
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvoiceInput }) =>
      financeApi.updateInvoice(id, input),
    onSuccess: (data: Invoice) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financeKeys.projectFinance(data.project_id) });
      queryClient.setQueryData(financeKeys.invoiceDetail(data.id), data);
    },
  });
}

/**
 * Record a payment on an invoice
 */
export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecordPaymentInput) => financeApi.recordPayment(input),
    onSuccess: (data: Invoice) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: financeKeys.projectFinance(data.project_id) });
      queryClient.invalidateQueries({ queryKey: financeKeys.buyerInvoices(data.buyer_id) });
      queryClient.setQueryData(financeKeys.invoiceDetail(data.id), data);
      // Also invalidate buyer data as payment status affects buyer
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
    },
  });
}

/**
 * Delete an invoice
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financeApi.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}
