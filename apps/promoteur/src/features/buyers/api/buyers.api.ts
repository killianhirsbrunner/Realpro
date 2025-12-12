/**
 * Buyers API - Supabase data access layer
 */

import { supabase } from '@/lib/supabase';
import type {
  Buyer,
  BuyerWithLot,
  BuyerDetails,
  BuyerDocument,
  BuyerPayment,
  CreateBuyerInput,
  UpdateBuyerInput,
} from '@realpro/entities';

export interface BuyersQueryFilters {
  status?: string;
  search?: string;
}

// Type for Supabase query result - nested selects may return arrays
interface SalesContractRow {
  id: string;
  status: string;
  total_price: number | null;
  lot: { id: string; code: string; type: string }[] | { id: string; code: string; type: string } | null;
  buyer: Buyer[] | Buyer | null;
  project: { id: string; name: string }[] | { id: string; name: string } | null;
}

// Helper to safely get first element from nested select result
function getFirst<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

interface DocumentRow {
  id: string;
  buyer_id: string;
  name: string;
  type: string | null;
  status: string | null;
  storage_path: string | null;
  created_at: string;
}

interface PaymentRow {
  id: string;
  buyer_id: string;
  description: string;
  amount: number;
  status: string | null;
  due_date: string | null;
  paid_date: string | null;
}

export async function fetchBuyers(
  projectId: string,
  filters?: BuyersQueryFilters
): Promise<BuyerWithLot[]> {
  // Fetch buyers via sales_contracts for the project
  let query = supabase
    .from('sales_contracts')
    .select(`
      id,
      status,
      total_price,
      lot:lot_id (
        id,
        code,
        type
      ),
      buyer:buyer_id (
        id,
        organization_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        postal_code,
        country,
        status,
        notes,
        created_at,
        updated_at
      ),
      project:project_id (
        id,
        name
      )
    `)
    .eq('project_id', projectId);

  const { data: contracts, error } = await query;

  if (error) throw error;

  // Transform to BuyerWithLot array
  const contractRows = (contracts || []) as SalesContractRow[];
  const buyers: BuyerWithLot[] = contractRows
    .filter((contract: SalesContractRow) => getFirst(contract.buyer))
    .map((contract: SalesContractRow) => {
      const buyer = getFirst(contract.buyer) as Buyer;
      const lot = getFirst(contract.lot);
      const project = getFirst(contract.project);
      return {
        ...buyer,
        lot_id: lot?.id || null,
        lot_code: lot?.code || null,
        lot_type: lot?.type || null,
        project_id: project?.id || null,
        project_name: project?.name || null,
        sale_contract_id: contract.id,
        sale_price: contract.total_price || null,
      };
    });

  // Apply client-side filters
  let filteredBuyers = buyers;

  if (filters?.status) {
    filteredBuyers = filteredBuyers.filter((b) => b.status === filters.status);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredBuyers = filteredBuyers.filter(
      (b) =>
        b.first_name.toLowerCase().includes(searchLower) ||
        b.last_name.toLowerCase().includes(searchLower) ||
        b.email?.toLowerCase().includes(searchLower) ||
        b.lot_code?.toLowerCase().includes(searchLower)
    );
  }

  return filteredBuyers;
}

export async function fetchBuyer(buyerId: string): Promise<Buyer | null> {
  const { data, error } = await supabase
    .from('buyers')
    .select('*')
    .eq('id', buyerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchBuyerDetails(buyerId: string): Promise<BuyerDetails | null> {
  // Fetch buyer with relations
  const { data: buyerData, error: buyerError } = await supabase
    .from('buyers')
    .select(`
      *,
      sales_contracts (
        id,
        status,
        sale_type,
        total_price,
        lot:lot_id (
          id,
          code,
          type,
          price_total
        ),
        project:project_id (
          id,
          name
        )
      )
    `)
    .eq('id', buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyerData) return null;

  // Fetch documents
  const { data: documents } = await supabase
    .from('documents')
    .select('id, buyer_id, name, type, status, storage_path, created_at')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  // Fetch payments
  const { data: payments } = await supabase
    .from('payment_schedules')
    .select('id, buyer_id, description, amount, status, due_date, paid_date')
    .eq('buyer_id', buyerId)
    .order('due_date', { ascending: true });

  const saleContract = buyerData.sales_contracts?.[0];

  const documentRows = (documents || []) as DocumentRow[];
  const buyerDocuments: BuyerDocument[] = documentRows.map((doc: DocumentRow) => ({
    id: doc.id,
    buyer_id: doc.buyer_id,
    name: doc.name,
    type: doc.type || 'other',
    status: (doc.status || 'pending') as 'pending' | 'approved' | 'rejected',
    storage_path: doc.storage_path,
    created_at: doc.created_at,
  }));

  const paymentRows = (payments || []) as PaymentRow[];
  const buyerPayments: BuyerPayment[] = paymentRows.map((p: PaymentRow) => ({
    id: p.id,
    buyer_id: p.buyer_id,
    description: p.description,
    amount: p.amount,
    status: (p.status || 'pending') as 'pending' | 'paid' | 'overdue' | 'cancelled',
    due_date: p.due_date,
    paid_date: p.paid_date,
  }));

  const documentsComplete =
    buyerDocuments.length > 0 && buyerDocuments.every((d) => d.status === 'approved');
  const paymentsComplete =
    buyerPayments.length > 0 && buyerPayments.every((p) => p.status === 'paid');

  return {
    id: buyerData.id,
    organization_id: buyerData.organization_id,
    first_name: buyerData.first_name,
    last_name: buyerData.last_name,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    city: buyerData.city,
    postal_code: buyerData.postal_code,
    country: buyerData.country || 'CH',
    status: buyerData.status,
    notes: buyerData.notes,
    created_at: buyerData.created_at,
    updated_at: buyerData.updated_at,
    lot: saleContract?.lot || null,
    project: saleContract?.project || null,
    sale_contract: saleContract
      ? {
          id: saleContract.id,
          status: saleContract.status,
          sale_type: saleContract.sale_type,
          total_price: saleContract.total_price,
        }
      : null,
    documents: buyerDocuments,
    payments: buyerPayments,
    documents_complete: documentsComplete,
    payments_complete: paymentsComplete,
  };
}

export async function createBuyer(input: CreateBuyerInput): Promise<Buyer> {
  const { data, error } = await supabase
    .from('buyers')
    .insert({
      ...input,
      country: input.country || 'CH',
      status: input.status || 'PROSPECT',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBuyer(id: string, input: UpdateBuyerInput): Promise<Buyer> {
  const { data, error } = await supabase
    .from('buyers')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBuyer(id: string): Promise<void> {
  const { error } = await supabase.from('buyers').delete().eq('id', id);

  if (error) throw error;
}

// Stats calculation
export interface BuyerStats {
  total: number;
  byStatus: Record<string, number>;
  documentsComplete: number;
  paymentsComplete: number;
}

export function calculateBuyerStats(buyers: BuyerWithLot[]): BuyerStats {
  const byStatus: Record<string, number> = {};

  buyers.forEach((buyer) => {
    byStatus[buyer.status] = (byStatus[buyer.status] || 0) + 1;
  });

  return {
    total: buyers.length,
    byStatus,
    documentsComplete: 0, // Would need to fetch documents for each buyer
    paymentsComplete: 0,
  };
}
