/*
  # Fix Remaining RLS Performance Issues - Batch 5

  ## Changes
  - Optimize RLS policies for supplier_appointments, supplier_showrooms, supplier_time_slots, plan_annotations
*/

-- Supplier Appointments
DROP POLICY IF EXISTS "Acheteurs peuvent voir leurs rendez-vous" ON public.supplier_appointments;
CREATE POLICY "Acheteurs peuvent voir leurs rendez-vous"
  ON public.supplier_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = supplier_appointments.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent voir rendez-vous de leurs showrooms" ON public.supplier_appointments;
CREATE POLICY "Fournisseurs peuvent voir rendez-vous de leurs showrooms"
  ON public.supplier_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_appointments.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Acheteurs peuvent créer rendez-vous" ON public.supplier_appointments;
CREATE POLICY "Acheteurs peuvent créer rendez-vous"
  ON public.supplier_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = supplier_appointments.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Acheteurs peuvent annuler leurs rendez-vous" ON public.supplier_appointments;
CREATE POLICY "Acheteurs peuvent annuler leurs rendez-vous"
  ON public.supplier_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = supplier_appointments.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent répondre aux rendez-vous" ON public.supplier_appointments;
CREATE POLICY "Fournisseurs peuvent répondre aux rendez-vous"
  ON public.supplier_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_appointments.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view appointments in their org" ON public.supplier_appointments;
CREATE POLICY "Users can view appointments in their org"
  ON public.supplier_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = supplier_appointments.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create appointments in their org" ON public.supplier_appointments;
CREATE POLICY "Users can create appointments in their org"
  ON public.supplier_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = supplier_appointments.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update appointments in their org" ON public.supplier_appointments;
CREATE POLICY "Users can update appointments in their org"
  ON public.supplier_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = supplier_appointments.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Supplier Showrooms
DROP POLICY IF EXISTS "Fournisseurs peuvent voir leurs showrooms" ON public.supplier_showrooms;
CREATE POLICY "Fournisseurs peuvent voir leurs showrooms"
  ON public.supplier_showrooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent créer leurs showrooms" ON public.supplier_showrooms;
CREATE POLICY "Fournisseurs peuvent créer leurs showrooms"
  ON public.supplier_showrooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent modifier leurs showrooms" ON public.supplier_showrooms;
CREATE POLICY "Fournisseurs peuvent modifier leurs showrooms"
  ON public.supplier_showrooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view showrooms in their org" ON public.supplier_showrooms;
CREATE POLICY "Users can view showrooms in their org"
  ON public.supplier_showrooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create showrooms in their org" ON public.supplier_showrooms;
CREATE POLICY "Users can create showrooms in their org"
  ON public.supplier_showrooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update showrooms in their org" ON public.supplier_showrooms;
CREATE POLICY "Users can update showrooms in their org"
  ON public.supplier_showrooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = supplier_showrooms.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Supplier Time Slots
DROP POLICY IF EXISTS "Fournisseurs peuvent voir leurs créneaux" ON public.supplier_time_slots;
CREATE POLICY "Fournisseurs peuvent voir leurs créneaux"
  ON public.supplier_time_slots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent créer leurs créneaux" ON public.supplier_time_slots;
CREATE POLICY "Fournisseurs peuvent créer leurs créneaux"
  ON public.supplier_time_slots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Fournisseurs peuvent modifier leurs créneaux" ON public.supplier_time_slots;
CREATE POLICY "Fournisseurs peuvent modifier leurs créneaux"
  ON public.supplier_time_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view time slots in their org" ON public.supplier_time_slots;
CREATE POLICY "Users can view time slots in their org"
  ON public.supplier_time_slots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create time slots in their org" ON public.supplier_time_slots;
CREATE POLICY "Users can create time slots in their org"
  ON public.supplier_time_slots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update time slots in their org" ON public.supplier_time_slots;
CREATE POLICY "Users can update time slots in their org"
  ON public.supplier_time_slots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_showrooms ss
      JOIN public.companies c ON c.id = ss.company_id
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE ss.id = supplier_time_slots.showroom_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Plan Annotations
DROP POLICY IF EXISTS "Users can view annotations in their org projects" ON public.plan_annotations;
CREATE POLICY "Users can view annotations in their org projects"
  ON public.plan_annotations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = plan_annotations.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create annotations in their org projects" ON public.plan_annotations;
CREATE POLICY "Users can create annotations in their org projects"
  ON public.plan_annotations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = plan_annotations.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authors can update their own annotations" ON public.plan_annotations;
CREATE POLICY "Authors can update their own annotations"
  ON public.plan_annotations FOR UPDATE
  TO authenticated
  USING (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Authors can delete their own annotations" ON public.plan_annotations;
CREATE POLICY "Authors can delete their own annotations"
  ON public.plan_annotations FOR DELETE
  TO authenticated
  USING (author_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can manage plan annotations for their projects" ON public.plan_annotations;
CREATE POLICY "Users can manage plan annotations for their projects"
  ON public.plan_annotations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = plan_annotations.project_id
      AND uo.user_id = (select auth.uid())
    )
  );
