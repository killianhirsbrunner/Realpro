/**
 * RealPro PPE-Admin | Domain Entity Types
 *
 * Types spécifiques au domaine Administration de PPE (Propriété par Étages).
 * Basé sur les best practices de gestion de copropriété suisse.
 *
 * ⚠️ Ces types sont EXCLUSIFS à l'app PPE-Admin.
 * Ne pas importer dans Promoteur ou Régie.
 */

import type { Json, SwissCanton } from '@realpro/entities/shared';

// ============================================================================
// PPE-Specific Enums
// ============================================================================

/**
 * Statut d'une copropriété
 */
export type PPECoproprieteStatus = 'ACTIVE' | 'INACTIVE' | 'IN_CREATION' | 'DISSOLVED';

/**
 * Type de lot PPE
 */
export type PPELotType =
  | 'APARTMENT'      // Appartement
  | 'STUDIO'         // Studio
  | 'PENTHOUSE'      // Penthouse/Attique
  | 'COMMERCIAL'     // Local commercial
  | 'OFFICE'         // Bureau
  | 'PARKING_INT'    // Parking intérieur
  | 'PARKING_EXT'    // Parking extérieur
  | 'GARAGE'         // Garage/Box
  | 'STORAGE'        // Cave/Dépôt
  | 'GARDEN'         // Jardin privatif
  | 'TERRACE';       // Terrasse privative

/**
 * Statut d'une assemblée générale
 */
export type AGStatus = 'PLANNED' | 'CONVOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/**
 * Type d'assemblée générale
 */
export type AGType = 'ORDINARY' | 'EXTRAORDINARY';

/**
 * Type de majorité pour les votes
 */
export type VoteMajorityType =
  | 'SIMPLE'           // Majorité simple présents
  | 'ABSOLUTE'         // Majorité absolue (tous les copropriétaires)
  | 'QUALIFIED'        // Majorité qualifiée (2/3)
  | 'UNANIMOUS';       // Unanimité

/**
 * Statut d'un vote
 */
export type VoteStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ABSTAINED';

/**
 * Catégorie de charge PPE
 */
export type ChargeCategory =
  | 'HEATING'          // Chauffage
  | 'WATER_HOT'        // Eau chaude
  | 'WATER_COLD'       // Eau froide
  | 'ELECTRICITY'      // Électricité parties communes
  | 'ELEVATOR'         // Ascenseur
  | 'CLEANING'         // Nettoyage
  | 'GARDENING'        // Jardinage
  | 'INSURANCE'        // Assurance bâtiment
  | 'ADMINISTRATION'   // Frais d'administration
  | 'MAINTENANCE'      // Entretien courant
  | 'RENOVATION'       // Fonds de rénovation
  | 'OTHER';           // Autres

/**
 * Mode de répartition des charges
 */
export type ChargeDistributionMode =
  | 'MILLIEMES'        // Par millièmes
  | 'EQUAL'            // Parts égales
  | 'SURFACE'          // Par surface
  | 'CONSUMPTION'      // Par consommation
  | 'CUSTOM';          // Répartition personnalisée

/**
 * Rôles spécifiques au domaine PPE
 */
export type PPEUserRole =
  | 'admin'            // Administrateur système
  | 'administrator'    // Administrateur PPE (syndic)
  | 'accountant'       // Comptable
  | 'president'        // Président de la copropriété
  | 'committee'        // Membre du comité
  | 'owner'            // Copropriétaire
  | 'tenant';          // Locataire (accès limité)

// ============================================================================
// Status Labels
// ============================================================================

export const PPE_COPROPRIETE_STATUS_LABELS: Record<PPECoproprieteStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  IN_CREATION: 'En création',
  DISSOLVED: 'Dissoute',
};

export const PPE_LOT_TYPE_LABELS: Record<PPELotType, string> = {
  APARTMENT: 'Appartement',
  STUDIO: 'Studio',
  PENTHOUSE: 'Attique',
  COMMERCIAL: 'Local commercial',
  OFFICE: 'Bureau',
  PARKING_INT: 'Parking intérieur',
  PARKING_EXT: 'Parking extérieur',
  GARAGE: 'Garage',
  STORAGE: 'Cave',
  GARDEN: 'Jardin',
  TERRACE: 'Terrasse',
};

