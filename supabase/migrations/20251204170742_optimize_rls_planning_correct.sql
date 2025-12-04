/*
  # Optimize RLS Policies - Planning Module (Corrected)

  1. Security Improvements
    - Optimize planning_tasks RLS policies
    - Optimize planning_task_dependencies RLS policies
    - Optimize planning_alerts RLS policies
    - Use (select auth.uid()) for better performance
    - Use correct column names

  2. Changes
    - Update 6 policies across 3 tables
*/

-- planning_tasks policies
DROP POLICY IF EXISTS "Project team can view planning tasks" ON planning_tasks;
CREATE POLICY "Project team can view planning tasks"
  ON planning_tasks FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project managers can manage planning tasks" ON planning_tasks;
CREATE POLICY "Project managers can manage planning tasks"
  ON planning_tasks FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );

-- planning_task_dependencies policies
DROP POLICY IF EXISTS "Project team can view task dependencies" ON planning_task_dependencies;
CREATE POLICY "Project team can view task dependencies"
  ON planning_task_dependencies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM planning_tasks pt
      INNER JOIN projects p ON p.id = pt.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE pt.id = planning_task_dependencies.predecessor_task_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project managers can manage dependencies" ON planning_task_dependencies;
CREATE POLICY "Project managers can manage dependencies"
  ON planning_task_dependencies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM planning_tasks pt
      INNER JOIN projects p ON p.id = pt.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE pt.id = planning_task_dependencies.predecessor_task_id
      AND uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );

-- planning_alerts policies
DROP POLICY IF EXISTS "Project team can view planning alerts" ON planning_alerts;
CREATE POLICY "Project team can view planning alerts"
  ON planning_alerts FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project managers can manage alerts" ON planning_alerts;
CREATE POLICY "Project managers can manage alerts"
  ON planning_alerts FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );
