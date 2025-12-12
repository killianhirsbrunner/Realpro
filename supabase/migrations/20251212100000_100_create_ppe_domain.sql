-- ============================================================================
-- Migration: PPE Domain (Propriété par Étages / Copropriété)
-- Version: 100
-- Description: Tables spécifiques au domaine Administration de PPE
--
-- IMPORTANT: Ces tables sont EXCLUSIVES à l'app PPE-Admin.
-- Convention de nommage: préfixe "ppe_"
-- ============================================================================

-- ============================================================================
-- ENUMS PPE
-- ============================================================================

CREATE TYPE ppe_copropriete_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'IN_CREATION',
  'DISSOLVED'
);

CREATE TYPE ppe_lot_type AS ENUM (
  'APARTMENT',
  'STUDIO',
  'PENTHOUSE',
  'COMMERCIAL',
  'OFFICE',
  'PARKING_INT',
  'PARKING_EXT',
  'GARAGE',
  'STORAGE',
  'GARDEN',
  'TERRACE'
);

CREATE TYPE ppe_ag_status AS ENUM (
  'PLANNED',
  'CONVOKED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE ppe_ag_type AS ENUM (
  'ORDINARY',
  'EXTRAORDINARY'
);

CREATE TYPE ppe_vote_majority AS ENUM (
  'SIMPLE',
  'ABSOLUTE',
  'QUALIFIED',
  'UNANIMOUS'
);

CREATE TYPE ppe_vote_status AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'ABSTAINED'
);

CREATE TYPE ppe_charge_category AS ENUM (
  'HEATING',
  'WATER_HOT',
  'WATER_COLD',
  'ELECTRICITY',
  'ELEVATOR',
  'CLEANING',
  'GARDENING',
  'INSURANCE',
  'ADMINISTRATION',
  'MAINTENANCE',
  'RENOVATION',
  'OTHER'
);

CREATE TYPE ppe_charge_distribution AS ENUM (
  'MILLIEMES',
  'EQUAL',
  'SURFACE',
  'CONSUMPTION',
  'CUSTOM'
);

CREATE TYPE ppe_decompte_status AS ENUM (
  'DRAFT',
  'VALIDATED',
  'SENT',
  'CLOSED'
);

CREATE TYPE ppe_fonds_movement_type AS ENUM (
  'CONTRIBUTION',
  'WITHDRAWAL',
  'INTEREST',
  'EXPENSE'
);

-- ============================================================================
-- TABLE: ppe_coproprietes
-- Immeubles en propriété par étages gérés
-- ============================================================================

CREATE TABLE ppe_coproprietes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Identification
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  status ppe_copropriete_status NOT NULL DEFAULT 'ACTIVE',

  -- Adresse
  address TEXT NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  canton VARCHAR(2) NOT NULL,
  country VARCHAR(2) NOT NULL DEFAULT 'CH',

  -- Données PPE
  total_milliemes INTEGER NOT NULL DEFAULT 1000,
  nb_lots INTEGER NOT NULL DEFAULT 0,
  nb_coproprietaires INTEGER NOT NULL DEFAULT 0,

  -- Références légales
  egrid VARCHAR(50),                 -- Numéro EGRID (registre foncier)
  rf_number VARCHAR(100),            -- Numéro registre foncier

  -- Dates
  creation_date DATE,                -- Date création PPE
  fiscal_year_start INTEGER NOT NULL DEFAULT 1, -- Mois début exercice (1-12)

  -- Images
  image_url TEXT,

  -- Metadata
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_coproprietes_code_unique UNIQUE(organization_id, code),
  CONSTRAINT ppe_coproprietes_fiscal_month_valid CHECK (fiscal_year_start BETWEEN 1 AND 12),
  CONSTRAINT ppe_coproprietes_milliemes_positive CHECK (total_milliemes > 0)
);

-- ============================================================================
-- TABLE: ppe_lots
-- Lots (unités) d'une copropriété PPE
-- ============================================================================

CREATE TABLE ppe_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,

  -- Identification
  code VARCHAR(50) NOT NULL,          -- Ex: "A-301", "P-12"
  type ppe_lot_type NOT NULL,

  -- Millièmes et répartition
  milliemes INTEGER NOT NULL,
  milliemes_chauffage INTEGER,        -- Millièmes spécifiques chauffage
  milliemes_ascenseur INTEGER,        -- Millièmes spécifiques ascenseur

  -- Description
  floor_level INTEGER,                -- Étage (-2, -1, 0, 1, 2...)
  rooms_count DECIMAL(3,1),           -- Ex: 3.5 pièces
  surface_living DECIMAL(10,2),       -- m²
  surface_total DECIMAL(10,2),        -- m² total

  -- Références
  rf_lot_number VARCHAR(100),         -- N° feuillet registre foncier

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_lots_code_unique UNIQUE(copropriete_id, code),
  CONSTRAINT ppe_lots_milliemes_positive CHECK (milliemes > 0)
);

