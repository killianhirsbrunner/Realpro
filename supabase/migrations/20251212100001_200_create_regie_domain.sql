-- ============================================================================
-- Migration: Régie Domain (Gestion Locative)
-- Version: 200
-- Description: Tables spécifiques au domaine Gestion Locative (Régie)
--
-- IMPORTANT: Ces tables sont EXCLUSIVES à l'app Régie.
-- Convention de nommage: préfixe "reg_"
-- ============================================================================

-- ============================================================================
-- ENUMS RÉGIE
-- ============================================================================

CREATE TYPE reg_immeuble_type AS ENUM (
  'RESIDENTIAL',
  'COMMERCIAL',
  'MIXED',
  'INDUSTRIAL'
);

CREATE TYPE reg_immeuble_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'UNDER_RENOVATION'
);

CREATE TYPE reg_objet_type AS ENUM (
  'APARTMENT',
  'STUDIO',
  'LOFT',
  'HOUSE',
  'COMMERCIAL',
  'OFFICE',
  'WAREHOUSE',
  'PARKING_INT',
  'PARKING_EXT',
  'GARAGE',
  'STORAGE',
  'OTHER'
);

CREATE TYPE reg_objet_status AS ENUM (
  'AVAILABLE',
  'RENTED',
  'RESERVED',
  'UNDER_RENOVATION',
  'BLOCKED'
);

CREATE TYPE reg_bail_type AS ENUM (
  'RESIDENTIAL',
  'COMMERCIAL',
  'PARKING',
  'STORAGE',
  'MIXED'
);

CREATE TYPE reg_bail_status AS ENUM (
  'DRAFT',
  'ACTIVE',
  'NOTICE_GIVEN',
  'TERMINATED',
  'EXPIRED'
);

CREATE TYPE reg_paiement_status AS ENUM (
  'PENDING',
  'PAID',
  'PARTIAL',
  'OVERDUE',
  'CANCELLED'
);

CREATE TYPE reg_contentieux_status AS ENUM (
  'OPEN',
  'REMINDER_1',
  'REMINDER_2',
  'FORMAL_NOTICE',
  'LEGAL_ACTION',
  'BAILIFF',
  'RESOLVED',
  'WRITTEN_OFF'
);

CREATE TYPE reg_charge_type AS ENUM (
  'HEATING',
  'WATER_HOT',
  'WATER_COLD',
  'ELECTRICITY',
  'CLEANING',
  'GARDENING',
  'ELEVATOR',
  'GARBAGE',
  'CONCIERGE',
  'TV_ANTENNA',
  'OTHER'
);

CREATE TYPE reg_repartition_key AS ENUM (
  'SURFACE',
  'ROOMS',
  'EQUAL',
  'PERSONS',
  'CONSUMPTION',
  'CUSTOM'
);

CREATE TYPE reg_intervention_type AS ENUM (
  'REPAIR',
  'MAINTENANCE',
  'EMERGENCY',
  'IMPROVEMENT'
);

CREATE TYPE reg_intervention_priority AS ENUM (
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
);

CREATE TYPE reg_intervention_status AS ENUM (
  'OPEN',
  'IN_PROGRESS',
  'PENDING_PARTS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE reg_decompte_status AS ENUM (
  'DRAFT',
  'VALIDATED',
  'SENT',
  'CLOSED'
);

-- ============================================================================
-- TABLE: reg_proprietaires
-- Propriétaires d'immeubles gérés par la régie
-- ============================================================================

CREATE TABLE reg_proprietaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Identité
  type VARCHAR(20) NOT NULL DEFAULT 'INDIVIDUAL' CHECK (type IN ('INDIVIDUAL', 'COMPANY')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),

  -- Contact
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  mobile VARCHAR(30),

  -- Adresse
  address TEXT,
  postal_code VARCHAR(10),
  city VARCHAR(100),

  -- Banque
  iban VARCHAR(34),
  bank_name VARCHAR(255),

  -- Metadata
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_immeubles
-- Immeubles gérés par la régie
-- ============================================================================

CREATE TABLE reg_immeubles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  proprietaire_id UUID REFERENCES reg_proprietaires(id) ON DELETE SET NULL,

  -- Identification
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  type reg_immeuble_type NOT NULL,
  status reg_immeuble_status NOT NULL DEFAULT 'ACTIVE',

  -- Adresse
  address TEXT NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  canton VARCHAR(2) NOT NULL,
  country VARCHAR(2) NOT NULL DEFAULT 'CH',

  -- Caractéristiques
  construction_year INTEGER,
  renovation_year INTEGER,
  floors_count INTEGER NOT NULL DEFAULT 1,
  units_count INTEGER NOT NULL DEFAULT 0,

  -- Références
  egrid VARCHAR(50),
  rf_number VARCHAR(100),

  -- Gestionnaire
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Images
  image_url TEXT,

  -- Metadata
  notes TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reg_immeubles_code_unique UNIQUE(organization_id, code)
);

-- ============================================================================
-- TABLE: reg_objets_locatifs
-- Objets locatifs (appartements, parkings, etc.)
-- ============================================================================

CREATE TABLE reg_objets_locatifs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immeuble_id UUID NOT NULL REFERENCES reg_immeubles(id) ON DELETE CASCADE,

  -- Identification
  code VARCHAR(50) NOT NULL,
  type reg_objet_type NOT NULL,
  status reg_objet_status NOT NULL DEFAULT 'AVAILABLE',

  -- Localisation
  floor_level INTEGER,
  position VARCHAR(50),               -- Ex: "gauche", "droite"

  -- Caractéristiques
  rooms_count DECIMAL(3,1),
  surface_living DECIMAL(10,2),
  surface_total DECIMAL(10,2),

  -- Loyer de référence
  rent_reference DECIMAL(10,2),
  charges_reference DECIMAL(10,2),

  -- Équipements
  has_balcony BOOLEAN NOT NULL DEFAULT FALSE,
  has_terrace BOOLEAN NOT NULL DEFAULT FALSE,
  has_garden BOOLEAN NOT NULL DEFAULT FALSE,
  has_parking BOOLEAN NOT NULL DEFAULT FALSE,
  has_elevator_access BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadata
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reg_objets_code_unique UNIQUE(immeuble_id, code)
);

-- ============================================================================
-- TABLE: reg_locataires
-- Locataires
-- ============================================================================

CREATE TABLE reg_locataires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Identité
  type VARCHAR(20) NOT NULL DEFAULT 'INDIVIDUAL' CHECK (type IN ('INDIVIDUAL', 'COMPANY')),
  civility VARCHAR(10) CHECK (civility IN ('M', 'MME', 'AUTRE')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),

  -- Contact
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  mobile VARCHAR(30),

  -- Adresse actuelle
  current_address TEXT,
  current_postal_code VARCHAR(10),
  current_city VARCHAR(100),

  -- Documents d'identité
  birth_date DATE,
  nationality VARCHAR(50),
  id_type VARCHAR(20) CHECK (id_type IN ('PASSPORT', 'ID_CARD', 'PERMIT')),
  id_number VARCHAR(50),

  -- Situation professionnelle
  profession VARCHAR(100),
  employer VARCHAR(255),
  annual_income DECIMAL(12,2),

  -- Banque
  iban VARCHAR(34),

  -- Metadata
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_baux
-- Contrats de bail
-- ============================================================================

