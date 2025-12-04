/*
  # Optimize RLS Policies - PDF Exports & Templates

  1. Security Improvements
    - Optimize generated_documents RLS policies
    - Optimize document_templates RLS policies
    - Use (select auth.uid()) for better performance

  2. Changes
    - Update 7 policies across 2 tables
*/

-- generated_documents policies
DROP POLICY IF EXISTS "Users can view organization documents" ON generated_documents;
CREATE POLICY "Users can view organization documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create documents in own org" ON generated_documents;
CREATE POLICY "Users can create documents in own org"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete organization documents" ON generated_documents;
CREATE POLICY "Users can delete organization documents"
  ON generated_documents FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN')
    )
  );

-- document_templates policies
DROP POLICY IF EXISTS "Users can view organization templates" ON document_templates;
CREATE POLICY "Users can view organization templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create templates in own org" ON document_templates;
CREATE POLICY "Users can create templates in own org"
  ON document_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Users can update organization templates" ON document_templates;
CREATE POLICY "Users can update organization templates"
  ON document_templates FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Users can delete organization templates" ON document_templates;
CREATE POLICY "Users can delete organization templates"
  ON document_templates FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id FROM user_organizations uo
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN')
    )
  );
