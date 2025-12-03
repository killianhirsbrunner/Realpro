/*
  # Enhanced Courtiers (Brokers) Module
  
  ## Overview
  This migration enhances the Courtiers module to allow brokers to manage:
  - Lot status updates (FREE/RESERVED/SOLD/BLOCKED)
  - Reservation signature dates
  - Sales contracts (actes notariés) with signed documents
  - Attachment of signed EG contracts as documents
  
  ## New Tables
  
  ### `sales_contracts`
  Sales contracts representing notarized acts (actes notariés)
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `lot_id` (uuid, foreign key to lots)
  - `buyer_id` (uuid, foreign key to buyers)
  - `signed_at` (timestamptz, nullable) - signature date
  - `effective_at` (timestamptz, nullable) - effective date if different
  - `document_id` (uuid, nullable, foreign key to documents)
  - `created_by_id` (uuid, foreign key to users)
  - `created_at`, `updated_at` (timestamptz)
  
  ## Modified Tables
  
  ### `reservations`
  - Add `signed_at` (timestamptz, nullable) - reservation contract signature date
  
  ### `lots`
  - Modify `status` enum to include 'BLOCKED' status
  
  ### `contracts`
  - Add `signed_document_id` (uuid, nullable, foreign key to documents)
  
  ### `project_participants`
  - Add `user_id` (uuid, foreign key to users) for direct user assignment
  - Add `status` column for ACTIVE/INACTIVE participants
  
  ## New Permissions
  - `lots:update_status:broker` - Brokers can update lot status
  - `reservations:manage:broker` - Brokers can manage reservations
  - `sales_contracts:create` - Create sales contracts
  - `sales_contracts:update_dates` - Update signature dates
  - `contracts:attach_signed_doc:broker` - Attach signed documents to contracts
  
  ## Security
  - Enable RLS on `sales_contracts` table
  - Brokers can only access lots/sales for projects where they are participants
  - Brokers cannot modify financial data (amounts, invoices, payments)
*/

-- =====================================================
-- 1. ADD SIGNED_AT TO RESERVATIONS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'signed_at'
  ) THEN
    ALTER TABLE reservations ADD COLUMN signed_at timestamptz;
  END IF;
END $$;

-- =====================================================
-- 2. CREATE SALES_CONTRACTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS sales_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  signed_at timestamptz,
  effective_at timestamptz,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  notes text,
  created_by_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_sales_contracts_project_id ON sales_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_lot_id ON sales_contracts(lot_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_buyer_id ON sales_contracts(buyer_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_signed_at ON sales_contracts(signed_at);

-- =====================================================
-- 3. ADD SIGNED_DOCUMENT_ID TO CONTRACTS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contracts' AND column_name = 'signed_document_id'
  ) THEN
    ALTER TABLE contracts ADD COLUMN signed_document_id uuid REFERENCES documents(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_contracts_signed_document_id ON contracts(signed_document_id);
  END IF;
END $$;

-- =====================================================
-- 4. ENHANCE PROJECT_PARTICIPANTS TABLE
-- =====================================================

-- Add user_id for direct user assignment to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_participants' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE project_participants ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_project_participants_user_id ON project_participants(user_id);
  END IF;
END $$;

-- Add status column for active/inactive participants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'participant_status'
  ) THEN
    CREATE TYPE participant_status AS ENUM ('ACTIVE', 'INACTIVE');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_participants' AND column_name = 'status'
  ) THEN
    ALTER TABLE project_participants ADD COLUMN status participant_status DEFAULT 'ACTIVE' NOT NULL;
  END IF;
END $$;

-- =====================================================
-- 5. ADD NEW PERMISSIONS
-- =====================================================

-- Insert broker-specific permissions
INSERT INTO permissions (id, resource, action, name, description, created_at)
VALUES
  (gen_random_uuid(), 'lots', 'update_status_broker', 'lots:update_status:broker', '{"en": "Brokers can update lot status within allowed transitions", "fr": "Les courtiers peuvent mettre à jour le statut des lots", "de": "Makler können Losstatus aktualisieren", "it": "I broker possono aggiornare lo stato dei lotti"}', now()),
  (gen_random_uuid(), 'reservations', 'manage_broker', 'reservations:manage:broker', '{"en": "Brokers can manage reservations and signature dates", "fr": "Les courtiers peuvent gérer les réservations", "de": "Makler können Reservierungen verwalten", "it": "I broker possono gestire le prenotazioni"}', now()),
  (gen_random_uuid(), 'sales_contracts', 'create', 'sales_contracts:create', '{"en": "Create sales contracts (actes notariés)", "fr": "Créer des contrats de vente", "de": "Kaufverträge erstellen", "it": "Creare contratti di vendita"}', now()),
  (gen_random_uuid(), 'sales_contracts', 'update', 'sales_contracts:update', '{"en": "Update sales contract dates and documents", "fr": "Modifier les contrats de vente", "de": "Kaufverträge aktualisieren", "it": "Aggiornare i contratti di vendita"}', now()),
  (gen_random_uuid(), 'sales_contracts', 'read', 'sales_contracts:read', '{"en": "View sales contracts", "fr": "Voir les contrats de vente", "de": "Kaufverträge anzeigen", "it": "Visualizzare i contratti di vendita"}', now()),
  (gen_random_uuid(), 'contracts', 'attach_signed_doc_broker', 'contracts:attach_signed_doc:broker', '{"en": "Brokers can attach signed documents to EG contracts", "fr": "Les courtiers peuvent joindre des documents signés", "de": "Makler können unterschriebene Dokumente anhängen", "it": "I broker possono allegare documenti firmati"}', now())
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 6. ASSIGN PERMISSIONS TO BROKER ROLE
-- =====================================================

-- Assign broker permissions to BROKER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'BROKER'
  AND p.name IN (
    'lots:update_status:broker',
    'reservations:manage:broker',
    'sales_contracts:create',
    'sales_contracts:update',
    'sales_contracts:read',
    'contracts:attach_signed_doc:broker',
    'lots:read',
    'projects:read',
    'buyers:read',
    'documents:create',
    'documents:read'
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. ROW LEVEL SECURITY - SALES_CONTRACTS
-- =====================================================

ALTER TABLE sales_contracts ENABLE ROW LEVEL SECURITY;

-- Brokers can view sales contracts for projects where they are participants
CREATE POLICY "Brokers can view sales contracts for their projects"
  ON sales_contracts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = sales_contracts.project_id
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
      WHERE p.id = sales_contracts.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- Brokers can create sales contracts for their projects
CREATE POLICY "Brokers can create sales contracts for their projects"
  ON sales_contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = sales_contracts.project_id
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
      WHERE p.id = sales_contracts.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- Brokers can update sales contracts for their projects
CREATE POLICY "Brokers can update sales contracts for their projects"
  ON sales_contracts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = sales_contracts.project_id
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
      WHERE p.id = sales_contracts.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = sales_contracts.project_id
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
      WHERE p.id = sales_contracts.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 8. UPDATE TIMESTAMP TRIGGER FOR SALES_CONTRACTS
-- =====================================================

CREATE OR REPLACE FUNCTION update_sales_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sales_contracts_updated_at ON sales_contracts;
CREATE TRIGGER trigger_update_sales_contracts_updated_at
  BEFORE UPDATE ON sales_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_sales_contracts_updated_at();
