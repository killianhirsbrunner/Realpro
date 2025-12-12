/**
 * RealPro | Promoteur Domain Types
 *
 * Types spécifiques au domaine Promoteur immobilier.
 * Ces types NE DOIVENT PAS être utilisés par PPE-Admin ou Régie.
 *
 * ⚠️ RÈGLE: Si vous avez besoin de types similaires dans une autre app,
 * créez-les dans le domaine de cette app (apps/xxx/src/entities/).
 */

import type { Json } from '../shared/types';

// ============================================================================
// Promoteur-Specific Enums
// ============================================================================

export type ProjectStatus = 'PLANNING' | 'CONSTRUCTION' | 'SELLING' | 'COMPLETED' | 'ARCHIVED';

export type LotType = 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';

export type LotStatus = 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';

export type ProspectStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VISIT_SCHEDULED'
  | 'VISIT_DONE'
  | 'OFFER_SENT'
  | 'RESERVED'
  | 'LOST';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CONVERTED' | 'CANCELLED' | 'EXPIRED';

export type BuyerStatus =
  | 'ACTIVE'
  | 'DOCUMENTS_PENDING'
  | 'READY_FOR_SIGNING'
  | 'SIGNED'
  | 'COMPLETED';

/**
 * Rôles spécifiques au domaine Promoteur
 */
export type PromoteurUserRole =
  | 'admin'
  | 'promoteur'
  | 'eg' // Entreprise générale
  | 'architecte'
  | 'notaire'
  | 'courtier'
  | 'acheteur'
  | 'fournisseur';

// ============================================================================
// Status Labels (French)
// ============================================================================

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planification',
  CONSTRUCTION: 'Construction',
  SELLING: 'Commercialisation',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
};

export const LOT_STATUS_LABELS: Record<LotStatus, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  OPTION: 'Option',
  SOLD: 'Vendu',
  DELIVERED: 'Livré',
};

export const LOT_TYPE_LABELS: Record<LotType, string> = {
  APARTMENT: 'Appartement',
  COMMERCIAL: 'Commercial',
  PARKING: 'Parking',
  STORAGE: 'Cave',
  VILLA: 'Villa',
  HOUSE: 'Maison',
};

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  QUALIFIED: 'Qualifié',
  VISIT_SCHEDULED: 'Visite planifiée',
  VISIT_DONE: 'Visite effectuée',
  OFFER_SENT: 'Offre envoyée',
  RESERVED: 'Réservé',
  LOST: 'Perdu',
};

export const PROMOTEUR_ROLE_LABELS: Record<PromoteurUserRole, string> = {
  admin: 'Administrateur',
  promoteur: 'Promoteur',
  eg: 'Entreprise Générale',
  architecte: 'Architecte',
  notaire: 'Notaire',
  courtier: 'Courtier',
  acheteur: 'Acheteur',
  fournisseur: 'Fournisseur',
};

// ============================================================================
// Project Entity
// ============================================================================

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  total_surface: number | null;
  image_url: string | null;
  settings: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithStats extends Project {
  total_lots: number;
  sold_lots: number;
  available_lots: number;
  reserved_lots: number;
  total_revenue: number;
  completion_percent: number;
}

export interface CreateProjectInput {
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  total_surface?: number;
}

export interface UpdateProjectInput {
  name?: string;
  code?: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
  total_surface?: number | null;
  image_url?: string | null;
  settings?: Json;
}

// ============================================================================
// Building, Floor, Entrance (Project Structure)
// ============================================================================

export interface Building {
  id: string;
  project_id: string;
  name: string;
  code: string;
  address: string | null;
  floors_count: number;
  created_at: string;
  updated_at: string;
}

export interface Floor {
  id: string;
  building_id: string;
  name: string;
  level: number;
  created_at: string;
}

export interface Entrance {
  id: string;
  building_id: string;
  name: string;
  code: string;
  created_at: string;
}

// ============================================================================
// Lot Entity
// ============================================================================

export interface Lot {
  id: string;
  project_id: string;
  building_id: string;
  floor_id: string | null;
  code: string;
  type: LotType;
  status: LotStatus;
  rooms_count: number | null;
  surface_living: number | null;
  surface_total: number | null;
  price_base: number | null;
  price_total: number | null;
  orientation: string | null;
  floor_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface LotWithBuyer extends Lot {
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface CreateLotInput {
  project_id: string;
  building_id: string;
  floor_id?: string;
  code: string;
  type: LotType;
  status?: LotStatus;
  rooms_count?: number;
  surface_living?: number;
  surface_total?: number;
  price_base?: number;
  price_total?: number;
  orientation?: string;
  floor_level?: number;
}

export interface UpdateLotInput {
  code?: string;
  type?: LotType;
  status?: LotStatus;
  rooms_count?: number | null;
  surface_living?: number | null;
  surface_total?: number | null;
  price_base?: number | null;
  price_total?: number | null;
  orientation?: string | null;
  floor_level?: number | null;
}

export interface LotFilters {
  project_id?: string;
  building_id?: string;
  type?: LotType;
  status?: LotStatus;
  min_price?: number;
  max_price?: number;
  min_rooms?: number;
  max_rooms?: number;
  min_surface?: number;
  max_surface?: number;
}

// ============================================================================
// Prospect & CRM
// ============================================================================

export interface Prospect {
  id: string;
  project_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: ProspectStatus;
  source: string | null;
  notes: string | null;
  interested_lot_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProspectInput {
  project_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source?: string;
  notes?: string;
  interested_lot_ids?: string[];
}

// ============================================================================
// Reservation & Buyer
// ============================================================================

export interface Reservation {
  id: string;
  lot_id: string;
  prospect_id: string;
  status: ReservationStatus;
  deposit_amount: number | null;
  deposit_paid: boolean;
  signed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  project_id: string;
  lot_id: string;
  reservation_id: string | null;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: BuyerStatus;
  is_company: boolean;
  company_name: string | null;
  financing_type: 'CASH' | 'MORTGAGE' | 'MIXED';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getProjectFullAddress(
  project: Pick<Project, 'address' | 'postal_code' | 'city'>
): string {
  const parts = [project.address, project.postal_code, project.city].filter(Boolean);
  return parts.join(', ');
}

export function isProjectActive(project: Pick<Project, 'status'>): boolean {
  return ['PLANNING', 'CONSTRUCTION', 'SELLING'].includes(project.status);
}

export function isProjectCompleted(project: Pick<Project, 'status'>): boolean {
  return ['COMPLETED', 'ARCHIVED'].includes(project.status);
}

export function getLotDisplayName(lot: Pick<Lot, 'code' | 'type' | 'rooms_count'>): string {
  const rooms = lot.rooms_count ? `${lot.rooms_count} pcs` : '';
  return `${lot.code}${rooms ? ` - ${rooms}` : ''}`;
}

export function isLotAvailable(lot: Pick<Lot, 'status'>): boolean {
  return lot.status === 'AVAILABLE';
}

export function isLotSold(lot: Pick<Lot, 'status'>): boolean {
  return ['SOLD', 'DELIVERED'].includes(lot.status);
}

export function isLotReserved(lot: Pick<Lot, 'status'>): boolean {
  return ['RESERVED', 'OPTION'].includes(lot.status);
}

export function getProspectFullName(prospect: Pick<Prospect, 'first_name' | 'last_name'>): string {
  return `${prospect.first_name} ${prospect.last_name}`.trim();
}

export function canConvertProspect(prospect: Pick<Prospect, 'status'>): boolean {
  return ['QUALIFIED', 'VISIT_DONE', 'OFFER_SENT'].includes(prospect.status);
}