export const AG_STATUS_LABELS: Record<AGStatus, string> = {
  PLANNED: 'Planifiée',
  CONVOKED: 'Convoquée',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

export const AG_TYPE_LABELS: Record<AGType, string> = {
  ORDINARY: 'Ordinaire',
  EXTRAORDINARY: 'Extraordinaire',
};

export const CHARGE_CATEGORY_LABELS: Record<ChargeCategory, string> = {
  HEATING: 'Chauffage',
  WATER_HOT: 'Eau chaude',
  WATER_COLD: 'Eau froide',
  ELECTRICITY: 'Électricité',
  ELEVATOR: 'Ascenseur',
  CLEANING: 'Nettoyage',
  GARDENING: 'Jardinage',
  INSURANCE: 'Assurance',
  ADMINISTRATION: 'Administration',
  MAINTENANCE: 'Entretien',
  RENOVATION: 'Fonds rénovation',
  OTHER: 'Autres',
};

export const PPE_ROLE_LABELS: Record<PPEUserRole, string> = {
  admin: 'Administrateur système',
  administrator: 'Administrateur PPE',
  accountant: 'Comptable',
  president: 'Président',
  committee: 'Membre du comité',
  owner: 'Copropriétaire',
  tenant: 'Locataire',
};

// ============================================================================
// Copropriété Entity
// ============================================================================

export interface PPECopropriete {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  status: PPECoproprieteStatus;

  // Adresse
  address: string;
  postal_code: string;
  city: string;
  canton: SwissCanton;
  country: string;

  // Données PPE
  total_milliemes: number;        // Généralement 1000
  nb_lots: number;
  nb_coproprietaires: number;

  // Références
  egrid: string | null;           // Numéro EGRID (registre foncier)
  rf_number: string | null;       // Numéro registre foncier

  // Dates
  creation_date: string | null;   // Date création PPE
  fiscal_year_start: number;      // Mois début exercice (1-12)

  // Images et documents
  image_url: string | null;

  // Metadata
  settings: Json;
  created_at: string;
  updated_at: string;
}

export interface PPECoproprieteWithStats extends PPECopropriete {
  total_charges_year: number;
  unpaid_amount: number;
  fonds_renovation_balance: number;
  next_ag_date: string | null;
  pending_issues_count: number;
}

export interface CreatePPECoproprieteInput {
  name: string;
  code: string;
  address: string;
  postal_code: string;
  city: string;
  canton: SwissCanton;
  total_milliemes?: number;
  egrid?: string;
  rf_number?: string;
  creation_date?: string;
  fiscal_year_start?: number;
}

export interface UpdatePPECoproprieteInput {
  name?: string;
  code?: string;
  status?: PPECoproprieteStatus;
  address?: string;
  postal_code?: string;
  city?: string;
  canton?: SwissCanton;
  total_milliemes?: number;
  egrid?: string | null;
  rf_number?: string | null;
  creation_date?: string | null;
  fiscal_year_start?: number;
  image_url?: string | null;
  settings?: Json;
}

// ============================================================================
// Lot PPE Entity
// ============================================================================

export interface PPELot {
  id: string;
  copropriete_id: string;
  code: string;                   // Ex: "A-301", "P-12"
  type: PPELotType;

  // Millièmes et répartition
  milliemes: number;              // Part en millièmes
  milliemes_chauffage: number | null;  // Millièmes spécifiques chauffage
  milliemes_ascenseur: number | null;  // Millièmes spécifiques ascenseur

  // Description
  floor_level: number | null;     // Étage (-2, -1, 0, 1, 2...)
  rooms_count: number | null;
  surface_living: number | null;
  surface_total: number | null;

  // Références
  rf_lot_number: string | null;   // N° feuillet registre foncier

  // Metadata
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PPELotWithOwner extends PPELot {
  current_owner: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface CreatePPELotInput {
  copropriete_id: string;
  code: string;
  type: PPELotType;
  milliemes: number;
  milliemes_chauffage?: number;
  milliemes_ascenseur?: number;
  floor_level?: number;
  rooms_count?: number;
  surface_living?: number;
  surface_total?: number;
  rf_lot_number?: string;
  notes?: string;
}

// ============================================================================
// Copropriétaire Entity
// ============================================================================

export interface PPECoproprietaire {
  id: string;
  copropriete_id: string;
  user_id: string | null;         // Lien vers user si connecté

  // Identité
  type: 'INDIVIDUAL' | 'COMPANY';
  first_name: string;
  last_name: string;
  company_name: string | null;

  // Contact
  email: string;
  phone: string | null;
  mobile: string | null;

  // Adresse de correspondance
  correspondence_address: string | null;
  correspondence_postal_code: string | null;
  correspondence_city: string | null;

  // Banque (pour remboursements)
  iban: string | null;

  // Rôle dans la copropriété
  is_president: boolean;
  is_committee_member: boolean;

  // Lots possédés
  lot_ids: string[];

  // Metadata
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PPECoproprietaireWithLots extends PPECoproprietaire {
  lots: PPELot[];
  total_milliemes: number;
  outstanding_balance: number;
}

export interface CreatePPECoproprietaireInput {
  copropriete_id: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  first_name: string;
  last_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  mobile?: string;
  lot_ids: string[];
}

// ============================================================================
// Assemblée Générale Entity
// ============================================================================

export interface PPEAG {
  id: string;
  copropriete_id: string;
  type: AGType;
  status: AGStatus;

  // Planning
  title: string;
  date: string;                   // Date et heure de l'AG
  location: string;
  convocation_date: string | null;

  // Quorum
  milliemes_present: number;
  milliemes_represented: number;  // Par procuration
  quorum_reached: boolean;

  // Documents
  convocation_document_id: string | null;
  pv_document_id: string | null;

  // Metadata
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PPEAGWithDetails extends PPEAG {
  points_ordre_jour: PPEPointOrdreDuJour[];
  presences_count: number;
  procurations_count: number;
}

export interface CreatePPEAGInput {
  copropriete_id: string;
  type: AGType;
  title: string;
  date: string;
  location: string;
}

// ============================================================================
// Point d'ordre du jour
// ============================================================================

export interface PPEPointOrdreDuJour {
  id: string;
  ag_id: string;
  order_index: number;
  title: string;
  description: string | null;
  majority_type: VoteMajorityType;
  vote_status: VoteStatus | null;

  // Résultats du vote
  votes_pour: number | null;
  votes_contre: number | null;
  abstentions: number | null;

  created_at: string;
}

export interface CreatePPEPointOrdreDuJourInput {
  ag_id: string;
  order_index: number;
  title: string;
  description?: string;
  majority_type: VoteMajorityType;
}

// ============================================================================
// Décompte de charges
// ============================================================================

export interface PPEDecompteCharges {
  id: string;
  copropriete_id: string;
  year: number;
  status: 'DRAFT' | 'VALIDATED' | 'SENT' | 'CLOSED';

  // Montants globaux
  total_charges: number;
  total_acomptes: number;

  // Dates
  period_start: string;
  period_end: string;
  validated_at: string | null;
  sent_at: string | null;

  // Document
  document_id: string | null;

  created_at: string;
  updated_at: string;
}

export interface PPELigneCharge {
  id: string;
  decompte_id: string;
  category: ChargeCategory;
  label: string;
  amount: number;
  distribution_mode: ChargeDistributionMode;
  created_at: string;
}

export interface PPEDecompteIndividuel {
  id: string;
  decompte_id: string;
  coproprietaire_id: string;
  lot_id: string;

  // Calculs
  total_charges: number;
  total_acomptes: number;
  solde: number;                  // Positif = dû, Négatif = crédit

  // Détail par catégorie
  detail: Record<ChargeCategory, number>;

  created_at: string;
}

// ============================================================================
// Fonds de rénovation
// ============================================================================

export interface PPEFondsRenovation {
  id: string;
  copropriete_id: string;
  name: string;
  balance: number;
  target_amount: number | null;
  annual_contribution: number;

  // Compte bancaire dédié
  bank_account_iban: string | null;
  bank_name: string | null;

  created_at: string;
  updated_at: string;
}

export interface PPEMouvementFonds {
  id: string;
  fonds_id: string;
  date: string;
  type: 'CONTRIBUTION' | 'WITHDRAWAL' | 'INTEREST' | 'EXPENSE';
  amount: number;
  description: string;
  document_id: string | null;
  created_at: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getCoproprieteFullAddress(
  copro: Pick<PPECopropriete, 'address' | 'postal_code' | 'city'>
): string {
  return `${copro.address}, ${copro.postal_code} ${copro.city}`;
}

export function getCoproprietaireFullName(
  copro: Pick<PPECoproprietaire, 'type' | 'first_name' | 'last_name' | 'company_name'>
): string {
  if (copro.type === 'COMPANY' && copro.company_name) {
    return copro.company_name;
  }
  return `${copro.first_name} ${copro.last_name}`.trim();
}

export function calculateQuorumPercent(
  ag: Pick<PPEAG, 'milliemes_present' | 'milliemes_represented'>,
  totalMilliemes: number
): number {
  const total = ag.milliemes_present + ag.milliemes_represented;
  return Math.round((total / totalMilliemes) * 100 * 10) / 10;
}

export function isQuorumReached(
  ag: Pick<PPEAG, 'milliemes_present' | 'milliemes_represented'>,
  totalMilliemes: number,
  requiredPercent: number = 50
): boolean {
  const percent = calculateQuorumPercent(ag, totalMilliemes);
  return percent >= requiredPercent;
}

export function formatMilliemes(milliemes: number, total: number = 1000): string {
  const percent = (milliemes / total) * 100;
  return `${milliemes}‰ (${percent.toFixed(2)}%)`;
}

export function getLotDisplayName(lot: Pick<PPELot, 'code' | 'type'>): string {
  const typeLabel = PPE_LOT_TYPE_LABELS[lot.type];
  return `${lot.code} - ${typeLabel}`;
}
