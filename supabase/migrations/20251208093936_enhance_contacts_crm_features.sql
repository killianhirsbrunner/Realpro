/*
  # Enrichissement CRM - Contacts & Entreprises

  ## Modifications sur tables existantes
  
  ### Enrichissement de `companies`:
  - Ajout de colonnes CRM: legal_form, industry, tags, is_client, is_supplier, is_partner, status
  
  ### Enrichissement de `contacts`:
  - Ajout de colonnes CRM: mobile, department, linkedin_url, preferred_language, contact_type, is_primary, status, tags, address_*, user_id, created_by
  
  ## Nouvelles tables
  
  ### 1. `contact_interactions` - Historique des interactions
  - Appels, emails, réunions, notes
  - Lien avec contacts, entreprises, projets
  - Suivi des actions futures
  
  ### 2. `contact_tags` - Tags personnalisables
  - Tags pour contacts et entreprises
  - Couleurs personnalisées
  - Catégorisation flexible

  ## Sécurité
  - RLS activé sur nouvelles tables
  - Policies restrictives basées sur organization_id
*/

-- =====================================================
-- ENRICHISSEMENT: TABLE companies
-- =====================================================

-- Ajouter colonnes CRM manquantes à companies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'legal_form') THEN
    ALTER TABLE companies ADD COLUMN legal_form text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'industry') THEN
    ALTER TABLE companies ADD COLUMN industry text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'tags') THEN
    ALTER TABLE companies ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'is_client') THEN
    ALTER TABLE companies ADD COLUMN is_client boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'is_supplier') THEN
    ALTER TABLE companies ADD COLUMN is_supplier boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'is_partner') THEN
    ALTER TABLE companies ADD COLUMN is_partner boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'status') THEN
    ALTER TABLE companies ADD COLUMN status text DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'created_by') THEN
    ALTER TABLE companies ADD COLUMN created_by uuid REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ajouter index sur tags pour companies si pas déjà présent
CREATE INDEX IF NOT EXISTS idx_companies_tags_gin ON companies USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_companies_status_filter ON companies(organization_id, status);

-- =====================================================
-- ENRICHISSEMENT: TABLE contacts
-- =====================================================

-- Ajouter colonnes CRM manquantes à contacts
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'mobile') THEN
    ALTER TABLE contacts ADD COLUMN mobile text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'department') THEN
    ALTER TABLE contacts ADD COLUMN department text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'address_street') THEN
    ALTER TABLE contacts ADD COLUMN address_street text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'address_city') THEN
    ALTER TABLE contacts ADD COLUMN address_city text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'address_postal_code') THEN
    ALTER TABLE contacts ADD COLUMN address_postal_code text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'address_canton') THEN
    ALTER TABLE contacts ADD COLUMN address_canton text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'address_country') THEN
    ALTER TABLE contacts ADD COLUMN address_country text DEFAULT 'CH';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'tags') THEN
    ALTER TABLE contacts ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'linkedin_url') THEN
    ALTER TABLE contacts ADD COLUMN linkedin_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'preferred_language') THEN
    ALTER TABLE contacts ADD COLUMN preferred_language text DEFAULT 'fr';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'contact_type') THEN
    ALTER TABLE contacts ADD COLUMN contact_type text DEFAULT 'contact';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'is_primary') THEN
    ALTER TABLE contacts ADD COLUMN is_primary boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
    ALTER TABLE contacts ADD COLUMN status text DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'user_id') THEN
    ALTER TABLE contacts ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'created_by') THEN
    ALTER TABLE contacts ADD COLUMN created_by uuid REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ajouter index sur tags pour contacts si pas déjà présent
CREATE INDEX IF NOT EXISTS idx_contacts_tags_gin ON contacts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_contacts_type_filter ON contacts(organization_id, contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_user_link ON contacts(user_id);

-- =====================================================
-- NOUVELLE TABLE: contact_interactions
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  interaction_type text NOT NULL,
  subject text NOT NULL,
  description text,
  interaction_date timestamptz DEFAULT now(),
  duration_minutes integer,
  outcome text,
  next_action text,
  next_action_date timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour contact_interactions
CREATE INDEX IF NOT EXISTS idx_interactions_org ON contact_interactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_interactions_contact ON contact_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_interactions_company ON contact_interactions(company_id);
CREATE INDEX IF NOT EXISTS idx_interactions_project ON contact_interactions(project_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON contact_interactions(organization_id, interaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_next_action ON contact_interactions(organization_id, next_action_date) WHERE next_action_date IS NOT NULL;

-- =====================================================
-- NOUVELLE TABLE: contact_tags
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  category text DEFAULT 'contact',
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, name, category)
);

-- Index pour contact_tags
CREATE INDEX IF NOT EXISTS idx_contact_tags_org ON contact_tags(organization_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_category ON contact_tags(organization_id, category);

-- =====================================================
-- RLS POLICIES pour contact_interactions
-- =====================================================

ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions in their organization"
  ON contact_interactions FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create interactions in their organization"
  ON contact_interactions FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update interactions in their organization"
  ON contact_interactions FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete interactions in their organization"
  ON contact_interactions FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES pour contact_tags
-- =====================================================

ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tags in their organization"
  ON contact_tags FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create tags in their organization"
  ON contact_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update tags in their organization"
  ON contact_tags FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tags in their organization"
  ON contact_tags FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGER pour updated_at sur contact_interactions
-- =====================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contact_interactions_updated_at') THEN
    CREATE TRIGGER update_contact_interactions_updated_at
      BEFORE UPDATE ON contact_interactions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;