/*
  # Billing Module - SaaS Subscription & Datatrans Integration
  
  ## Description
  Gère les abonnements SaaS, plans tarifaires, paiements via Datatrans (PSP Suisse).
  Support multi-devises (CHF principalement), facturation récurrente, webhooks.
  
  ## Nouvelles tables
  
  ### `plans`
  - `id` (uuid, PK)
  - `name` (text) - Nom du plan (Basic, Pro, Enterprise)
  - `slug` (text, unique) - Identifiant technique
  - `description` (jsonb) - Descriptions i18n
  - `price_monthly` (numeric) - Prix mensuel CHF
  - `price_yearly` (numeric) - Prix annuel CHF
  - `currency` (text) - CHF par défaut
  - `features` (jsonb) - Liste des fonctionnalités incluses
  - `limits` (jsonb) - Limites (projects_max, users_max, storage_gb, etc.)
  - `is_active` (boolean)
  - `trial_days` (integer) - Durée d'essai en jours
  - `sort_order` (integer)
  - `created_at`, `updated_at`
  
  ### `subscriptions`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK organizations)
  - `plan_id` (uuid, FK plans)
  - `status` (subscription_status) - TRIAL, ACTIVE, PAST_DUE, CANCELLED, EXPIRED
  - `billing_cycle` (billing_cycle) - MONTHLY, YEARLY
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `trial_start` (timestamptz)
  - `trial_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `cancelled_at` (timestamptz)
  - `created_at`, `updated_at`
  
  ### `subscription_invoices`
  - `id` (uuid, PK)
  - `subscription_id` (uuid, FK subscriptions)
  - `organization_id` (uuid, FK organizations)
  - `invoice_number` (text, unique) - Numéro de facture
  - `amount` (numeric) - Montant CHF
  - `currency` (text)
  - `status` (invoice_status) - DRAFT, PENDING, PAID, FAILED, REFUNDED
  - `issued_at` (timestamptz)
  - `due_at` (timestamptz)
  - `paid_at` (timestamptz)
  - `period_start`, `period_end` (timestamptz)
  - `pdf_url` (text) - URL du PDF de facture
  - `created_at`, `updated_at`
  
  ### `payment_methods`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK organizations)
  - `type` (payment_method_type) - CARD, TWINT, POSTFINANCE
  - `datatrans_alias` (text) - Alias Datatrans pour paiements récurrents
  - `card_last4` (text) - 4 derniers chiffres carte
  - `card_brand` (text) - VISA, MASTERCARD, AMEX
  - `card_expiry_month`, `card_expiry_year` (integer)
  - `is_default` (boolean)
  - `created_at`, `updated_at`
  
  ### `datatrans_customers`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK organizations)
  - `datatrans_customer_id` (text, unique) - ID client chez Datatrans
  - `metadata` (jsonb)
  - `created_at`, `updated_at`
  
  ### `datatrans_transactions`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK organizations)
  - `subscription_invoice_id` (uuid, FK subscription_invoices)
  - `datatrans_transaction_id` (text, unique) - Transaction ID Datatrans
  - `amount` (numeric)
  - `currency` (text)
  - `status` (transaction_status) - PENDING, AUTHORIZED, SETTLED, FAILED, CANCELLED
  - `payment_method` (text)
  - `error_code` (text)
  - `error_message` (text)
  - `metadata` (jsonb)
  - `created_at`, `updated_at`
  
  ### `datatrans_webhook_events`
  - `id` (uuid, PK)
  - `event_id` (text, unique) - ID événement Datatrans
  - `event_type` (text) - Type d'événement (transaction.authorized, etc.)
  - `payload` (jsonb) - Payload complet de l'événement
  - `processed` (boolean)
  - `processed_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ## Enums
  - `subscription_status`: TRIAL, ACTIVE, PAST_DUE, CANCELLED, EXPIRED
  - `billing_cycle`: MONTHLY, YEARLY
  - `invoice_status`: DRAFT, PENDING, PAID, FAILED, REFUNDED
  - `payment_method_type`: CARD, TWINT, POSTFINANCE, BANK_TRANSFER
  - `transaction_status`: PENDING, AUTHORIZED, SETTLED, FAILED, CANCELLED
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Les organisations voient uniquement leurs propres données de facturation
  - Les webhook events sont accessibles uniquement en backend
  
  ## Index
  - Index sur organization_id pour toutes les tables
  - Index sur les statuts et dates pour reporting
  - Index unique sur les identifiants Datatrans
*/