-- ============================================================================
-- TABLE: ppe_coproprietaires
-- Propriétaires de lots PPE
-- ============================================================================

CREATE TABLE ppe_coproprietaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,
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

  -- Adresse de correspondance (si différente)
  correspondence_address TEXT,
  correspondence_postal_code VARCHAR(10),
  correspondence_city VARCHAR(100),

  -- Banque (pour remboursements)
  iban VARCHAR(34),

  -- Rôle dans la copropriété
  is_president BOOLEAN NOT NULL DEFAULT FALSE,
  is_committee_member BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadata
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ppe_lot_ownership
-- Liaison lots <-> propriétaires (historisée)
-- ============================================================================

CREATE TABLE ppe_lot_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES ppe_lots(id) ON DELETE CASCADE,
  coproprietaire_id UUID NOT NULL REFERENCES ppe_coproprietaires(id) ON DELETE CASCADE,

  -- Période de propriété
  start_date DATE NOT NULL,
  end_date DATE,                      -- NULL = propriétaire actuel

  -- Part de propriété (si lot divisé entre plusieurs)
  share_percent DECIMAL(5,2) NOT NULL DEFAULT 100.00,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_lot_ownership_dates_valid CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT ppe_lot_ownership_share_valid CHECK (share_percent > 0 AND share_percent <= 100)
);

-- ============================================================================
-- TABLE: ppe_assemblees_generales
-- Assemblées générales
-- ============================================================================

CREATE TABLE ppe_assemblees_generales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,

  -- Type et statut
  type ppe_ag_type NOT NULL,
  status ppe_ag_status NOT NULL DEFAULT 'PLANNED',

  -- Planning
  title VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  convocation_date DATE,

  -- Quorum
  milliemes_present INTEGER NOT NULL DEFAULT 0,
  milliemes_represented INTEGER NOT NULL DEFAULT 0,
  quorum_reached BOOLEAN NOT NULL DEFAULT FALSE,

  -- Documents
  convocation_document_id UUID,
  pv_document_id UUID,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ppe_ag_presences
-- Présences aux AG
-- ============================================================================

CREATE TABLE ppe_ag_presences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ag_id UUID NOT NULL REFERENCES ppe_assemblees_generales(id) ON DELETE CASCADE,
  coproprietaire_id UUID NOT NULL REFERENCES ppe_coproprietaires(id) ON DELETE CASCADE,

  -- Type de présence
  presence_type VARCHAR(20) NOT NULL CHECK (presence_type IN ('PRESENT', 'REPRESENTED', 'ABSENT')),

  -- Si représenté
  represented_by UUID REFERENCES ppe_coproprietaires(id),
  procuration_document_id UUID,

  -- Millièmes représentés
  milliemes INTEGER NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_ag_presences_unique UNIQUE(ag_id, coproprietaire_id)
);

-- ============================================================================
-- TABLE: ppe_ag_points
-- Points de l'ordre du jour
-- ============================================================================

CREATE TABLE ppe_ag_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ag_id UUID NOT NULL REFERENCES ppe_assemblees_generales(id) ON DELETE CASCADE,

  -- Ordre et contenu
  order_index INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Vote
  majority_type ppe_vote_majority NOT NULL DEFAULT 'SIMPLE',
  vote_status ppe_vote_status,

  -- Résultats
  votes_pour INTEGER,
  votes_contre INTEGER,
  abstentions INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_ag_points_order_unique UNIQUE(ag_id, order_index)
);

-- ============================================================================
-- TABLE: ppe_decomptes_charges
-- Décomptes annuels de charges
-- ============================================================================

CREATE TABLE ppe_decomptes_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,

  -- Période
  year INTEGER NOT NULL,
  status ppe_decompte_status NOT NULL DEFAULT 'DRAFT',

  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Totaux
  total_charges DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_acomptes DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Dates
  validated_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  -- Document
  document_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_decomptes_year_unique UNIQUE(copropriete_id, year),
  CONSTRAINT ppe_decomptes_period_valid CHECK (period_end > period_start)
);

-- ============================================================================
-- TABLE: ppe_lignes_charges
-- Lignes de charges dans un décompte
-- ============================================================================

