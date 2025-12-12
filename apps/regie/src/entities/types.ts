/**
 * RealPro Régie | Domain Entity Types
 *
 * Types spécifiques au domaine Gestion Locative (Régie immobilière).
 * Basé sur les best practices de la gestion locative suisse.
 *
 * ⚠️ Ces types sont EXCLUSIFS à l'app Régie.
 * Ne pas importer dans Promoteur ou PPE-Admin.
 */

import type { Json, SwissCanton } from '@realpro/entities/shared';

// ============================================================================
// Régie-Specific Enums
// ============================================================================

/**
 * Type d'immeuble géré
 */
export type ImmeubleType =
  | 'RESIDENTIAL'      // Résidentiel
  | 'COMMERCIAL'       // Commercial
  | 'MIXED'            // Mixte
  | 'INDUSTRIAL';      // Industriel

/**
 * Statut d'un immeuble
 */
export type ImmeubleStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION';

/**
 * Type d'objet locatif
 */
export type ObjetLocatifType =
  | 'APARTMENT'        // Appartement
  | 'STUDIO'           // Studio
  | 'LOFT'             // Loft
  | 'HOUSE'            // Maison individuelle
  | 'COMMERCIAL'       // Local commercial
  | 'OFFICE'           // Bureau
  | 'WAREHOUSE'        // Entrepôt
  | 'PARKING_INT'      // Parking intérieur
  | 'PARKING_EXT'      // Parking extérieur
  | 'GARAGE'           // Garage/Box
  | 'STORAGE'          // Cave/Dépôt
  | 'OTHER';           // Autre

/**
 * Statut d'un objet locatif
 */
export type ObjetLocatifStatus =
  | 'AVAILABLE'        // Disponible à la location
  | 'RENTED'           // Loué
  | 'RESERVED'         // Réservé
  | 'UNDER_RENOVATION' // En travaux
  | 'BLOCKED';         // Bloqué (indisponible)

/**
 * Type de bail
 */
export type BailType =
  | 'RESIDENTIAL'      // Bail d'habitation
  | 'COMMERCIAL'       // Bail commercial
  | 'PARKING'          // Bail parking
  | 'STORAGE'          // Bail cave/dépôt
  | 'MIXED';           // Bail mixte

/**
 * Statut d'un bail
 */
export type BailStatus =
  | 'DRAFT'            // Brouillon
  | 'ACTIVE'           // Actif
  | 'NOTICE_GIVEN'     // Préavis donné
  | 'TERMINATED'       // Résilié
  | 'EXPIRED';         // Expiré

/**
 * Motif de résiliation
 */
export type ResiliationMotif =
  | 'TENANT_REQUEST'   // Demande du locataire
  | 'OWNER_REQUEST'    // Congé du propriétaire
  | 'NON_PAYMENT'      // Non-paiement
  | 'BREACH'           // Violation du bail
  | 'MUTUAL'           // Accord mutuel
  | 'EXPIRY';          // Échéance naturelle

/**
 * Statut de paiement
 */
export type PaiementStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';

/**
 * Statut d'un dossier contentieux
 */
export type ContentieuxStatus =
  | 'OPEN'             // Ouvert
  | 'REMINDER_1'       // 1er rappel envoyé
  | 'REMINDER_2'       // 2e rappel envoyé
  | 'FORMAL_NOTICE'    // Mise en demeure
  | 'LEGAL_ACTION'     // Procédure juridique
  | 'BAILIFF'          // Poursuite (LP)
  | 'RESOLVED'         // Résolu
  | 'WRITTEN_OFF';     // Passé en perte

/**
 * Type de charge locative
 */
export type ChargeLocativeType =
  | 'HEATING'          // Chauffage
  | 'WATER_HOT'        // Eau chaude
  | 'WATER_COLD'       // Eau froide
  | 'ELECTRICITY'      // Électricité parties communes
  | 'CLEANING'         // Nettoyage
  | 'GARDENING'        // Jardinage
  | 'ELEVATOR'         // Ascenseur
  | 'GARBAGE'          // Ordures ménagères
  | 'CONCIERGE'        // Conciergerie
  | 'TV_ANTENNA'       // Antenne TV collective
  | 'OTHER';           // Autres

/**
 * Clé de répartition des charges
 */
export type CleRepartition =
  | 'SURFACE'          // Par surface
  | 'ROOMS'            // Par nombre de pièces
  | 'EQUAL'            // Parts égales
  | 'PERSONS'          // Par nombre d'occupants
  | 'CONSUMPTION'      // Par consommation
  | 'CUSTOM';          // Personnalisée

/**
 * Rôles spécifiques au domaine Régie
 */
export type RegieUserRole =
  | 'admin'            // Administrateur système
  | 'manager'          // Gérant d'immeuble
  | 'accountant'       // Comptable
  | 'assistant'        // Assistant(e)
  | 'owner'            // Propriétaire
  | 'tenant';          // Locataire (accès portail)

// ============================================================================
// Status Labels
// ============================================================================

export const IMMEUBLE_TYPE_LABELS: Record<ImmeubleType, string> = {
  RESIDENTIAL: 'Résidentiel',
  COMMERCIAL: 'Commercial',
  MIXED: 'Mixte',
  INDUSTRIAL: 'Industriel',
};

export const IMMEUBLE_STATUS_LABELS: Record<ImmeubleStatus, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  UNDER_RENOVATION: 'En rénovation',
};

export const OBJET_LOCATIF_TYPE_LABELS: Record<ObjetLocatifType, string> = {
  APARTMENT: 'Appartement',
  STUDIO: 'Studio',
  LOFT: 'Loft',
  HOUSE: 'Maison',
  COMMERCIAL: 'Local commercial',
  OFFICE: 'Bureau',
  WAREHOUSE: 'Entrepôt',
  PARKING_INT: 'Parking intérieur',
  PARKING_EXT: 'Parking extérieur',
  GARAGE: 'Garage',
  STORAGE: 'Cave',
  OTHER: 'Autre',
};

export const OBJET_LOCATIF_STATUS_LABELS: Record<ObjetLocatifStatus, string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'Loué',
  RESERVED: 'Réservé',
  UNDER_RENOVATION: 'En travaux',
  BLOCKED: 'Bloqué',
};

export const BAIL_TYPE_LABELS: Record<BailType, string> = {
  RESIDENTIAL: 'Habitation',
  COMMERCIAL: 'Commercial',
  PARKING: 'Parking',
  STORAGE: 'Cave/Dépôt',
  MIXED: 'Mixte',
};

export const BAIL_STATUS_LABELS: Record<BailStatus, string> = {
  DRAFT: 'Brouillon',
  ACTIVE: 'Actif',
  NOTICE_GIVEN: 'Préavis',
  TERMINATED: 'Résilié',
  EXPIRED: 'Expiré',
};

export const CONTENTIEUX_STATUS_LABELS: Record<ContentieuxStatus, string> = {
  OPEN: 'Ouvert',
  REMINDER_1: '1er rappel',
  REMINDER_2: '2e rappel',
  FORMAL_NOTICE: 'Mise en demeure',
  LEGAL_ACTION: 'Procédure juridique',
  BAILIFF: 'Poursuite',
  RESOLVED: 'Résolu',
  WRITTEN_OFF: 'Perte',
};

export const CHARGE_LOCATIVE_TYPE_LABELS: Record<ChargeLocativeType, string> = {
  HEATING: 'Chauffage',
  WATER_HOT: 'Eau chaude',
  WATER_COLD: 'Eau froide',
  ELECTRICITY: 'Électricité',
  CLEANING: 'Nettoyage',
  GARDENING: 'Jardinage',
  ELEVATOR: 'Ascenseur',
  GARBAGE: 'Ordures',
  CONCIERGE: 'Conciergerie',
  TV_ANTENNA: 'Antenne TV',
  OTHER: 'Autres',
};

export const REGIE_ROLE_LABELS: Record<RegieUserRole, string> = {
  admin: 'Administrateur',
  manager: 'Gérant',
  accountant: 'Comptable',
  assistant: 'Assistant(e)',
  owner: 'Propriétaire',
  tenant: 'Locataire',
};

// ============================================================================
// Immeuble Entity
// ============================================================================

export interface Immeuble {
  id: string;
  organization_id: string;
  owner_id: string | null;        // Propriétaire (peut être externe)

  // Identification
  name: string;
  code: string;                   // Code interne
  type: ImmeubleType;
  status: ImmeubleStatus;

  // Adresse
  address: string;
  postal_code: string;
  city: string;
  canton: SwissCanton;
  country: string;

  // Caractéristiques
  construction_year: number | null;
  renovation_year: number | null;
  floors_count: number;
  units_count: number;

  // Références
  egrid: string | null;
  rf_number: string | null;

  // Gestionnaire
  manager_id: string | null;      // Utilisateur gérant

  // Images
  image_url: string | null;

  // Metadata
  notes: string | null;
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface ImmeubleWithStats extends Immeuble {
  occupancy_rate: number;         // Taux d'occupation %
  total_rent_potential: number;   // Loyers potentiels
  total_rent_actual: number;      // Loyers encaissés
  vacant_units: number;
  pending_payments: number;
  owner_name: string | null;
}

export interface CreateImmeubleInput {
  name: string;
  code: string;
  type: ImmeubleType;
  address: string;
  postal_code: string;
  city: string;
  canton: SwissCanton;
  owner_id?: string;
  construction_year?: number;
  floors_count?: number;
}

export interface UpdateImmeubleInput {
  name?: string;
  code?: string;
  type?: ImmeubleType;
  status?: ImmeubleStatus;
  address?: string;
  postal_code?: string;
  city?: string;
  canton?: SwissCanton;
  owner_id?: string | null;
  manager_id?: string | null;
  construction_year?: number | null;
  renovation_year?: number | null;
  floors_count?: number;
  egrid?: string | null;
  rf_number?: string | null;
  image_url?: string | null;
  notes?: string | null;
}

// ============================================================================
// Objet Locatif Entity
// ============================================================================

export interface ObjetLocatif {
  id: string;
  immeuble_id: string;

  // Identification
  code: string;                   // Ex: "A-301", "P-12"
  type: ObjetLocatifType;
  status: ObjetLocatifStatus;

  // Localisation
  floor_level: number | null;
  position: string | null;        // Ex: "gauche", "droite", "centre"

  // Caractéristiques
  rooms_count: number | null;
  surface_living: number | null;
  surface_total: number | null;

  // Loyer de référence
  rent_reference: number | null;  // Loyer de référence/cible
  charges_reference: number | null;

  // Équipements
  has_balcony: boolean;
  has_terrace: boolean;
  has_garden: boolean;
  has_parking: boolean;
  has_elevator_access: boolean;

  // Metadata
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ObjetLocatifWithTenant extends ObjetLocatif {
  current_tenant: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  current_bail: {
    id: string;
    start_date: string;
    rent_amount: number;
    charges_amount: number;
  } | null;
}

export interface CreateObjetLocatifInput {
  immeuble_id: string;
  code: string;
  type: ObjetLocatifType;
  floor_level?: number;
  rooms_count?: number;
  surface_living?: number;
  surface_total?: number;
  rent_reference?: number;
  charges_reference?: number;
}

// ============================================================================
// Locataire Entity
// ============================================================================

export interface Locataire {
  id: string;
  organization_id: string;
  user_id: string | null;         // Lien si accès portail

  // Identité
  type: 'INDIVIDUAL' | 'COMPANY';
  civility: 'M' | 'MME' | 'AUTRE' | null;
  first_name: string;
  last_name: string;
  company_name: string | null;

  // Contact
  email: string;
  phone: string | null;
  mobile: string | null;

  // Adresse actuelle
  current_address: string | null;
  current_postal_code: string | null;
  current_city: string | null;

  // Documents d'identité
  birth_date: string | null;
  nationality: string | null;
  id_type: 'PASSPORT' | 'ID_CARD' | 'PERMIT' | null;
  id_number: string | null;

  // Situation professionnelle
  profession: string | null;
  employer: string | null;
  annual_income: number | null;

  // Banque
  iban: string | null;

