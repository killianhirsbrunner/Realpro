/*
  # Optimize RLS Policies - Construction & Photos

  1. Security Improvements
    - Optimize construction_photos RLS policies
    - Optimize buyer_progress_snapshots RLS policies
    - Use (select auth.uid()) for better performance

  2. Changes
    - Update 7 policies across 2 tables
*/

-- construction_photos policies
DROP POLICY IF EXISTS "Project team can view construction photos" ON construction_photos;
CREATE POLICY "Project team can view construction photos"
  ON construction_photos FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can view their lot photos" ON construction_photos;
CREATE POLICY "Buyers can view their lot photos"
  ON construction_photos FOR SELECT
  TO authenticated
  USING (
    lot_id IN (
      SELECT lot_id FROM buyers
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can upload photos" ON construction_photos;
CREATE POLICY "Project team can upload photos"
  ON construction_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'ARCHITECT', 'EG')
    )
  );

DROP POLICY IF EXISTS "Uploader can delete their photos" ON construction_photos;
CREATE POLICY "Uploader can delete their photos"
  ON construction_photos FOR DELETE
  TO authenticated
  USING (uploaded_by = (select auth.uid()));

-- buyer_progress_snapshots policies
DROP POLICY IF EXISTS "Project team can view progress snapshots" ON buyer_progress_snapshots;
CREATE POLICY "Project team can view progress snapshots"
  ON buyer_progress_snapshots FOR SELECT
  TO authenticated
  USING (
    lot_id IN (
      SELECT l.id FROM lots l
      INNER JOIN projects p ON p.id = l.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can view their lot progress" ON buyer_progress_snapshots;
CREATE POLICY "Buyers can view their lot progress"
  ON buyer_progress_snapshots FOR SELECT
  TO authenticated
  USING (
    lot_id IN (
      SELECT lot_id FROM buyers
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project managers can create progress snapshots" ON buyer_progress_snapshots;
CREATE POLICY "Project managers can create progress snapshots"
  ON buyer_progress_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    lot_id IN (
      SELECT l.id FROM lots l
      INNER JOIN projects p ON p.id = l.project_id
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      INNER JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE uo.user_id = (select auth.uid())
      AND r.name IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );
