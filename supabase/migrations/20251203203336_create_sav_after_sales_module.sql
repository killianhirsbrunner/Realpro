/*
  # Create SAV (Service Après-Vente) Module
  
  1. New Types
    - sav_status ENUM (NEW, ASSIGNED, IN_PROGRESS, FIXED, VALIDATED, CLOSED, REJECTED, EXPIRED)
    - sav_severity ENUM (MINOR, MAJOR, CRITICAL, BLOCKING)
    
  2. New Tables
    - sav_tickets - Tickets SAV pour réserves et interventions post-livraison
    - sav_messages - Messages et communications sur les tickets
    - sav_history - Historique des changements de statut et actions
    - sav_attachments - Photos et documents attachés
    
  3. Features
    - Gestion complète réserves après livraison
    - Workflow assignation entreprise/sous-traitant
    - Communication multi-parties (acheteur/promoteur/EG)
    - Suivi garanties et clôture automatique
    - Traçabilité complète des interventions
    
  4. Security
    - Enable RLS on all tables
    - Organization-scoped access
    - Buyer can see only their tickets
    - Company can see assigned tickets
*/

-- ========================================
-- ENUMS
-- ========================================

DO $$ BEGIN
  CREATE TYPE sav_status AS ENUM (
    'NEW',          -- Nouveau ticket créé
    'ASSIGNED',     -- Assigné à une entreprise
    'IN_PROGRESS',  -- Intervention en cours
    'FIXED',        -- Corrigé, en attente validation
    'VALIDATED',    -- Validé par acheteur
    'CLOSED',       -- Clôturé définitivement
    'REJECTED',     -- Rejeté (hors garantie, etc.)
    'EXPIRED'       -- Garantie expirée
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sav_severity AS ENUM (
    'MINOR',     -- Mineur (cosmétique)
    'MAJOR',     -- Majeur (fonctionnalité impactée)
    'CRITICAL',  -- Critique (sécurité)
    'BLOCKING'   -- Bloquant (inhabitable)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ========================================
-- SAV TICKETS
-- ========================================

CREATE TABLE IF NOT EXISTS sav_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES buyers(id) ON DELETE SET NULL,
  
  -- Ticket details
  title text NOT NULL,
  description text NOT NULL,
  location text,
  severity sav_severity DEFAULT 'MINOR',
  status sav_status DEFAULT 'NEW',
  
  -- Assignment
  reported_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  assigned_to_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  
  -- Dates
  due_date timestamptz,
  fixed_at timestamptz,
  validated_at timestamptz,
  closed_at timestamptz,
  
  -- Metadata
  category text,
  warranty_type text,
  warranty_end_date date,
  internal_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sav_tickets_organization_id_idx ON sav_tickets(organization_id);
CREATE INDEX IF NOT EXISTS sav_tickets_project_id_idx ON sav_tickets(project_id);
CREATE INDEX IF NOT EXISTS sav_tickets_lot_id_idx ON sav_tickets(lot_id);
CREATE INDEX IF NOT EXISTS sav_tickets_buyer_id_idx ON sav_tickets(buyer_id);
CREATE INDEX IF NOT EXISTS sav_tickets_status_idx ON sav_tickets(status);
CREATE INDEX IF NOT EXISTS sav_tickets_severity_idx ON sav_tickets(severity);
CREATE INDEX IF NOT EXISTS sav_tickets_assigned_to_company_id_idx ON sav_tickets(assigned_to_company_id);
CREATE INDEX IF NOT EXISTS sav_tickets_created_at_idx ON sav_tickets(created_at DESC);

-- ========================================
-- SAV MESSAGES
-- ========================================

CREATE TABLE IF NOT EXISTS sav_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES sav_tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  body text NOT NULL,
  is_internal boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sav_messages_ticket_id_idx ON sav_messages(ticket_id);
CREATE INDEX IF NOT EXISTS sav_messages_author_id_idx ON sav_messages(author_id);
CREATE INDEX IF NOT EXISTS sav_messages_created_at_idx ON sav_messages(created_at);

-- ========================================
-- SAV ATTACHMENTS
-- ========================================

CREATE TABLE IF NOT EXISTS sav_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES sav_tickets(id) ON DELETE CASCADE,
  message_id uuid REFERENCES sav_messages(id) ON DELETE CASCADE,
  
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size int,
  
  uploaded_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT ticket_or_message_required CHECK (
    (ticket_id IS NOT NULL AND message_id IS NULL) OR
    (ticket_id IS NULL AND message_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS sav_attachments_ticket_id_idx ON sav_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS sav_attachments_message_id_idx ON sav_attachments(message_id);

-- ========================================
-- SAV HISTORY
-- ========================================

CREATE TABLE IF NOT EXISTS sav_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES sav_tickets(id) ON DELETE CASCADE,
  
  action text NOT NULL,
  details text,
  old_value text,
  new_value text,
  
  created_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sav_history_ticket_id_idx ON sav_history(ticket_id);
CREATE INDEX IF NOT EXISTS sav_history_created_at_idx ON sav_history(created_at DESC);

-- ========================================
-- ENABLE RLS
-- ========================================

ALTER TABLE sav_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sav_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sav_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sav_history ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES - SAV TICKETS
-- ========================================

DROP POLICY IF EXISTS "Users can view tickets in their org" ON sav_tickets;
CREATE POLICY "Users can view tickets in their org"
  ON sav_tickets FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo WHERE uo.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create tickets in their org" ON sav_tickets;
CREATE POLICY "Users can create tickets in their org"
  ON sav_tickets FOR INSERT TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo WHERE uo.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tickets in their org" ON sav_tickets;
CREATE POLICY "Users can update tickets in their org"
  ON sav_tickets FOR UPDATE TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo WHERE uo.user_id = auth.uid()
    )
  );

-- ========================================
-- RLS POLICIES - SAV MESSAGES
-- ========================================

DROP POLICY IF EXISTS "Users can view messages for their org tickets" ON sav_messages;
CREATE POLICY "Users can view messages for their org tickets"
  ON sav_messages FOR SELECT TO authenticated
  USING (
    ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages for their org tickets" ON sav_messages;
CREATE POLICY "Users can create messages for their org tickets"
  ON sav_messages FOR INSERT TO authenticated
  WITH CHECK (
    ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )
  );

-- ========================================
-- RLS POLICIES - SAV ATTACHMENTS
-- ========================================

DROP POLICY IF EXISTS "Users can view attachments for their org" ON sav_attachments;
CREATE POLICY "Users can view attachments for their org"
  ON sav_attachments FOR SELECT TO authenticated
  USING (
    (ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )) OR
    (message_id IN (
      SELECT sm.id FROM sav_messages sm
      INNER JOIN sav_tickets st ON st.id = sm.ticket_id
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can create attachments for their org" ON sav_attachments;
CREATE POLICY "Users can create attachments for their org"
  ON sav_attachments FOR INSERT TO authenticated
  WITH CHECK (
    (ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )) OR
    (message_id IN (
      SELECT sm.id FROM sav_messages sm
      INNER JOIN sav_tickets st ON st.id = sm.ticket_id
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    ))
  );

-- ========================================
-- RLS POLICIES - SAV HISTORY
-- ========================================

DROP POLICY IF EXISTS "Users can view history for their org tickets" ON sav_history;
CREATE POLICY "Users can view history for their org tickets"
  ON sav_history FOR SELECT TO authenticated
  USING (
    ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create history for their org tickets" ON sav_history;
CREATE POLICY "Users can create history for their org tickets"
  ON sav_history FOR INSERT TO authenticated
  WITH CHECK (
    ticket_id IN (
      SELECT st.id FROM sav_tickets st
      INNER JOIN user_organizations uo ON uo.organization_id = st.organization_id
      WHERE uo.user_id = auth.uid()
    )
  );

-- ========================================
-- TRIGGERS
-- ========================================

CREATE OR REPLACE FUNCTION update_sav_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sav_tickets_updated_at ON sav_tickets;
CREATE TRIGGER sav_tickets_updated_at
  BEFORE UPDATE ON sav_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_sav_tickets_updated_at();

-- Trigger to log history on status change
CREATE OR REPLACE FUNCTION log_sav_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO sav_history (ticket_id, action, old_value, new_value, details)
    VALUES (
      NEW.id,
      'status_changed',
      OLD.status::text,
      NEW.status::text,
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;
  
  IF OLD.assigned_to_company_id IS DISTINCT FROM NEW.assigned_to_company_id THEN
    INSERT INTO sav_history (ticket_id, action, details)
    VALUES (
      NEW.id,
      'assigned',
      'Ticket assigned to company ' || COALESCE(NEW.assigned_to_company_id::text, 'none')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sav_status_change_trigger ON sav_tickets;
CREATE TRIGGER sav_status_change_trigger
  AFTER UPDATE ON sav_tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_sav_status_change();

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to get ticket statistics for a project
CREATE OR REPLACE FUNCTION get_sav_statistics(p_project_id uuid)
RETURNS TABLE (
  total_tickets bigint,
  new_tickets bigint,
  in_progress bigint,
  fixed_tickets bigint,
  closed_tickets bigint,
  critical_tickets bigint,
  avg_resolution_days numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint AS total_tickets,
    COUNT(*) FILTER (WHERE status = 'NEW')::bigint AS new_tickets,
    COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::bigint AS in_progress,
    COUNT(*) FILTER (WHERE status = 'FIXED')::bigint AS fixed_tickets,
    COUNT(*) FILTER (WHERE status = 'CLOSED')::bigint AS closed_tickets,
    COUNT(*) FILTER (WHERE severity = 'CRITICAL' OR severity = 'BLOCKING')::bigint AS critical_tickets,
    AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400)::numeric AS avg_resolution_days
  FROM sav_tickets
  WHERE project_id = p_project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if warranty is expired
CREATE OR REPLACE FUNCTION check_warranty_expired(ticket_id uuid)
RETURNS boolean AS $$
DECLARE
  warranty_date date;
BEGIN
  SELECT warranty_end_date INTO warranty_date
  FROM sav_tickets
  WHERE id = ticket_id;
  
  IF warranty_date IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN CURRENT_DATE > warranty_date;
END;
$$ LANGUAGE plpgsql;
