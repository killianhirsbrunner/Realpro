/*
  # Workflow Engine System

  This migration creates a comprehensive workflow orchestration system for RealPro SA.

  ## New Tables

  1. `workflow_definitions` - Reusable workflow templates
  2. `workflow_instances` - Active workflow executions  
  3. `workflow_steps` - Individual steps tracking
  4. `workflow_transitions` - Audit log of transitions
  5. `workflow_actions` - Automated actions configuration
  6. `scheduled_jobs` - Cron-like job scheduling

  ## Security

  - RLS enabled on all tables
  - Multi-tenant isolation via organizations
  - Role-based access control
*/

-- =====================================================
-- 1. WORKFLOW DEFINITIONS (Templates)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  name text NOT NULL,
  description text,
  workflow_type text NOT NULL CHECK (workflow_type IN (
    'modification_offer',
    'avenant_signature',
    'sales_process',
    'notary_process',
    'construction_approval',
    'buyer_onboarding',
    'material_selection',
    'submission_evaluation'
  )),

  config jsonb NOT NULL DEFAULT '{
    "steps": [],
    "transitions": [],
    "notifications": [],
    "approvers": []
  }'::jsonb,

  is_active boolean DEFAULT true,
  version integer DEFAULT 1,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),

  UNIQUE(organization_id, workflow_type, version)
);

CREATE INDEX idx_workflow_definitions_org ON workflow_definitions(organization_id);
CREATE INDEX idx_workflow_definitions_type ON workflow_definitions(workflow_type);
CREATE INDEX idx_workflow_definitions_active ON workflow_definitions(is_active) WHERE is_active = true;

-- =====================================================
-- 2. WORKFLOW INSTANCES (Active Executions)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_definition_id uuid REFERENCES workflow_definitions(id) ON DELETE RESTRICT NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,

  entity_type text NOT NULL CHECK (entity_type IN (
    'supplier_offer',
    'avenant',
    'sales_contract',
    'notary_dossier',
    'construction_phase',
    'buyer',
    'submission',
    'material_selection'
  )),
  entity_id uuid NOT NULL,

  current_step_key text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN (
    'active',
    'completed',
    'cancelled',
    'on_hold',
    'failed'
  )),

  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  due_date timestamptz,

  initiator_id uuid REFERENCES users(id),
  assigned_to uuid REFERENCES users(id),

  context jsonb DEFAULT '{}'::jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(entity_type, entity_id)
);

CREATE INDEX idx_workflow_instances_definition ON workflow_instances(workflow_definition_id);
CREATE INDEX idx_workflow_instances_org ON workflow_instances(organization_id);
CREATE INDEX idx_workflow_instances_project ON workflow_instances(project_id);
CREATE INDEX idx_workflow_instances_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX idx_workflow_instances_assigned ON workflow_instances(assigned_to);

-- =====================================================
-- 3. WORKFLOW STEPS (Individual Steps)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_instance_id uuid REFERENCES workflow_instances(id) ON DELETE CASCADE NOT NULL,

  step_key text NOT NULL,
  step_name text NOT NULL,
  step_order integer NOT NULL,

  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'in_progress',
    'completed',
    'skipped',
    'failed'
  )),

  assigned_to uuid REFERENCES users(id),
  assigned_role text,

  started_at timestamptz,
  completed_at timestamptz,
  due_date timestamptz,

  requires_approval boolean DEFAULT false,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  rejection_reason text,

  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(workflow_instance_id, step_key)
);

CREATE INDEX idx_workflow_steps_instance ON workflow_steps(workflow_instance_id);
CREATE INDEX idx_workflow_steps_status ON workflow_steps(status);
CREATE INDEX idx_workflow_steps_assigned ON workflow_steps(assigned_to);
CREATE INDEX idx_workflow_steps_due ON workflow_steps(due_date) WHERE due_date IS NOT NULL;

-- =====================================================
-- 4. WORKFLOW TRANSITIONS (Audit Log)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_instance_id uuid REFERENCES workflow_instances(id) ON DELETE CASCADE NOT NULL,
  workflow_step_id uuid REFERENCES workflow_steps(id) ON DELETE CASCADE,

  from_status text NOT NULL,
  to_status text NOT NULL,

  triggered_by uuid REFERENCES users(id) NOT NULL,
  triggered_at timestamptz DEFAULT now(),

  transition_type text NOT NULL CHECK (transition_type IN (
    'automatic',
    'manual',
    'scheduled',
    'conditional'
  )),

  comment text,
  decision_data jsonb DEFAULT '{}'::jsonb,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_workflow_transitions_instance ON workflow_transitions(workflow_instance_id);
