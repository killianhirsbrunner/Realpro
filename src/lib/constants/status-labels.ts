/**
 * French labels for all status enums used in the application
 */

export const LOT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  OPTION: 'En option',
  SOLD: 'Vendu',
  DELIVERED: 'Livré',
  BLOCKED: 'Bloqué',
};

export const LOT_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  OPTION: 'info',
  SOLD: 'default',
  DELIVERED: 'default',
  BLOCKED: 'error',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: 'Planification',
  SALES: 'Commercialisation',
  CONSTRUCTION: 'Chantier',
  COMPLETED: 'Terminé',
  DELIVERED: 'Livré',
  CLOSED: 'Clôturé',
};

export const LOT_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Appartement',
  PENTHOUSE: 'Attique',
  DUPLEX: 'Duplex',
  VILLA: 'Villa',
  HOUSE: 'Maison',
  COMMERCIAL: 'Commercial',
  OFFICE: 'Bureau',
  SHOP: 'Commerce',
  PARKING: 'Parking',
  STORAGE: 'Cave',
  GARDEN: 'Jardin',
  TERRACE: 'Terrasse',
};

export const SALE_TYPE_LABELS: Record<string, string> = {
  PPE: 'PPE',
  QPT: 'QPT',
  RENTAL: 'Locatif',
};

export const PROSPECT_STATUS_LABELS: Record<string, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  QUALIFIED: 'Qualifié',
  RESERVED: 'Réservé',
  IN_SALE: 'En vente',
  SIGNED: 'Signé',
  LOST: 'Perdu',
};

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  EXPIRED: 'Expirée',
  CANCELLED: 'Annulée',
  CONFIRMED: 'Confirmée',
};

export const BUYER_FILE_STATUS_LABELS: Record<string, string> = {
  INCOMPLETE: 'Incomplet',
  READY_FOR_NOTARY: 'Prêt pour notaire',
  AT_NOTARY: 'Chez le notaire',
  SIGNED: 'Signé',
  COMPLETED: 'Complété',
};

export const NOTARY_FILE_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours',
  AWAITING_APPOINTMENT: 'Attente RDV',
  READY: 'Prêt à signer',
  SIGNED: 'Signé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Complété',
};

export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  COMPLETED: 'Terminé',
  TERMINATED: 'Résilié',
};

export const CONTRACT_TYPE_LABELS: Record<string, string> = {
  EG: 'Entreprise Générale',
  SUBCONTRACTOR: 'Sous-traitant',
  ARCHITECT: 'Architecte',
  ENGINEER: 'Ingénieur',
  SERVICE: 'Prestation',
  OTHER: 'Autre',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyée',
  APPROVED: 'Approuvée',
  PAID: 'Payée',
  OVERDUE: 'Échue',
  CANCELLED: 'Annulée',
};

export const WORK_PROGRESS_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumise',
  TECHNICALLY_APPROVED: 'Approuvée techniquement',
  FINANCIALLY_APPROVED: 'Approuvée financièrement',
  REJECTED: 'Refusée',
};

export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
  CLOSED: 'Clôturée',
  ADJUDICATED: 'Adjugée',
  CANCELLED: 'Annulée',
};

export const SUBMISSION_OFFER_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumise',
  WITHDRAWN: 'Retirée',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
};

export const PHASE_STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  DELAYED: 'Retardée',
  ON_HOLD: 'En attente',
};

export const MILESTONE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  ACHIEVED: 'Atteint',
  MISSED: 'Manqué',
  CANCELLED: 'Annulé',
};

export const CHANGE_REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  UNDER_REVIEW: 'En examen',
  APPROVED: 'Approuvée',
  REJECTED: 'Refusée',
  COMPLETED: 'Complétée',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: 'Virement bancaire',
  CREDIT_CARD: 'Carte de crédit',
  CHECK: 'Chèque',
  CASH: 'Espèces',
  OTHER: 'Autre',
};

/**
 * Get label for any status
 */
export function getStatusLabel(
  statusType: string,
  statusValue: string
): string {
  const maps: Record<string, Record<string, string>> = {
    lot: LOT_STATUS_LABELS,
    project: PROJECT_STATUS_LABELS,
    prospect: PROSPECT_STATUS_LABELS,
    reservation: RESERVATION_STATUS_LABELS,
    buyer_file: BUYER_FILE_STATUS_LABELS,
    notary_file: NOTARY_FILE_STATUS_LABELS,
    contract: CONTRACT_STATUS_LABELS,
    invoice: INVOICE_STATUS_LABELS,
    work_progress: WORK_PROGRESS_STATUS_LABELS,
    submission: SUBMISSION_STATUS_LABELS,
    submission_offer: SUBMISSION_OFFER_STATUS_LABELS,
    phase: PHASE_STATUS_LABELS,
    milestone: MILESTONE_STATUS_LABELS,
    change_request: CHANGE_REQUEST_STATUS_LABELS,
  };

  return maps[statusType]?.[statusValue] || statusValue;
}
