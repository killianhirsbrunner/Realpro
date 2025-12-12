/**
 * RealPro | Buyer Entity Types
 */

export type BuyerStatus =
  | 'PROSPECT'
  | 'RESERVED'
  | 'CONTRACT_PENDING'
  | 'CONTRACT_SIGNED'
  | 'NOTARY_PENDING'
  | 'SALE_COMPLETED'
  | 'DELIVERED';

export const BUYER_STATUS_LABELS: Record<BuyerStatus, string> = {
  PROSPECT: 'Prospect',
  RESERVED: 'Réservation',
  CONTRACT_PENDING: 'Contrat en attente',
  CONTRACT_SIGNED: 'Contrat signé',
  NOTARY_PENDING: 'En attente notaire',
  SALE_COMPLETED: 'Vente finalisée',
  DELIVERED: 'Livré',
};

export interface Buyer {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  status: BuyerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuyerWithLot extends Buyer {
  lot_id: string | null;
  lot_code: string | null;
  lot_type: string | null;
  project_id: string | null;
  project_name: string | null;
  sale_contract_id: string | null;
  sale_price: number | null;
}

export interface BuyerDocument {
  id: string;
  buyer_id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  storage_path: string | null;
  created_at: string;
}

export interface BuyerPayment {
  id: string;
  buyer_id: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string | null;
  paid_date: string | null;
}

export interface BuyerDetails extends Buyer {
  lot?: {
    id: string;
    code: string;
    type: string;
    price_total: number | null;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
  sale_contract?: {
    id: string;
    status: string;
    sale_type: string | null;
    total_price: number | null;
  } | null;
  documents: BuyerDocument[];
  payments: BuyerPayment[];
  documents_complete: boolean;
  payments_complete: boolean;
}

export interface CreateBuyerInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  status?: BuyerStatus;
  notes?: string;
}

export interface UpdateBuyerInput {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  status?: BuyerStatus;
  notes?: string | null;
}

// Utility functions
export function getBuyerFullName(buyer: Pick<Buyer, 'first_name' | 'last_name'>): string {
  return `${buyer.first_name} ${buyer.last_name}`;
}

export function getBuyerInitials(buyer: Pick<Buyer, 'first_name' | 'last_name'>): string {
  return `${buyer.first_name.charAt(0)}${buyer.last_name.charAt(0)}`.toUpperCase();
}

export function isBuyerSaleCompleted(buyer: Pick<Buyer, 'status'>): boolean {
  return ['SALE_COMPLETED', 'DELIVERED'].includes(buyer.status);
}
