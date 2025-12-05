/*
  # Système de signature électronique pour avenants

  1. New Tables
    - `avenants`
      - Avenants générés pour les modifications techniques
      - Lien avec les offres fournisseurs validées
      - Stockage du PDF généré
      - Tracking du workflow de signature
    
    - `avenant_signatures`
      - Signatures électroniques des clients
      - Horodatage et traçabilité complète
      - IP, User-Agent, localisation
      - Données de signature (image)
    
    - `avenant_versions`
      - Historique des versions d'avenant
      - Chaque modification crée une nouvelle version
      - Traçabilité complète

  2. Security
    - Enable RLS on all tables
    - Clients can only sign their own avenants
    - Team can view and manage all avenants
    - Full audit trail for legal compliance
*/

-- Table des avenants
CREATE TABLE IF NOT EXISTS avenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid REFERENCES lots(id) ON DELETE SET NULL,
  supplier_offer_id uuid REFERENCES supplier_offers(id) ON DELETE CASCADE,
  
  reference text NOT NULL,
  title text NOT NULL,
  description text,
  
  amount decimal(12,2) NOT NULL DEFAULT 0,
  vat_rate decimal(5,2) NOT NULL DEFAULT 8.1,
  vat_amount decimal(12,2) NOT NULL DEFAULT 0,
  total_with_vat decimal(12,2) NOT NULL DEFAULT 0,
  
  type text NOT NULL DEFAULT 'simple' CHECK (type IN (
    'simple',
    'detailed',
    'legal'
  )),
  
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'pending_signature',
    'signed',
    'rejected',
    'cancelled'
  )),
  
  pdf_url text,
  pdf_signed_url text,
  
  generated_at timestamptz,
  generated_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  
  requires_qualified_signature boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des signatures électroniques
CREATE TABLE IF NOT EXISTS avenant_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avenant_id uuid NOT NULL REFERENCES avenants(id) ON DELETE CASCADE,
  
  signer_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signer_name text NOT NULL,
  signer_email text NOT NULL,
  signer_role text NOT NULL DEFAULT 'client' CHECK (signer_role IN (
    'client',
    'promoter',
    'architect',
    'contractor'
  )),
  
  signature_data text NOT NULL,
  signature_method text NOT NULL DEFAULT 'electronic' CHECK (signature_method IN (
    'electronic',
    'qualified',
    'simple'
  )),
  
  ip_address text,
  user_agent text,
  location text,
  
  signed_at timestamptz DEFAULT now(),
  certificate_data jsonb,
  
  is_valid boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

-- Table des versions d'avenant
CREATE TABLE IF NOT EXISTS avenant_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avenant_id uuid NOT NULL REFERENCES avenants(id) ON DELETE CASCADE,
  
  version_number integer NOT NULL,
  pdf_url text NOT NULL,
  changes text,
  
  created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Table de liaison avenant -> facture
CREATE TABLE IF NOT EXISTS avenant_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avenant_id uuid NOT NULL REFERENCES avenants(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  auto_generated boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(avenant_id, invoice_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_avenants_project ON avenants(project_id);
CREATE INDEX IF NOT EXISTS idx_avenants_lot ON avenants(lot_id);
CREATE INDEX IF NOT EXISTS idx_avenants_offer ON avenants(supplier_offer_id);
CREATE INDEX IF NOT EXISTS idx_avenants_status ON avenants(status);
CREATE INDEX IF NOT EXISTS idx_avenants_reference ON avenants(reference);

CREATE INDEX IF NOT EXISTS idx_avenant_signatures_avenant ON avenant_signatures(avenant_id);
CREATE INDEX IF NOT EXISTS idx_avenant_signatures_signer ON avenant_signatures(signer_user_id);
CREATE INDEX IF NOT EXISTS idx_avenant_signatures_signed_at ON avenant_signatures(signed_at);

CREATE INDEX IF NOT EXISTS idx_avenant_versions_avenant ON avenant_versions(avenant_id);

CREATE INDEX IF NOT EXISTS idx_avenant_invoices_avenant ON avenant_invoices(avenant_id);
CREATE INDEX IF NOT EXISTS idx_avenant_invoices_invoice ON avenant_invoices(invoice_id);

-- Enable RLS
ALTER TABLE avenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenant_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenant_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenant_invoices ENABLE ROW LEVEL SECURITY;

-- Policies for avenants

-- Team can view all avenants
CREATE POLICY "Team can view avenants"
  ON avenants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = avenants.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can create avenants
CREATE POLICY "Team can create avenants"
  ON avenants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = avenants.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can update avenants
CREATE POLICY "Team can update avenants"
  ON avenants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = avenants.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = avenants.project_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policies for avenant_signatures

-- Users can view signatures for avenants they have access to
CREATE POLICY "Users can view avenant signatures"
  ON avenant_signatures FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_signatures.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can sign avenants
CREATE POLICY "Users can sign avenants"
  ON avenant_signatures FOR INSERT
  TO authenticated
  WITH CHECK (
    signer_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_signatures.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policies for avenant_versions

-- Users can view versions for avenants they have access to
CREATE POLICY "Users can view avenant versions"
  ON avenant_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_versions.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can create versions
CREATE POLICY "Team can create avenant versions"
  ON avenant_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_versions.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policies for avenant_invoices

-- Users can view avenant invoices
CREATE POLICY "Users can view avenant invoices"
  ON avenant_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_invoices.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Team can create avenant invoices
CREATE POLICY "Team can create avenant invoices"
  ON avenant_invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM avenants a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = avenant_invoices.avenant_id
      AND p.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Update triggers
CREATE TRIGGER update_avenants_updated_at
  BEFORE UPDATE ON avenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate avenant reference
CREATE OR REPLACE FUNCTION generate_avenant_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'AVE-' || to_char(now(), 'YYYY') || '-' || LPAD(nextval('avenant_sequence')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for avenant references
CREATE SEQUENCE IF NOT EXISTS avenant_sequence START 1;

-- Trigger to generate reference
CREATE TRIGGER generate_avenant_reference_trigger
  BEFORE INSERT ON avenants
  FOR EACH ROW
  EXECUTE FUNCTION generate_avenant_reference();
