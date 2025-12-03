/*
  # Submissions & Adjudications Module

  ## Overview
  This migration creates the submissions module for managing tender processes:
  - Companies submit offers for work packages
  - Project managers compare offers
  - Adjudicate winners and create contracts automatically

  ## New Tables

  ### `submissions`
  Tender/RFQ for a work package
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `reference` (text) - Reference number (e.g., "SOUM-2024-001")
  - `title` (text) - Title of tender
  - `description` (text, nullable)
  - `cfc_budget_id` (uuid, nullable, foreign key to cfc_budgets)
  - `status` (enum: DRAFT, PUBLISHED, CLOSED, ADJUDICATED, CANCELLED)
  - `submission_deadline` (timestamptz, nullable)
  - `published_at` (timestamptz, nullable)
  - `closed_at` (timestamptz, nullable)
  - `adjudicated_at` (timestamptz, nullable)
  - `created_by_id` (uuid, foreign key to users)
  - `created_at`, `updated_at` (timestamptz)

  ### `submission_invites`
  Companies invited to submit offers
  - `id` (uuid, primary key)
  - `submission_id` (uuid, foreign key to submissions)
  - `company_id` (uuid, foreign key to companies)
  - `invited_at` (timestamptz)
  - `invited_by_id` (uuid, foreign key to users)
  - `status` (enum: PENDING, ACCEPTED, DECLINED, SUBMITTED)
  - `responded_at` (timestamptz, nullable)

  ### `submission_offers`
  Offers submitted by companies
  - `id` (uuid, primary key)
  - `submission_id` (uuid, foreign key to submissions)
  - `company_id` (uuid, foreign key to companies)
  - `reference` (text, nullable) - Company's offer reference
  - `total_amount` (numeric) - Total offer amount
  - `vat_rate` (numeric, default 8.1)
  - `vat_amount` (numeric, default 0)
  - `total_with_vat` (numeric)
  - `delivery_time_days` (integer, nullable) - Proposed delivery time
  - `notes` (text, nullable) - Company notes
  - `status` (enum: DRAFT, SUBMITTED, WITHDRAWN, ACCEPTED, REJECTED)
  - `submitted_at` (timestamptz, nullable)
  - `submitted_by_id` (uuid, nullable, foreign key to users)
  - `is_winner` (boolean, default false)
  - `adjudication_notes` (text, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ### `submission_offer_items`
  Line items in an offer
  - `id` (uuid, primary key)
  - `submission_offer_id` (uuid, foreign key to submission_offers)
  - `line_number` (integer)
  - `description` (text)
  - `quantity` (numeric)
  - `unit` (text) - Unit of measurement (e.g., "m²", "pcs", "hours")
  - `unit_price` (numeric)
  - `total_price` (numeric)
  - `notes` (text, nullable)

  ### `submission_documents`
  Documents attached to submissions or offers
  - `id` (uuid, primary key)
  - `submission_id` (uuid, nullable, foreign key to submissions)
  - `submission_offer_id` (uuid, nullable, foreign key to submission_offers)
  - `document_id` (uuid, foreign key to documents)
  - `category` (text) - e.g., "TECHNICAL_SPEC", "OFFER_DOCUMENT", "CERTIFICATE"
  - `uploaded_at` (timestamptz)
  - `uploaded_by_id` (uuid, foreign key to users)

  ## Security
  - Enable RLS on all tables
  - Project managers and admins can manage submissions
  - Invited companies can view and submit offers
  - Only project team can view comparison data
*/

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM (
      'DRAFT',
      'PUBLISHED',
      'CLOSED',
      'ADJUDICATED',
      'CANCELLED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_invite_status') THEN
    CREATE TYPE submission_invite_status AS ENUM (
      'PENDING',
      'ACCEPTED',
      'DECLINED',
      'SUBMITTED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_offer_status') THEN
    CREATE TYPE submission_offer_status AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'WITHDRAWN',
      'ACCEPTED',
      'REJECTED'
    );
  END IF;
END $$;

-- =====================================================
-- 2. CREATE SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference text NOT NULL,
  title text NOT NULL,
  description text,
  cfc_budget_id uuid REFERENCES cfc_budgets(id) ON DELETE SET NULL,
  status submission_status DEFAULT 'DRAFT' NOT NULL,
  submission_deadline timestamptz,
  published_at timestamptz,
  closed_at timestamptz,
  adjudicated_at timestamptz,
  created_by_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_submission_reference_per_project'
  ) THEN
    ALTER TABLE submissions ADD CONSTRAINT unique_submission_reference_per_project UNIQUE (project_id, reference);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submissions_project_id ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_deadline ON submissions(submission_deadline);

-- =====================================================
-- 3. CREATE SUBMISSION_INVITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS submission_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invited_at timestamptz DEFAULT now() NOT NULL,
  invited_by_id uuid NOT NULL REFERENCES users(id),
  status submission_invite_status DEFAULT 'PENDING' NOT NULL,
  responded_at timestamptz
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_invite_per_company'
  ) THEN
    ALTER TABLE submission_invites ADD CONSTRAINT unique_invite_per_company UNIQUE (submission_id, company_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submission_invites_submission_id ON submission_invites(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_invites_company_id ON submission_invites(company_id);
CREATE INDEX IF NOT EXISTS idx_submission_invites_status ON submission_invites(status);

-- =====================================================
-- 4. CREATE SUBMISSION_OFFERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS submission_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  reference text,
  total_amount numeric NOT NULL DEFAULT 0,
  vat_rate numeric DEFAULT 8.1 NOT NULL,
  vat_amount numeric DEFAULT 0 NOT NULL,
  total_with_vat numeric NOT NULL DEFAULT 0,
  delivery_time_days integer,
  notes text,
  status submission_offer_status DEFAULT 'DRAFT' NOT NULL,
  submitted_at timestamptz,
  submitted_by_id uuid REFERENCES users(id),
  is_winner boolean DEFAULT false NOT NULL,
  adjudication_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_offer_per_company'
  ) THEN
    ALTER TABLE submission_offers ADD CONSTRAINT unique_offer_per_company UNIQUE (submission_id, company_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submission_offers_submission_id ON submission_offers(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_offers_company_id ON submission_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_submission_offers_status ON submission_offers(status);
CREATE INDEX IF NOT EXISTS idx_submission_offers_winner ON submission_offers(is_winner) WHERE is_winner = true;

-- =====================================================
-- 5. CREATE SUBMISSION_OFFER_ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS submission_offer_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_offer_id uuid NOT NULL REFERENCES submission_offers(id) ON DELETE CASCADE,
  line_number integer NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  notes text
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_line_number_per_offer'
  ) THEN
    ALTER TABLE submission_offer_items ADD CONSTRAINT unique_line_number_per_offer UNIQUE (submission_offer_id, line_number);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submission_offer_items_offer_id ON submission_offer_items(submission_offer_id);

-- =====================================================
-- 6. CREATE SUBMISSION_DOCUMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS submission_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  submission_offer_id uuid REFERENCES submission_offers(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  category text NOT NULL,
  uploaded_at timestamptz DEFAULT now() NOT NULL,
  uploaded_by_id uuid NOT NULL REFERENCES users(id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_submission_or_offer'
  ) THEN
    ALTER TABLE submission_documents ADD CONSTRAINT check_submission_or_offer CHECK (
      (submission_id IS NOT NULL AND submission_offer_id IS NULL) OR
      (submission_id IS NULL AND submission_offer_id IS NOT NULL)
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_submission_documents_submission_id ON submission_documents(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_documents_offer_id ON submission_documents(submission_offer_id);
CREATE INDEX IF NOT EXISTS idx_submission_documents_document_id ON submission_documents(document_id);

-- =====================================================
-- 7. ROW LEVEL SECURITY - SUBMISSIONS
-- =====================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project team can manage submissions" ON submissions;
CREATE POLICY "Project team can manage submissions"
  ON submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = submissions.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('EG', 'ARCHITECT', 'ENGINEER')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = submissions.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 8. ROW LEVEL SECURITY - SUBMISSION_INVITES
-- =====================================================

ALTER TABLE submission_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project team and invited companies can view invites" ON submission_invites;
CREATE POLICY "Project team and invited companies can view invites"
  ON submission_invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN project_participants pp ON pp.project_id = s.project_id
      WHERE s.id = submission_invites.submission_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = (SELECT organization_id FROM companies WHERE id = submission_invites.company_id)
    )
  );

DROP POLICY IF EXISTS "Project team can manage invites" ON submission_invites;
CREATE POLICY "Project team can manage invites"
  ON submission_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN project_participants pp ON pp.project_id = s.project_id
      WHERE s.id = submission_invites.submission_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('EG', 'ARCHITECT')
        AND pp.status = 'ACTIVE'
    )
  );

-- =====================================================
-- 9. ROW LEVEL SECURITY - SUBMISSION_OFFERS
-- =====================================================

ALTER TABLE submission_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Companies can manage their own offers" ON submission_offers;
CREATE POLICY "Companies can manage their own offers"
  ON submission_offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = (SELECT organization_id FROM companies WHERE id = submission_offers.company_id)
    )
    OR
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN project_participants pp ON pp.project_id = s.project_id
      WHERE s.id = submission_offers.submission_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
  );

-- =====================================================
-- 10. ROW LEVEL SECURITY - SUBMISSION_OFFER_ITEMS
-- =====================================================

ALTER TABLE submission_offer_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Offer items follow offer access" ON submission_offer_items;
CREATE POLICY "Offer items follow offer access"
  ON submission_offer_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submission_offers so
      WHERE so.id = submission_offer_items.submission_offer_id
    )
  );

-- =====================================================
-- 11. ROW LEVEL SECURITY - SUBMISSION_DOCUMENTS
-- =====================================================

ALTER TABLE submission_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authorized users can view submission documents" ON submission_documents;
CREATE POLICY "Authorized users can view submission documents"
  ON submission_documents
  FOR SELECT
  TO authenticated
  USING (
    (submission_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM submissions WHERE id = submission_documents.submission_id
    ))
    OR
    (submission_offer_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM submission_offers WHERE id = submission_documents.submission_offer_id
    ))
  );

-- =====================================================
-- 12. UPDATE TIMESTAMP TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_submissions_updated_at ON submissions;
CREATE TRIGGER trigger_update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_submissions_updated_at();

DROP TRIGGER IF EXISTS trigger_update_submission_offers_updated_at ON submission_offers;
CREATE TRIGGER trigger_update_submission_offers_updated_at
  BEFORE UPDATE ON submission_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_submissions_updated_at();

-- =====================================================
-- 13. FUNCTION TO AUTO-UPDATE INVITE STATUS
-- =====================================================

CREATE OR REPLACE FUNCTION update_invite_status_on_offer_submit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'SUBMITTED' AND OLD.status != 'SUBMITTED' THEN
    UPDATE submission_invites
    SET status = 'SUBMITTED', responded_at = now()
    WHERE submission_id = NEW.submission_id
      AND company_id = NEW.company_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_invite_on_submit ON submission_offers;
CREATE TRIGGER trigger_update_invite_on_submit
  AFTER UPDATE ON submission_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_invite_status_on_offer_submit();