CREATE INDEX idx_workflow_transitions_step ON workflow_transitions(workflow_step_id);
CREATE INDEX idx_workflow_transitions_triggered_by ON workflow_transitions(triggered_by);
CREATE INDEX idx_workflow_transitions_date ON workflow_transitions(triggered_at);

-- =====================================================
-- 5. WORKFLOW ACTIONS (Automated Actions)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_definition_id uuid REFERENCES workflow_definitions(id) ON DELETE CASCADE NOT NULL,

  action_name text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'send_email',
    'send_sms',
    'create_notification',
    'generate_document',
    'update_status',
    'create_task',
    'webhook',
    'custom_function'
  )),

  trigger_event text NOT NULL CHECK (trigger_event IN (
    'step_started',
    'step_completed',
    'workflow_completed',
    'deadline_approaching',
    'approval_required',
    'approval_granted',
    'approval_rejected'
  )),
  trigger_step_key text,

  conditions jsonb DEFAULT '{}'::jsonb,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,

  delay_minutes integer DEFAULT 0,

  is_active boolean DEFAULT true,
  execution_order integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_workflow_actions_definition ON workflow_actions(workflow_definition_id);
CREATE INDEX idx_workflow_actions_trigger ON workflow_actions(trigger_event, trigger_step_key);
CREATE INDEX idx_workflow_actions_active ON workflow_actions(is_active) WHERE is_active = true;

-- =====================================================
-- 6. SCHEDULED JOBS (Cron-like Scheduling)
-- =====================================================

CREATE TABLE IF NOT EXISTS scheduled_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  job_name text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN (
    'deadline_reminder',
    'overdue_notification',
    'status_check',
    'data_cleanup',
    'report_generation',
    'backup',
    'custom'
  )),

  schedule_type text NOT NULL CHECK (schedule_type IN (
    'once',
    'daily',
    'weekly',
    'monthly',
    'cron'
  )),
  schedule_config jsonb DEFAULT '{}'::jsonb,
  cron_expression text,

  job_function text NOT NULL,
  job_params jsonb DEFAULT '{}'::jsonb,

  is_active boolean DEFAULT true,
  last_run_at timestamptz,
  last_run_status text,
  last_run_error text,
  next_run_at timestamptz,

  run_count integer DEFAULT 0,
  failure_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

CREATE INDEX idx_scheduled_jobs_org ON scheduled_jobs(organization_id);
CREATE INDEX idx_scheduled_jobs_active ON scheduled_jobs(is_active) WHERE is_active = true;
CREATE INDEX idx_scheduled_jobs_next_run ON scheduled_jobs(next_run_at) WHERE next_run_at IS NOT NULL;

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow definitions in their organization"
  ON workflow_definitions FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage workflow definitions"
  ON workflow_definitions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = workflow_definitions.organization_id
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view workflows they participate in"
  ON workflow_instances FOR SELECT
  TO authenticated
  USING (
    organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())
    OR initiator_id = auth.uid()
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Users can update workflows they're assigned to"
  ON workflow_instances FOR UPDATE
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR initiator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = workflow_instances.organization_id
      AND r.name IN ('admin', 'super_admin', 'promoter')
    )
  );

CREATE POLICY "Users can view steps in their workflows"
  ON workflow_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_instances wi
      WHERE wi.id = workflow_steps.workflow_instance_id
      AND (
        wi.organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())
        OR wi.initiator_id = auth.uid()
        OR wi.assigned_to = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update steps assigned to them"
  ON workflow_steps FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Users can view transitions in their workflows"
  ON workflow_transitions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_instances wi
      WHERE wi.id = workflow_transitions.workflow_instance_id
      AND wi.organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "System can insert transitions"
  ON workflow_transitions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view actions in their organization"
  ON workflow_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_definitions wd
      WHERE wd.id = workflow_actions.workflow_definition_id
      AND wd.organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage workflow actions"
  ON workflow_actions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_definitions wd
      JOIN user_roles ur ON ur.organization_id = wd.organization_id
      JOIN roles r ON r.id = ur.role_id
      WHERE wd.id = workflow_actions.workflow_definition_id
      AND ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can view scheduled jobs in their organization"
  ON scheduled_jobs FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT ur.organization_id FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage scheduled jobs"
  ON scheduled_jobs FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT ur.organization_id FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION start_workflow_instance(
  p_workflow_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_project_id uuid,
  p_organization_id uuid,
  p_initiator_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_workflow_definition_id uuid;
  v_workflow_instance_id uuid;
  v_config jsonb;
  v_step jsonb;
BEGIN
  SELECT id, config INTO v_workflow_definition_id, v_config
  FROM workflow_definitions
  WHERE organization_id = p_organization_id
    AND workflow_type = p_workflow_type
    AND is_active = true
  ORDER BY version DESC
  LIMIT 1;

  IF v_workflow_definition_id IS NULL THEN
    RAISE EXCEPTION 'No active workflow definition found for type: %', p_workflow_type;
  END IF;

  INSERT INTO workflow_instances (
    workflow_definition_id,
    organization_id,
    project_id,
    entity_type,
    entity_id,
    initiator_id,
    current_step_key,
    status
  ) VALUES (
    v_workflow_definition_id,
    p_organization_id,
    p_project_id,
    p_entity_type,
    p_entity_id,
    p_initiator_id,
    (v_config->'steps'->0->>'key')::text,
    'active'
  )
  RETURNING id INTO v_workflow_instance_id;

  FOR v_step IN SELECT * FROM jsonb_array_elements(v_config->'steps')
  LOOP
    INSERT INTO workflow_steps (
      workflow_instance_id,
      step_key,
      step_name,
      step_order,
      status,
      assigned_role,
      requires_approval
    ) VALUES (
      v_workflow_instance_id,
      v_step->>'key',
      v_step->>'name',
      (v_step->>'order')::integer,
      CASE WHEN (v_step->>'order')::integer = 1 THEN 'in_progress' ELSE 'pending' END,
      v_step->>'assigned_role',
      COALESCE((v_step->>'requires_approval')::boolean, false)
    );
  END LOOP;

  RETURN v_workflow_instance_id;
END;
$$;

CREATE OR REPLACE FUNCTION transition_workflow_step(
  p_workflow_instance_id uuid,
  p_current_step_key text,
  p_next_step_key text,
  p_user_id uuid,
  p_comment text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_step_id uuid;
BEGIN
  UPDATE workflow_steps
  SET
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE workflow_instance_id = p_workflow_instance_id
    AND step_key = p_current_step_key
  RETURNING id INTO v_current_step_id;

  INSERT INTO workflow_transitions (
    workflow_instance_id,
    workflow_step_id,
    from_status,
    to_status,
    triggered_by,
    transition_type,
    comment
  ) VALUES (
    p_workflow_instance_id,
    v_current_step_id,
    'in_progress',
    'completed',
    p_user_id,
    'manual',
    p_comment
  );

  IF p_next_step_key IS NOT NULL THEN
    UPDATE workflow_steps
    SET
      status = 'in_progress',
      started_at = now(),
      updated_at = now()
    WHERE workflow_instance_id = p_workflow_instance_id
      AND step_key = p_next_step_key;

    UPDATE workflow_instances
    SET
      current_step_key = p_next_step_key,
      updated_at = now()
    WHERE id = p_workflow_instance_id;
  ELSE
    UPDATE workflow_instances
    SET
      status = 'completed',
      completed_at = now(),
      updated_at = now()
    WHERE id = p_workflow_instance_id;
  END IF;

  RETURN true;
END;
$$;

INSERT INTO workflow_definitions (
  organization_id,
  name,
  description,
  workflow_type,
  config
)
SELECT
  o.id,
  'Workflow Standard - Offres de Modification',
  'Workflow en 3 étapes pour validation des offres fournisseurs',
  'modification_offer',
  '{
    "steps": [
      {
        "key": "supplier_creation",
        "name": "Création offre fournisseur",
        "order": 1,
        "assigned_role": "supplier",
        "requires_approval": false
      },
      {
        "key": "client_validation",
        "name": "Validation client",
        "order": 2,
        "assigned_role": "buyer",
        "requires_approval": true
      },
      {
        "key": "architect_validation",
        "name": "Validation technique architecte",
        "order": 3,
        "assigned_role": "architect",
        "requires_approval": true
      }
    ]
  }'::jsonb
FROM organizations o
ON CONFLICT (organization_id, workflow_type, version) DO NOTHING;
