/*
  # Fix Remaining RLS Performance Issues - Batch 7

  ## Changes
  - Optimize RLS policies for activity_feed, organization_branding, organization_settings, financial_scenarios, signature_requests, site_diary, handover_events
*/

-- Activity Feed
DROP POLICY IF EXISTS "Organization members can view activity feed" ON public.activity_feed;
CREATE POLICY "Organization members can view activity feed"
  ON public.activity_feed FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = activity_feed.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Organization Branding
DROP POLICY IF EXISTS "Organization members can view branding" ON public.organization_branding;
CREATE POLICY "Organization members can view branding"
  ON public.organization_branding FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = organization_branding.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Organization admins can manage branding" ON public.organization_branding;
CREATE POLICY "Organization admins can manage branding"
  ON public.organization_branding FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      JOIN public.user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN public.roles r ON r.id = ur.role_id
      WHERE uo.organization_id = organization_branding.organization_id
      AND uo.user_id = (select auth.uid())
      AND r.name = 'ADMIN'
    )
  );

-- Organization Settings
DROP POLICY IF EXISTS "Organization members can view settings" ON public.organization_settings;
CREATE POLICY "Organization members can view settings"
  ON public.organization_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = organization_settings.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Organization admins can manage settings" ON public.organization_settings;
CREATE POLICY "Organization admins can manage settings"
  ON public.organization_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      JOIN public.user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN public.roles r ON r.id = ur.role_id
      WHERE uo.organization_id = organization_settings.organization_id
      AND uo.user_id = (select auth.uid())
      AND r.name = 'ADMIN'
    )
  );

-- Financial Scenarios
DROP POLICY IF EXISTS "Users can manage scenarios in their org" ON public.financial_scenarios;
CREATE POLICY "Users can manage scenarios in their org"
  ON public.financial_scenarios FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = financial_scenarios.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Public Pages
DROP POLICY IF EXISTS "Users can manage public pages for their projects" ON public.project_public_pages;
CREATE POLICY "Users can manage public pages for their projects"
  ON public.project_public_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_public_pages.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Signature Requests
DROP POLICY IF EXISTS "Users can view signature requests in their org" ON public.signature_requests;
CREATE POLICY "Users can view signature requests in their org"
  ON public.signature_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create signature requests in their org" ON public.signature_requests;
CREATE POLICY "Users can create signature requests in their org"
  ON public.signature_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update signature requests in their org" ON public.signature_requests;
CREATE POLICY "Users can update signature requests in their org"
  ON public.signature_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage signature requests in their org" ON public.signature_requests;
CREATE POLICY "Users can manage signature requests in their org"
  ON public.signature_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = signature_requests.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Site Diary Entries
DROP POLICY IF EXISTS "Users can manage site diary for their projects" ON public.site_diary_entries;
CREATE POLICY "Users can manage site diary for their projects"
  ON public.site_diary_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = site_diary_entries.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Site Diary Photos
DROP POLICY IF EXISTS "Users can manage photos for their diary entries" ON public.site_diary_photos;
CREATE POLICY "Users can manage photos for their diary entries"
  ON public.site_diary_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.site_diary_entries sde
      JOIN public.projects p ON p.id = sde.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE sde.id = site_diary_photos.diary_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Company Warranties
DROP POLICY IF EXISTS "Users can manage company warranties for their projects" ON public.company_warranties;
CREATE POLICY "Users can manage company warranties for their projects"
  ON public.company_warranties FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = company_warranties.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Safety Plans
DROP POLICY IF EXISTS "Users can manage safety plans for their projects" ON public.safety_plans;
CREATE POLICY "Users can manage safety plans for their projects"
  ON public.safety_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_plans.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Safety Trainings
DROP POLICY IF EXISTS "Users can manage safety trainings for their projects" ON public.safety_trainings;
CREATE POLICY "Users can manage safety trainings for their projects"
  ON public.safety_trainings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = safety_trainings.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Handover Events
DROP POLICY IF EXISTS "Users can view handover events for their projects" ON public.handover_events;
CREATE POLICY "Users can view handover events for their projects"
  ON public.handover_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_events.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage handover events for their projects" ON public.handover_events;
CREATE POLICY "Users can manage handover events for their projects"
  ON public.handover_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_events.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update handover events for their projects" ON public.handover_events;
CREATE POLICY "Users can update handover events for their projects"
  ON public.handover_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_events.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );
