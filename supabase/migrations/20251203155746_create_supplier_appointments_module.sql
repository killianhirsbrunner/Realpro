/*
  # Module Rendez-vous Fournisseurs (Cuisines/Sanitaires/Sols)

  1. Nouvelles Tables
    - `supplier_showrooms` - Showrooms fournisseurs
    - `supplier_time_slots` - Créneaux horaires par catégorie
    - `supplier_appointments` - Rendez-vous acheteurs

  2. Enums
    - `supplier_category` - KITCHEN, SANITARY, FLOORING
    - `appointment_status` - REQUESTED, CONFIRMED, DECLINED, CANCELLED

  3. Workflow
    - Fournisseur crée créneaux (par catégorie)
    - Acheteur demande rendez-vous sur créneau
    - Fournisseur accepte/refuse
    - Notifications automatiques

  4. Sécurité
    - RLS activé sur toutes les tables
    - Policies séparées pour fournisseurs et acheteurs
*/

-- 1. Enum catégories fournisseurs
DO $$ BEGIN
  CREATE TYPE supplier_category AS ENUM ('KITCHEN', 'SANITARY', 'FLOORING');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Enum statut rendez-vous
DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('REQUESTED', 'CONFIRMED', 'DECLINED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Table supplier_showrooms
CREATE TABLE IF NOT EXISTS supplier_showrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  categories supplier_category[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE supplier_showrooms IS 'Showrooms fournisseurs (cuisines, sanitaires, sols)';
COMMENT ON COLUMN supplier_showrooms.categories IS 'Catégories supportées par ce showroom';

-- 4. Table supplier_time_slots
CREATE TABLE IF NOT EXISTS supplier_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showroom_id UUID NOT NULL REFERENCES supplier_showrooms(id) ON DELETE CASCADE,
  category supplier_category NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_at > start_at),
  CONSTRAINT positive_capacity CHECK (capacity > 0)
);

COMMENT ON TABLE supplier_time_slots IS 'Créneaux horaires disponibles par showroom et catégorie';
COMMENT ON COLUMN supplier_time_slots.capacity IS 'Nombre max de rendez-vous sur ce créneau';

-- 5. Table supplier_appointments
CREATE TABLE IF NOT EXISTS supplier_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showroom_id UUID NOT NULL REFERENCES supplier_showrooms(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES supplier_time_slots(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status appointment_status NOT NULL DEFAULT 'REQUESTED',
  notes_buyer TEXT,
  notes_supplier TEXT,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE supplier_appointments IS 'Rendez-vous fournisseurs demandés par les acheteurs';

-- 6. Index pour performance
CREATE INDEX IF NOT EXISTS idx_supplier_showrooms_organization ON supplier_showrooms(organization_id);
CREATE INDEX IF NOT EXISTS idx_supplier_showrooms_active ON supplier_showrooms(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_supplier_time_slots_showroom ON supplier_time_slots(showroom_id);
CREATE INDEX IF NOT EXISTS idx_supplier_time_slots_category ON supplier_time_slots(category);
CREATE INDEX IF NOT EXISTS idx_supplier_time_slots_start ON supplier_time_slots(start_at);
CREATE INDEX IF NOT EXISTS idx_supplier_time_slots_active ON supplier_time_slots(is_active, start_at) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_supplier_appointments_showroom ON supplier_appointments(showroom_id);
CREATE INDEX IF NOT EXISTS idx_supplier_appointments_buyer ON supplier_appointments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_supplier_appointments_lot ON supplier_appointments(lot_id);
CREATE INDEX IF NOT EXISTS idx_supplier_appointments_status ON supplier_appointments(status);

-- 7. Trigger updated_at
CREATE OR REPLACE FUNCTION update_supplier_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_supplier_showrooms_updated_at
  BEFORE UPDATE ON supplier_showrooms
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_appointments_updated_at();

CREATE TRIGGER trigger_supplier_time_slots_updated_at
  BEFORE UPDATE ON supplier_time_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_appointments_updated_at();

CREATE TRIGGER trigger_supplier_appointments_updated_at
  BEFORE UPDATE ON supplier_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_appointments_updated_at();

-- 8. RLS - Activer
ALTER TABLE supplier_showrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_appointments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies - supplier_showrooms

CREATE POLICY "Fournisseurs peuvent voir leurs showrooms"
  ON supplier_showrooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = supplier_showrooms.organization_id
    )
  );

CREATE POLICY "Acheteurs peuvent voir showrooms actifs"
  ON supplier_showrooms FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Fournisseurs peuvent créer leurs showrooms"
  ON supplier_showrooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = supplier_showrooms.organization_id
    )
  );

CREATE POLICY "Fournisseurs peuvent modifier leurs showrooms"
  ON supplier_showrooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = supplier_showrooms.organization_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = supplier_showrooms.organization_id
    )
  );

-- 10. RLS Policies - supplier_time_slots

CREATE POLICY "Fournisseurs peuvent voir leurs créneaux"
  ON supplier_time_slots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_time_slots.showroom_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Acheteurs peuvent voir créneaux actifs futurs"
  ON supplier_time_slots FOR SELECT
  TO authenticated
  USING (
    is_active = true
    AND start_at > now()
    AND EXISTS (
      SELECT 1 FROM supplier_showrooms s
      WHERE s.id = supplier_time_slots.showroom_id
      AND s.is_active = true
    )
  );

CREATE POLICY "Fournisseurs peuvent créer leurs créneaux"
  ON supplier_time_slots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_time_slots.showroom_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Fournisseurs peuvent modifier leurs créneaux"
  ON supplier_time_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_time_slots.showroom_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_time_slots.showroom_id
      AND uo.user_id = auth.uid()
    )
  );

-- 11. RLS Policies - supplier_appointments

CREATE POLICY "Acheteurs peuvent voir leurs rendez-vous"
  ON supplier_appointments FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Fournisseurs peuvent voir rendez-vous de leurs showrooms"
  ON supplier_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_appointments.showroom_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Acheteurs peuvent créer rendez-vous"
  ON supplier_appointments FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Acheteurs peuvent annuler leurs rendez-vous"
  ON supplier_appointments FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid() AND status = 'CANCELLED');

CREATE POLICY "Fournisseurs peuvent répondre aux rendez-vous"
  ON supplier_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_appointments.showroom_id
      AND uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM supplier_showrooms s
      JOIN user_organizations uo ON s.organization_id = uo.organization_id
      WHERE s.id = supplier_appointments.showroom_id
      AND uo.user_id = auth.uid()
    )
  );

-- 12. Fonction helper - capacité restante créneau
CREATE OR REPLACE FUNCTION get_time_slot_remaining_capacity(p_time_slot_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_capacity INT;
  v_confirmed_count INT;
BEGIN
  SELECT capacity INTO v_capacity
  FROM supplier_time_slots
  WHERE id = p_time_slot_id;

  SELECT COUNT(*) INTO v_confirmed_count
  FROM supplier_appointments
  WHERE time_slot_id = p_time_slot_id
  AND status = 'CONFIRMED';

  RETURN COALESCE(v_capacity, 0) - COALESCE(v_confirmed_count, 0);
END;
$$;

COMMENT ON FUNCTION get_time_slot_remaining_capacity IS 'Calcule le nombre de places restantes sur un créneau';

GRANT EXECUTE ON FUNCTION get_time_slot_remaining_capacity TO authenticated;
