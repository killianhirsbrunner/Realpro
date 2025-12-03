/*
  # Add Notary Files and Enhance Sales Contracts

  ## Overview
  This migration creates the notary_files table and adds buyer_file_id and notary_file_id 
  to sales_contracts to integrate with the notary module.

  ## New Tables
  
  ### `notary_files`
  Notary files for managing notarial documentation
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `buyer_file_id` (uuid, foreign key to buyer_files)
  - `notary_id` (uuid, nullable, foreign key to companies where type='NOTARY')
  - `status` (enum: OPEN, IN_PROGRESS, READY, SIGNED, COMPLETED, CANCELLED)
  - `opening_date` (timestamptz, nullable)
  - `signature_date` (timestamptz, nullable)
  - `completion_date` (timestamptz, nullable)
  - `notes` (text, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ## Modified Tables

  ### `sales_contracts`
  - Add `buyer_file_id` (uuid, nullable, foreign key to buyer_files)
  - Add `notary_file_id` (uuid, nullable, foreign key to notary_files)

  ## Security
  - Enable RLS on `notary_files` table
  - Brokers, notaries, and admins can access notary files for their projects
*/

-- =====================================================
-- 1. CREATE NOTARY_FILES STATUS ENUM
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'notary_file_status'
  ) THEN
    CREATE TYPE notary_file_status AS ENUM (
      'OPEN',
      'IN_PROGRESS',
      'READY',
      'SIGNED',
      'COMPLETED',
      'CANCELLED'
    );
  END IF;
END $$;

-- =====================================================
-- 2. CREATE NOTARY_FILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notary_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  buyer_file_id uuid NOT NULL REFERENCES buyer_files(id) ON DELETE CASCADE,
  notary_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  status notary_file_status DEFAULT 'OPEN' NOT NULL,
  opening_date timestamptz,
  signature_date timestamptz,
  completion_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notary_files_project_id ON notary_files(project_id);
CREATE INDEX IF NOT EXISTS idx_notary_files_buyer_file_id ON notary_files(buyer_file_id);
CREATE INDEX IF NOT EXISTS idx_notary_files_notary_id ON notary_files(notary_id);
CREATE INDEX IF NOT EXISTS idx_notary_files_status ON notary_files(status);

-- =====================================================
-- 3. ADD BUYER_FILE_ID AND NOTARY_FILE_ID TO SALES_CONTRACTS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales_contracts' AND column_name = 'buyer_file_id'
  ) THEN
    ALTER TABLE sales_contracts ADD COLUMN buyer_file_id uuid REFERENCES buyer_files(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_sales_contracts_buyer_file_id ON sales_contracts(buyer_file_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales_contracts' AND column_name = 'notary_file_id'
  ) THEN
    ALTER TABLE sales_contracts ADD COLUMN notary_file_id uuid REFERENCES notary_files(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_sales_contracts_notary_file_id ON sales_contracts(notary_file_id);
  END IF;
END $$;

-- =====================================================
-- 4. ROW LEVEL SECURITY - NOTARY_FILES
-- =====================================================

ALTER TABLE notary_files ENABLE ROW LEVEL SECURITY;

-- Brokers, notaries, and admins can view notary files for their projects
CREATE POLICY "Authorized users can view notary files"
  ON notary_files
  FOR SELECT
  TO authenticated
  USING (
    -- Brokers can see notary files for their projects
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = notary_files.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('BROKER', 'NOTARY')
        AND pp.status = 'ACTIVE'
    )
    OR
    -- Admins and developers can see all notary files in their organization
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = notary_files.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- Brokers and admins can create notary files
CREATE POLICY "Authorized users can create notary files"
  ON notary_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = notary_files.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role = 'BROKER'
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = notary_files.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- Brokers, notaries, and admins can update notary files
CREATE POLICY "Authorized users can update notary files"
  ON notary_files
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = notary_files.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('BROKER', 'NOTARY')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = notary_files.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = notary_files.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('BROKER', 'NOTARY')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = notary_files.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 5. UPDATE TIMESTAMP TRIGGER FOR NOTARY_FILES
-- =====================================================

CREATE OR REPLACE FUNCTION update_notary_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notary_files_updated_at ON notary_files;
CREATE TRIGGER trigger_update_notary_files_updated_at
  BEFORE UPDATE ON notary_files
  FOR EACH ROW
  EXECUTE FUNCTION update_notary_files_updated_at();

-- =====================================================
-- 6. FUNCTION TO AUTO-CREATE NOTARY FILE WHEN SALES CONTRACT IS CREATED
-- =====================================================

CREATE OR REPLACE FUNCTION auto_create_notary_file_for_sales_contract()
RETURNS TRIGGER AS $$
DECLARE
  v_buyer_file_id uuid;
  v_notary_file_id uuid;
  v_project_id uuid;
BEGIN
  -- Get project_id and buyer_file_id
  SELECT sc.project_id, bf.id INTO v_project_id, v_buyer_file_id
  FROM sales_contracts sc
  LEFT JOIN buyer_files bf ON bf.buyer_id = NEW.buyer_id
  WHERE sc.id = NEW.id
  LIMIT 1;

  -- If no buyer_file exists, create one
  IF v_buyer_file_id IS NULL THEN
    INSERT INTO buyer_files (buyer_id, name, status)
    VALUES (NEW.buyer_id, 'Dossier acheteur', 'INCOMPLETE')
    RETURNING id INTO v_buyer_file_id;

    -- Update the sales_contract with buyer_file_id
    NEW.buyer_file_id := v_buyer_file_id;
  ELSE
    NEW.buyer_file_id := v_buyer_file_id;
  END IF;

  -- Create notary_file if it doesn't exist
  IF NEW.notary_file_id IS NULL AND v_buyer_file_id IS NOT NULL THEN
    INSERT INTO notary_files (project_id, buyer_file_id, status)
    VALUES (NEW.project_id, v_buyer_file_id, 'OPEN')
    RETURNING id INTO v_notary_file_id;

    NEW.notary_file_id := v_notary_file_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_create_notary_file ON sales_contracts;
CREATE TRIGGER trigger_auto_create_notary_file
  BEFORE INSERT ON sales_contracts
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_notary_file_for_sales_contract();

-- =====================================================
-- 7. ADD PERMISSIONS FOR NOTARY FILES
-- =====================================================

INSERT INTO permissions (id, resource, action, name, description, created_at)
VALUES
  (gen_random_uuid(), 'notary_files', 'read', 'notary_files:read', '{"en": "View notary files", "fr": "Voir les dossiers notaire", "de": "Notariatsakten anzeigen", "it": "Visualizzare i fascicoli notarili"}', now()),
  (gen_random_uuid(), 'notary_files', 'create', 'notary_files:create', '{"en": "Create notary files", "fr": "Créer des dossiers notaire", "de": "Notariatsakten erstellen", "it": "Creare fascicoli notarili"}', now()),
  (gen_random_uuid(), 'notary_files', 'update', 'notary_files:update', '{"en": "Update notary files", "fr": "Modifier les dossiers notaire", "de": "Notariatsakten aktualisieren", "it": "Aggiornare i fascicoli notarili"}', now())
ON CONFLICT (name) DO NOTHING;

-- Assign notary files permissions to BROKER and NOTARY roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name IN ('BROKER', 'NOTARY')
  AND p.name IN (
    'notary_files:read',
    'notary_files:create',
    'notary_files:update'
  )
ON CONFLICT DO NOTHING;
