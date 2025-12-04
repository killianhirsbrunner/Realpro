/*
  # MODULE 11 — PLANNING & SUIVI CHANTIER
  
  1. New Tables
    - `planning_tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `name` (text) - Task name
      - `description` (text) - Task description
      - `type` (text) - Type: 'milestone', 'task', 'phase'
      - `phase` (text) - Phase: 'gros_oeuvre', 'second_oeuvre', 'finitions', etc.
      - `cfc_line_id` (uuid, nullable, foreign key to cfc_lines) - Related CFC line
      - `start_date` (date) - Planned start date
      - `end_date` (date) - Planned end date
      - `actual_start_date` (date, nullable) - Actual start
      - `actual_end_date` (date, nullable) - Actual end
      - `progress` (integer, 0-100) - Progress percentage
      - `status` (text) - 'not_started', 'in_progress', 'completed', 'delayed', 'blocked'
      - `responsible_user_id` (uuid, nullable, foreign key to users)
      - `parent_task_id` (uuid, nullable, self-reference) - For hierarchical tasks
      - `priority` (text) - 'low', 'medium', 'high', 'critical'
      - `created_at`, `updated_at`
    
    - `planning_task_dependencies`
      - `id` (uuid, primary key)
      - `predecessor_task_id` (uuid, foreign key to planning_tasks)
      - `successor_task_id` (uuid, foreign key to planning_tasks)
      - `dependency_type` (text) - 'finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish'
      - `lag_days` (integer, default 0) - Lag time in days
      - `created_at`
    
    - `construction_photos`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `lot_id` (uuid, nullable, foreign key to lots)
      - `task_id` (uuid, nullable, foreign key to planning_tasks)
      - `diary_entry_id` (uuid, nullable, foreign key to site_diary_entries)
      - `file_url` (text) - URL to photo
      - `thumbnail_url` (text, nullable) - Thumbnail
      - `caption` (text, nullable) - Photo caption
      - `taken_at` (timestamptz) - When photo was taken
      - `location` (text, nullable) - Location on site
      - `uploaded_by` (uuid, foreign key to users)
      - `created_at`
    
    - `buyer_progress_snapshots`
      - `id` (uuid, primary key)
      - `lot_id` (uuid, foreign key to lots)
      - `snapshot_date` (date) - Date of snapshot
      - `global_progress` (integer) - Overall progress %
      - `gros_oeuvre_progress` (integer) - Structural work %
      - `second_oeuvre_progress` (integer) - Secondary work %
      - `finitions_progress` (integer) - Finishes %
      - `current_phase` (text) - Current construction phase
      - `milestone_reached` (text, nullable) - Recent milestone
      - `notes` (text, nullable) - Notes for buyer
      - `created_at`
    
    - `planning_alerts`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `task_id` (uuid, nullable, foreign key to planning_tasks)
      - `alert_type` (text) - 'delay', 'dependency_blocked', 'milestone_missed', 'resource_conflict'
      - `severity` (text) - 'info', 'warning', 'critical'
      - `message` (text) - Alert message
      - `resolved` (boolean, default false)
      - `resolved_at` (timestamptz, nullable)
      - `created_at`
  
  2. Security
    - Enable RLS on all tables
    - Add policies for project team members
    - Add policies for buyers (limited access to their lot info)
  
  3. Indexes
    - Add indexes for common queries (project_id, dates, status)
  
  4. Functions
    - Function to calculate task delays
    - Function to update project progress
    - Function to check dependency chains
*/

-- =====================================================
-- PLANNING TASKS
-- =====================================================

