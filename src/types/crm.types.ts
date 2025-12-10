// CRM Types - Shared type definitions for CRM module

/**
 * Prospect/Lead status enum
 */
export type ProspectStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'VISIT_SCHEDULED'
  | 'VISIT_DONE'
  | 'NEGOTIATING'
  | 'RESERVED'
  | 'CONVERTED'
  | 'LOST';

/**
 * Lead source enum
 */
export type LeadSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'BROKER'
  | 'ADVERTISING'
  | 'EVENT'
  | 'DIRECT'
  | 'OTHER';

/**
 * Contact type enum
 */
export type ContactType = 'PERSON' | 'COMPANY';

/**
 * Prospect/Lead data
 */
export interface Prospect {
  id: string;
  project_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: ProspectStatus;
  source: LeadSource;
  score?: number;
  interested_lots: string[];
  budget_min?: number;
  budget_max?: number;
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  next_followup_date?: string;
}

/**
 * Prospect activity
 */
export interface ProspectActivity {
  id: string;
  prospect_id: string;
  type: 'call' | 'email' | 'meeting' | 'visit' | 'note' | 'status_change';
  description: string;
  created_by: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * CRM Pipeline stage
 */
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  prospects_count: number;
  prospects: Prospect[];
}

/**
 * Buyer data (converted prospect)
 */
export interface Buyer {
  id: string;
  project_id: string;
  lot_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  reservation_date?: string;
  signature_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Company/Corporate contact
 */
export interface Company {
  id: string;
  name: string;
  type: 'BROKER' | 'CONTRACTOR' | 'SUPPLIER' | 'NOTARY' | 'BANK' | 'OTHER';
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  website?: string;
  contacts: Contact[];
  created_at: string;
}

/**
 * Contact person
 */
export interface Contact {
  id: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role?: string;
  is_primary: boolean;
}

/**
 * CRM Dashboard data
 */
export interface CRMDashboardData {
  totalProspects: number;
  newProspectsThisMonth: number;
  conversionRate: number;
  pipeline: PipelineStage[];
  topSources: Array<{
    source: LeadSource;
    count: number;
    percentage: number;
  }>;
  recentActivities: ProspectActivity[];
  upcomingFollowups: Prospect[];
}

/**
 * Lead scoring criteria
 */
export interface LeadScoringCriteria {
  budget_match: number;
  engagement_level: number;
  source_quality: number;
  timeline_urgency: number;
  response_speed: number;
}

/**
 * UseProspects hook return type
 */
export interface UseProspectsReturn {
  prospects: Prospect[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProspectStatus: (id: string, status: ProspectStatus) => Promise<void>;
  deleteProspect: (id: string) => Promise<void>;
}

/**
 * UseBuyers hook return type
 */
export interface UseBuyersReturn {
  buyers: Buyer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
