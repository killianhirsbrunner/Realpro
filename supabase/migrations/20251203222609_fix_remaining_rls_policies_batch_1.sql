/*
  # Fix Remaining RLS Performance Issues - Batch 1

  ## Changes
  - Optimize remaining RLS policies to use (select auth.uid())
  - Covers entrances, floors, companies, contacts, prospects, reservations, buyers, buyer_files
*/

-- Entrances
DROP POLICY IF EXISTS "Users can view entrances in their projects" ON public.entrances;
CREATE POLICY "Users can view entrances in their projects"
  ON public.entrances FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buildings b
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE b.id = entrances.building_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage entrances with permission" ON public.entrances;
CREATE POLICY "Users can manage entrances with permission"
  ON public.entrances FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buildings b
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE b.id = entrances.building_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Floors
DROP POLICY IF EXISTS "Users can view floors in their projects" ON public.floors;
CREATE POLICY "Users can view floors in their projects"
  ON public.floors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.entrances e
      JOIN public.buildings b ON b.id = e.building_id
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE e.id = floors.entrance_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage floors with permission" ON public.floors;
CREATE POLICY "Users can manage floors with permission"
  ON public.floors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.entrances e
      JOIN public.buildings b ON b.id = e.building_id
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE e.id = floors.entrance_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Companies
DROP POLICY IF EXISTS "Users can view companies in their organizations" ON public.companies;
CREATE POLICY "Users can view companies in their organizations"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = companies.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view companies in their organization" ON public.companies;
CREATE POLICY "Users can view companies in their organization"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = companies.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Contacts
DROP POLICY IF EXISTS "Users can view contacts in their organizations" ON public.contacts;
CREATE POLICY "Users can view contacts in their organizations"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = contacts.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Prospects
DROP POLICY IF EXISTS "Users can view prospects in their projects" ON public.prospects;
CREATE POLICY "Users can view prospects in their projects"
  ON public.prospects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = prospects.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Reservations
DROP POLICY IF EXISTS "Users can view reservations in their projects" ON public.reservations;
CREATE POLICY "Users can view reservations in their projects"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = reservations.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyers
DROP POLICY IF EXISTS "Users can view buyers in their projects" ON public.buyers;
CREATE POLICY "Users can view buyers in their projects"
  ON public.buyers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buyers.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyer Files
DROP POLICY IF EXISTS "Users can view buyer files in their projects" ON public.buyer_files;
CREATE POLICY "Users can view buyer files in their projects"
  ON public.buyer_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE b.id = buyer_files.buyer_id
      AND uo.user_id = (select auth.uid())
    )
  );
