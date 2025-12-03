/*
  # Construction & Planning Module

  ## Overview
  This migration creates the construction module for managing project phases and progress tracking.

  ## New Tables

  ### `project_phases`
  Construction phases for a project
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `name` (text) - Phase name (e.g., "Foundation", "Structure", "Finishing")
  - `description` (text, nullable)
  - `order_index` (integer) - Display order
  - `status` (enum: PLANNED, IN_PROGRESS, COMPLETED, DELAYED, ON_HOLD)
  - `planned_start_date` (date, nullable)
  - `planned_end_date` (date, nullable)
  - `actual_start_date` (date, nullable)
  - `actual_end_date` (date, nullable)
  - `progress_percent` (numeric, default 0) - 0-100
  - `created_at`, `updated_at` (timestamptz)

  ### `project_progress_snapshots`
  Historical snapshots of project progress
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `snapshot_date` (date)
  - `overall_progress_percent` (numeric) - 0-100
  - `notes` (text, nullable)
  - `created_by_id` (uuid, foreign key to users)
  - `created_at` (timestamptz)

  ### `phase_milestones`
  Key milestones within phases
  - `id` (uuid, primary key)
  - `phase_id` (uuid, foreign key to project_phases)
  - `title` (text)
  - `description` (text, nullable)
  - `target_date` (date)
  - `actual_date` (date, nullable)
  - `status` (enum: PENDING, ACHIEVED, MISSED, CANCELLED)
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Project participants can view progress
  - Only EG, architects, and admins can update
*/

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phase_status') THEN
    CREATE TYPE phase_status AS ENUM (
      'PLANNED',
      'IN_PROGRESS',
      'COMPLETED',
      'DELAYED',
      'ON_HOLD'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'milestone_status') THEN
    CREATE TYPE milestone_status AS ENUM (
      'PENDING',
      'ACHIEVED',
      'MISSED',
      'CANCELLED'
    );
  END IF;
END $$;

-- =====================================================
-- 2. CREATE PROJECT_PHASES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS project_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  status phase_status DEFAULT 'PLANNED' NOT NULL,
  planned_start_date date,
  planned_end_date date,
  actual_start_date date,
  actual_end_date date,
  progress_percent numeric DEFAULT 0 NOT NULL CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_status ON project_phases(status);
CREATE INDEX IF NOT EXISTS idx_project_phases_order ON project_phases(project_id, order_index);

-- =====================================================
-- 3. CREATE PROJECT_PROGRESS_SNAPSHOTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS project_progress_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  overall_progress_percent numeric NOT NULL CHECK (overall_progress_percent >= 0 AND overall_progress_percent <= 100),
  notes text,
  created_by_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_progress_snapshots_project_id ON project_progress_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_progress_snapshots_date ON project_progress_snapshots(project_id, snapshot_date DESC);

-- =====================================================
-- 4. CREATE PHASE_MILESTONES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS phase_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid NOT NULL REFERENCES project_phases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_date date NOT NULL,
  actual_date date,
  status milestone_status DEFAULT 'PENDING' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_phase_milestones_phase_id ON phase_milestones(phase_id);
CREATE INDEX IF NOT EXISTS idx_phase_milestones_status ON phase_milestones(status);
CREATE INDEX IF NOT EXISTS idx_phase_milestones_target_date ON phase_milestones(target_date);

-- =====================================================
-- 5. ROW LEVEL SECURITY - PROJECT_PHASES
-- =====================================================

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project participants can view phases" ON project_phases;
CREATE POLICY "Project participants can view phases"
  ON project_phases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_phases.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = project_phases.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

DROP POLICY IF EXISTS "EG and architects can manage phases" ON project_phases;
CREATE POLICY "EG and architects can manage phases"
  ON project_phases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_phases.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('EG', 'ARCHITECT')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = project_phases.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 6. ROW LEVEL SECURITY - PROJECT_PROGRESS_SNAPSHOTS
-- =====================================================

ALTER TABLE project_progress_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project participants can view snapshots" ON project_progress_snapshots;
CREATE POLICY "Project participants can view snapshots"
  ON project_progress_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_progress_snapshots.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = project_progress_snapshots.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

DROP POLICY IF EXISTS "EG and architects can create snapshots" ON project_progress_snapshots;
CREATE POLICY "EG and architects can create snapshots"
  ON project_progress_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_progress_snapshots.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('EG', 'ARCHITECT')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = project_progress_snapshots.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 7. ROW LEVEL SECURITY - PHASE_MILESTONES
-- =====================================================

ALTER TABLE phase_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Milestones follow phase access" ON phase_milestones;
CREATE POLICY "Milestones follow phase access"
  ON phase_milestones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_phases WHERE id = phase_milestones.phase_id
    )
  );

-- =====================================================
-- 8. UPDATE TIMESTAMP TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_construction_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_project_phases_updated_at ON project_phases;
CREATE TRIGGER trigger_update_project_phases_updated_at
  BEFORE UPDATE ON project_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_construction_updated_at();

DROP TRIGGER IF EXISTS trigger_update_phase_milestones_updated_at ON phase_milestones;
CREATE TRIGGER trigger_update_phase_milestones_updated_at
  BEFORE UPDATE ON phase_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_construction_updated_at();

-- =====================================================
-- 9. FUNCTION TO AUTO-UPDATE PROJECT STATUS
-- =====================================================

CREATE OR REPLACE FUNCTION update_project_status_on_phase_change()
RETURNS TRIGGER AS $$
DECLARE
  all_completed boolean;
  any_in_progress boolean;
BEGIN
  SELECT 
    bool_and(status = 'COMPLETED'),
    bool_or(status = 'IN_PROGRESS')
  INTO all_completed, any_in_progress
  FROM project_phases
  WHERE project_id = NEW.project_id;

  IF all_completed THEN
    UPDATE projects
    SET status = 'COMPLETED'
    WHERE id = NEW.project_id AND status != 'COMPLETED';
  ELSIF any_in_progress THEN
    UPDATE projects
    SET status = 'CONSTRUCTION'
    WHERE id = NEW.project_id AND status = 'PLANNING';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_project_status ON project_phases;
CREATE TRIGGER trigger_update_project_status
  AFTER UPDATE ON project_phases
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_project_status_on_phase_change();
