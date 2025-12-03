/*
  # CRM & Participants Schema
  
  ## Description
  Gère les acteurs du projet (entreprises, contacts) et le pipeline CRM
  (prospects, réservations, acheteurs, dossiers acheteurs).
  
  ## Nouvelles tables
  
  ### `companies`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK) - Multi-tenant
  - `name` (text) - Nom de l'entreprise
  - `type` (company_type) - EG, NOTARY, BROKER, ARCHITECT, ENGINEER, SUPPLIER
  - `registration_number` (text) - IDE/SIREN
  - `vat_number` (text) - TVA
  - `address`, `city`, `postal_code`, `country` (text)
  - `phone`, `email`, `website` (text)
  - `logo_url` (text)
  - `notes` (text)
  - `created_at`, `updated_at`
  
  ### `contacts`
  - `id` (uuid, PK)
  - `company_id` (uuid, FK companies) - Nullable
  - `organization_id` (uuid, FK) - Multi-tenant
  - `first_name`, `last_name` (text)
  - `email` (text)
  - `phone` (text)
  - `position` (text) - Poste dans l'entreprise
  - `notes` (text)
  - `created_at`, `updated_at`
  
  ### `project_participants`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `company_id` (uuid, FK companies)
  - `role` (participant_role) - OWNER, EG, ARCHITECT, ENGINEER, NOTARY, BROKER
  - `contact_id` (uuid, FK contacts) - Contact principal
  - `joined_at` (timestamptz)
  
  ### `prospects`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `first_name`, `last_name` (text)
  - `email` (text)
  - `phone` (text)
  - `status` (prospect_status) - NEW, CONTACTED, QUALIFIED, VISIT_SCHEDULED, VISIT_DONE, OFFER_SENT, RESERVED, LOST
  - `source` (text) - Origine du lead
  - `interested_lots` (jsonb) - Array de lot_ids
  - `budget_min`, `budget_max` (numeric)
  - `notes` (text)
  - `assigned_to` (uuid, FK users) - Commercial assigné
  - `created_at`, `updated_at`
  
  ### `reservations`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `lot_id` (uuid, FK lots)
  - `prospect_id` (uuid, FK prospects) - Nullable si achat direct
  - `buyer_first_name`, `buyer_last_name` (text)
  - `buyer_email`, `buyer_phone` (text)
  - `status` (reservation_status) - PENDING, CONFIRMED, CONVERTED, CANCELLED, EXPIRED
  - `reserved_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `deposit_amount` (numeric) - Montant arrhes CHF
  - `deposit_paid_at` (timestamptz)
  - `broker_id` (uuid, FK companies) - Courtier
  - `broker_commission_rate` (numeric) - % commission
  - `notes` (text)
  - `created_at`, `updated_at`
  
  ### `buyers`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `lot_id` (uuid, FK lots)
  - `reservation_id` (uuid, FK reservations)
  - `user_id` (uuid, FK users) - Lien avec compte utilisateur
  - `first_name`, `last_name` (text)
  - `email`, `phone` (text)
  - `address`, `city`, `postal_code`, `country` (text)
  - `birth_date` (date)
  - `nationality` (text)
  - `is_individual` (boolean) - Personne physique ou morale
  - `company_name` (text) - Si personne morale
  - `financing_type` (financing_type) - CASH, MORTGAGE, MIXED
  - `bank_name` (text)
  - `notary_id` (uuid, FK companies)
  - `status` (buyer_status) - ACTIVE, DOCUMENTS_PENDING, READY_FOR_SIGNING, SIGNED, COMPLETED
  - `created_at`, `updated_at`
  
  ### `buyer_files`
  - `id` (uuid, PK)
  - `buyer_id` (uuid, FK buyers)
  - `name` (text) - Nom du dossier
  - `status` (file_status) - INCOMPLETE, COMPLETE, VALIDATED
  - `completion_percentage` (integer)
  - `created_at`, `updated_at`
  
  ## Enums
  - `company_type`: EG, NOTARY, BROKER, ARCHITECT, ENGINEER, SUPPLIER, OTHER
  - `participant_role`: OWNER, EG, ARCHITECT, ENGINEER, NOTARY, BROKER, CONSULTANT
  - `prospect_status`: NEW, CONTACTED, QUALIFIED, VISIT_SCHEDULED, VISIT_DONE, OFFER_SENT, RESERVED, LOST
  - `reservation_status`: PENDING, CONFIRMED, CONVERTED, CANCELLED, EXPIRED
  - `financing_type`: CASH, MORTGAGE, MIXED
  - `buyer_status`: ACTIVE, DOCUMENTS_PENDING, READY_FOR_SIGNING, SIGNED, COMPLETED
  - `file_status`: INCOMPLETE, COMPLETE, VALIDATED
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Filtrage par organization_id ou project_id
  - Les buyers ont accès uniquement à leurs propres données
  
  ## Index
  - Index sur organization_id, project_id, lot_id
  - Index sur email pour recherches rapides
  - Index sur les statuts
*/

