/*
  # Système d'Interconnexion des Intervenants de Projet Immobilier

  Ce module crée une infrastructure complète pour:
  1. KYC (Know Your Customer) - Vérification identité et entreprise des intervenants
  2. 2FA SMS - Double authentification par SMS pour sécurité renforcée
  3. Documents Clients - Gestion des documents par les courtiers
  4. Workflow d'Onboarding - Processus guidé par type d'intervenant
  5. Activités et Audit - Traçabilité complète des actions

  Tables créées:
  - kyc_verifications: Processus KYC des intervenants
  - kyc_documents: Documents d'identité soumis
  - user_phone_verifications: Vérification téléphone pour 2FA
  - sms_verification_codes: Codes OTP envoyés par SMS
  - stakeholder_onboarding: Workflow d'onboarding par rôle
  - client_documents: Documents clients gérés par les courtiers
  - stakeholder_activities: Journal d'activités des intervenants
*/

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Statut de vérification KYC
DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM (
    'PENDING',      -- En attente de soumission
    'SUBMITTED',    -- Documents soumis, en attente de vérification
    'IN_REVIEW',    -- En cours de vérification
    'APPROVED',     -- Approuvé
    'REJECTED',     -- Rejeté
    'EXPIRED'       -- Expiré (nécessite renouvellement)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de document KYC
DO $$ BEGIN
  CREATE TYPE kyc_document_type AS ENUM (
    'PASSPORT',              -- Passeport
    'ID_CARD',               -- Carte d'identité
    'DRIVING_LICENSE',       -- Permis de conduire
    'RESIDENCE_PERMIT',      -- Permis de séjour
    'COMPANY_REGISTRATION',  -- Extrait RC (Registre du Commerce)
    'VAT_CERTIFICATE',       -- Certificat TVA
    'INSURANCE_CERTIFICATE', -- Attestation d'assurance RC
    'PROFESSIONAL_LICENSE',  -- Licence professionnelle (notaire, courtier)
    'BANK_STATEMENT',        -- Relevé bancaire (preuve d'adresse)
    'UTILITY_BILL',          -- Facture (preuve d'adresse)
    'COMPANY_STATUTES',      -- Statuts de la société
    'BENEFICIAL_OWNERS',     -- Registre des ayants droit économiques
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de vérification
DO $$ BEGIN
  CREATE TYPE verification_type AS ENUM (
    'IDENTITY',     -- Vérification d'identité personnelle
    'COMPANY',      -- Vérification d'entreprise
    'ADDRESS',      -- Vérification d'adresse
    'PROFESSIONAL'  -- Vérification professionnelle (licence, certification)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut de vérification téléphone
DO $$ BEGIN
  CREATE TYPE phone_verification_status AS ENUM (
    'UNVERIFIED',   -- Non vérifié
    'PENDING',      -- Code envoyé, en attente de validation
    'VERIFIED',     -- Vérifié
    'FAILED'        -- Échec après trop de tentatives
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut d'onboarding
DO $$ BEGIN
  CREATE TYPE onboarding_status AS ENUM (
    'NOT_STARTED',    -- Pas encore commencé
    'IN_PROGRESS',    -- En cours
    'PENDING_KYC',    -- En attente de validation KYC
    'PENDING_2FA',    -- En attente de configuration 2FA
    'COMPLETED',      -- Terminé
    'BLOCKED'         -- Bloqué (KYC rejeté, etc.)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de document client (pour les courtiers)
DO $$ BEGIN
  CREATE TYPE client_document_type AS ENUM (
    'RESERVATION_AGREEMENT',     -- Convention de réservation
    'EG_CONTRACT_SIGNED',        -- Contrat EG signé
    'ID_COPY',                   -- Copie pièce d'identité client
    'PROOF_OF_FUNDS',            -- Preuve de fonds
    'BANK_GUARANTEE',            -- Garantie bancaire
    'MORTGAGE_APPROVAL',         -- Accord de principe hypothécaire
    'POWER_OF_ATTORNEY',         -- Procuration
    'MARRIAGE_CONTRACT',         -- Contrat de mariage
    'TAX_RETURN',                -- Déclaration fiscale
    'EMPLOYMENT_CONTRACT',       -- Contrat de travail
    'AMENDMENT_SIGNED',          -- Avenant signé (plus-values)
    'DEPOSIT_RECEIPT',           -- Reçu d'acompte
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLE: KYC Verifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui est vérifié
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,

  -- Contexte
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  invitation_id uuid REFERENCES project_invitations(id) ON DELETE SET NULL,

  -- Type et statut
  verification_type verification_type NOT NULL DEFAULT 'IDENTITY',
  status kyc_status NOT NULL DEFAULT 'PENDING',

  -- Niveau de risque (calculé)
  risk_level text DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
  risk_score integer DEFAULT 0,

  -- Dates importantes
  submitted_at timestamptz,
  reviewed_at timestamptz,
  approved_at timestamptz,
  expires_at timestamptz,

  -- Vérificateur
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  review_notes text,
  rejection_reason text,

  -- Informations vérifiées (chiffrées/hashées en production)
  verified_data jsonb DEFAULT '{}', -- Nom, date de naissance, nationalité, etc.

  -- Métadonnées
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TABLE: KYC Documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_verification_id uuid NOT NULL REFERENCES kyc_verifications(id) ON DELETE CASCADE,

  -- Document
  document_type kyc_document_type NOT NULL,
  document_number text, -- Numéro de document (passeport, ID, etc.)

  -- Fichier
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  file_type text, -- MIME type

  -- Validité
  issue_date date,
  expiry_date date,
  issuing_country text DEFAULT 'CH',
  issuing_authority text,

  -- Vérification
  is_verified boolean DEFAULT false,
  verification_method text, -- MANUAL, OCR, EXTERNAL_API
  verification_result jsonb DEFAULT '{}',
  verified_at timestamptz,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,

  -- Métadonnées
  metadata jsonb DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TABLE: User Phone Verifications (2FA SMS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Numéro de téléphone
  phone_number text NOT NULL,
  country_code text NOT NULL DEFAULT 'CH',

  -- Statut
  status phone_verification_status NOT NULL DEFAULT 'UNVERIFIED',

  -- Dates
  verified_at timestamptz,
  last_code_sent_at timestamptz,

  -- Compteurs (protection anti-abus)
  verification_attempts integer DEFAULT 0,
  codes_sent_today integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,

  -- 2FA activé
  is_2fa_enabled boolean DEFAULT false,

  -- Backup codes (hashés)
  backup_codes_hash text[],

  -- Métadonnées
  metadata jsonb DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_phone UNIQUE (user_id, phone_number)
);

-- ============================================================================
-- TABLE: SMS Verification Codes
-- ============================================================================

CREATE TABLE IF NOT EXISTS sms_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_verification_id uuid REFERENCES user_phone_verifications(id) ON DELETE CASCADE,

  -- Code OTP (hashé en production)
  code_hash text NOT NULL,

  -- Type de vérification
  purpose text NOT NULL DEFAULT 'LOGIN', -- LOGIN, PHONE_VERIFY, TRANSACTION, PASSWORD_RESET

  -- Validité
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  is_used boolean DEFAULT false,
  used_at timestamptz,

  -- Tentatives
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 3,

  -- Métadonnées
  ip_address text,
  user_agent text,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TABLE: Stakeholder Onboarding
-- ============================================================================

CREATE TABLE IF NOT EXISTS stakeholder_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitation_id uuid REFERENCES project_invitations(id) ON DELETE SET NULL,

  -- Contexte
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Rôle et statut
  role participant_role NOT NULL,
  status onboarding_status NOT NULL DEFAULT 'NOT_STARTED',

  -- Étapes complétées
  steps_completed jsonb DEFAULT '[]', -- ['profile', 'kyc', '2fa', 'company', 'documents']
  current_step text DEFAULT 'welcome',

  -- Progression
  progress_percentage integer DEFAULT 0,

  -- Dates
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz DEFAULT now(),

  -- Configuration par rôle
  required_steps jsonb NOT NULL DEFAULT '["profile", "kyc", "2fa"]',
  optional_steps jsonb DEFAULT '[]',

  -- Notes et blocages
  notes text,
  blocked_reason text,

  -- Métadonnées
  metadata jsonb DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_project_onboarding UNIQUE (user_id, project_id)
);

-- ============================================================================
-- TABLE: Client Documents (pour les courtiers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contexte
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid REFERENCES lots(id) ON DELETE SET NULL,

  -- Client (prospect ou buyer)
  prospect_id uuid REFERENCES prospects(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES buyers(id) ON DELETE SET NULL,
  reservation_id uuid REFERENCES reservations(id) ON DELETE SET NULL,

  -- Document
  document_type client_document_type NOT NULL,
  title text NOT NULL,
  description text,

  -- Fichier
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  file_type text,

  -- Statut
  status text NOT NULL DEFAULT 'UPLOADED', -- UPLOADED, VALIDATED, REJECTED, EXPIRED

  -- Validation
  validated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  validated_at timestamptz,
  validation_notes text,
  rejection_reason text,

  -- Qui a uploadé
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Dates de validité
  valid_from date,
  valid_until date,

  -- Tags et catégories
  tags text[] DEFAULT '{}',
  category text,

  -- Signature électronique (si applicable)
  requires_signature boolean DEFAULT false,
  signature_status text, -- PENDING, SIGNED, REJECTED
  signed_at timestamptz,
  signed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  signature_data jsonb DEFAULT '{}',

  -- Métadonnées
  metadata jsonb DEFAULT '{}',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TABLE: Stakeholder Activities (Journal d'activités)
-- ============================================================================

CREATE TABLE IF NOT EXISTS stakeholder_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Contexte
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,

  -- Action
  action_type text NOT NULL, -- LOGIN, KYC_SUBMIT, DOCUMENT_UPLOAD, DOCUMENT_VIEW, etc.
  action_details jsonb DEFAULT '{}',

  -- Ressource concernée
  resource_type text, -- kyc_verification, client_document, lot, prospect, etc.
  resource_id uuid,

  -- Métadonnées techniques
  ip_address text,
  user_agent text,
  device_info jsonb DEFAULT '{}',
  location jsonb DEFAULT '{}', -- Géolocalisation approximative

  -- Résultat
  success boolean DEFAULT true,
  error_message text,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- TABLE: Stakeholder Permissions (Permissions granulaires par projet)
-- ============================================================================

CREATE TABLE IF NOT EXISTS stakeholder_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Contexte
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Permissions granulaires
  can_view_clients boolean DEFAULT false,
  can_edit_clients boolean DEFAULT false,
  can_upload_documents boolean DEFAULT false,
  can_validate_documents boolean DEFAULT false,
  can_view_financial boolean DEFAULT false,
  can_view_all_lots boolean DEFAULT true,
  can_reserve_lots boolean DEFAULT false,
  can_view_plans boolean DEFAULT false,
  can_download_plans boolean DEFAULT false,
  can_view_other_stakeholders boolean DEFAULT false,
  can_communicate boolean DEFAULT true,
  can_export_data boolean DEFAULT false,

  -- Permissions spécifiques par lots
  lot_restrictions uuid[] DEFAULT '{}', -- Si vide = tous les lots, sinon uniquement ceux listés

  -- Dates de validité
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,

  -- Métadonnées
  granted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  granted_at timestamptz DEFAULT now(),
  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_user_project_permissions UNIQUE (user_id, project_id)
);

-- ============================================================================
-- TABLE: Stakeholder Sessions (Sessions actives pour 2FA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS stakeholder_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Session token (hashé)
  session_token_hash text NOT NULL,

  -- 2FA validé pour cette session
  is_2fa_verified boolean DEFAULT false,
  verified_2fa_at timestamptz,

  -- Device info
  device_id text,
  device_name text,
  device_type text, -- desktop, mobile, tablet
  browser text,
  os text,

  -- IP et localisation
  ip_address text,
  location jsonb DEFAULT '{}',

  -- Validité
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  is_revoked boolean DEFAULT false,
  revoked_at timestamptz,
  revoked_reason text,

  -- Dernière activité
  last_activity_at timestamptz DEFAULT now(),

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEX pour performance
-- ============================================================================

-- KYC Verifications
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_organization_id ON kyc_verifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_project_id ON kyc_verifications(project_id);

-- KYC Documents
CREATE INDEX IF NOT EXISTS idx_kyc_documents_verification_id ON kyc_documents(kyc_verification_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_document_type ON kyc_documents(document_type);

-- Phone Verifications
CREATE INDEX IF NOT EXISTS idx_user_phone_verifications_user_id ON user_phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_phone_verifications_phone ON user_phone_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_user_phone_verifications_status ON user_phone_verifications(status);

-- SMS Codes
CREATE INDEX IF NOT EXISTS idx_sms_verification_codes_user_id ON sms_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_verification_codes_expires ON sms_verification_codes(expires_at);

-- Stakeholder Onboarding
CREATE INDEX IF NOT EXISTS idx_stakeholder_onboarding_user_id ON stakeholder_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_onboarding_project_id ON stakeholder_onboarding(project_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_onboarding_status ON stakeholder_onboarding(status);

-- Client Documents
CREATE INDEX IF NOT EXISTS idx_client_documents_organization_id ON client_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_project_id ON client_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_prospect_id ON client_documents(prospect_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_buyer_id ON client_documents(buyer_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_lot_id ON client_documents(lot_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_document_type ON client_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_client_documents_uploaded_by ON client_documents(uploaded_by);

-- Stakeholder Activities
CREATE INDEX IF NOT EXISTS idx_stakeholder_activities_user_id ON stakeholder_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_activities_organization_id ON stakeholder_activities(organization_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_activities_project_id ON stakeholder_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_activities_created_at ON stakeholder_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stakeholder_activities_action_type ON stakeholder_activities(action_type);

-- Stakeholder Permissions
CREATE INDEX IF NOT EXISTS idx_stakeholder_permissions_user_id ON stakeholder_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_permissions_project_id ON stakeholder_permissions(project_id);

-- Stakeholder Sessions
CREATE INDEX IF NOT EXISTS idx_stakeholder_sessions_user_id ON stakeholder_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_sessions_expires_at ON stakeholder_sessions(expires_at);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_sessions ENABLE ROW LEVEL SECURITY;

-- KYC Verifications: Users can view their own, org admins can view all in org
CREATE POLICY "Users can view their own KYC"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Org admins can view all KYC in org"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo
      JOIN user_roles ur ON uo.organization_id = ur.organization_id AND uo.user_id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE uo.user_id = auth.uid()
      AND r.name IN ('saas_admin', 'org_admin', 'promoter')
    )
  );

CREATE POLICY "Users can insert their own KYC"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending KYC"
  ON kyc_verifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('PENDING', 'SUBMITTED'))
  WITH CHECK (user_id = auth.uid());

-- KYC Documents: Users can manage their own
CREATE POLICY "Users can view their KYC documents"
  ON kyc_documents FOR SELECT
  TO authenticated
  USING (
    kyc_verification_id IN (
      SELECT id FROM kyc_verifications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their KYC documents"
  ON kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    kyc_verification_id IN (
      SELECT id FROM kyc_verifications WHERE user_id = auth.uid()
    )
  );

-- Phone Verifications: Users can manage their own
CREATE POLICY "Users can view their phone verifications"
  ON user_phone_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their phone verifications"
  ON user_phone_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their phone verifications"
  ON user_phone_verifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- SMS Codes: Users can view their own
CREATE POLICY "Users can view their SMS codes"
  ON sms_verification_codes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Stakeholder Onboarding: Users can view/update their own
CREATE POLICY "Users can view their onboarding"
  ON stakeholder_onboarding FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their onboarding"
  ON stakeholder_onboarding FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Client Documents: Based on project participation and role
CREATE POLICY "Stakeholders can view client documents in their projects"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM project_participants WHERE user_id = auth.uid()
    )
    OR
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Stakeholders can insert client documents"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_participants WHERE user_id = auth.uid()
    )
    OR
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Document uploaders can update their documents"
  ON client_documents FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

-- Stakeholder Activities: Users can view their own
CREATE POLICY "Users can view their activities"
  ON stakeholder_activities FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Stakeholder Permissions: Users can view their own permissions
CREATE POLICY "Users can view their permissions"
  ON stakeholder_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Stakeholder Sessions: Users can view their own sessions
CREATE POLICY "Users can view their sessions"
  ON stakeholder_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their sessions"
  ON stakeholder_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their sessions"
  ON stakeholder_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON kyc_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_phone_verifications_updated_at
  BEFORE UPDATE ON user_phone_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholder_onboarding_updated_at
  BEFORE UPDATE ON stakeholder_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_documents_updated_at
  BEFORE UPDATE ON client_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholder_permissions_updated_at
  BEFORE UPDATE ON stakeholder_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Fonction pour créer un code de vérification SMS
CREATE OR REPLACE FUNCTION create_sms_verification_code(
  p_user_id uuid,
  p_phone_verification_id uuid,
  p_purpose text DEFAULT 'LOGIN'
)
RETURNS TABLE(code text, expires_at timestamptz) AS $$
DECLARE
  v_code text;
  v_code_hash text;
  v_expires_at timestamptz;
  v_codes_today integer;
BEGIN
  -- Générer un code à 6 chiffres
  v_code := lpad(floor(random() * 1000000)::text, 6, '0');
  v_code_hash := encode(digest(v_code, 'sha256'), 'hex');
  v_expires_at := now() + interval '5 minutes';

  -- Vérifier le nombre de codes envoyés aujourd'hui
  SELECT COALESCE(upv.codes_sent_today, 0) INTO v_codes_today
  FROM user_phone_verifications upv
  WHERE upv.id = p_phone_verification_id;

  IF v_codes_today >= 5 THEN
    RAISE EXCEPTION 'Too many codes sent today';
  END IF;

  -- Invalider les codes précédents
  UPDATE sms_verification_codes
  SET is_used = true
  WHERE user_id = p_user_id
  AND purpose = p_purpose
  AND is_used = false;

  -- Créer le nouveau code
  INSERT INTO sms_verification_codes (
    user_id, phone_verification_id, code_hash, purpose, expires_at
  )
  VALUES (
    p_user_id, p_phone_verification_id, v_code_hash, p_purpose, v_expires_at
  );

  -- Mettre à jour le compteur
  UPDATE user_phone_verifications
  SET codes_sent_today = codes_sent_today + 1,
      last_code_sent_at = now()
  WHERE id = p_phone_verification_id;

  RETURN QUERY SELECT v_code, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier un code SMS
CREATE OR REPLACE FUNCTION verify_sms_code(
  p_user_id uuid,
  p_code text,
  p_purpose text DEFAULT 'LOGIN'
)
RETURNS boolean AS $$
DECLARE
  v_code_hash text;
  v_code_record record;
BEGIN
  v_code_hash := encode(digest(p_code, 'sha256'), 'hex');

  -- Trouver le code valide
  SELECT * INTO v_code_record
  FROM sms_verification_codes
  WHERE user_id = p_user_id
  AND code_hash = v_code_hash
  AND purpose = p_purpose
  AND is_used = false
  AND expires_at > now()
  AND attempts < max_attempts
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_code_record IS NULL THEN
    -- Incrémenter les tentatives sur le dernier code
    UPDATE sms_verification_codes
    SET attempts = attempts + 1
    WHERE user_id = p_user_id
    AND purpose = p_purpose
    AND is_used = false
    AND created_at = (
      SELECT MAX(created_at) FROM sms_verification_codes
      WHERE user_id = p_user_id AND purpose = p_purpose
    );

    RETURN false;
  END IF;

  -- Marquer le code comme utilisé
  UPDATE sms_verification_codes
  SET is_used = true, used_at = now()
  WHERE id = v_code_record.id;

  -- Si c'est pour vérification téléphone, mettre à jour le statut
  IF p_purpose = 'PHONE_VERIFY' AND v_code_record.phone_verification_id IS NOT NULL THEN
    UPDATE user_phone_verifications
    SET status = 'VERIFIED', verified_at = now()
    WHERE id = v_code_record.phone_verification_id;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer la progression de l'onboarding
CREATE OR REPLACE FUNCTION calculate_onboarding_progress(p_onboarding_id uuid)
RETURNS integer AS $$
DECLARE
  v_required_steps jsonb;
  v_completed_steps jsonb;
  v_total integer;
  v_completed integer;
BEGIN
  SELECT required_steps, steps_completed
  INTO v_required_steps, v_completed_steps
  FROM stakeholder_onboarding
  WHERE id = p_onboarding_id;

  v_total := jsonb_array_length(v_required_steps);
  v_completed := (
    SELECT COUNT(*)
    FROM jsonb_array_elements_text(v_required_steps) AS required
    WHERE required IN (SELECT jsonb_array_elements_text(v_completed_steps))
  );

  IF v_total = 0 THEN
    RETURN 100;
  END IF;

  RETURN (v_completed * 100 / v_total);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer l'onboarding lors de l'acceptation d'invitation
CREATE OR REPLACE FUNCTION create_stakeholder_onboarding()
RETURNS TRIGGER AS $$
DECLARE
  v_required_steps jsonb;
BEGIN
  -- Définir les étapes requises selon le rôle
  v_required_steps := CASE NEW.role
    WHEN 'BROKER' THEN '["profile", "company", "kyc_identity", "kyc_company", "2fa", "documents"]'::jsonb
    WHEN 'ARCHITECT' THEN '["profile", "company", "kyc_identity", "kyc_company", "2fa"]'::jsonb
    WHEN 'NOTARY' THEN '["profile", "company", "kyc_identity", "kyc_professional", "2fa"]'::jsonb
    WHEN 'ENGINEER' THEN '["profile", "company", "kyc_identity", "2fa"]'::jsonb
    WHEN 'GENERAL_CONTRACTOR' THEN '["profile", "company", "kyc_identity", "kyc_company", "2fa"]'::jsonb
    WHEN 'SUPPLIER' THEN '["profile", "company", "kyc_company"]'::jsonb
    WHEN 'BUYER' THEN '["profile", "kyc_identity", "2fa"]'::jsonb
    ELSE '["profile", "kyc_identity", "2fa"]'::jsonb
  END;

  INSERT INTO stakeholder_onboarding (
    user_id, invitation_id, organization_id, project_id, role, required_steps, status
  )
  VALUES (
    NEW.accepted_by, NEW.id, NEW.organization_id, NEW.project_id, NEW.role, v_required_steps, 'NOT_STARTED'
  )
  ON CONFLICT (user_id, project_id) DO UPDATE
  SET status = 'NOT_STARTED', updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_onboarding_on_invitation_accept
  AFTER UPDATE OF status ON project_invitations
  FOR EACH ROW
  WHEN (NEW.status = 'ACCEPTED')
  EXECUTE FUNCTION create_stakeholder_onboarding();

-- Fonction pour enregistrer une activité
CREATE OR REPLACE FUNCTION log_stakeholder_activity(
  p_user_id uuid,
  p_organization_id uuid,
  p_project_id uuid,
  p_action_type text,
  p_action_details jsonb DEFAULT '{}',
  p_resource_type text DEFAULT NULL,
  p_resource_id uuid DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO stakeholder_activities (
    user_id, organization_id, project_id, action_type, action_details,
    resource_type, resource_id, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_organization_id, p_project_id, p_action_type, p_action_details,
    p_resource_type, p_resource_id, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les étapes d'onboarding par rôle
CREATE OR REPLACE FUNCTION get_onboarding_steps_for_role(p_role participant_role)
RETURNS jsonb AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'BROKER' THEN jsonb_build_object(
      'required', '["profile", "company", "kyc_identity", "kyc_company", "2fa", "documents"]'::jsonb,
      'optional', '["preferences"]'::jsonb,
      'labels', jsonb_build_object(
        'profile', 'Compléter votre profil',
        'company', 'Informations de votre agence',
        'kyc_identity', 'Vérification d''identité',
        'kyc_company', 'Documents de l''entreprise',
        '2fa', 'Sécuriser votre compte (2FA)',
        'documents', 'Documents requis'
      )
    )
    WHEN 'ARCHITECT' THEN jsonb_build_object(
      'required', '["profile", "company", "kyc_identity", "kyc_company", "2fa"]'::jsonb,
      'optional', '["portfolio"]'::jsonb,
      'labels', jsonb_build_object(
        'profile', 'Compléter votre profil',
        'company', 'Informations du bureau',
        'kyc_identity', 'Vérification d''identité',
        'kyc_company', 'Documents de l''entreprise',
        '2fa', 'Sécuriser votre compte (2FA)'
      )
    )
    WHEN 'NOTARY' THEN jsonb_build_object(
      'required', '["profile", "company", "kyc_identity", "kyc_professional", "2fa"]'::jsonb,
      'optional', '[]'::jsonb,
      'labels', jsonb_build_object(
        'profile', 'Compléter votre profil',
        'company', 'Informations de l''étude',
        'kyc_identity', 'Vérification d''identité',
        'kyc_professional', 'Licence professionnelle',
        '2fa', 'Sécuriser votre compte (2FA)'
      )
    )
    WHEN 'BUYER' THEN jsonb_build_object(
      'required', '["profile", "kyc_identity", "2fa"]'::jsonb,
      'optional', '["financing"]'::jsonb,
      'labels', jsonb_build_object(
        'profile', 'Compléter votre profil',
        'kyc_identity', 'Vérification d''identité',
        '2fa', 'Sécuriser votre compte (2FA)'
      )
    )
    ELSE jsonb_build_object(
      'required', '["profile", "kyc_identity", "2fa"]'::jsonb,
      'optional', '[]'::jsonb,
      'labels', jsonb_build_object(
        'profile', 'Compléter votre profil',
        'kyc_identity', 'Vérification d''identité',
        '2fa', 'Sécuriser votre compte (2FA)'
      )
    )
  END;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si un utilisateur a complété son onboarding
CREATE OR REPLACE FUNCTION is_onboarding_complete(
  p_user_id uuid,
  p_project_id uuid
)
RETURNS boolean AS $$
DECLARE
  v_status onboarding_status;
BEGIN
  SELECT status INTO v_status
  FROM stakeholder_onboarding
  WHERE user_id = p_user_id AND project_id = p_project_id;

  RETURN v_status = 'COMPLETED';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour réinitialiser les compteurs de SMS quotidiens
CREATE OR REPLACE FUNCTION reset_daily_sms_counters()
RETURNS void AS $$
BEGIN
  UPDATE user_phone_verifications
  SET codes_sent_today = 0, last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE kyc_verifications IS 'Processus KYC (Know Your Customer) pour les intervenants du projet';
COMMENT ON TABLE kyc_documents IS 'Documents d''identité et d''entreprise soumis pour KYC';
COMMENT ON TABLE user_phone_verifications IS 'Numéros de téléphone vérifiés pour 2FA SMS';
COMMENT ON TABLE sms_verification_codes IS 'Codes OTP envoyés par SMS pour authentification';
COMMENT ON TABLE stakeholder_onboarding IS 'Workflow d''onboarding par type d''intervenant';
COMMENT ON TABLE client_documents IS 'Documents clients gérés par les courtiers (contrats, réservations)';
COMMENT ON TABLE stakeholder_activities IS 'Journal d''activités des intervenants pour audit';
COMMENT ON TABLE stakeholder_permissions IS 'Permissions granulaires par projet et intervenant';
COMMENT ON TABLE stakeholder_sessions IS 'Sessions actives avec statut 2FA';

COMMENT ON FUNCTION create_sms_verification_code IS 'Génère un code OTP à 6 chiffres pour vérification SMS';
COMMENT ON FUNCTION verify_sms_code IS 'Vérifie un code OTP et met à jour le statut si valide';
COMMENT ON FUNCTION log_stakeholder_activity IS 'Enregistre une activité d''intervenant pour audit';
COMMENT ON FUNCTION get_onboarding_steps_for_role IS 'Retourne les étapes d''onboarding requises par rôle';
