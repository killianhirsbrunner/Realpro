/*
  # Documents, Finance & Communication Modules
  
  ## Description
  Crée les tables pour la GED (documents), la gestion financière (CFC, contrats, factures),
  et la communication (messages, notifications).
  
  ## Nouvelles tables
  
  ### Documents Module
  
  #### `documents`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `name` (text) - Nom du document
  - `description` (text)
  - `category` (document_category) - PLAN, CONTRACT, INVOICE, REPORT, PHOTO, OTHER
  - `file_url` (text) - URL de stockage
  - `file_size` (bigint) - Taille en bytes
  - `file_type` (text) - MIME type
  - `version_number` (integer) - Version actuelle
  - `parent_folder_id` (uuid, FK documents) - Pour arborescence
  - `is_folder` (boolean) - Est-ce un dossier
  - `tags` (jsonb) - Array de tags
  - `uploaded_by` (uuid, FK users)
  - `created_at`, `updated_at`
  
  #### `document_versions`
  - `id` (uuid, PK)
  - `document_id` (uuid, FK documents)
  - `version_number` (integer)
  - `file_url` (text)
  - `file_size` (bigint)
  - `comment` (text) - Commentaire sur cette version
  - `created_by` (uuid, FK users)
  - `created_at`
  
  ### Finance Module
  
  #### `cfc_budgets`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `name` (text) - Nom du budget CFC
  - `version` (text) - Version du budget
  - `total_amount` (numeric) - Montant total CHF
  - `status` (budget_status) - DRAFT, APPROVED, ACTIVE, CLOSED
  - `created_by` (uuid, FK users)
  - `created_at`, `updated_at`
  
  #### `cfc_lines`
  - `id` (uuid, PK)
  - `budget_id` (uuid, FK cfc_budgets)
  - `code` (text) - Code CFC (ex: 211.3)
  - `label` (text) - Libellé du poste
  - `amount_budgeted` (numeric) - Montant budgété CHF
  - `amount_committed` (numeric) - Montant engagé CHF
  - `amount_spent` (numeric) - Montant dépensé CHF
  - `parent_id` (uuid, FK cfc_lines) - Hiérarchie CFC
  - `created_at`, `updated_at`
  
  #### `contracts`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `company_id` (uuid, FK companies) - Entreprise contractante
  - `number` (text) - Numéro de contrat
  - `name` (text)
  - `type` (contract_type) - EG, LOT, ARCHITECT, ENGINEER, OTHER
  - `amount` (numeric) - Montant CHF
  - `status` (contract_status) - DRAFT, SIGNED, ACTIVE, COMPLETED, CANCELLED
  - `signed_at` (timestamptz)
  - `start_date`, `end_date` (date)
  - `cfc_line_id` (uuid, FK cfc_lines) - Lien avec poste CFC
  - `document_id` (uuid, FK documents) - Document du contrat
  - `created_at`, `updated_at`
  
  #### `invoices`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `contract_id` (uuid, FK contracts)
  - `company_id` (uuid, FK companies) - Émetteur
  - `invoice_number` (text)
  - `type` (invoice_type) - SUPPLIER, BUYER_INSTALLMENT, OTHER
  - `amount` (numeric) - Montant CHF
  - `vat_rate` (numeric) - Taux TVA %
  - `vat_amount` (numeric) - Montant TVA CHF
  - `total_amount` (numeric) - Total TTC CHF
  - `status` (invoice_status) - DRAFT, SENT, PAID, OVERDUE, CANCELLED
  - `issued_at` (timestamptz)
  - `due_at` (timestamptz)
  - `paid_at` (timestamptz)
  - `document_id` (uuid, FK documents)
  - `created_at`, `updated_at`
  
  #### `payments`
  - `id` (uuid, PK)
  - `invoice_id` (uuid, FK invoices)
  - `amount` (numeric) - Montant payé CHF
  - `payment_date` (timestamptz)
  - `payment_method` (text)
  - `reference` (text) - Référence bancaire
  - `notes` (text)
  - `created_at`
  
  #### `buyer_installments`
  - `id` (uuid, PK)
  - `buyer_id` (uuid, FK buyers)
  - `lot_id` (uuid, FK lots)
  - `installment_number` (integer) - Numéro d'acompte
  - `due_date` (date)
  - `percentage` (numeric) - % du prix total
  - `amount` (numeric) - Montant CHF
  - `status` (installment_status) - PENDING, PAID, OVERDUE
  - `invoice_id` (uuid, FK invoices)
  - `paid_at` (timestamptz)
  - `created_at`, `updated_at`
  
  ### Communication Module
  
  #### `message_threads`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `title` (text)
  - `context_type` (text) - 'lot', 'document', 'submission', 'general'
  - `context_id` (uuid) - ID de l'entité liée
  - `created_by` (uuid, FK users)
  - `created_at`, `updated_at`
  
  #### `messages`
  - `id` (uuid, PK)
  - `thread_id` (uuid, FK message_threads)
  - `content` (text)
  - `author_id` (uuid, FK users)
  - `mentions` (jsonb) - Array de user_ids mentionnés
  - `attachments` (jsonb) - Array de document_ids
  - `created_at`, `updated_at`
  
  #### `notifications`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK users)
  - `type` (notification_type) - MENTION, MESSAGE, TASK, DEADLINE, SYSTEM
  - `title` (text)
  - `message` (text)
  - `link_url` (text) - Lien vers la ressource
  - `is_read` (boolean)
  - `read_at` (timestamptz)
  - `created_at`
  
  ## Enums
  - `document_category`: PLAN, CONTRACT, INVOICE, REPORT, PHOTO, DOCUMENT, OTHER
  - `budget_status`: DRAFT, APPROVED, ACTIVE, CLOSED
  - `contract_type`: EG, LOT, ARCHITECT, ENGINEER, NOTARY, OTHER
  - `contract_status`: DRAFT, SIGNED, ACTIVE, COMPLETED, CANCELLED
  - `invoice_type`: SUPPLIER, BUYER_INSTALLMENT, OTHER
  - `installment_status`: PENDING, PAID, OVERDUE
  - `notification_type`: MENTION, MESSAGE, TASK, DEADLINE, SYSTEM
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Filtrage par project_id ou user_id selon le contexte
  
  ## Index
  - Index sur project_id, user_id, status pour performance
*/

-- Enums
CREATE TYPE document_category AS ENUM ('PLAN', 'CONTRACT', 'INVOICE', 'REPORT', 'PHOTO', 'DOCUMENT', 'OTHER');
CREATE TYPE budget_status AS ENUM ('DRAFT', 'APPROVED', 'ACTIVE', 'CLOSED');
CREATE TYPE contract_type AS ENUM ('EG', 'LOT', 'ARCHITECT', 'ENGINEER', 'NOTARY', 'OTHER');
CREATE TYPE contract_status AS ENUM ('DRAFT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE invoice_type AS ENUM ('SUPPLIER', 'BUYER_INSTALLMENT', 'OTHER');
CREATE TYPE installment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE');
CREATE TYPE notification_type AS ENUM ('MENTION', 'MESSAGE', 'TASK', 'DEADLINE', 'SYSTEM');

-- === DOCUMENTS MODULE ===

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category document_category NOT NULL DEFAULT 'DOCUMENT',
  file_url text,
  file_size bigint,
  file_type text,
  version_number integer NOT NULL DEFAULT 1,
  parent_folder_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  is_folder boolean NOT NULL DEFAULT false,
  tags jsonb DEFAULT '[]'::jsonb,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  comment text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- === FINANCE MODULE ===

CREATE TABLE IF NOT EXISTS cfc_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  version text,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  status budget_status NOT NULL DEFAULT 'DRAFT',
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cfc_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES cfc_budgets(id) ON DELETE CASCADE,
  code text NOT NULL,
  label text NOT NULL,
  amount_budgeted numeric(12,2) NOT NULL DEFAULT 0,
  amount_committed numeric(12,2) NOT NULL DEFAULT 0,
  amount_spent numeric(12,2) NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES cfc_lines(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  number text NOT NULL,
  name text NOT NULL,
  type contract_type NOT NULL,
  amount numeric(12,2) NOT NULL,
  status contract_status NOT NULL DEFAULT 'DRAFT',
  signed_at timestamptz,
  start_date date,
  end_date date,
  cfc_line_id uuid REFERENCES cfc_lines(id),
  document_id uuid REFERENCES documents(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES contracts(id),
  company_id uuid REFERENCES companies(id),
  invoice_number text NOT NULL,
  type invoice_type NOT NULL DEFAULT 'SUPPLIER',
  amount numeric(12,2) NOT NULL,
  vat_rate numeric(5,2) DEFAULT 8.1,
  vat_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'DRAFT',
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz,
  paid_at timestamptz,
  document_id uuid REFERENCES documents(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  payment_date timestamptz NOT NULL DEFAULT now(),
  payment_method text,
  reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS buyer_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  due_date date NOT NULL,
  percentage numeric(5,2) NOT NULL,
  amount numeric(12,2) NOT NULL,
  status installment_status NOT NULL DEFAULT 'PENDING',
  invoice_id uuid REFERENCES invoices(id),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- === COMMUNICATION MODULE ===

CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  context_type text,
  context_id uuid,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES users(id),
  mentions jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text,
  link_url text,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_parent_folder ON documents(parent_folder_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_document_versions_document ON document_versions(document_id);

CREATE INDEX idx_cfc_budgets_project ON cfc_budgets(project_id);
CREATE INDEX idx_cfc_lines_budget ON cfc_lines(budget_id);
CREATE INDEX idx_cfc_lines_parent ON cfc_lines(parent_id);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_company ON contracts(company_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_contract ON invoices(contract_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_buyer_installments_buyer ON buyer_installments(buyer_id);
CREATE INDEX idx_buyer_installments_lot ON buyer_installments(lot_id);

CREATE INDEX idx_message_threads_project ON message_threads(project_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_author ON messages(author_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Triggers pour updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cfc_budgets_updated_at
  BEFORE UPDATE ON cfc_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cfc_lines_updated_at
  BEFORE UPDATE ON cfc_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_installments_updated_at
  BEFORE UPDATE ON buyer_installments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON message_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cfc_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cfc_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour Documents
CREATE POLICY "Users can view documents in their projects"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = documents.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- RLS Policies pour Finance
CREATE POLICY "Users can view budgets in their projects"
  ON cfc_budgets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = cfc_budgets.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view contracts in their projects"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = contracts.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view invoices in their projects"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = invoices.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- RLS Policies pour Communication
CREATE POLICY "Users can view threads in their projects"
  ON message_threads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = message_threads.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages in accessible threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads mt
      JOIN projects p ON mt.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE mt.id = messages.thread_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());