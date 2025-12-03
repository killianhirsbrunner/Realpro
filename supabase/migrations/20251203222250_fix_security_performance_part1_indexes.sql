/*
  # Fix Security and Performance Issues - Part 1: Indexes

  ## Changes
  1. Add 73 missing foreign key indexes for query performance
  2. Remove 12 duplicate indexes
*/

-- ============================================================================
-- ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_change_requests_reviewed_by_id ON public.buyer_change_requests(reviewed_by_id);
CREATE INDEX IF NOT EXISTS idx_buyer_document_requirements_project_id ON public.buyer_document_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_buyer_documents_buyer_file_id ON public.buyer_documents(buyer_file_id);
CREATE INDEX IF NOT EXISTS idx_buyer_documents_requirement_id ON public.buyer_documents(requirement_id);
CREATE INDEX IF NOT EXISTS idx_buyer_installments_invoice_id ON public.buyer_installments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_buyer_invoices_buyer_id ON public.buyer_invoices(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_invoices_project_id ON public.buyer_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_buyers_notary_id ON public.buyers(notary_id);
CREATE INDEX IF NOT EXISTS idx_buyers_reservation_id ON public.buyers(reservation_id);
CREATE INDEX IF NOT EXISTS idx_cfc_budgets_created_by ON public.cfc_budgets(created_by);
CREATE INDEX IF NOT EXISTS idx_company_warranties_document_id ON public.company_warranties(document_id);
CREATE INDEX IF NOT EXISTS idx_construction_updates_created_by_id ON public.construction_updates(created_by_id);
CREATE INDEX IF NOT EXISTS idx_construction_updates_project_id ON public.construction_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_contract_cfc_allocations_cfc_budget_id ON public.contract_cfc_allocations(cfc_budget_id);
CREATE INDEX IF NOT EXISTS idx_contract_cfc_allocations_contract_id ON public.contract_cfc_allocations(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_change_orders_cfc_budget_id ON public.contract_change_orders(cfc_budget_id);
CREATE INDEX IF NOT EXISTS idx_contract_change_orders_contract_id ON public.contract_change_orders(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_invoices_contract_id ON public.contract_invoices(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_milestones_contract_id ON public.contract_milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_payments_contract_invoice_id ON public.contract_payments(contract_invoice_id);
CREATE INDEX IF NOT EXISTS idx_contract_work_progresses_approved_fin_by_id ON public.contract_work_progresses(approved_fin_by_id);
CREATE INDEX IF NOT EXISTS idx_contract_work_progresses_approved_tech_by_id ON public.contract_work_progresses(approved_tech_by_id);
CREATE INDEX IF NOT EXISTS idx_contract_work_progresses_contract_id ON public.contract_work_progresses(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_work_progresses_submitted_by_id ON public.contract_work_progresses(submitted_by_id);
CREATE INDEX IF NOT EXISTS idx_contracts_cfc_line_id ON public.contracts(cfc_line_id);
CREATE INDEX IF NOT EXISTS idx_contracts_document_id ON public.contracts(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by ON public.document_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_eg_invoices_company_id ON public.eg_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_eg_invoices_project_id ON public.eg_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_financial_scenarios_created_by_id ON public.financial_scenarios(created_by_id);
CREATE INDEX IF NOT EXISTS idx_floors_entrance_id ON public.floors(entrance_id);
CREATE INDEX IF NOT EXISTS idx_handover_events_created_by_id ON public.handover_events(created_by_id);
CREATE INDEX IF NOT EXISTS idx_handover_events_document_id ON public.handover_events(document_id);
CREATE INDEX IF NOT EXISTS idx_handover_inspections_buyer_id ON public.handover_inspections(buyer_id);
CREATE INDEX IF NOT EXISTS idx_handover_inspections_created_by_id ON public.handover_inspections(created_by_id);
CREATE INDEX IF NOT EXISTS idx_installments_invoice_id ON public.installments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_installments_lot_id ON public.installments(lot_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_document_id ON public.invoices(document_id);
CREATE INDEX IF NOT EXISTS idx_material_options_technical_sheet_id ON public.material_options(technical_sheet_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_created_by ON public.message_threads(created_by);
CREATE INDEX IF NOT EXISTS idx_notary_act_versions_notary_file_id ON public.notary_act_versions(notary_file_id);
CREATE INDEX IF NOT EXISTS idx_notary_signature_appointments_notary_file_id ON public.notary_signature_appointments(notary_file_id);
CREATE INDEX IF NOT EXISTS idx_project_participants_contact_id ON public.project_participants(contact_id);
CREATE INDEX IF NOT EXISTS idx_project_progress_snapshots_created_by_id ON public.project_progress_snapshots(created_by_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_by_id ON public.project_updates(created_by_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON public.project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_reservations_broker_id ON public.reservations(broker_id);
CREATE INDEX IF NOT EXISTS idx_reservations_prospect_id ON public.reservations(prospect_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_safety_plans_document_id ON public.safety_plans(document_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_created_by_id ON public.sales_contracts(created_by_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_document_id ON public.sales_contracts(document_id);
CREATE INDEX IF NOT EXISTS idx_sav_attachments_uploaded_by_id ON public.sav_attachments(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_sav_history_created_by_id ON public.sav_history(created_by_id);
CREATE INDEX IF NOT EXISTS idx_sav_tickets_assigned_to_user_id ON public.sav_tickets(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_sav_tickets_reported_by_id ON public.sav_tickets(reported_by_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_assigned_to_company_id ON public.service_tickets(assigned_to_company_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_warranty_id ON public.service_tickets(warranty_id);
CREATE INDEX IF NOT EXISTS idx_site_diary_documents_document_id ON public.site_diary_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_site_diary_entries_created_by_id ON public.site_diary_entries(created_by_id);
CREATE INDEX IF NOT EXISTS idx_submission_documents_uploaded_by_id ON public.submission_documents(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_submission_invites_invited_by_id ON public.submission_invites(invited_by_id);
CREATE INDEX IF NOT EXISTS idx_submission_offers_submitted_by_id ON public.submission_offers(submitted_by_id);
CREATE INDEX IF NOT EXISTS idx_submissions_cfc_budget_id ON public.submissions(cfc_budget_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_by_id ON public.submissions(created_by_id);
CREATE INDEX IF NOT EXISTS idx_supplier_appointments_project_id ON public.supplier_appointments(project_id);
CREATE INDEX IF NOT EXISTS idx_supplier_appointments_time_slot_id ON public.supplier_appointments(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_supplier_showrooms_company_id ON public.supplier_showrooms(company_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_by ON public.user_roles(assigned_by);
CREATE INDEX IF NOT EXISTS idx_warranties_company_id ON public.warranties(company_id);

-- ============================================================================
-- REMOVE DUPLICATE INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_buyer_choices_buyer;
DROP INDEX IF EXISTS public.idx_material_categories_project;
DROP INDEX IF EXISTS public.idx_notary_files_buyer_file;
DROP INDEX IF EXISTS public.idx_plan_annotations_doc;
DROP INDEX IF EXISTS public.idx_plan_annotations_project;
DROP INDEX IF EXISTS public.idx_project_phases_project;
DROP INDEX IF EXISTS public.idx_sales_contracts_lot;
DROP INDEX IF EXISTS public.idx_sales_contracts_project;
DROP INDEX IF EXISTS public.idx_signature_requests_doc;
DROP INDEX IF EXISTS public.idx_signature_requests_org;
DROP INDEX IF EXISTS public.idx_signature_requests_status;
DROP INDEX IF EXISTS public.idx_submissions_project;
