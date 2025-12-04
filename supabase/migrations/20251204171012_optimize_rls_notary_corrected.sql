/*
  # Optimize RLS Policies - Notary Module (Corrected)

  1. Security Improvements
    - Optimize buyer_dossiers RLS policies
    - Optimize act_versions RLS policies
    - Optimize notary_messages RLS policies
    - Optimize notary_documents RLS policies
    - Optimize signature_appointments RLS policies
    - Use (select auth.uid()) for better performance
    - Use correct column names (dossier_id)

  2. Changes
    - Update 11 policies across 5 tables
*/

-- buyer_dossiers policies
DROP POLICY IF EXISTS "Users can view dossiers in their projects" ON buyer_dossiers;
CREATE POLICY "Users can view dossiers in their projects"
  ON buyer_dossiers FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create dossiers in their projects" ON buyer_dossiers;
CREATE POLICY "Users can create dossiers in their projects"
  ON buyer_dossiers FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );

DROP POLICY IF EXISTS "Users can update dossiers in their projects" ON buyer_dossiers;
CREATE POLICY "Users can update dossiers in their projects"
  ON buyer_dossiers FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );

-- act_versions policies
DROP POLICY IF EXISTS "Users can view act versions in their projects" ON act_versions;
CREATE POLICY "Users can view act versions in their projects"
  ON act_versions FOR SELECT
  TO authenticated
  USING (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create act versions in their projects" ON act_versions;
CREATE POLICY "Users can create act versions in their projects"
  ON act_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );

-- notary_messages policies
DROP POLICY IF EXISTS "Users can view messages in their projects" ON notary_messages;
CREATE POLICY "Users can view messages in their projects"
  ON notary_messages FOR SELECT
  TO authenticated
  USING (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their projects" ON notary_messages;
CREATE POLICY "Users can create messages in their projects"
  ON notary_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

-- notary_documents policies
DROP POLICY IF EXISTS "Users can view documents in their projects" ON notary_documents;
CREATE POLICY "Users can view documents in their projects"
  ON notary_documents FOR SELECT
  TO authenticated
  USING (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create documents in their projects" ON notary_documents;
CREATE POLICY "Users can create documents in their projects"
  ON notary_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );

-- signature_appointments policies
DROP POLICY IF EXISTS "Users can view appointments in their projects" ON signature_appointments;
CREATE POLICY "Users can view appointments in their projects"
  ON signature_appointments FOR SELECT
  TO authenticated
  USING (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create appointments in their projects" ON signature_appointments;
CREATE POLICY "Users can create appointments in their projects"
  ON signature_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );

DROP POLICY IF EXISTS "Users can update appointments in their projects" ON signature_appointments;
CREATE POLICY "Users can update appointments in their projects"
  ON signature_appointments FOR UPDATE
  TO authenticated
  USING (
    dossier_id IN (
      SELECT bd.id FROM buyer_dossiers bd
      INNER JOIN projects p ON p.id = bd.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'NOTARY')
    )
  );