CREATE TABLE reg_baux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objet_locatif_id UUID NOT NULL REFERENCES reg_objets_locatifs(id) ON DELETE CASCADE,
  locataire_id UUID NOT NULL REFERENCES reg_locataires(id) ON DELETE CASCADE,

  -- Type et statut
  type reg_bail_type NOT NULL,
  status reg_bail_status NOT NULL DEFAULT 'DRAFT',

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,                      -- NULL = durée indéterminée
  notice_date DATE,                   -- Date du préavis
  termination_date DATE,

  -- Loyer
  rent_amount DECIMAL(10,2) NOT NULL,
  charges_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (rent_amount + charges_amount) STORED,

  -- Garantie de loyer
  deposit_amount DECIMAL(10,2),
  deposit_type VARCHAR(20) CHECK (deposit_type IN ('BANK_GUARANTEE', 'CASH', 'INSURANCE')),
  deposit_bank VARCHAR(255),
  deposit_account VARCHAR(50),

  -- Conditions
  notice_period_months INTEGER NOT NULL DEFAULT 3,
  rent_due_day INTEGER NOT NULL DEFAULT 1 CHECK (rent_due_day BETWEEN 1 AND 28),
  payment_method VARCHAR(20) NOT NULL DEFAULT 'BANK_TRANSFER'
    CHECK (payment_method IN ('BANK_TRANSFER', 'LSV', 'EBILL', 'CASH')),

  -- Index (adaptation loyer)
  is_indexed BOOLEAN NOT NULL DEFAULT FALSE,
  index_reference VARCHAR(100),
  last_index_date DATE,

  -- Documents
  contract_document_id UUID,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_avis_loyers
-- Avis de loyers mensuels
-- ============================================================================

CREATE TABLE reg_avis_loyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bail_id UUID NOT NULL REFERENCES reg_baux(id) ON DELETE CASCADE,

  -- Période
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  due_date DATE NOT NULL,

  -- Montants
  rent_amount DECIMAL(10,2) NOT NULL,
  charges_amount DECIMAL(10,2) NOT NULL,
  adjustments DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (rent_amount + charges_amount + adjustments) STORED,

  -- Paiement
  status reg_paiement_status NOT NULL DEFAULT 'PENDING',
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_date DATE,
  payment_reference VARCHAR(100),

  -- QR facture
  qr_reference VARCHAR(50),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reg_avis_loyers_period_unique UNIQUE(bail_id, year, month)
);

-- ============================================================================
-- TABLE: reg_paiements_loyers
-- Paiements reçus pour les loyers
-- ============================================================================

CREATE TABLE reg_paiements_loyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avis_loyer_id UUID NOT NULL REFERENCES reg_avis_loyers(id) ON DELETE CASCADE,

  -- Montant et date
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  value_date DATE,

  -- Référence
  reference VARCHAR(100),
  bank_reference VARCHAR(100),

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_decomptes_charges
-- Décomptes de charges locatives
-- ============================================================================

CREATE TABLE reg_decomptes_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immeuble_id UUID NOT NULL REFERENCES reg_immeubles(id) ON DELETE CASCADE,

  -- Période
  year INTEGER NOT NULL,
  status reg_decompte_status NOT NULL DEFAULT 'DRAFT',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Totaux
  total_charges DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Dates
  validated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reg_decomptes_year_unique UNIQUE(immeuble_id, year)
);

-- ============================================================================
-- TABLE: reg_lignes_charges
-- Lignes de charges dans un décompte
-- ============================================================================

CREATE TABLE reg_lignes_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decompte_id UUID NOT NULL REFERENCES reg_decomptes_charges(id) ON DELETE CASCADE,

  -- Type et libellé
  type reg_charge_type NOT NULL,
  label VARCHAR(255) NOT NULL,

  -- Montant et répartition
  amount DECIMAL(12,2) NOT NULL,
  repartition_key reg_repartition_key NOT NULL DEFAULT 'SURFACE',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_decomptes_individuels
-- Décomptes individuels par locataire
-- ============================================================================

