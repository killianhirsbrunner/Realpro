-- Enhancement du système d'audit existant

-- 1. Ajouter colonnes manquantes à audit_logs
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;

COMMENT ON COLUMN audit_logs.ip_address IS 'Adresse IP de l''utilisateur';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent du navigateur';

-- 2. Index supplémentaires pour performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_entity ON audit_logs(organization_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_created ON audit_logs(project_id, created_at DESC);

-- 3. Fonction helper pour créer un log d'audit
CREATE OR REPLACE FUNCTION create_audit_log(
  p_organization_id UUID,
  p_project_id UUID,
  p_user_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_metadata JSONB DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    project_id,
    user_id,
    entity_type,
    entity_id,
    action,
    description,
    metadata,
    ip_address,
    user_agent
  )
  VALUES (
    p_organization_id,
    p_project_id,
    p_user_id,
    p_entity_type,
    p_entity_id,
    p_action,
    p_description,
    p_metadata,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

COMMENT ON FUNCTION create_audit_log IS 'Helper pour créer une entrée d''audit log';

GRANT EXECUTE ON FUNCTION create_audit_log TO authenticated;

-- 4. Table activity_feed (fil d'actualités simplifié)
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE activity_feed IS 'Fil d''actualité simplifié pour les dashboards';
COMMENT ON COLUMN activity_feed.activity_type IS 'LOT_SOLD, DOC_SIGNED, ISSUE_CREATED, MATERIAL_CHOSEN, etc.';

-- 5. Index pour activity_feed
CREATE INDEX IF NOT EXISTS idx_activity_feed_organization ON activity_feed(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_project ON activity_feed(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_org_created ON activity_feed(organization_id, created_at DESC);

-- 6. RLS pour activity_feed
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view activity feed"
  ON activity_feed FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = activity_feed.organization_id
    )
  );

CREATE POLICY "System can insert activity feed"
  ON activity_feed FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Vue pour historique récent par projet
CREATE OR REPLACE VIEW project_recent_activity AS
SELECT
  af.id,
  af.project_id,
  af.activity_type,
  af.entity_type,
  af.entity_id,
  af.title,
  af.description,
  af.metadata,
  af.created_at,
  u.first_name,
  u.last_name,
  u.email
FROM activity_feed af
LEFT JOIN users u ON af.user_id = u.id
ORDER BY af.created_at DESC;

COMMENT ON VIEW project_recent_activity IS 'Vue simplifiée des activités récentes par projet';
