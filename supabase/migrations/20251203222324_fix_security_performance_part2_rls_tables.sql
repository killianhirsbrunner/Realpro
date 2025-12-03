/*
  # Fix Security and Performance Issues - Part 2: Enable RLS

  ## Changes
  1. Enable RLS on 14 unprotected tables
  2. Add basic policies for these tables
*/

-- Buyer Document Requirements
ALTER TABLE IF EXISTS public.buyer_document_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage document requirements" ON public.buyer_document_requirements;
CREATE POLICY "Users can manage document requirements"
  ON public.buyer_document_requirements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = buyer_document_requirements.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyer Documents
ALTER TABLE IF EXISTS public.buyer_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage buyer documents" ON public.buyer_documents;
CREATE POLICY "Users can manage buyer documents"
  ON public.buyer_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyer_files bf
      JOIN public.buyers b ON b.id = bf.buyer_id
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE bf.id = buyer_documents.buyer_file_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Notary Act Versions
ALTER TABLE IF EXISTS public.notary_act_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage notary act versions" ON public.notary_act_versions;
CREATE POLICY "Users can manage notary act versions"
  ON public.notary_act_versions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.notary_files nf
      JOIN public.buyer_files bf ON bf.id = nf.buyer_file_id
      JOIN public.buyers b ON b.id = bf.buyer_id
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE nf.id = notary_act_versions.notary_file_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Notary Signature Appointments
ALTER TABLE IF EXISTS public.notary_signature_appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage notary appointments" ON public.notary_signature_appointments;
CREATE POLICY "Users can manage notary appointments"
  ON public.notary_signature_appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.notary_files nf
      JOIN public.buyer_files bf ON bf.id = nf.buyer_file_id
      JOIN public.buyers b ON b.id = bf.buyer_id
      JOIN public.projects p ON p.id = b.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE nf.id = notary_signature_appointments.notary_file_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract CFC Allocations
ALTER TABLE IF EXISTS public.contract_cfc_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage contract allocations" ON public.contract_cfc_allocations;
CREATE POLICY "Users can manage contract allocations"
  ON public.contract_cfc_allocations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE c.id = contract_cfc_allocations.contract_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract Change Orders
ALTER TABLE IF EXISTS public.contract_change_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage change orders" ON public.contract_change_orders;
CREATE POLICY "Users can manage change orders"
  ON public.contract_change_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE c.id = contract_change_orders.contract_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract Milestones
ALTER TABLE IF EXISTS public.contract_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage milestones" ON public.contract_milestones;
CREATE POLICY "Users can manage milestones"
  ON public.contract_milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE c.id = contract_milestones.contract_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract Work Progresses
ALTER TABLE IF EXISTS public.contract_work_progresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage work progresses" ON public.contract_work_progresses;
CREATE POLICY "Users can manage work progresses"
  ON public.contract_work_progresses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE c.id = contract_work_progresses.contract_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract Invoices
ALTER TABLE IF EXISTS public.contract_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage contract invoices" ON public.contract_invoices;
CREATE POLICY "Users can manage contract invoices"
  ON public.contract_invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE c.id = contract_invoices.contract_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Contract Payments
ALTER TABLE IF EXISTS public.contract_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage contract payments" ON public.contract_payments;
CREATE POLICY "Users can manage contract payments"
  ON public.contract_payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contract_invoices ci
      JOIN public.contracts c ON c.id = ci.contract_id
      JOIN public.projects p ON p.id = c.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE ci.id = contract_payments.contract_invoice_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Installments
ALTER TABLE IF EXISTS public.installments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage installments" ON public.installments;
CREATE POLICY "Users can manage installments"
  ON public.installments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.projects p ON p.id = l.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE l.id = installments.lot_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Updates
ALTER TABLE IF EXISTS public.project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage project updates" ON public.project_updates;
CREATE POLICY "Users can manage project updates"
  ON public.project_updates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_updates.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Construction Updates
ALTER TABLE IF EXISTS public.construction_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage construction updates" ON public.construction_updates;
CREATE POLICY "Users can manage construction updates"
  ON public.construction_updates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = construction_updates.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Audit Logs
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view audit logs" ON public.audit_logs;
CREATE POLICY "Users can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = audit_logs.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );
