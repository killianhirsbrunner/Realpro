/*
  # Create Signature Requests and Plan Annotations Tables

  1. New Tables
    - `signature_requests`
      - Electronic signature requests for documents
      - Supports Swisscom, Skribble, or test providers
      - Tracks signature status and provider integration
      
    - `plan_annotations`
      - Annotations on architectural plans/documents
      - X/Y coordinates for positioning
      - Author and comment tracking
      
  2. Changes
    - Add `qr_code_url` to `documents` table
    - Add `type` and `tags` columns to `documents` for classification
    
  3. Security
    - Enable RLS on both new tables
    - Organization-scoped access control
    - Author-based permissions for annotations
*/

-- Add QR code and classification fields to documents
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'qr_code_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN qr_code_url text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'type'
  ) THEN
    ALTER TABLE documents ADD COLUMN type text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'tags'
  ) THEN
    ALTER TABLE documents ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create signature_requests table
CREATE TABLE IF NOT EXISTS signature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  provider text NOT NULL DEFAULT 'TEST',
  provider_request_id text,
  signer_name text,
  signer_email text NOT NULL,
  signer_locale text,
  redirect_url_success text,
  redirect_url_cancel text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signature_requests_organization_id_idx ON signature_requests(organization_id);
CREATE INDEX IF NOT EXISTS signature_requests_document_id_idx ON signature_requests(document_id);
CREATE INDEX IF NOT EXISTS signature_requests_provider_request_id_idx ON signature_requests(provider_request_id);
CREATE INDEX IF NOT EXISTS signature_requests_status_idx ON signature_requests(status);

-- Enable RLS
ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view signature requests in their org" ON signature_requests;
DROP POLICY IF EXISTS "Users can create signature requests in their org" ON signature_requests;
DROP POLICY IF EXISTS "Users can update signature requests in their org" ON signature_requests;

-- RLS Policies for signature_requests
CREATE POLICY "Users can view signature requests in their org"
  ON signature_requests FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create signature requests in their org"
  ON signature_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update signature requests in their org"
  ON signature_requests FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

-- Create plan_annotations table
CREATE TABLE IF NOT EXISTS plan_annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid REFERENCES lots(id) ON DELETE SET NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page int DEFAULT 1,
  x float NOT NULL,
  y float NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS plan_annotations_document_id_idx ON plan_annotations(document_id);
CREATE INDEX IF NOT EXISTS plan_annotations_project_id_idx ON plan_annotations(project_id);
CREATE INDEX IF NOT EXISTS plan_annotations_lot_id_idx ON plan_annotations(lot_id);
CREATE INDEX IF NOT EXISTS plan_annotations_author_id_idx ON plan_annotations(author_id);

-- Enable RLS
ALTER TABLE plan_annotations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view annotations in their org projects" ON plan_annotations;
DROP POLICY IF EXISTS "Users can create annotations in their org projects" ON plan_annotations;
DROP POLICY IF EXISTS "Authors can update their own annotations" ON plan_annotations;
DROP POLICY IF EXISTS "Authors can delete their own annotations" ON plan_annotations;

-- RLS Policies for plan_annotations
CREATE POLICY "Users can view annotations in their org projects"
  ON plan_annotations FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create annotations in their org projects"
  ON plan_annotations FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = auth.uid()
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Authors can update their own annotations"
  ON plan_annotations FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own annotations"
  ON plan_annotations FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Create indexes on documents for classification
CREATE INDEX IF NOT EXISTS documents_type_idx ON documents(type);
CREATE INDEX IF NOT EXISTS documents_tags_idx ON documents USING GIN(tags);

-- Update trigger for signature_requests
CREATE OR REPLACE FUNCTION update_signature_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS signature_requests_updated_at ON signature_requests;

CREATE TRIGGER signature_requests_updated_at
  BEFORE UPDATE ON signature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_signature_requests_updated_at();
