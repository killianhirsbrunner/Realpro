/*
  # Fix Remaining RLS Performance Issues - Batch 3

  ## Changes
  - Optimize RLS policies for documents, cfc_budgets, contracts, invoices, sales_contracts, notary_files
*/

-- Documents
DROP POLICY IF EXISTS "Users can view documents in their projects" ON public.documents;
CREATE POLICY "Users can view documents in their projects"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = documents.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- CFC Budgets
DROP POLICY IF EXISTS "Users can view budgets in their projects" ON public.cfc_budgets;
CREATE POLICY "Users can view budgets in their projects"
  ON public.cfc_budgets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = cfc_budgets.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contracts
DROP POLICY IF EXISTS "Users can view contracts in their projects" ON public.contracts;
CREATE POLICY "Users can view contracts in their projects"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = contracts.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Invoices
DROP POLICY IF EXISTS "Users can view invoices in their projects" ON public.invoices;
CREATE POLICY "Users can view invoices in their projects"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = invoices.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Sales Contracts
DROP POLICY IF EXISTS "Brokers can view sales contracts for their projects" ON public.sales_contracts;
CREATE POLICY "Brokers can view sales contracts for their projects"
  ON public.sales_contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sales_contracts.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Brokers can create sales contracts for their projects" ON public.sales_contracts;
CREATE POLICY "Brokers can create sales contracts for their projects"
  ON public.sales_contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sales_contracts.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Brokers can update sales contracts for their projects" ON public.sales_contracts;
CREATE POLICY "Brokers can update sales contracts for their projects"
  ON public.sales_contracts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = sales_contracts.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Notary Files
DROP POLICY IF EXISTS "Authorized users can view notary files" ON public.notary_files;
CREATE POLICY "Authorized users can view notary files"
  ON public.notary_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = notary_files.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authorized users can create notary files" ON public.notary_files;
CREATE POLICY "Authorized users can create notary files"
  ON public.notary_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = notary_files.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authorized users can update notary files" ON public.notary_files;
CREATE POLICY "Authorized users can update notary files"
  ON public.notary_files FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = notary_files.project_id
      AND uo.user_id = (select auth.uid())
    )
  );
