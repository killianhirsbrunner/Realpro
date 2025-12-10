/**
 * Types pour le système d'interconnexion des intervenants
 * KYC, 2FA, Onboarding et Documents Clients
 */

// ============================================================================
// ENUMS
// ============================================================================

export type KYCStatus = 'PENDING' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type KYCDocumentType =
  | 'PASSPORT'
  | 'ID_CARD'
  | 'DRIVING_LICENSE'
  | 'RESIDENCE_PERMIT'
  | 'COMPANY_REGISTRATION'
  | 'VAT_CERTIFICATE'
  | 'INSURANCE_CERTIFICATE'
  | 'PROFESSIONAL_LICENSE'
  | 'BANK_STATEMENT'
  | 'UTILITY_BILL'
  | 'COMPANY_STATUTES'
  | 'BENEFICIAL_OWNERS'
  | 'OTHER';

export type VerificationType = 'IDENTITY' | 'COMPANY' | 'ADDRESS' | 'PROFESSIONAL';

export type PhoneVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED';

export type OnboardingStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PENDING_KYC'
  | 'PENDING_2FA'
  | 'COMPLETED'
  | 'BLOCKED';

export type ClientDocumentType =
  | 'RESERVATION_AGREEMENT'
  | 'EG_CONTRACT_SIGNED'
  | 'ID_COPY'
  | 'PROOF_OF_FUNDS'
  | 'BANK_GUARANTEE'
  | 'MORTGAGE_APPROVAL'
  | 'POWER_OF_ATTORNEY'
  | 'MARRIAGE_CONTRACT'
  | 'TAX_RETURN'
  | 'EMPLOYMENT_CONTRACT'
  | 'AMENDMENT_SIGNED'
  | 'DEPOSIT_RECEIPT'
  | 'OTHER';

export type ParticipantRole =
  | 'PROMOTER'
  | 'BROKER'
  | 'ARCHITECT'
  | 'ENGINEER'
  | 'NOTARY'
  | 'GENERAL_CONTRACTOR'
  | 'SUPPLIER'
  | 'BUYER';

// ============================================================================
// KYC TYPES
// ============================================================================