CREATE TABLE IF NOT EXISTS planning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'task' CHECK (type IN ('milestone', 'task', 'phase')),
  phase text CHECK (phase IN ('preparation', 'gros_oeuvre', 'second_oeuvre', 'finitions', 'livraison')),
  cfc_line_id uuid REFERENCES cfc_lines(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  actual_start_date date,
  actual_end_date date,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed', 'blocked')),
  responsible_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  parent_task_id uuid REFERENCES planning_tasks(id) ON DELETE CASCADE,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planning_tasks_project ON planning_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_planning_tasks_cfc ON planning_tasks(cfc_line_id);
CREATE INDEX IF NOT EXISTS idx_planning_tasks_dates ON planning_tasks(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_planning_tasks_status ON planning_tasks(status);
CREATE INDEX IF NOT EXISTS idx_planning_tasks_parent ON planning_tasks(parent_task_id);

ALTER TABLE planning_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project team can view planning tasks"
  ON planning_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = planning_tasks.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can manage planning tasks"
  ON planning_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      JOIN user_roles ur ON ur.user_id = pp.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE pp.project_id = planning_tasks.project_id
      AND pp.user_id = auth.uid()
      AND r.name IN ('promoteur', 'directeur_travaux', 'architecte', 'admin')
    )
  );

-- =====================================================
-- TASK DEPENDENCIES
-- =====================================================

CREATE TABLE IF NOT EXISTS planning_task_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_task_id uuid NOT NULL REFERENCES planning_tasks(id) ON DELETE CASCADE,
  successor_task_id uuid NOT NULL REFERENCES planning_tasks(id) ON DELETE CASCADE,
  dependency_type text NOT NULL DEFAULT 'finish_to_start' CHECK (dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')),
  lag_days integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_dependency CHECK (predecessor_task_id != successor_task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_deps_predecessor ON planning_task_dependencies(predecessor_task_id);
CREATE INDEX IF NOT EXISTS idx_task_deps_successor ON planning_task_dependencies(successor_task_id);

ALTER TABLE planning_task_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project team can view task dependencies"
  ON planning_task_dependencies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM planning_tasks pt
      JOIN project_participants pp ON pp.project_id = pt.project_id
      WHERE pt.id = planning_task_dependencies.predecessor_task_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can manage dependencies"
  ON planning_task_dependencies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM planning_tasks pt
      JOIN project_participants pp ON pp.project_id = pt.project_id
      JOIN user_roles ur ON ur.user_id = pp.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE pt.id = planning_task_dependencies.predecessor_task_id
      AND pp.user_id = auth.uid()
      AND r.name IN ('promoteur', 'directeur_travaux', 'architecte', 'admin')
    )
  );

-- =====================================================
-- CONSTRUCTION PHOTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS construction_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  lot_id uuid REFERENCES lots(id) ON DELETE SET NULL,
  task_id uuid REFERENCES planning_tasks(id) ON DELETE SET NULL,
  diary_entry_id uuid REFERENCES site_diary_entries(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  caption text,
  taken_at timestamptz NOT NULL DEFAULT now(),
  location text,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_construction_photos_project ON construction_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_photos_lot ON construction_photos(lot_id);
CREATE INDEX IF NOT EXISTS idx_construction_photos_task ON construction_photos(task_id);
CREATE INDEX IF NOT EXISTS idx_construction_photos_diary ON construction_photos(diary_entry_id);
CREATE INDEX IF NOT EXISTS idx_construction_photos_date ON construction_photos(taken_at DESC);

ALTER TABLE construction_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project team can view construction photos"
  ON construction_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = construction_photos.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view their lot photos"
  ON construction_photos FOR SELECT
  TO authenticated
  USING (
    lot_id IN (
      SELECT l.id FROM lots l
      JOIN buyers b ON b.lot_id = l.id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Project team can upload photos"
  ON construction_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = construction_photos.project_id
      AND pp.user_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Uploader can delete their photos"
  ON construction_photos FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- =====================================================
-- BUYER PROGRESS SNAPSHOTS
-- =====================================================

CREATE TABLE IF NOT EXISTS buyer_progress_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  global_progress integer NOT NULL DEFAULT 0 CHECK (global_progress >= 0 AND global_progress <= 100),
  gros_oeuvre_progress integer NOT NULL DEFAULT 0 CHECK (gros_oeuvre_progress >= 0 AND gros_oeuvre_progress <= 100),
  second_oeuvre_progress integer NOT NULL DEFAULT 0 CHECK (second_oeuvre_progress >= 0 AND second_oeuvre_progress <= 100),
  finitions_progress integer NOT NULL DEFAULT 0 CHECK (finitions_progress >= 0 AND finitions_progress <= 100),
  current_phase text,
  milestone_reached text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buyer_progress_lot ON buyer_progress_snapshots(lot_id);
CREATE INDEX IF NOT EXISTS idx_buyer_progress_date ON buyer_progress_snapshots(snapshot_date DESC);

ALTER TABLE buyer_progress_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project team can view progress snapshots"
  ON buyer_progress_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lots l
      JOIN project_participants pp ON pp.project_id = l.project_id
      WHERE l.id = buyer_progress_snapshots.lot_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view their lot progress"
  ON buyer_progress_snapshots FOR SELECT
  TO authenticated
  USING (
    lot_id IN (
      SELECT l.id FROM lots l
      JOIN buyers b ON b.lot_id = l.id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can create progress snapshots"
  ON buyer_progress_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lots l
      JOIN project_participants pp ON pp.project_id = l.project_id
      JOIN user_roles ur ON ur.user_id = pp.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE l.id = buyer_progress_snapshots.lot_id
      AND pp.user_id = auth.uid()
      AND r.name IN ('promoteur', 'directeur_travaux', 'admin')
    )
  );

-- =====================================================
-- PLANNING ALERTS
-- =====================================================

CREATE TABLE IF NOT EXISTS planning_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid REFERENCES planning_tasks(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('delay', 'dependency_blocked', 'milestone_missed', 'resource_conflict')),
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  message text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planning_alerts_project ON planning_alerts(project_id);
CREATE INDEX IF NOT EXISTS idx_planning_alerts_task ON planning_alerts(task_id);
CREATE INDEX IF NOT EXISTS idx_planning_alerts_resolved ON planning_alerts(resolved, created_at DESC);

ALTER TABLE planning_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project team can view planning alerts"
  ON planning_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = planning_alerts.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Project managers can manage alerts"
  ON planning_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      JOIN user_roles ur ON ur.user_id = pp.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE pp.project_id = planning_alerts.project_id
      AND pp.user_id = auth.uid()
      AND r.name IN ('promoteur', 'directeur_travaux', 'admin')
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate if a task is delayed
CREATE OR REPLACE FUNCTION is_task_delayed(task_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  task_record RECORD;
  is_delayed boolean;
BEGIN
  SELECT * INTO task_record FROM planning_tasks WHERE id = task_id;
  
  IF task_record.status = 'completed' THEN
    RETURN false;
  END IF;
  
  IF task_record.end_date < CURRENT_DATE AND task_record.progress < 100 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Function to calculate project overall progress
CREATE OR REPLACE FUNCTION calculate_project_progress(proj_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_progress integer;
BEGIN
  SELECT COALESCE(AVG(progress)::integer, 0)
  INTO avg_progress
  FROM planning_tasks
  WHERE project_id = proj_id
  AND parent_task_id IS NULL;
  
  RETURN avg_progress;
END;
$$;

-- Trigger to update task status based on progress
CREATE OR REPLACE FUNCTION update_task_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.progress = 0 THEN
    NEW.status := 'not_started';
  ELSIF NEW.progress = 100 THEN
    NEW.status := 'completed';
    NEW.actual_end_date := COALESCE(NEW.actual_end_date, CURRENT_DATE);
  ELSIF NEW.progress > 0 AND NEW.progress < 100 THEN
    IF NEW.status = 'not_started' THEN
      NEW.status := 'in_progress';
      NEW.actual_start_date := COALESCE(NEW.actual_start_date, CURRENT_DATE);
    END IF;
  END IF;
  
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_task_status
  BEFORE UPDATE ON planning_tasks
  FOR EACH ROW
  WHEN (OLD.progress IS DISTINCT FROM NEW.progress)
  EXECUTE FUNCTION update_task_status();