-- Enums
CREATE TYPE company_type AS ENUM ('EG', 'NOTARY', 'BROKER', 'ARCHITECT', 'ENGINEER', 'SUPPLIER', 'OTHER');
CREATE TYPE participant_role AS ENUM ('OWNER', 'EG', 'ARCHITECT', 'ENGINEER', 'NOTARY', 'BROKER', 'CONSULTANT');
CREATE TYPE prospect_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'VISIT_DONE', 'OFFER_SENT', 'RESERVED', 'LOST');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CONVERTED', 'CANCELLED', 'EXPIRED');
CREATE TYPE financing_type AS ENUM ('CASH', 'MORTGAGE', 'MIXED');
CREATE TYPE buyer_status AS ENUM ('ACTIVE', 'DOCUMENTS_PENDING', 'READY_FOR_SIGNING', 'SIGNED', 'COMPLETED');
CREATE TYPE file_status AS ENUM ('INCOMPLETE', 'COMPLETE', 'VALIDATED');

-- Table Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type company_type NOT NULL,
  registration_number text,
  vat_number text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'CH',
  phone text,
  email text,
  website text,
  logo_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  position text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Project Participants
CREATE TABLE IF NOT EXISTS project_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role participant_role NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_project_company_role UNIQUE (project_id, company_id, role)
);

-- Table Prospects
CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  status prospect_status NOT NULL DEFAULT 'NEW',
  source text,
  interested_lots jsonb DEFAULT '[]'::jsonb,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  notes text,
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  prospect_id uuid REFERENCES prospects(id) ON DELETE SET NULL,
  buyer_first_name text NOT NULL,
  buyer_last_name text NOT NULL,
  buyer_email text,
  buyer_phone text,
  status reservation_status NOT NULL DEFAULT 'PENDING',
  reserved_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  deposit_amount numeric(12,2),
  deposit_paid_at timestamptz,
  broker_id uuid REFERENCES companies(id),
  broker_commission_rate numeric(5,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Buyers
CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  reservation_id uuid REFERENCES reservations(id),
  user_id uuid REFERENCES users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'CH',
  birth_date date,
  nationality text,
  is_individual boolean NOT NULL DEFAULT true,
  company_name text,
  financing_type financing_type,
  bank_name text,
  notary_id uuid REFERENCES companies(id),
  status buyer_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Buyer Files
CREATE TABLE IF NOT EXISTS buyer_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  name text NOT NULL,
  status file_status NOT NULL DEFAULT 'INCOMPLETE',
  completion_percentage integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_companies_organization ON companies(organization_id);
CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_contacts_organization ON contacts(organization_id);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_project_participants_project ON project_participants(project_id);
CREATE INDEX idx_project_participants_company ON project_participants(company_id);
CREATE INDEX idx_prospects_project ON prospects(project_id);
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_assigned_to ON prospects(assigned_to);
CREATE INDEX idx_reservations_project ON reservations(project_id);
CREATE INDEX idx_reservations_lot ON reservations(lot_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_buyers_project ON buyers(project_id);
CREATE INDEX idx_buyers_lot ON buyers(lot_id);
CREATE INDEX idx_buyers_user ON buyers(user_id);
CREATE INDEX idx_buyer_files_buyer ON buyer_files(buyer_id);

-- Triggers pour updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyers_updated_at
  BEFORE UPDATE ON buyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_files_updated_at
  BEFORE UPDATE ON buyer_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour Companies
CREATE POLICY "Users can view companies in their organizations"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = companies.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Contacts
CREATE POLICY "Users can view contacts in their organizations"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = contacts.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Prospects
CREATE POLICY "Users can view prospects in their projects"
  ON prospects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = prospects.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- RLS Policies pour Reservations
CREATE POLICY "Users can view reservations in their projects"
  ON reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = reservations.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- RLS Policies pour Buyers
CREATE POLICY "Users can view buyers in their projects"
  ON buyers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = buyers.project_id
      AND uo.user_id = auth.uid()
    )
    OR buyers.user_id = auth.uid()
  );

CREATE POLICY "Buyers can view their own data"
  ON buyers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies pour Buyer Files
CREATE POLICY "Users can view buyer files in their projects"
  ON buyer_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyers b
      JOIN projects p ON b.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE b.id = buyer_files.buyer_id
      AND uo.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM buyers b
      WHERE b.id = buyer_files.buyer_id
      AND b.user_id = auth.uid()
    )
  );