export interface KYCVerification {
  id: string;
  user_id: string;
  company_id: string | null;
  organization_id: string;
  project_id: string | null;
  invitation_id: string | null;
  verification_type: VerificationType;
  status: KYCStatus;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  expires_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  rejection_reason: string | null;
  verified_data: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KYCDocument {
  id: string;
  kyc_verification_id: string;
  document_type: KYCDocumentType;
  document_number: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  issuing_country: string;
  issuing_authority: string | null;
  is_verified: boolean;
  verification_method: string | null;
  verification_result: Record<string, any>;
  verified_at: string | null;
  verified_by: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KYCVerificationWithDocuments extends KYCVerification {
  documents: KYCDocument[];
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

// ============================================================================
// 2FA / PHONE VERIFICATION TYPES
// ============================================================================

export interface PhoneVerification {
  id: string;
  user_id: string;
  phone_number: string;
  country_code: string;
  status: PhoneVerificationStatus;
  verified_at: string | null;
  last_code_sent_at: string | null;
  verification_attempts: number;
  codes_sent_today: number;
  last_reset_date: string;
  is_2fa_enabled: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SMSVerificationCode {
  id: string;
  user_id: string;
  phone_verification_id: string | null;
  code_hash: string;
  purpose: 'LOGIN' | 'PHONE_VERIFY' | 'TRANSACTION' | 'PASSWORD_RESET';
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  attempts: number;
  max_attempts: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface StakeholderSession {
  id: string;
  user_id: string;
  session_token_hash: string;
  is_2fa_verified: boolean;
  verified_2fa_at: string | null;
  device_id: string | null;
  device_name: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: Record<string, any>;
  expires_at: string;
  is_revoked: boolean;
  revoked_at: string | null;
  revoked_reason: string | null;
  last_activity_at: string;
  created_at: string;
}

// ============================================================================
// ONBOARDING TYPES
// ============================================================================

export interface StakeholderOnboarding {
  id: string;
  user_id: string;
  invitation_id: string | null;
  organization_id: string;
  project_id: string;
  role: ParticipantRole;
  status: OnboardingStatus;
  steps_completed: string[];
  current_step: string;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string;
  required_steps: string[];
  optional_steps: string[];
  notes: string | null;
  blocked_reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isRequired: boolean;
  isCurrent: boolean;
}

export interface OnboardingConfig {
  required: string[];
  optional: string[];
  labels: Record<string, string>;
}

// ============================================================================
// CLIENT DOCUMENTS TYPES
// ============================================================================

export interface ClientDocument {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string | null;
  prospect_id: string | null;
  buyer_id: string | null;
  reservation_id: string | null;
  document_type: ClientDocumentType;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  status: 'UPLOADED' | 'VALIDATED' | 'REJECTED' | 'EXPIRED';
  validated_by: string | null;
  validated_at: string | null;
  validation_notes: string | null;
  rejection_reason: string | null;
  uploaded_by: string;
  valid_from: string | null;
  valid_until: string | null;
  tags: string[];
  category: string | null;
  requires_signature: boolean;
  signature_status: 'PENDING' | 'SIGNED' | 'REJECTED' | null;
  signed_at: string | null;
  signed_by: string | null;
  signature_data: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ClientDocumentWithRelations extends ClientDocument {
  lot?: {
    id: string;
    lot_number: string;
    lot_type: string;
  };
  prospect?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  buyer?: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  uploader?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

// ============================================================================
// STAKEHOLDER ACTIVITY TYPES
// ============================================================================

export interface StakeholderActivity {
  id: string;
  user_id: string;
  organization_id: string;
  project_id: string | null;
  action_type: string;
  action_details: Record<string, any>;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_info: Record<string, any>;
  location: Record<string, any>;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

// ============================================================================
// STAKEHOLDER PERMISSIONS TYPES
// ============================================================================

export interface StakeholderPermissions {
  id: string;
  user_id: string;
  organization_id: string;
  project_id: string;
  can_view_clients: boolean;
  can_edit_clients: boolean;
  can_upload_documents: boolean;
  can_validate_documents: boolean;
  can_view_financial: boolean;
  can_view_all_lots: boolean;
  can_reserve_lots: boolean;
  can_view_plans: boolean;
  can_download_plans: boolean;
  can_view_other_stakeholders: boolean;
  can_communicate: boolean;
  can_export_data: boolean;
  lot_restrictions: string[];
  valid_from: string;
  valid_until: string | null;
  granted_by: string | null;
  granted_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PROJECT INVITATION TYPES (Enhanced)
// ============================================================================

export interface ProjectInvitation {
  id: string;
  project_id: string;
  organization_id: string;
  role: ParticipantRole;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_id: string | null;
  token: string;
  expires_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  invited_by: string;
  invited_at: string;
  accepted_by: string | null;
  accepted_at: string | null;
  message: string | null;
  permissions: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectInvitationWithRelations extends ProjectInvitation {
  project?: {
    id: string;
    name: string;
    address: string;
  };
  organization?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  company?: {
    id: string;
    name: string;
  };
  inviter?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface KYCSubmissionData {
  verification_type: VerificationType;
  personal_info?: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
  company_info?: {
    name: string;
    registration_number: string;
    vat_number: string;
    address: {
      street: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
  documents: Array<{
    document_type: KYCDocumentType;
    file: File;
    document_number?: string;
    issue_date?: string;
    expiry_date?: string;
  }>;
}

export interface PhoneVerificationData {
  phone_number: string;
  country_code: string;
}

export interface ClientDocumentUploadData {
  document_type: ClientDocumentType;
  title: string;
  description?: string;
  file: File;
  prospect_id?: string;
  buyer_id?: string;
  lot_id?: string;
  reservation_id?: string;
  valid_from?: string;
  valid_until?: string;
  requires_signature?: boolean;
  tags?: string[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface KYCStatusResponse {
  hasActiveKYC: boolean;
  verification: KYCVerificationWithDocuments | null;
  requiredDocuments: KYCDocumentType[];
  canProceed: boolean;
  blockedReason?: string;
}

export interface TwoFactorStatusResponse {
  isEnabled: boolean;
  isVerified: boolean;
  phoneNumber?: string;
  lastVerified?: string;
  backupCodesRemaining?: number;
}

export interface OnboardingStatusResponse {
  status: OnboardingStatus;
  progress: number;
  currentStep: string;
  completedSteps: string[];
  remainingSteps: string[];
  canAccessPlatform: boolean;
  blockedReason?: string;
}
