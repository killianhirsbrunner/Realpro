/*
  # Fix Remaining RLS Performance Issues - Batch 6

  ## Changes
  - Optimize RLS policies for wizard_states, buyer_checklist, handover, warranties, service_tickets
*/

-- Project Setup Wizard States
DROP POLICY IF EXISTS "Users can view wizard state for their projects" ON public.project_setup_wizard_states;
CREATE POLICY "Users can view wizard state for their projects"
  ON public.project_setup_wizard_states FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_setup_wizard_states.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage wizard state for their projects" ON public.project_setup_wizard_states;
CREATE POLICY "Users can manage wizard state for their projects"
  ON public.project_setup_wizard_states FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_setup_wizard_states.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyer Checklist Items
DROP POLICY IF EXISTS "Buyers can view their own checklist" ON public.buyer_checklist_items;
CREATE POLICY "Buyers can view their own checklist"
  ON public.buyer_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = buyer_checklist_items.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can view buyer checklists" ON public.buyer_checklist_items;
CREATE POLICY "Project team can view buyer checklists"
  ON public.buyer_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = buyer_checklist_items.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Handover Inspections
DROP POLICY IF EXISTS "Project team can view inspections" ON public.handover_inspections;
CREATE POLICY "Project team can view inspections"
  ON public.handover_inspections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_inspections.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage inspections" ON public.handover_inspections;
CREATE POLICY "Project team can manage inspections"
  ON public.handover_inspections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_inspections.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Handover Issues
DROP POLICY IF EXISTS "Project team can view issues" ON public.handover_issues;
CREATE POLICY "Project team can view issues"
  ON public.handover_issues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_issues.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can view their lot issues" ON public.handover_issues;
CREATE POLICY "Buyers can view their lot issues"
  ON public.handover_issues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.lot_id = handover_issues.lot_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage issues" ON public.handover_issues;
CREATE POLICY "Project team can manage issues"
  ON public.handover_issues FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = handover_issues.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Warranties
DROP POLICY IF EXISTS "Project team can view warranties" ON public.warranties;
CREATE POLICY "Project team can view warranties"
  ON public.warranties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = warranties.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can view their lot warranties" ON public.warranties;
CREATE POLICY "Buyers can view their lot warranties"
  ON public.warranties FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.lot_id = warranties.lot_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage warranties" ON public.warranties;
CREATE POLICY "Project team can manage warranties"
  ON public.warranties FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = warranties.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Service Tickets
DROP POLICY IF EXISTS "Project team can view tickets" ON public.service_tickets;
CREATE POLICY "Project team can view tickets"
  ON public.service_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = service_tickets.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can view their tickets" ON public.service_tickets;
CREATE POLICY "Buyers can view their tickets"
  ON public.service_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = service_tickets.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Buyers can create tickets" ON public.service_tickets;
CREATE POLICY "Buyers can create tickets"
  ON public.service_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = service_tickets.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage tickets" ON public.service_tickets;
CREATE POLICY "Project team can manage tickets"
  ON public.service_tickets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = service_tickets.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );
