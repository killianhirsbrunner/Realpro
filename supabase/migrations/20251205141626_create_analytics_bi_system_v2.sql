/*
  # Analytics & Business Intelligence System

  This migration creates comprehensive analytics and BI capabilities.

  ## New Tables

  1. `analytics_events` - Track all user events
  2. `analytics_metrics` - Aggregated metrics
  3. `analytics_reports` - Saved reports
  4. `analytics_dashboards` - Custom dashboards

  ## Security

  - RLS enabled
  - Admins can view all analytics
  - Users can view their own activity
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id),
  
  event_type text NOT NULL CHECK (event_type IN (
    'page_view',
    'button_click',
    'form_submit',
    'document_upload',
    'document_download',
    'workflow_action',
    'notification_sent',
    'notification_read',
    'login',
    'logout',
    'export',
    'search',
    'filter_applied',
    'custom'
  )),
  
  event_name text NOT NULL,
  event_category text,
  
  page_url text,
  page_title text,
  referrer text,
  
  project_id uuid REFERENCES projects(id),
  entity_type text,
  entity_id uuid,
  
  properties jsonb DEFAULT '{}'::jsonb,
  
  session_id text,
  ip_address inet,
  user_agent text,
  
  duration_ms integer,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_events_org ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_project ON analytics_events(project_id);

CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  metric_name text NOT NULL,
  metric_type text NOT NULL CHECK (metric_type IN (
    'counter',
    'gauge',
    'histogram',
    'rate',
    'percentage'
  )),
  
  value numeric NOT NULL DEFAULT 0,
  previous_value numeric,
  
  dimensions jsonb DEFAULT '{}'::jsonb,
  
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  period_type text NOT NULL CHECK (period_type IN (
    'hour',
    'day',
    'week',
    'month',
    'quarter',
    'year'
  )),
  
  unit text,
  description text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(organization_id, metric_name, period_start, period_type)
);

CREATE INDEX idx_analytics_metrics_org ON analytics_metrics(organization_id);
CREATE INDEX idx_analytics_metrics_name ON analytics_metrics(metric_name);
CREATE INDEX idx_analytics_metrics_period ON analytics_metrics(period_start, period_end);

CREATE TABLE IF NOT EXISTS analytics_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  description text,
  
  report_type text NOT NULL CHECK (report_type IN (
    'sales',
    'financial',
    'operational',
    'marketing',
    'user_activity',
    'custom'
  )),
  
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  is_scheduled boolean DEFAULT false,
  schedule_cron text,
  last_run_at timestamptz,
  next_run_at timestamptz,
  
  recipients text[],
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_reports_org ON analytics_reports(organization_id);
CREATE INDEX idx_analytics_reports_type ON analytics_reports(report_type);

CREATE TABLE IF NOT EXISTS analytics_dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  name text NOT NULL,
  description text,
  
  layout jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  is_public boolean DEFAULT false,
  shared_with uuid[],
  
  refresh_interval integer DEFAULT 300,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_dashboards_org ON analytics_dashboards(organization_id);
CREATE INDEX idx_analytics_dashboards_creator ON analytics_dashboards(created_by);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events in their organization"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view metrics in their organization"
  ON analytics_metrics FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage metrics"
  ON analytics_metrics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = analytics_metrics.organization_id
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view reports in their organization"
  ON analytics_reports FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reports"
  ON analytics_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their reports"
  ON analytics_reports FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view dashboards in their organization"
  ON analytics_dashboards FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
    OR is_public = true
    OR auth.uid() = ANY(shared_with)
  );

CREATE POLICY "Users can create dashboards"
  ON analytics_dashboards FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their dashboards"
  ON analytics_dashboards FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE OR REPLACE FUNCTION track_analytics_event(
  p_organization_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_event_name text,
  p_properties jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO analytics_events (
    organization_id,
    user_id,
    event_type,
    event_name,
    properties
  ) VALUES (
    p_organization_id,
    p_user_id,
    p_event_type,
    p_event_name,
    p_properties
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;
