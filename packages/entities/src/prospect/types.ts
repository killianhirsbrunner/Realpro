/**
 * RealPro | Prospect/CRM Entity Types
 */

export type ProspectStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VISIT_SCHEDULED'
  | 'VISIT_DONE'
  | 'OFFER_SENT'
  | 'NEGOTIATION'
  | 'LOST'
  | 'CONVERTED';

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  QUALIFIED: 'Qualifié',
  VISIT_SCHEDULED: 'Visite planifiée',
  VISIT_DONE: 'Visite effectuée',
  OFFER_SENT: 'Offre envoyée',
  NEGOTIATION: 'En négociation',
  LOST: 'Perdu',
  CONVERTED: 'Converti',
};

export type ProspectSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'BROKER'
  | 'ADVERTISING'
  | 'SOCIAL_MEDIA'
  | 'EVENT'
  | 'OTHER';

export const PROSPECT_SOURCE_LABELS: Record<ProspectSource, string> = {
  WEBSITE: 'Site web',
  REFERRAL: 'Recommandation',
  BROKER: 'Courtier',
  ADVERTISING: 'Publicité',
  SOCIAL_MEDIA: 'Réseaux sociaux',
  EVENT: 'Événement',
  OTHER: 'Autre',
};

export interface Prospect {
  id: string;
  organization_id: string;
  project_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: ProspectStatus;
  source: ProspectSource | null;
  budget_min: number | null;
  budget_max: number | null;
  rooms_wanted: number | null;
  notes: string | null;
  interested_lots: string[] | null;
  last_contact_at: string | null;
  next_followup_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProspectWithProject extends Prospect {
  project_name: string;
  days_in_stage: number;
  interested_lots_info: Array<{
    id: string;
    code: string;
    type: string;
  }>;
}

export interface CRMActivity {
  id: string;
  prospect_id: string;
  type: 'NOTE' | 'CALL' | 'EMAIL' | 'MEETING' | 'VISIT' | 'TASK';
  description: string;
  outcome: string | null;
  created_by: string | null;
  created_at: string;
}

export interface CreateProspectInput {
  project_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status?: ProspectStatus;
  source?: ProspectSource;
  budget_min?: number;
  budget_max?: number;
  rooms_wanted?: number;
  notes?: string;
  interested_lots?: string[];
}

export interface UpdateProspectInput {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  status?: ProspectStatus;
  source?: ProspectSource | null;
  budget_min?: number | null;
  budget_max?: number | null;
  rooms_wanted?: number | null;
  notes?: string | null;
  interested_lots?: string[] | null;
  last_contact_at?: string | null;
  next_followup_at?: string | null;
  assigned_to?: string | null;
}

// Pipeline stage definition for Kanban view
export interface PipelineStage {
  id: ProspectStatus;
  label: string;
  color: string;
}

export const CRM_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'NEW', label: 'Nouveaux', color: 'blue' },
  { id: 'CONTACTED', label: 'Contactés', color: 'cyan' },
  { id: 'QUALIFIED', label: 'Qualifiés', color: 'indigo' },
  { id: 'VISIT_SCHEDULED', label: 'Visites planifiées', color: 'purple' },
  { id: 'VISIT_DONE', label: 'Visites effectuées', color: 'violet' },
  { id: 'OFFER_SENT', label: 'Offres envoyées', color: 'amber' },
  { id: 'NEGOTIATION', label: 'En négociation', color: 'orange' },
];

// Utility functions
export function getProspectFullName(prospect: Pick<Prospect, 'first_name' | 'last_name'>): string {
  return `${prospect.first_name} ${prospect.last_name}`;
}

export function getProspectInitials(prospect: Pick<Prospect, 'first_name' | 'last_name'>): string {
  return `${prospect.first_name.charAt(0)}${prospect.last_name.charAt(0)}`.toUpperCase();
}

export function isProspectActive(prospect: Pick<Prospect, 'status'>): boolean {
  return !['LOST', 'CONVERTED'].includes(prospect.status);
}

export function calculateDaysInStage(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
}