-- Enums
CREATE TYPE subscription_status AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE billing_cycle AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method_type AS ENUM ('CARD', 'TWINT', 'POSTFINANCE', 'BANK_TRANSFER');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'AUTHORIZED', 'SETTLED', 'FAILED', 'CANCELLED');

-- Table Plans
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  price_monthly numeric(10,2) NOT NULL,
  price_yearly numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CHF',
  features jsonb DEFAULT '[]'::jsonb,
  limits jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  trial_days integer DEFAULT 14,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'TRIAL',
  billing_cycle billing_cycle NOT NULL DEFAULT 'MONTHLY',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Subscription Invoices
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CHF',
  status invoice_status NOT NULL DEFAULT 'DRAFT',
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz NOT NULL,
  paid_at timestamptz,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  datatrans_alias text,
  card_last4 text,
  card_brand text,
  card_expiry_month integer,
  card_expiry_year integer,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Datatrans Customers
CREATE TABLE IF NOT EXISTS datatrans_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  datatrans_customer_id text UNIQUE NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Datatrans Transactions
CREATE TABLE IF NOT EXISTS datatrans_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_invoice_id uuid REFERENCES subscription_invoices(id),
  datatrans_transaction_id text UNIQUE NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'CHF',
  status transaction_status NOT NULL DEFAULT 'PENDING',
  payment_method text,
  error_code text,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Datatrans Webhook Events
CREATE TABLE IF NOT EXISTS datatrans_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_subscriptions_organization ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscription_invoices_subscription ON subscription_invoices(subscription_id);
CREATE INDEX idx_subscription_invoices_organization ON subscription_invoices(organization_id);
CREATE INDEX idx_subscription_invoices_status ON subscription_invoices(status);
CREATE INDEX idx_payment_methods_organization ON payment_methods(organization_id);
CREATE INDEX idx_datatrans_customers_organization ON datatrans_customers(organization_id);
CREATE INDEX idx_datatrans_transactions_organization ON datatrans_transactions(organization_id);
CREATE INDEX idx_datatrans_transactions_invoice ON datatrans_transactions(subscription_invoice_id);
CREATE INDEX idx_datatrans_webhook_events_processed ON datatrans_webhook_events(processed);
CREATE INDEX idx_datatrans_webhook_events_type ON datatrans_webhook_events(event_type);

-- Triggers pour updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_invoices_updated_at
  BEFORE UPDATE ON subscription_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datatrans_customers_updated_at
  BEFORE UPDATE ON datatrans_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datatrans_transactions_updated_at
  BEFORE UPDATE ON datatrans_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE datatrans_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE datatrans_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE datatrans_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour Plans (public read pour authenticated)
CREATE POLICY "Authenticated users can view plans"
  ON plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies pour Subscriptions
CREATE POLICY "Users can view their organization subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = subscriptions.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = subscriptions.organization_id
      AND p.name = 'billing.manage'
    )
  );

-- RLS Policies pour Subscription Invoices
CREATE POLICY "Users can view their organization invoices"
  ON subscription_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = subscription_invoices.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Payment Methods
CREATE POLICY "Users can view their organization payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = payment_methods.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Datatrans Customers
CREATE POLICY "Users can view their organization datatrans data"
  ON datatrans_customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = datatrans_customers.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Datatrans Transactions
CREATE POLICY "Users can view their organization transactions"
  ON datatrans_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = datatrans_transactions.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies pour Webhook Events (backend only via service role)
CREATE POLICY "Webhook events are backend only"
  ON datatrans_webhook_events FOR ALL
  TO authenticated
  USING (false);