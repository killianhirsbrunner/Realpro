/*
  # Create Supplier Offers & Modifications System

  1. New Tables
    - `supplier_offers`
      - Complete offer management from supplier
      - Multi-step validation workflow (client -> architect -> promoter)
      - Versioning support
      - Document attachments support

    - `supplier_offer_comments`
      - Comments and discussions on offers
      - Track author role (client, architect, promoter, supplier)

    - `supplier_offer_documents`
      - PDF files, images, plans attached to offers
      - Version tracking

  2. Workflow
    - draft: Initial creation
    - pending_client: Awaiting client validation
    - client_approved: Client validated, awaiting architect
    - architect_approved: Technical validation done, ready for avenant
    - final: Avenant generated and integrated
    - rejected: Modifications requested

  3. Security
    - Enable RLS on all tables
    - Project team access policies
*/

-- Table for supplier offers
CREATE TABLE IF NOT EXISTS supplier_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_number text NOT NULL,
  supplier_name text NOT NULL,
  supplier_email text,
  price decimal(12,2),
  description text,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'pending_client',
    'client_approved',
    'architect_approved',
    'final',
    'rejected'
  )),
  version int NOT NULL DEFAULT 1,
  client_approved_at timestamptz,
  client_approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  architect_approved_at timestamptz,
  architect_approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table for offer comments
CREATE TABLE IF NOT EXISTS supplier_offer_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES supplier_offers(id) ON DELETE CASCADE,
  comment text NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  author_role text NOT NULL DEFAULT 'promoter',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table for offer documents
CREATE TABLE IF NOT EXISTS supplier_offer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES supplier_offers(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_offers_project ON supplier_offers(project_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_status ON supplier_offers(status);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_lot ON supplier_offers(lot_number);

CREATE INDEX IF NOT EXISTS idx_supplier_offer_comments_offer ON supplier_offer_comments(offer_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offer_documents_offer ON supplier_offer_documents(offer_id);

-- Enable RLS
ALTER TABLE supplier_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_offer_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_offer_documents ENABLE ROW LEVEL SECURITY;

-- Policies for supplier_offers

-- Team can view offers for their projects
CREATE POLICY "Team can view offers for their projects"
  ON supplier_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = supplier_offers.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can create offers
CREATE POLICY "Team can create offers"
  ON supplier_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = supplier_offers.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can update offers
CREATE POLICY "Team can update offers"
  ON supplier_offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = supplier_offers.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = supplier_offers.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can delete offers
CREATE POLICY "Team can delete offers"
  ON supplier_offers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = supplier_offers.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policies for supplier_offer_comments

-- Team can view comments
CREATE POLICY "Team can view offer comments"
  ON supplier_offer_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_offers so
      JOIN projects p ON so.project_id = p.id
      WHERE so.id = supplier_offer_comments.offer_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can add comments
CREATE POLICY "Team can add comments"
  ON supplier_offer_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM supplier_offers so
      JOIN projects p ON so.project_id = p.id
      WHERE so.id = supplier_offer_comments.offer_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can update their own comments
CREATE POLICY "Team can update their comments"
  ON supplier_offer_comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Team can delete their own comments
CREATE POLICY "Team can delete their comments"
  ON supplier_offer_comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Policies for supplier_offer_documents

-- Team can view documents
CREATE POLICY "Team can view offer documents"
  ON supplier_offer_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_offers so
      JOIN projects p ON so.project_id = p.id
      WHERE so.id = supplier_offer_documents.offer_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can upload documents
CREATE POLICY "Team can upload documents"
  ON supplier_offer_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM supplier_offers so
      JOIN projects p ON so.project_id = p.id
      WHERE so.id = supplier_offer_documents.offer_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can delete documents
CREATE POLICY "Team can delete documents"
  ON supplier_offer_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_offers so
      JOIN projects p ON so.project_id = p.id
      WHERE so.id = supplier_offer_documents.offer_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Update triggers
CREATE TRIGGER update_supplier_offers_updated_at
  BEFORE UPDATE ON supplier_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_offer_comments_updated_at
  BEFORE UPDATE ON supplier_offer_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
