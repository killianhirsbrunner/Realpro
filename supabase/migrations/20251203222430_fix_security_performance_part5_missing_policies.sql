/*
  # Fix Security and Performance Issues - Part 5: Missing Policies

  ## Changes
  1. Add policies for tables with RLS enabled but no policies
*/

-- Buyer Installments
DROP POLICY IF EXISTS "Users can manage buyer installments" ON public.buyer_installments;
CREATE POLICY "Users can manage buyer installments"
  ON public.buyer_installments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE b.id = buyer_installments.buyer_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- CFC Lines
DROP POLICY IF EXISTS "Users can manage CFC lines" ON public.cfc_lines;
CREATE POLICY "Users can manage CFC lines"
  ON public.cfc_lines FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cfc_budgets cb
      JOIN public.projects p ON p.id = cb.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE cb.id = cfc_lines.budget_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Document Versions
DROP POLICY IF EXISTS "Users can manage document versions" ON public.document_versions;
CREATE POLICY "Users can manage document versions"
  ON public.document_versions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      JOIN public.projects p ON p.id = d.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE d.id = document_versions.document_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Payments
DROP POLICY IF EXISTS "Users can manage payments" ON public.payments;
CREATE POLICY "Users can manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      JOIN public.projects p ON p.id = i.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE i.id = payments.invoice_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Participants
DROP POLICY IF EXISTS "Users can manage project participants" ON public.project_participants;
CREATE POLICY "Users can manage project participants"
  ON public.project_participants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_participants.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Site Diary Documents
DROP POLICY IF EXISTS "Users can manage site diary documents" ON public.site_diary_documents;
CREATE POLICY "Users can manage site diary documents"
  ON public.site_diary_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.site_diary_entries sde
      JOIN public.projects p ON p.id = sde.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE sde.id = site_diary_documents.diary_id
      AND uo.user_id = (select auth.uid())
    )
  );
