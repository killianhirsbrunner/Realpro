/*
  # Create Project Milestones Table

  1. New Tables
    - `project_milestones`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `name` (text) - Milestone name
      - `description` (text) - Milestone description
      - `target_date` (date) - Target completion date
      - `completed` (boolean) - Whether milestone is completed
      - `completed_at` (timestamptz) - When milestone was completed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `project_milestones` table
    - Add policies for authenticated users with project access
*/

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_date date,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_completion CHECK (
    (completed = false AND completed_at IS NULL) OR
    (completed = true AND completed_at IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_target_date ON project_milestones(target_date);
CREATE INDEX IF NOT EXISTS idx_project_milestones_completed ON project_milestones(completed);

-- Enable RLS
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view milestones of their organization projects"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_milestones.project_id
      AND p.organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Project participants can create milestones"
  ON project_milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_milestones.project_id
      AND pp.user_id = auth.uid()
      AND pp.role IN ('OWNER', 'EG', 'ARCHITECT')
    )
  );

CREATE POLICY "Project participants can update milestones"
  ON project_milestones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_milestones.project_id
      AND pp.user_id = auth.uid()
      AND pp.role IN ('OWNER', 'EG', 'ARCHITECT')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_milestones.project_id
      AND pp.user_id = auth.uid()
      AND pp.role IN ('OWNER', 'EG', 'ARCHITECT')
    )
  );

CREATE POLICY "Project participants can delete milestones"
  ON project_milestones FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = project_milestones.project_id
      AND pp.user_id = auth.uid()
      AND pp.role IN ('OWNER', 'EG')
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_project_milestones_updated_at();
