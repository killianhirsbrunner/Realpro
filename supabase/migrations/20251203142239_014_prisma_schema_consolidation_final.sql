/*
  # Consolidation Schéma Prisma Complet - Version Finale

  ## Description
  Migration consolidée compatible avec toutes les migrations précédentes.
  Ajoute toutes les tables manquantes du schéma Prisma.

  ## Nouvelles tables
  50+ tables pour système immobilier complet: CRM, Finance, Soumissions,
  Choix matériaux, Construction, Communication, Billing, Audit
*/

-- ============================================================================
-- NOUVEAUX ENUMS
-- ============================================================================

DO $$ BEGIN CREATE TYPE project_type AS ENUM ('PPE', 'LOCATIF', 'MIXTE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE sale_type AS ENUM ('PPE', 'QPT'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE buyer_file_status AS ENUM ('INCOMPLETE', 'READY_FOR_NOTARY', 'AT_NOTARY', 'SIGNED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE notary_file_status AS ENUM ('OPEN', 'AWAITING_APPOINTMENT', 'APPOINTMENT_SCHEDULED', 'SIGNED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE act_status AS ENUM ('DRAFT', 'FINAL'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE change_order_status AS ENUM ('DRAFT', 'APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE work_progress_status AS ENUM ('DRAFT', 'SUBMITTED', 'TECHNICALLY_APPROVED', 'FINANCIALLY_APPROVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('BANK_TRANSFER', 'CASH', 'OTHER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE submission_status AS ENUM ('DRAFT', 'INVITED', 'IN_PROGRESS', 'CLOSED', 'ADJUDICATED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE submission_offer_status AS ENUM ('INVITED', 'SUBMITTED', 'WITHDRAWN', 'REJECTED', 'WINNER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE phase_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'LATE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE thread_context_type AS ENUM ('PROJECT', 'LOT', 'BUYER', 'SUBMISSION', 'CONTRACT'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE buyer_choice_status AS ENUM ('SELECTED', 'VALIDATED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE change_request_status AS ENUM ('REQUESTED', 'PRICED', 'ACCEPTED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE buyer_document_status AS ENUM ('REQUESTED', 'RECEIVED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Ajouter colonnes manquantes à projects
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'type') THEN ALTER TABLE projects ADD COLUMN type project_type DEFAULT 'PPE'; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'canton') THEN ALTER TABLE projects ADD COLUMN canton text; END IF; END $$;

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, name text NOT NULL, type text NOT NULL, address text, city text, postal_code text, country text DEFAULT 'CH', phone text, email text, website text, vat_number text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contacts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE, first_name text NOT NULL, last_name text NOT NULL, email text, phone text, mobile text, position text, is_primary boolean DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS project_participants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE, role text NOT NULL, started_at timestamptz DEFAULT now(), ended_at timestamptz, UNIQUE(project_id, company_id, role));
CREATE TABLE IF NOT EXISTS prospects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, first_name text NOT NULL, last_name text NOT NULL, email text, phone text, source text, status prospect_status NOT NULL DEFAULT 'NEW', preferred_lot_id uuid REFERENCES lots(id), assigned_broker_id uuid REFERENCES users(id), notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS reservations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE, prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE, start_date timestamptz NOT NULL DEFAULT now(), end_date timestamptz NOT NULL, signed_at timestamptz, status reservation_status NOT NULL DEFAULT 'PENDING', created_by_id uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, first_name text NOT NULL, last_name text NOT NULL, email text, phone text, portal_user_id uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyer_files (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, status buyer_file_status NOT NULL DEFAULT 'INCOMPLETE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyer_document_requirements (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, label text NOT NULL, is_mandatory boolean NOT NULL DEFAULT true, order_index integer DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyer_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_file_id uuid NOT NULL REFERENCES buyer_files(id) ON DELETE CASCADE, requirement_id uuid REFERENCES buyer_document_requirements(id), document_id uuid, status buyer_document_status NOT NULL DEFAULT 'RECEIVED', uploaded_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notary_files (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_file_id uuid UNIQUE NOT NULL REFERENCES buyer_files(id) ON DELETE CASCADE, status notary_file_status NOT NULL DEFAULT 'OPEN', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notary_act_versions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), notary_file_id uuid NOT NULL REFERENCES notary_files(id) ON DELETE CASCADE, document_id uuid, version integer NOT NULL DEFAULT 1, status act_status NOT NULL DEFAULT 'DRAFT', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notary_signature_appointments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), notary_file_id uuid NOT NULL REFERENCES notary_files(id) ON DELETE CASCADE, scheduled_at timestamptz NOT NULL, location text, notes text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sales_contracts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE, buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, buyer_file_id uuid REFERENCES buyer_files(id), signed_at timestamptz, effective_at timestamptz, document_id uuid, created_by_id uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cfc_budgets (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, cfc_code text NOT NULL, label text, budget_initial numeric(15,2) DEFAULT 0, budget_revised numeric(15,2) DEFAULT 0, engagement_total numeric(15,2) DEFAULT 0, invoiced_total numeric(15,2) DEFAULT 0, paid_total numeric(15,2) DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(project_id, cfc_code));
CREATE TABLE IF NOT EXISTS contracts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE, reference text, type contract_type NOT NULL DEFAULT 'EG', title text NOT NULL, cfc_main_code text, amount_initial numeric(15,2) DEFAULT 0, vat_rate numeric(5,2), retention_rate numeric(5,2), signed_document_id uuid, status contract_status NOT NULL DEFAULT 'DRAFT', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contract_cfc_allocations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE, cfc_budget_id uuid NOT NULL REFERENCES cfc_budgets(id) ON DELETE CASCADE, amount numeric(15,2) DEFAULT 0);
CREATE TABLE IF NOT EXISTS contract_change_orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE, reference text, title text NOT NULL, amount_delta numeric(15,2) DEFAULT 0, cfc_budget_id uuid REFERENCES cfc_budgets(id), status change_order_status NOT NULL DEFAULT 'DRAFT', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contract_milestones (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE, label text NOT NULL, planned_amount numeric(15,2) DEFAULT 0, planned_date date, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contract_work_progresses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE, period_start date, period_end date, description text, progress_percent integer, status work_progress_status NOT NULL DEFAULT 'DRAFT', submitted_by_id uuid REFERENCES users(id), approved_tech_by_id uuid REFERENCES users(id), approved_fin_by_id uuid REFERENCES users(id), approved_fin_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contract_invoices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE, work_progress_id uuid UNIQUE REFERENCES contract_work_progresses(id), invoice_number text, issue_date date, due_date date, amount_excl_vat numeric(15,2) DEFAULT 0, vat_amount numeric(15,2) DEFAULT 0, amount_incl_vat numeric(15,2) DEFAULT 0, retention_amount numeric(15,2) DEFAULT 0, amount_payable numeric(15,2) DEFAULT 0, status invoice_status NOT NULL DEFAULT 'DRAFT', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contract_payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_invoice_id uuid NOT NULL REFERENCES contract_invoices(id) ON DELETE CASCADE, payment_date date NOT NULL, amount numeric(15,2) DEFAULT 0, payment_reference text, method payment_method DEFAULT 'BANK_TRANSFER', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyer_invoices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, invoice_number text, issue_date date, due_date date, amount numeric(15,2) DEFAULT 0, pdf_document_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS installments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE, label text NOT NULL, due_date date, amount numeric(15,2) DEFAULT 0, status installment_status NOT NULL DEFAULT 'PENDING', invoice_id uuid REFERENCES buyer_invoices(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, title text NOT NULL, cfc_code text, description text, question_deadline timestamptz, offer_deadline timestamptz, status submission_status NOT NULL DEFAULT 'DRAFT', clarifications_open integer DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS submission_invites (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE, company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE, email_sent_at timestamptz, UNIQUE(submission_id, company_id));
CREATE TABLE IF NOT EXISTS submission_offers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE, company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE, total_excl_vat numeric(15,2) NOT NULL, total_incl_vat numeric(15,2) NOT NULL, delay_proposal text, status submission_offer_status NOT NULL DEFAULT 'SUBMITTED', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS submission_offer_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission_offer_id uuid NOT NULL REFERENCES submission_offers(id) ON DELETE CASCADE, label text NOT NULL, quantity numeric(10,2), unit_price numeric(15,2));
CREATE TABLE IF NOT EXISTS material_categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, name text NOT NULL, order_index integer DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS material_options (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category_id uuid NOT NULL REFERENCES material_categories(id) ON DELETE CASCADE, name text NOT NULL, description text, is_standard boolean DEFAULT false, extra_price numeric(15,2) DEFAULT 0, image_document_id uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS buyer_choices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE, option_id uuid NOT NULL REFERENCES material_options(id) ON DELETE CASCADE, status buyer_choice_status NOT NULL DEFAULT 'SELECTED', decided_at timestamptz);
CREATE TABLE IF NOT EXISTS buyer_change_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE, lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE, description text NOT NULL, status change_request_status NOT NULL DEFAULT 'REQUESTED', extra_price numeric(15,2), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS project_phases (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, name text NOT NULL, planned_start_date date, planned_end_date date, actual_start_date date, actual_end_date date, status phase_status NOT NULL DEFAULT 'NOT_STARTED', order_index integer DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS project_progress_snapshots (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, date date NOT NULL, progress_pct integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS project_updates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, date date NOT NULL, message text NOT NULL, created_by_id uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS construction_updates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, date date NOT NULL, title text NOT NULL, content text, created_by_id uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS message_threads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE, context_type thread_context_type NOT NULL, context_id uuid, title text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE, author_id uuid NOT NULL REFERENCES users(id), body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, type text NOT NULL, payload jsonb DEFAULT '{}'::jsonb, read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS billing_plans (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text UNIQUE NOT NULL, name text NOT NULL, price_cents integer NOT NULL, currency text NOT NULL DEFAULT 'CHF', interval text NOT NULL, features jsonb DEFAULT '{}'::jsonb, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS subscriptions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, plan_id uuid NOT NULL REFERENCES billing_plans(id), status subscription_status NOT NULL DEFAULT 'TRIAL', current_period_start timestamptz NOT NULL, current_period_end timestamptz NOT NULL, cancel_at_period_end boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS subscription_invoices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE, invoice_number text UNIQUE NOT NULL, amount_cents integer NOT NULL, currency text NOT NULL DEFAULT 'CHF', issued_at timestamptz NOT NULL, due_at timestamptz NOT NULL, paid_at timestamptz, status text NOT NULL DEFAULT 'OPEN', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS datatrans_customers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, customer_ref text UNIQUE NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS datatrans_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, transaction_id text UNIQUE NOT NULL, type text NOT NULL, status text NOT NULL, amount_cents integer, currency text, raw_payload jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS datatrans_webhook_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id text UNIQUE NOT NULL, received_at timestamptz NOT NULL DEFAULT now(), payload jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS audit_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, project_id uuid REFERENCES projects(id) ON DELETE CASCADE, user_id uuid REFERENCES users(id), action text NOT NULL, entity_type text NOT NULL, entity_id uuid, description text, metadata jsonb DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());

-- ============================================================================
-- INDEX
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_companies_organization ON companies(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_prospects_project ON prospects(project_id);
CREATE INDEX IF NOT EXISTS idx_buyers_project ON buyers(project_id);
CREATE INDEX IF NOT EXISTS idx_buyer_files_buyer ON buyer_files(buyer_id);
CREATE INDEX IF NOT EXISTS idx_notary_files_buyer_file ON notary_files(buyer_file_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_project ON sales_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_lot ON sales_contracts(lot_id);
CREATE INDEX IF NOT EXISTS idx_cfc_budgets_project ON cfc_budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_installments_buyer ON installments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_submissions_project ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_material_categories_project ON material_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_buyer_choices_buyer ON buyer_choices(buyer_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_project ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_project ON message_threads(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DO $$ BEGIN CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_buyers_updated_at BEFORE UPDATE ON buyers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_cfc_budgets_updated_at BEFORE UPDATE ON cfc_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users can view companies in their organization" ON companies FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_organizations WHERE user_organizations.organization_id = companies.organization_id AND user_organizations.user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can view buyers in their projects" ON buyers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM projects p JOIN user_organizations uo ON p.organization_id = uo.organization_id WHERE p.id = buyers.project_id AND uo.user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid()); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can view billing plans" ON billing_plans FOR SELECT TO authenticated USING (active = true); EXCEPTION WHEN duplicate_object THEN null; END $$;
