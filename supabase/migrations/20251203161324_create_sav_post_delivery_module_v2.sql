-- Module SAV & Post-livraison
-- Gestion des réserves, garanties et service après-vente

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE issue_severity AS ENUM ('MINOR', 'MAJOR', 'CRITICAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_source AS ENUM ('BUYER', 'INTERNAL', 'INSPECTION');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Table handover_inspections (Réceptions de chantier)
CREATE TABLE IF NOT EXISTS handover_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  inspection_date TIMESTAMPTZ NOT NULL,
  inspector_name VARCHAR(255),
  notes TEXT,
  created_by_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE handover_inspections IS 'Réceptions de chantier / Inspections avant livraison';

-- 3. Table handover_issues (Réserves)
CREATE TABLE IF NOT EXISTS handover_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES handover_inspections(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  severity issue_severity NOT NULL DEFAULT 'MINOR',
  status issue_status NOT NULL DEFAULT 'OPEN',
  due_date DATE,
  assigned_to_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE handover_issues IS 'Réserves identifiées lors des réceptions';
COMMENT ON COLUMN handover_issues.category IS 'ELECTRICITY, PLUMBING, FINISHING, HEATING, etc.';

-- 4. Table warranties (Garanties)
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID REFERENCES lots(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  duration_months INT NOT NULL,
  start_at DATE NOT NULL,
  end_at DATE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE warranties IS 'Garanties légales et contractuelles';
COMMENT ON COLUMN warranties.category IS 'STRUCTURAL, EQUIPMENT, WATERPROOFING, etc.';

-- 5. Table service_tickets (Tickets SAV)
CREATE TABLE IF NOT EXISTS service_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source ticket_source NOT NULL DEFAULT 'BUYER',
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  status issue_status NOT NULL DEFAULT 'OPEN',
  priority VARCHAR(50) DEFAULT 'NORMAL',
  assigned_to_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  warranty_id UUID REFERENCES warranties(id) ON DELETE SET NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

COMMENT ON TABLE service_tickets IS 'Tickets service après-vente';

-- 6. Index pour performance
CREATE INDEX IF NOT EXISTS idx_inspections_project ON handover_inspections(project_id);
CREATE INDEX IF NOT EXISTS idx_inspections_lot ON handover_inspections(lot_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON handover_inspections(inspection_date);

CREATE INDEX IF NOT EXISTS idx_issues_inspection ON handover_issues(inspection_id);
CREATE INDEX IF NOT EXISTS idx_issues_project ON handover_issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_lot ON handover_issues(lot_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON handover_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_assigned ON handover_issues(assigned_to_company_id);

CREATE INDEX IF NOT EXISTS idx_warranties_project ON warranties(project_id);
CREATE INDEX IF NOT EXISTS idx_warranties_lot ON warranties(lot_id);
CREATE INDEX IF NOT EXISTS idx_warranties_dates ON warranties(start_at, end_at);

CREATE INDEX IF NOT EXISTS idx_tickets_project ON service_tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_tickets_lot ON service_tickets(lot_id);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer ON service_tickets(buyer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON service_tickets(status);

-- 7. Triggers pour updated_at
CREATE TRIGGER trigger_handover_inspections_updated_at
  BEFORE UPDATE ON handover_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_handover_issues_updated_at
  BEFORE UPDATE ON handover_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_service_tickets_updated_at
  BEFORE UPDATE ON service_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS - Activer
ALTER TABLE handover_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE handover_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies - handover_inspections

CREATE POLICY "Project team can view inspections"
  ON handover_inspections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = handover_inspections.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "Project team can manage inspections"
  ON handover_inspections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = handover_inspections.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

-- 10. RLS Policies - handover_issues

CREATE POLICY "Project team can view issues"
  ON handover_issues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = handover_issues.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "Buyers can view their lot issues"
  ON handover_issues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales_contracts sc
      WHERE sc.lot_id = handover_issues.lot_id
      AND sc.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Project team can manage issues"
  ON handover_issues FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = handover_issues.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

-- 11. RLS Policies - warranties

CREATE POLICY "Project team can view warranties"
  ON warranties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = warranties.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "Buyers can view their lot warranties"
  ON warranties FOR SELECT
  TO authenticated
  USING (
    lot_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM sales_contracts sc
      WHERE sc.lot_id = warranties.lot_id
      AND sc.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Project team can manage warranties"
  ON warranties FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = warranties.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

-- 12. RLS Policies - service_tickets

CREATE POLICY "Project team can view tickets"
  ON service_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = service_tickets.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );

CREATE POLICY "Buyers can view their tickets"
  ON service_tickets FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can create tickets"
  ON service_tickets FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Project team can manage tickets"
  ON service_tickets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = service_tickets.project_id
      AND EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid()
        AND uo.organization_id = p.organization_id
      )
    )
  );
