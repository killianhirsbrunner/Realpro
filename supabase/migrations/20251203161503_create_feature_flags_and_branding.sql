-- Module Feature Flags & Organization Branding
-- Contrôle des fonctionnalités par plan et personnalisation

-- 1. Amélioration de la table plans (feature flags)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS feature_flags JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN plans.feature_flags IS 'Feature flags activés pour ce plan';

-- Exemples de feature flags:
-- {"submissions": true, "materials": true, "supplier_appointments": true, "advanced_reporting": false, "api_access": false}

-- 2. Table organization_branding
CREATE TABLE IF NOT EXISTS organization_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  logo_url TEXT,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  accent_color VARCHAR(20),
  font_family VARCHAR(100),
  custom_domain VARCHAR(255),
  email_footer_text TEXT,
  terms_url TEXT,
  privacy_url TEXT,
  support_email VARCHAR(255),
  support_phone VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE organization_branding IS 'Personnalisation visuelle par organisation';
COMMENT ON COLUMN organization_branding.primary_color IS 'Couleur principale (hex: #1D4ED8)';
COMMENT ON COLUMN organization_branding.custom_domain IS 'Domaine personnalisé (ex: app.promoteur.ch)';

-- 3. Table organization_settings
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  default_language VARCHAR(10) NOT NULL DEFAULT 'fr-CH',
  default_currency VARCHAR(10) NOT NULL DEFAULT 'CHF',
  default_timezone VARCHAR(50) NOT NULL DEFAULT 'Europe/Zurich',
  enable_buyer_portal BOOLEAN NOT NULL DEFAULT true,
  enable_broker_portal BOOLEAN NOT NULL DEFAULT true,
  enable_material_choices BOOLEAN NOT NULL DEFAULT true,
  enable_supplier_appointments BOOLEAN NOT NULL DEFAULT true,
  enable_two_factor_auth BOOLEAN NOT NULL DEFAULT false,
  session_timeout_minutes INT DEFAULT 480,
  max_file_upload_mb INT DEFAULT 50,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE organization_settings IS 'Paramètres généraux de l''organisation';

-- 4. Table feature_usage_tracking
CREATE TABLE IF NOT EXISTS feature_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  usage_count INT NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  month_year VARCHAR(7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, feature_key, month_year)
);

COMMENT ON TABLE feature_usage_tracking IS 'Suivi de l''utilisation des fonctionnalités';
COMMENT ON COLUMN feature_usage_tracking.month_year IS 'Format: YYYY-MM pour regroupement mensuel';

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_org_branding_organization ON organization_branding(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_settings_organization ON organization_settings(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_org ON feature_usage_tracking(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_month ON feature_usage_tracking(month_year);

-- 6. Triggers pour updated_at
CREATE TRIGGER trigger_org_branding_updated_at
  BEFORE UPDATE ON organization_branding
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_org_settings_updated_at
  BEFORE UPDATE ON organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. RLS - Activer
ALTER TABLE organization_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage_tracking ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies - organization_branding

CREATE POLICY "Organization members can view branding"
  ON organization_branding FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = organization_branding.organization_id
    )
  );

CREATE POLICY "Organization admins can manage branding"
  ON organization_branding FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = organization_branding.organization_id
    )
  );

-- 9. RLS Policies - organization_settings

CREATE POLICY "Organization members can view settings"
  ON organization_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = organization_settings.organization_id
    )
  );

CREATE POLICY "Organization admins can manage settings"
  ON organization_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
      AND uo.organization_id = organization_settings.organization_id
    )
  );

-- 10. RLS Policies - feature_usage_tracking

CREATE POLICY "System can manage feature usage"
  ON feature_usage_tracking FOR ALL
  TO authenticated
  USING (true);

-- 11. Fonction pour vérifier si une feature est disponible
CREATE OR REPLACE FUNCTION is_feature_enabled(
  p_organization_id UUID,
  p_feature_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_enabled BOOLEAN;
BEGIN
  SELECT 
    COALESCE(
      (s.plan.feature_flags->>p_feature_key)::boolean,
      false
    )
  INTO v_enabled
  FROM subscriptions s
  JOIN plans ON s.plan_id = plans.id
  WHERE s.organization_id = p_organization_id
  AND s.status IN ('TRIAL', 'ACTIVE')
  LIMIT 1;
  
  RETURN COALESCE(v_enabled, false);
END;
$$;

COMMENT ON FUNCTION is_feature_enabled IS 'Vérifie si une feature est activée pour l''organisation';

GRANT EXECUTE ON FUNCTION is_feature_enabled TO authenticated;

-- 12. Fonction pour incrémenter l'usage d'une feature
CREATE OR REPLACE FUNCTION track_feature_usage(
  p_organization_id UUID,
  p_feature_key TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_month_year TEXT;
BEGIN
  v_month_year := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  
  INSERT INTO feature_usage_tracking (
    organization_id,
    feature_key,
    usage_count,
    last_used_at,
    month_year
  )
  VALUES (
    p_organization_id,
    p_feature_key,
    1,
    now(),
    v_month_year
  )
  ON CONFLICT (organization_id, feature_key, month_year)
  DO UPDATE SET
    usage_count = feature_usage_tracking.usage_count + 1,
    last_used_at = now();
END;
$$;

COMMENT ON FUNCTION track_feature_usage IS 'Incrémente le compteur d''usage d''une feature';

GRANT EXECUTE ON FUNCTION track_feature_usage TO authenticated;

-- 13. Vue pour les limites du plan actuel
CREATE OR REPLACE VIEW organization_plan_limits AS
SELECT
  s.organization_id,
  p.slug AS plan_slug,
  p.name AS plan_name,
  p.limits,
  p.feature_flags,
  s.status AS subscription_status
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.status IN ('TRIAL', 'ACTIVE');

COMMENT ON VIEW organization_plan_limits IS 'Vue des limites et features du plan actuel par organisation';
