/*
  # Fix Remaining RLS Performance Issues - Batch 8 (Final)

  ## Changes
  - Optimize RLS policies for organization_subscriptions, buyer_invoices, eg_invoices, sav_tickets, sav_messages, sav_attachments, sav_history, project_exports, offline_actions
*/

-- Organization Subscriptions
DROP POLICY IF EXISTS "Users can view their org subscription" ON public.organization_subscriptions;
CREATE POLICY "Users can view their org subscription"
  ON public.organization_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = organization_subscriptions.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Buyer Invoices
DROP POLICY IF EXISTS "Users can view buyer invoices in their org" ON public.buyer_invoices;
CREATE POLICY "Users can view buyer invoices in their org"
  ON public.buyer_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buyer_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create buyer invoices in their org" ON public.buyer_invoices;
CREATE POLICY "Users can create buyer invoices in their org"
  ON public.buyer_invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buyer_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update buyer invoices in their org" ON public.buyer_invoices;
CREATE POLICY "Users can update buyer invoices in their org"
  ON public.buyer_invoices FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buyer_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- EG Invoices
DROP POLICY IF EXISTS "Users can view eg invoices in their org" ON public.eg_invoices;
CREATE POLICY "Users can view eg invoices in their org"
  ON public.eg_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = eg_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create eg invoices in their org" ON public.eg_invoices;
CREATE POLICY "Users can create eg invoices in their org"
  ON public.eg_invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = eg_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update eg invoices in their org" ON public.eg_invoices;
CREATE POLICY "Users can update eg invoices in their org"
  ON public.eg_invoices FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = eg_invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- SAV Tickets
DROP POLICY IF EXISTS "Users can view tickets in their org" ON public.sav_tickets;
CREATE POLICY "Users can view tickets in their org"
  ON public.sav_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sav_tickets.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create tickets in their org" ON public.sav_tickets;
CREATE POLICY "Users can create tickets in their org"
  ON public.sav_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sav_tickets.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update tickets in their org" ON public.sav_tickets;
CREATE POLICY "Users can update tickets in their org"
  ON public.sav_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sav_tickets.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- SAV Messages
DROP POLICY IF EXISTS "Users can view messages for their org tickets" ON public.sav_messages;
CREATE POLICY "Users can view messages for their org tickets"
  ON public.sav_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_messages.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create messages for their org tickets" ON public.sav_messages;
CREATE POLICY "Users can create messages for their org tickets"
  ON public.sav_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_messages.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- SAV Attachments
DROP POLICY IF EXISTS "Users can view attachments for their org" ON public.sav_attachments;
CREATE POLICY "Users can view attachments for their org"
  ON public.sav_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_attachments.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create attachments for their org" ON public.sav_attachments;
CREATE POLICY "Users can create attachments for their org"
  ON public.sav_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_attachments.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- SAV History
DROP POLICY IF EXISTS "Users can view history for their org tickets" ON public.sav_history;
CREATE POLICY "Users can view history for their org tickets"
  ON public.sav_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_history.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create history for their org tickets" ON public.sav_history;
CREATE POLICY "Users can create history for their org tickets"
  ON public.sav_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sav_tickets st
      JOIN public.projects p ON p.id = st.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE st.id = sav_history.ticket_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Exports
DROP POLICY IF EXISTS "Users can view exports in their org" ON public.project_exports;
CREATE POLICY "Users can view exports in their org"
  ON public.project_exports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_exports.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create exports in their org" ON public.project_exports;
CREATE POLICY "Users can create exports in their org"
  ON public.project_exports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_exports.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their org exports" ON public.project_exports;
CREATE POLICY "Users can update their org exports"
  ON public.project_exports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_exports.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Offline Actions
DROP POLICY IF EXISTS "Users can view their own offline actions" ON public.offline_actions;
CREATE POLICY "Users can view their own offline actions"
  ON public.offline_actions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create their own offline actions" ON public.offline_actions;
CREATE POLICY "Users can create their own offline actions"
  ON public.offline_actions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own offline actions" ON public.offline_actions;
CREATE POLICY "Users can update their own offline actions"
  ON public.offline_actions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own offline actions" ON public.offline_actions;
CREATE POLICY "Users can delete their own offline actions"
  ON public.offline_actions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
