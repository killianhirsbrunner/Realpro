/*
  # Create Advanced Features Modules

  1. New Tables
    - `financial_scenarios` - Simulateur financier
    - `project_public_pages` - Pages publiques projet  
    - `signature_requests` - Demandes de signature électronique
    - `site_diary_entries` - Journal de chantier
    - `site_diary_photos` - Photos journal de chantier
    - `company_warranties` - Garanties entreprises
    - `safety_plans` - Plans de prévention
    - `safety_trainings` - Formations sécurité
    - `handover_events` - Livraisons & prises de possession
    - `plan_annotations` - Annotations sur plans
    
  2. Security
    - Enable RLS on all tables
    - Restrictive policies for organization members
*/

-- Financial Scenarios
CREATE TABLE IF NOT EXISTS financial_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  assumptions jsonb DEFAULT '{}'::jsonb,
  results jsonb,
  base_on_actuals boolean DEFAULT true,
  created_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_scenarios_org ON financial_scenarios(organization_id);
CREATE INDEX IF NOT EXISTS idx_financial_scenarios_project ON financial_scenarios(project_id);

ALTER TABLE financial_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage scenarios in their org"
  ON financial_scenarios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = financial_scenarios.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = financial_scenarios.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- Project Public Pages
CREATE TABLE IF NOT EXISTS project_public_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  is_published boolean DEFAULT false,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  highlight_text text,
  sections jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_public_pages_slug ON project_public_pages(slug);
CREATE INDEX IF NOT EXISTS idx_project_public_pages_project ON project_public_pages(project_id);

ALTER TABLE project_public_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public pages are viewable by anyone"
  ON project_public_pages
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can manage public pages for their projects"
  ON project_public_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_public_pages.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_public_pages.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Signature Requests
CREATE TABLE IF NOT EXISTS signature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'PENDING' NOT NULL,
  provider text,
  provider_request_id text,
  signer_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signature_requests_org ON signature_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_signature_requests_doc ON signature_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_signature_requests_status ON signature_requests(status);

ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage signature requests in their org"
  ON signature_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- Site Diary Entries
CREATE TABLE IF NOT EXISTS site_diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  entry_date date NOT NULL,
  weather text,
  notes text,
  created_by_id uuid REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_diary_project ON site_diary_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_site_diary_date ON site_diary_entries(entry_date);

ALTER TABLE site_diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage site diary for their projects"
  ON site_diary_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = site_diary_entries.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = site_diary_entries.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Site Diary Photos
CREATE TABLE IF NOT EXISTS site_diary_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id uuid REFERENCES site_diary_entries(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_diary_photos_diary ON site_diary_photos(diary_id);

ALTER TABLE site_diary_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage photos for their diary entries"
  ON site_diary_photos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM site_diary_entries sde
      JOIN projects p ON p.id = sde.project_id
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE sde.id = site_diary_photos.diary_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_diary_entries sde
      JOIN projects p ON p.id = sde.project_id
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE sde.id = site_diary_photos.diary_id
      AND uo.user_id = auth.uid()
    )
  );

-- Company Warranties
CREATE TABLE IF NOT EXISTS company_warranties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  start_at date NOT NULL,
  end_at date NOT NULL,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_warranties_company ON company_warranties(company_id);
CREATE INDEX IF NOT EXISTS idx_company_warranties_project ON company_warranties(project_id);

ALTER TABLE company_warranties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage company warranties for their projects"
  ON company_warranties
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = company_warranties.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = company_warranties.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Safety Plans
CREATE TABLE IF NOT EXISTS safety_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_safety_plans_project ON safety_plans(project_id);

ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage safety plans for their projects"
  ON safety_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_plans.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_plans.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Safety Trainings
CREATE TABLE IF NOT EXISTS safety_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  training_date date NOT NULL,
  topic text NOT NULL,
  attendees jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_safety_trainings_project ON safety_trainings(project_id);
CREATE INDEX IF NOT EXISTS idx_safety_trainings_company ON safety_trainings(company_id);

ALTER TABLE safety_trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage safety trainings for their projects"
  ON safety_trainings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_trainings.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_trainings.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Handover Events
CREATE TABLE IF NOT EXISTS handover_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  lot_id uuid REFERENCES lots(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES buyers(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  event_date timestamptz NOT NULL,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_handover_events_project ON handover_events(project_id);
CREATE INDEX IF NOT EXISTS idx_handover_events_lot ON handover_events(lot_id);
CREATE INDEX IF NOT EXISTS idx_handover_events_buyer ON handover_events(buyer_id);

ALTER TABLE handover_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view handover events for their projects"
  ON handover_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = handover_events.project_id
      AND uo.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM buyers b
      WHERE b.id = handover_events.buyer_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage handover events for their projects"
  ON handover_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = handover_events.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update handover events for their projects"
  ON handover_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = handover_events.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = handover_events.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Plan Annotations
CREATE TABLE IF NOT EXISTS plan_annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  lot_id uuid REFERENCES lots(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  x float NOT NULL,
  y float NOT NULL,
  page int DEFAULT 1,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_annotations_doc ON plan_annotations(document_id);
CREATE INDEX IF NOT EXISTS idx_plan_annotations_project ON plan_annotations(project_id);

ALTER TABLE plan_annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage plan annotations for their projects"
  ON plan_annotations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = plan_annotations.project_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = plan_annotations.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Update triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER financial_scenarios_updated_at
  BEFORE UPDATE ON financial_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER project_public_pages_updated_at
  BEFORE UPDATE ON project_public_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER signature_requests_updated_at
  BEFORE UPDATE ON signature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
