/*
  # Fix Security and Performance Issues - Part 3: Optimize RLS Policies

  ## Changes
  1. Optimize RLS policies to use (select auth.uid()) for better performance
  2. Fix most critical tables first
*/

-- Organizations
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = organizations.id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their organization details" ON public.organizations;
CREATE POLICY "Users can update their organization details"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      JOIN public.user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN public.roles r ON r.id = ur.role_id
      WHERE uo.organization_id = organizations.id
      AND uo.user_id = (select auth.uid())
      AND r.name IN ('ADMIN', 'OWNER')
    )
  );

-- Users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view other users in same organization" ON public.users;
CREATE POLICY "Users can view other users in same organization"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo1
      JOIN public.user_organizations uo2 ON uo1.organization_id = uo2.organization_id
      WHERE uo1.user_id = users.id
      AND uo2.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()));

-- User Organizations
DROP POLICY IF EXISTS "Users can view their organization memberships" ON public.user_organizations;
CREATE POLICY "Users can view their organization memberships"
  ON public.user_organizations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- User Roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view roles in their organizations" ON public.user_roles;
CREATE POLICY "Users can view roles in their organizations"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = user_roles.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Projects
DROP POLICY IF EXISTS "Users can view projects in their organizations" ON public.projects;
CREATE POLICY "Users can view projects in their organizations"
  ON public.projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create projects in their organizations" ON public.projects;
CREATE POLICY "Users can create projects in their organizations"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update projects with permission" ON public.projects;
CREATE POLICY "Users can update projects with permission"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Buildings
DROP POLICY IF EXISTS "Users can view buildings in their projects" ON public.buildings;
CREATE POLICY "Users can view buildings in their projects"
  ON public.buildings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buildings.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage buildings with permission" ON public.buildings;
CREATE POLICY "Users can manage buildings with permission"
  ON public.buildings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buildings.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Lots
DROP POLICY IF EXISTS "Users can view lots in their projects" ON public.lots;
CREATE POLICY "Users can view lots in their projects"
  ON public.lots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = lots.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage lots with permission" ON public.lots;
CREATE POLICY "Users can manage lots with permission"
  ON public.lots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = lots.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyers
DROP POLICY IF EXISTS "Buyers can view their own data" ON public.buyers;
CREATE POLICY "Buyers can view their own data"
  ON public.buyers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));