CREATE TABLE ppe_lignes_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decompte_id UUID NOT NULL REFERENCES ppe_decomptes_charges(id) ON DELETE CASCADE,

  -- Catégorie et libellé
  category ppe_charge_category NOT NULL,
  label VARCHAR(255) NOT NULL,

  -- Montant et répartition
  amount DECIMAL(12,2) NOT NULL,
  distribution_mode ppe_charge_distribution NOT NULL DEFAULT 'MILLIEMES',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ppe_decomptes_individuels
-- Décomptes individuels par copropriétaire
-- ============================================================================

CREATE TABLE ppe_decomptes_individuels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decompte_id UUID NOT NULL REFERENCES ppe_decomptes_charges(id) ON DELETE CASCADE,
  coproprietaire_id UUID NOT NULL REFERENCES ppe_coproprietaires(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES ppe_lots(id) ON DELETE CASCADE,

  -- Calculs
  total_charges DECIMAL(12,2) NOT NULL,
  total_acomptes DECIMAL(12,2) NOT NULL,
  solde DECIMAL(12,2) NOT NULL,        -- Positif = dû, Négatif = crédit

  -- Détail par catégorie (JSON)
  detail JSONB NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ppe_decomptes_indiv_unique UNIQUE(decompte_id, lot_id)
);

-- ============================================================================
-- TABLE: ppe_fonds_renovation
-- Fonds de rénovation
-- ============================================================================

CREATE TABLE ppe_fonds_renovation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,

  -- Identification
  name VARCHAR(255) NOT NULL,

  -- Montants
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_amount DECIMAL(12,2),
  annual_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Compte bancaire dédié
  bank_account_iban VARCHAR(34),
  bank_name VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ppe_mouvements_fonds
-- Mouvements du fonds de rénovation
-- ============================================================================

CREATE TABLE ppe_mouvements_fonds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fonds_id UUID NOT NULL REFERENCES ppe_fonds_renovation(id) ON DELETE CASCADE,

  -- Mouvement
  date DATE NOT NULL,
  type ppe_fonds_movement_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,

  -- Document justificatif
  document_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: ppe_paiements
-- Paiements des copropriétaires
-- ============================================================================

CREATE TABLE ppe_paiements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropriete_id UUID NOT NULL REFERENCES ppe_coproprietes(id) ON DELETE CASCADE,
  coproprietaire_id UUID NOT NULL REFERENCES ppe_coproprietaires(id) ON DELETE CASCADE,

  -- Montant et date
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  value_date DATE,

  -- Type
  type VARCHAR(50) NOT NULL CHECK (type IN ('ACOMPTE', 'SOLDE_DECOMPTE', 'FONDS_RENOVATION', 'AUTRE')),

  -- Référence
  reference VARCHAR(100),
  bank_reference VARCHAR(100),

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Coproprietes
CREATE INDEX idx_ppe_coproprietes_org ON ppe_coproprietes(organization_id);
CREATE INDEX idx_ppe_coproprietes_status ON ppe_coproprietes(status);

-- Lots
CREATE INDEX idx_ppe_lots_copropriete ON ppe_lots(copropriete_id);
CREATE INDEX idx_ppe_lots_type ON ppe_lots(type);

-- Coproprietaires
CREATE INDEX idx_ppe_coproprietaires_copropriete ON ppe_coproprietaires(copropriete_id);
CREATE INDEX idx_ppe_coproprietaires_email ON ppe_coproprietaires(email);
CREATE INDEX idx_ppe_coproprietaires_user ON ppe_coproprietaires(user_id);

-- Lot ownership
CREATE INDEX idx_ppe_lot_ownership_lot ON ppe_lot_ownership(lot_id);
CREATE INDEX idx_ppe_lot_ownership_copro ON ppe_lot_ownership(coproprietaire_id);
CREATE INDEX idx_ppe_lot_ownership_current ON ppe_lot_ownership(lot_id) WHERE end_date IS NULL;

-- AG
CREATE INDEX idx_ppe_ag_copropriete ON ppe_assemblees_generales(copropriete_id);
CREATE INDEX idx_ppe_ag_date ON ppe_assemblees_generales(date);
CREATE INDEX idx_ppe_ag_status ON ppe_assemblees_generales(status);

-- Decomptes
CREATE INDEX idx_ppe_decomptes_copropriete ON ppe_decomptes_charges(copropriete_id);
CREATE INDEX idx_ppe_decomptes_year ON ppe_decomptes_charges(year);