CREATE TABLE reg_decomptes_individuels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decompte_id UUID NOT NULL REFERENCES reg_decomptes_charges(id) ON DELETE CASCADE,
  bail_id UUID NOT NULL REFERENCES reg_baux(id) ON DELETE CASCADE,
  locataire_id UUID NOT NULL REFERENCES reg_locataires(id) ON DELETE CASCADE,

  -- Calculs
  total_charges DECIMAL(12,2) NOT NULL,
  total_acomptes DECIMAL(12,2) NOT NULL,
  solde DECIMAL(12,2) NOT NULL,        -- Positif = dû par locataire

  -- Détail (JSON)
  detail JSONB NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reg_decomptes_indiv_unique UNIQUE(decompte_id, bail_id)
);

-- ============================================================================
-- TABLE: reg_contentieux
-- Dossiers contentieux (impayés)
-- ============================================================================

CREATE TABLE reg_contentieux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bail_id UUID NOT NULL REFERENCES reg_baux(id) ON DELETE CASCADE,
  locataire_id UUID NOT NULL REFERENCES reg_locataires(id) ON DELETE CASCADE,

  -- Statut
  status reg_contentieux_status NOT NULL DEFAULT 'OPEN',

  -- Montants
  initial_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL,
  recovered_amount DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Dates clés
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reminder1_at TIMESTAMPTZ,
  reminder2_at TIMESTAMPTZ,
  formal_notice_at TIMESTAMPTZ,
  legal_action_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,

  -- Motif de clôture
  closure_reason VARCHAR(50),

  -- Documents
  documents UUID[] NOT NULL DEFAULT '{}',

  -- Metadata
  notes TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_interventions
-- Tickets de maintenance / travaux
-- ============================================================================

CREATE TABLE reg_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immeuble_id UUID NOT NULL REFERENCES reg_immeubles(id) ON DELETE CASCADE,
  objet_locatif_id UUID REFERENCES reg_objets_locatifs(id) ON DELETE SET NULL,

  -- Identification
  number VARCHAR(20) NOT NULL,
  type reg_intervention_type NOT NULL,
  priority reg_intervention_priority NOT NULL DEFAULT 'NORMAL',
  status reg_intervention_status NOT NULL DEFAULT 'OPEN',

  -- Description
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  reported_by VARCHAR(255),

  -- Artisan
  artisan_id UUID,
  artisan_name VARCHAR(255),

  -- Dates
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Coûts
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  invoiced_to VARCHAR(20) CHECK (invoiced_to IN ('OWNER', 'TENANT', 'INSURANCE')),

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: reg_etats_lieux
-- États des lieux d'entrée/sortie
-- ============================================================================

CREATE TABLE reg_etats_lieux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bail_id UUID NOT NULL REFERENCES reg_baux(id) ON DELETE CASCADE,
  objet_locatif_id UUID NOT NULL REFERENCES reg_objets_locatifs(id) ON DELETE CASCADE,

  -- Type
  type VARCHAR(10) NOT NULL CHECK (type IN ('ENTRY', 'EXIT')),

  -- Date et participants
  date DATE NOT NULL,
  locataire_present BOOLEAN NOT NULL DEFAULT TRUE,
  representant_name VARCHAR(255),

  -- Document
  document_id UUID,

  -- Observations générales
  general_condition VARCHAR(20) CHECK (general_condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR')),
  notes TEXT,

  -- Retenues (pour sortie)
  deductions_amount DECIMAL(10,2),
  deductions_detail JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Proprietaires
CREATE INDEX idx_reg_proprietaires_org ON reg_proprietaires(organization_id);
CREATE INDEX idx_reg_proprietaires_email ON reg_proprietaires(email);

-- Immeubles
CREATE INDEX idx_reg_immeubles_org ON reg_immeubles(organization_id);
CREATE INDEX idx_reg_immeubles_proprietaire ON reg_immeubles(proprietaire_id);
CREATE INDEX idx_reg_immeubles_status ON reg_immeubles(status);

-- Objets locatifs
CREATE INDEX idx_reg_objets_immeuble ON reg_objets_locatifs(immeuble_id);
CREATE INDEX idx_reg_objets_status ON reg_objets_locatifs(status);
CREATE INDEX idx_reg_objets_type ON reg_objets_locatifs(type);

-- Locataires
CREATE INDEX idx_reg_locataires_org ON reg_locataires(organization_id);
CREATE INDEX idx_reg_locataires_email ON reg_locataires(email);

-- Baux
CREATE INDEX idx_reg_baux_objet ON reg_baux(objet_locatif_id);
CREATE INDEX idx_reg_baux_locataire ON reg_baux(locataire_id);
CREATE INDEX idx_reg_baux_status ON reg_baux(status);
CREATE INDEX idx_reg_baux_dates ON reg_baux(start_date, end_date);
CREATE INDEX idx_reg_baux_active ON reg_baux(objet_locatif_id) WHERE status = 'ACTIVE';

-- Avis loyers
CREATE INDEX idx_reg_avis_bail ON reg_avis_loyers(bail_id);
CREATE INDEX idx_reg_avis_status ON reg_avis_loyers(status);
CREATE INDEX idx_reg_avis_due_date ON reg_avis_loyers(due_date);
CREATE INDEX idx_reg_avis_period ON reg_avis_loyers(year, month);

-- Contentieux
CREATE INDEX idx_reg_contentieux_bail ON reg_contentieux(bail_id);
CREATE INDEX idx_reg_contentieux_locataire ON reg_contentieux(locataire_id);
CREATE INDEX idx_reg_contentieux_status ON reg_contentieux(status);

-- Interventions
CREATE INDEX idx_reg_interventions_immeuble ON reg_interventions(immeuble_id);
CREATE INDEX idx_reg_interventions_objet ON reg_interventions(objet_locatif_id);
CREATE INDEX idx_reg_interventions_status ON reg_interventions(status);
CREATE INDEX idx_reg_interventions_priority ON reg_interventions(priority);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE reg_proprietaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_immeubles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_objets_locatifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_locataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_baux ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_avis_loyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_paiements_loyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_decomptes_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_lignes_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_decomptes_individuels ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_contentieux ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reg_etats_lieux ENABLE ROW LEVEL SECURITY;

-- Policies: Accès via organization_id

CREATE POLICY "reg_proprietaires_org_access" ON reg_proprietaires
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reg_immeubles_org_access" ON reg_immeubles
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reg_objets_org_access" ON reg_objets_locatifs
  FOR ALL USING (
    immeuble_id IN (
      SELECT id FROM reg_immeubles WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_locataires_org_access" ON reg_locataires
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reg_baux_org_access" ON reg_baux
  FOR ALL USING (
    objet_locatif_id IN (
      SELECT o.id FROM reg_objets_locatifs o
      JOIN reg_immeubles i ON o.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_avis_org_access" ON reg_avis_loyers
  FOR ALL USING (
    bail_id IN (
      SELECT b.id FROM reg_baux b
      JOIN reg_objets_locatifs o ON b.objet_locatif_id = o.id
      JOIN reg_immeubles i ON o.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_paiements_org_access" ON reg_paiements_loyers
  FOR ALL USING (
    avis_loyer_id IN (
      SELECT a.id FROM reg_avis_loyers a
      JOIN reg_baux b ON a.bail_id = b.id
      JOIN reg_objets_locatifs o ON b.objet_locatif_id = o.id
      JOIN reg_immeubles i ON o.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_decomptes_org_access" ON reg_decomptes_charges
  FOR ALL USING (
    immeuble_id IN (
      SELECT id FROM reg_immeubles WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_lignes_org_access" ON reg_lignes_charges
  FOR ALL USING (
    decompte_id IN (
      SELECT d.id FROM reg_decomptes_charges d
      JOIN reg_immeubles i ON d.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_decomptes_indiv_org_access" ON reg_decomptes_individuels
  FOR ALL USING (
    decompte_id IN (
      SELECT d.id FROM reg_decomptes_charges d
      JOIN reg_immeubles i ON d.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_contentieux_org_access" ON reg_contentieux
  FOR ALL USING (
    locataire_id IN (
      SELECT id FROM reg_locataires WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_interventions_org_access" ON reg_interventions
  FOR ALL USING (
    immeuble_id IN (
      SELECT id FROM reg_immeubles WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "reg_etats_lieux_org_access" ON reg_etats_lieux
  FOR ALL USING (
    objet_locatif_id IN (
      SELECT o.id FROM reg_objets_locatifs o
      JOIN reg_immeubles i ON o.immeuble_id = i.id
      WHERE i.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- TRIGGERS: updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_reg_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reg_proprietaires_updated_at
  BEFORE UPDATE ON reg_proprietaires
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_immeubles_updated_at
  BEFORE UPDATE ON reg_immeubles
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_objets_updated_at
  BEFORE UPDATE ON reg_objets_locatifs
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_locataires_updated_at
  BEFORE UPDATE ON reg_locataires
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_baux_updated_at
  BEFORE UPDATE ON reg_baux
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_avis_updated_at
  BEFORE UPDATE ON reg_avis_loyers
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_decomptes_updated_at
  BEFORE UPDATE ON reg_decomptes_charges
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_contentieux_updated_at
  BEFORE UPDATE ON reg_contentieux
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_interventions_updated_at
  BEFORE UPDATE ON reg_interventions
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

CREATE TRIGGER reg_etats_lieux_updated_at
  BEFORE UPDATE ON reg_etats_lieux
  FOR EACH ROW EXECUTE FUNCTION update_reg_updated_at();

-- ============================================================================
-- TRIGGER: Mise à jour status objet locatif selon bail
-- ============================================================================

CREATE OR REPLACE FUNCTION update_objet_status_on_bail_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Quand un bail devient actif, marquer l'objet comme loué
  IF NEW.status = 'ACTIVE' AND (OLD IS NULL OR OLD.status != 'ACTIVE') THEN
    UPDATE reg_objets_locatifs
    SET status = 'RENTED', updated_at = NOW()
    WHERE id = NEW.objet_locatif_id;
  END IF;

  -- Quand un bail se termine, marquer l'objet comme disponible
  IF NEW.status IN ('TERMINATED', 'EXPIRED') AND OLD.status = 'ACTIVE' THEN
    UPDATE reg_objets_locatifs
    SET status = 'AVAILABLE', updated_at = NOW()
    WHERE id = NEW.objet_locatif_id
    AND NOT EXISTS (
      SELECT 1 FROM reg_baux
      WHERE objet_locatif_id = NEW.objet_locatif_id
      AND status = 'ACTIVE'
      AND id != NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reg_bail_status_change
  AFTER INSERT OR UPDATE OF status ON reg_baux
  FOR EACH ROW EXECUTE FUNCTION update_objet_status_on_bail_change();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE reg_proprietaires IS 'Propriétaires d''immeubles gérés par la régie';
COMMENT ON TABLE reg_immeubles IS 'Immeubles en gestion locative';
COMMENT ON TABLE reg_objets_locatifs IS 'Objets locatifs (appartements, parkings, etc.)';
COMMENT ON TABLE reg_locataires IS 'Locataires';
COMMENT ON TABLE reg_baux IS 'Contrats de bail';
COMMENT ON TABLE reg_avis_loyers IS 'Avis de loyers mensuels';
COMMENT ON TABLE reg_paiements_loyers IS 'Paiements reçus pour les loyers';
COMMENT ON TABLE reg_decomptes_charges IS 'Décomptes de charges locatives';
COMMENT ON TABLE reg_lignes_charges IS 'Lignes de charges dans un décompte';
COMMENT ON TABLE reg_decomptes_individuels IS 'Décomptes individuels par locataire';
COMMENT ON TABLE reg_contentieux IS 'Dossiers contentieux (impayés)';
COMMENT ON TABLE reg_interventions IS 'Tickets de maintenance et travaux';
COMMENT ON TABLE reg_etats_lieux IS 'États des lieux d''entrée et sortie';