  // Metadata
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocataireWithBaux extends Locataire {
  active_baux: {
    id: string;
    objet_code: string;
    immeuble_name: string;
    rent_amount: number;
    start_date: string;
  }[];
  total_outstanding: number;
}

export interface CreateLocataireInput {
  type: 'INDIVIDUAL' | 'COMPANY';
  civility?: 'M' | 'MME' | 'AUTRE';
  first_name: string;
  last_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  mobile?: string;
}

// ============================================================================
// Bail Entity
// ============================================================================

export interface Bail {
  id: string;
  objet_locatif_id: string;
  locataire_id: string;

  // Type et statut
  type: BailType;
  status: BailStatus;

  // Dates
  start_date: string;
  end_date: string | null;        // null = durée indéterminée
  notice_date: string | null;     // Date du préavis
  termination_date: string | null;

  // Loyer
  rent_amount: number;            // Loyer net
  charges_amount: number;         // Acompte de charges
  total_amount: number;           // Total mensuel

  // Garantie de loyer
  deposit_amount: number | null;
  deposit_type: 'BANK_GUARANTEE' | 'CASH' | 'INSURANCE' | null;
  deposit_bank: string | null;
  deposit_account: string | null;

  // Conditions
  notice_period_months: number;   // Préavis en mois (généralement 3)
  rent_due_day: number;           // Jour d'échéance (1-28)
  payment_method: 'BANK_TRANSFER' | 'LSV' | 'EBILL' | 'CASH';

  // Index (adaptation loyer)
  is_indexed: boolean;
  index_reference: string | null; // Ex: "IPC septembre 2023"
  last_index_date: string | null;

  // Documents
  contract_document_id: string | null;

  // Metadata
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BailWithDetails extends Bail {
  locataire: Pick<Locataire, 'id' | 'first_name' | 'last_name' | 'email' | 'phone'>;
  objet: Pick<ObjetLocatif, 'id' | 'code' | 'type' | 'immeuble_id'>;
  immeuble_name: string;
  outstanding_balance: number;
}

export interface CreateBailInput {
  objet_locatif_id: string;
  locataire_id: string;
  type: BailType;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  charges_amount: number;
  deposit_amount?: number;
  deposit_type?: 'BANK_GUARANTEE' | 'CASH' | 'INSURANCE';
  notice_period_months?: number;
  rent_due_day?: number;
  payment_method?: 'BANK_TRANSFER' | 'LSV' | 'EBILL' | 'CASH';
}

// ============================================================================
// Loyer / Avis Entity
// ============================================================================

export interface AvisLoyer {
  id: string;
  bail_id: string;

  // Période
  year: number;
  month: number;                  // 1-12
  due_date: string;

  // Montants
  rent_amount: number;
  charges_amount: number;
  adjustments: number;            // Ajustements (+/-)
  total_amount: number;

  // Paiement
  status: PaiementStatus;
  paid_amount: number;
  paid_date: string | null;
  payment_reference: string | null;

  // QR facture
  qr_reference: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateAvisLoyerInput {
  bail_id: string;
  year: number;
  month: number;
  due_date: string;
  rent_amount: number;
  charges_amount: number;
  adjustments?: number;
}

// ============================================================================
// Décompte de charges locatif
// ============================================================================

export interface DecompteChargesLocatif {
  id: string;
  immeuble_id: string;
  year: number;
  status: 'DRAFT' | 'VALIDATED' | 'SENT' | 'CLOSED';

  // Période
  period_start: string;
  period_end: string;

  // Totaux
  total_charges: number;

  // Dates
  validated_at: string | null;
  sent_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface LigneChargeLocatif {
  id: string;
  decompte_id: string;
  type: ChargeLocativeType;
  label: string;
  amount: number;
  repartition_key: CleRepartition;
  created_at: string;
}

export interface DecompteIndividuelLocatif {
  id: string;
  decompte_id: string;
  bail_id: string;
  locataire_id: string;

  // Calculs
  total_charges: number;
  total_acomptes: number;
  solde: number;                  // Positif = dû par locataire

  // Détail
  detail: Record<ChargeLocativeType, number>;

  created_at: string;
}

// ============================================================================
// Contentieux Entity
// ============================================================================

export interface Contentieux {
  id: string;
  bail_id: string;
  locataire_id: string;

  // Statut
  status: ContentieuxStatus;

  // Montants
  initial_amount: number;         // Montant initial impayé
  current_amount: number;         // Montant actuel (avec intérêts/frais)
  recovered_amount: number;       // Montant récupéré

  // Dates clés
  opened_at: string;
  reminder1_at: string | null;
  reminder2_at: string | null;
  formal_notice_at: string | null;
  legal_action_at: string | null;
  closed_at: string | null;

  // Motif de clôture
  closure_reason: ResiliationMotif | null;

  // Documents
  documents: string[];            // IDs des documents

  // Metadata
  notes: string | null;
  assigned_to: string | null;     // Utilisateur en charge
  created_at: string;
  updated_at: string;
}

export interface ContentieuxWithDetails extends Contentieux {
  locataire: Pick<Locataire, 'id' | 'first_name' | 'last_name' | 'email'>;
  bail: Pick<Bail, 'id' | 'objet_locatif_id' | 'rent_amount'>;
  objet_code: string;
  immeuble_name: string;
}

export interface CreateContentieuxInput {
  bail_id: string;
  initial_amount: number;
  notes?: string;
}

// ============================================================================
// Intervention / Ticket Maintenance
// ============================================================================

export interface Intervention {
  id: string;
  immeuble_id: string;
  objet_locatif_id: string | null;

  // Identification
  number: string;                 // Numéro ticket
  type: 'REPAIR' | 'MAINTENANCE' | 'EMERGENCY' | 'IMPROVEMENT';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_PARTS' | 'COMPLETED' | 'CANCELLED';

  // Description
  title: string;
  description: string;
  reported_by: string | null;     // Locataire ou autre

  // Artisan
  artisan_id: string | null;
  artisan_name: string | null;

  // Dates
  reported_at: string;
  scheduled_at: string | null;
  completed_at: string | null;

  // Coûts
  estimated_cost: number | null;
  actual_cost: number | null;
  invoiced_to: 'OWNER' | 'TENANT' | 'INSURANCE' | null;

  // Metadata
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getImmeubleFullAddress(
  immeuble: Pick<Immeuble, 'address' | 'postal_code' | 'city'>
): string {
  return `${immeuble.address}, ${immeuble.postal_code} ${immeuble.city}`;
}

export function getLocataireFullName(
  locataire: Pick<Locataire, 'type' | 'first_name' | 'last_name' | 'company_name'>
): string {
  if (locataire.type === 'COMPANY' && locataire.company_name) {
    return locataire.company_name;
  }
  return `${locataire.first_name} ${locataire.last_name}`.trim();
}

export function getObjetDisplayName(objet: Pick<ObjetLocatif, 'code' | 'type' | 'rooms_count'>): string {
  const typeLabel = OBJET_LOCATIF_TYPE_LABELS[objet.type];
  const rooms = objet.rooms_count ? `${objet.rooms_count} pcs` : '';
  return `${objet.code} - ${typeLabel}${rooms ? ` (${rooms})` : ''}`;
}

export function calculateOccupancyRate(totalUnits: number, rentedUnits: number): number {
  if (totalUnits === 0) return 0;
  return Math.round((rentedUnits / totalUnits) * 100 * 10) / 10;
}

export function isBailActive(bail: Pick<Bail, 'status'>): boolean {
  return bail.status === 'ACTIVE';
}

export function isBailEnding(bail: Pick<Bail, 'status'>): boolean {
  return bail.status === 'NOTICE_GIVEN';
}

export function getBailTotalMonthly(bail: Pick<Bail, 'rent_amount' | 'charges_amount'>): number {
  return bail.rent_amount + bail.charges_amount;
}

export function isPaymentOverdue(avis: Pick<AvisLoyer, 'status' | 'due_date'>): boolean {
  if (avis.status === 'PAID') return false;
  return new Date(avis.due_date) < new Date();
}

export function getContentieuxDuration(contentieux: Pick<Contentieux, 'opened_at' | 'closed_at'>): number {
  const start = new Date(contentieux.opened_at);
  const end = contentieux.closed_at ? new Date(contentieux.closed_at) : new Date();
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