-- Paiements
CREATE INDEX idx_ppe_paiements_copropriete ON ppe_paiements(copropriete_id);
CREATE INDEX idx_ppe_paiements_coproprietaire ON ppe_paiements(coproprietaire_id);
CREATE INDEX idx_ppe_paiements_date ON ppe_paiements(date);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE ppe_coproprietes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_coproprietaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_lot_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_assemblees_generales ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_ag_presences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_ag_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_decomptes_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_lignes_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_decomptes_individuels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_fonds_renovation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_mouvements_fonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_paiements ENABLE ROW LEVEL SECURITY;

-- Policies: Accès via organization_id

CREATE POLICY "ppe_coproprietes_org_access" ON ppe_coproprietes
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "ppe_lots_org_access" ON ppe_lots
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_coproprietaires_org_access" ON ppe_coproprietaires
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_lot_ownership_org_access" ON ppe_lot_ownership
  FOR ALL USING (
    lot_id IN (
      SELECT l.id FROM ppe_lots l
      JOIN ppe_coproprietes c ON l.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_ag_org_access" ON ppe_assemblees_generales
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_ag_presences_org_access" ON ppe_ag_presences
  FOR ALL USING (
    ag_id IN (
      SELECT ag.id FROM ppe_assemblees_generales ag
      JOIN ppe_coproprietes c ON ag.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_ag_points_org_access" ON ppe_ag_points
  FOR ALL USING (
    ag_id IN (
      SELECT ag.id FROM ppe_assemblees_generales ag
      JOIN ppe_coproprietes c ON ag.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_decomptes_org_access" ON ppe_decomptes_charges
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_lignes_charges_org_access" ON ppe_lignes_charges
  FOR ALL USING (
    decompte_id IN (
      SELECT d.id FROM ppe_decomptes_charges d
      JOIN ppe_coproprietes c ON d.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_decomptes_indiv_org_access" ON ppe_decomptes_individuels
  FOR ALL USING (
    decompte_id IN (
      SELECT d.id FROM ppe_decomptes_charges d
      JOIN ppe_coproprietes c ON d.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_fonds_org_access" ON ppe_fonds_renovation
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_mouvements_org_access" ON ppe_mouvements_fonds
  FOR ALL USING (
    fonds_id IN (
      SELECT f.id FROM ppe_fonds_renovation f
      JOIN ppe_coproprietes c ON f.copropriete_id = c.id
      WHERE c.organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ppe_paiements_org_access" ON ppe_paiements
  FOR ALL USING (
    copropriete_id IN (
      SELECT id FROM ppe_coproprietes WHERE organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- TRIGGERS: updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_ppe_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ppe_coproprietes_updated_at
  BEFORE UPDATE ON ppe_coproprietes
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

CREATE TRIGGER ppe_lots_updated_at
  BEFORE UPDATE ON ppe_lots
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

CREATE TRIGGER ppe_coproprietaires_updated_at
  BEFORE UPDATE ON ppe_coproprietaires
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

CREATE TRIGGER ppe_ag_updated_at
  BEFORE UPDATE ON ppe_assemblees_generales
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

CREATE TRIGGER ppe_decomptes_updated_at
  BEFORE UPDATE ON ppe_decomptes_charges
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

CREATE TRIGGER ppe_fonds_updated_at
  BEFORE UPDATE ON ppe_fonds_renovation
  FOR EACH ROW EXECUTE FUNCTION update_ppe_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE ppe_coproprietes IS 'Immeubles en propriété par étages (PPE) gérés';
COMMENT ON TABLE ppe_lots IS 'Lots (unités) d''une copropriété PPE';
COMMENT ON TABLE ppe_coproprietaires IS 'Propriétaires de lots PPE';
COMMENT ON TABLE ppe_lot_ownership IS 'Historique de propriété des lots';
COMMENT ON TABLE ppe_assemblees_generales IS 'Assemblées générales des copropriétaires';
COMMENT ON TABLE ppe_ag_presences IS 'Présences et procurations aux AG';
COMMENT ON TABLE ppe_ag_points IS 'Points de l''ordre du jour et résultats des votes';
COMMENT ON TABLE ppe_decomptes_charges IS 'Décomptes annuels de charges';
COMMENT ON TABLE ppe_lignes_charges IS 'Lignes de charges dans un décompte';
COMMENT ON TABLE ppe_decomptes_individuels IS 'Décomptes individuels par copropriétaire';
COMMENT ON TABLE ppe_fonds_renovation IS 'Fonds de rénovation de la copropriété';
COMMENT ON TABLE ppe_mouvements_fonds IS 'Mouvements du fonds de rénovation';
COMMENT ON TABLE ppe_paiements IS 'Paiements des copropriétaires';
