-- Module Onboarding & Checklists
-- Wizards d'onboarding et checklists interactives pour guider les utilisateurs

-- 1. Enum pour statut checklist
DO $$ BEGIN
  CREATE TYPE checklist_item_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Table project_setup_wizard_states
CREATE TABLE IF NOT EXISTS project_setup_wizard_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  current_step INT NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE project_setup_wizard_states IS 'État du wizard d''onboarding projet';
COMMENT ON COLUMN project_setup_wizard_states.current_step IS 'Étape actuelle du wizard (1-7)';
COMMENT ON COLUMN project_setup_wizard_states.data IS 'Brouillon des données saisies dans le wizard';

-- 3. Table buyer_checklist_items
CREATE TABLE IF NOT EXISTS buyer_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  label_i18n_key VARCHAR(200) NOT NULL,
  status checklist_item_status NOT NULL DEFAULT 'PENDING',
  sort_order INT NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lot_id, buyer_id, key)
);

COMMENT ON TABLE buyer_checklist_items IS 'Checklist interactive pour guider les acheteurs';
COMMENT ON COLUMN buyer_checklist_items.key IS 'Clé unique: UPLOAD_DOCS, MATERIAL_CHOICES, SUPPLIER_APPTS, etc.';

-- 4. Index pour performance
CREATE INDEX IF NOT EXISTS idx_wizard_states_project ON project_setup_wizard_states(project_id);
CREATE INDEX IF NOT EXISTS idx_wizard_states_completed ON project_setup_wizard_states(completed) WHERE completed = false;

CREATE INDEX IF NOT EXISTS idx_buyer_checklist_lot ON buyer_checklist_items(lot_id);
CREATE INDEX IF NOT EXISTS idx_buyer_checklist_buyer ON buyer_checklist_items(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_checklist_status ON buyer_checklist_items(status);

-- 5. Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wizard_states_updated_at
  BEFORE UPDATE ON project_setup_wizard_states
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

CREATE TRIGGER trigger_buyer_checklist_updated_at
  BEFORE UPDATE ON buyer_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

-- 6. RLS - Activer
ALTER TABLE project_setup_wizard_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_checklist_items ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies - project_setup_wizard_states

CREATE POLICY "Users can view wizard state for their projects"
  ON project_setup_wizard_states FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_setup_wizard_states.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "Users can manage wizard state for their projects"
  ON project_setup_wizard_states FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_setup_wizard_states.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

-- 8. RLS Policies - buyer_checklist_items

CREATE POLICY "Buyers can view their own checklist"
  ON buyer_checklist_items FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Project team can view buyer checklists"
  ON buyer_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lots l
      JOIN projects p ON l.project_id = p.id
      WHERE l.id = buyer_checklist_items.lot_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "System can manage buyer checklists"
  ON buyer_checklist_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 9. Fonction helper - Initialiser checklist acheteur
CREATE OR REPLACE FUNCTION initialize_buyer_checklist(p_lot_id UUID, p_buyer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO buyer_checklist_items (lot_id, buyer_id, key, label_i18n_key, sort_order)
  VALUES
    (p_lot_id, p_buyer_id, 'ACCOUNT_SETUP', 'buyer.checklist.accountSetup', 1),
    (p_lot_id, p_buyer_id, 'UPLOAD_DOCUMENTS', 'buyer.checklist.uploadDocuments', 2),
    (p_lot_id, p_buyer_id, 'SUPPLIER_APPOINTMENTS', 'buyer.checklist.supplierAppointments', 3),
    (p_lot_id, p_buyer_id, 'MATERIAL_CHOICES', 'buyer.checklist.materialChoices', 4),
    (p_lot_id, p_buyer_id, 'SIGN_CONTRACT', 'buyer.checklist.signContract', 5),
    (p_lot_id, p_buyer_id, 'TRACK_PROGRESS', 'buyer.checklist.trackProgress', 6)
  ON CONFLICT (lot_id, buyer_id, key) DO NOTHING;
END;
$$;

COMMENT ON FUNCTION initialize_buyer_checklist IS 'Initialise la checklist pour un acheteur sur un lot';

GRANT EXECUTE ON FUNCTION initialize_buyer_checklist TO authenticated;
