/*
  # Seed Données Démo Complètes - Résidence Les Amandiers

  ## Description
  Script seed créant un écosystème complet de test:
  - Organisation SwissPrime Dev SA
  - 3 utilisateurs (admin, promoteur, courtier)
  - 3 entreprises (EG, Architecte, Notaire)
  - Projet PPE "Résidence Les Amandiers" à Lausanne
  - 2 lots (A-01 libre, A-02 vendu)
  - Budget CFC 5 postes (3.25M CHF)
  - Contrat EG 3.1M CHF avec allocations CFC
  - Work progress + Facture payée 161'550 CHF
  - 1 acheteur avec dossier
  - Planning 2 phases
  - 1 soumission en cours
  - Thread messages

  ## Utilisation
  Exécuter via Supabase SQL Editor ou mcp__supabase__execute_sql
*/

-- ============================================================================
-- ORGANIZATION & USERS
-- ============================================================================

INSERT INTO organizations (id, name, slug, default_language, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'SwissPrime Dev SA', 'swissprime-dev', 'FR', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, first_name, last_name, language, is_active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'admin@swissprime.dev', 'Lucas', 'Martin', 'FR', true),
  ('10000000-0000-0000-0000-000000000002', 'promoteur@swissprime.dev', 'Isabelle', 'Dupraz', 'FR', true),
  ('10000000-0000-0000-0000-000000000003', 'courtier@swissprime.dev', 'David', 'Fischer', 'FR', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_organizations (user_id, organization_id, is_default) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', true),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPANIES
-- ============================================================================

INSERT INTO companies (id, organization_id, name, type, city, country) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'EG Construction SA', 'EG', 'Lausanne', 'CH'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ARCO Architectes', 'ARCHITECT', 'Lausanne', 'CH'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Étude Notariale Dubois', 'NOTARY', 'Lausanne', 'CH')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contacts (company_id, organization_id, first_name, last_name, email)
VALUES ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Sandra', 'Keller', 'skeller@egconstruction.ch');

-- ============================================================================
-- PROJECT
-- ============================================================================

INSERT INTO projects (id, organization_id, name, code, type, address, city, postal_code, canton, country, status, created_by)
VALUES ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Résidence Les Amandiers', 'RLA-2024', 'PPE', 'Chemin du Lac 12', 'Lausanne', '1007', 'VD', 'CH', 'SELLING', '10000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_participants (project_id, company_id, role) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'EG'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'ARCHITECT'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'NOTARY')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STRUCTURE BÂTIMENT
-- ============================================================================

INSERT INTO buildings (id, project_id, name, code)
VALUES ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Bâtiment A', 'A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO floors (id, building_id, level, name) VALUES
  ('41000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 0, 'RDC'),
  ('41000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 1, 'Étage 1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lots (id, project_id, building_id, floor_id, code, type, status, rooms_count, surface_living, price_base) VALUES
  ('42000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', 'A-01', 'APARTMENT', 'AVAILABLE', 3.5, 82.5, 795000),
  ('42000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000002', 'A-02', 'APARTMENT', 'SOLD', 4.5, 102.0, 945000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CFC BUDGETS (3.25M CHF total)
-- ============================================================================

INSERT INTO cfc_budgets (id, project_id, cfc_code, label, budget_initial, budget_revised, engagement_total, invoiced_total, paid_total) VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '100', 'Terrassements', 120000, 120000, 0, 0, 0),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '200', 'Gros œuvre', 1400000, 1400000, 1400000, 150000, 150000),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '300', 'Second œuvre', 900000, 900000, 900000, 0, 0),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '400', 'Équipement technique', 650000, 650000, 650000, 0, 0),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', '500', 'Aménagements extérieurs', 180000, 180000, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CONTRAT EG (3.1M CHF)
-- ============================================================================

INSERT INTO contracts (id, organization_id, project_id, company_id, type, title, cfc_main_code, amount_initial, vat_rate, status)
VALUES ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'EG', 'Contrat entreprise générale', '200', 3100000, 8.1, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contract_cfc_allocations (contract_id, cfc_budget_id, amount) VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 1400000),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003', 900000),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000004', 650000);

-- ============================================================================
-- WORK PROGRESS + INVOICE + PAYMENT
-- ============================================================================

INSERT INTO contract_work_progresses (id, contract_id, description, progress_percent, status, submitted_by_id, approved_tech_by_id)
VALUES ('61000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'Travaux terrassement en cours - Acompte 1', 15, 'TECHNICALLY_APPROVED', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contract_invoices (id, contract_id, invoice_number, issue_date, due_date, amount_excl_vat, vat_amount, amount_incl_vat, retention_amount, amount_payable, status)
VALUES ('62000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'FV-2024-001', '2024-11-15', '2024-12-15', 150000, 11550, 161550, 0, 161550, 'PAID')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contract_payments (contract_invoice_id, payment_date, amount, method)
VALUES ('62000000-0000-0000-0000-000000000001', '2025-01-05', 161550, 'BANK_TRANSFER');

-- ============================================================================
-- BUYER & BUYER FILE
-- ============================================================================

INSERT INTO buyers (id, project_id, first_name, last_name, email)
VALUES ('70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Margaux', 'Beaud', 'margaux.beaud@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO buyer_files (id, project_id, buyer_id, status)
VALUES ('71000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'READY_FOR_NOTARY')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PROJECT PHASES & PROGRESS
-- ============================================================================

INSERT INTO project_phases (project_id, name, planned_start_date, planned_end_date, status, order_index) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Gros œuvre', '2024-09-01', '2025-03-01', 'IN_PROGRESS', 1),
  ('30000000-0000-0000-0000-000000000001', 'Second œuvre', '2025-03-15', '2025-10-30', 'NOT_STARTED', 2);

INSERT INTO project_progress_snapshots (project_id, date, progress_pct)
VALUES ('30000000-0000-0000-0000-000000000001', CURRENT_DATE, 12);

-- ============================================================================
-- SUBMISSION (Soumission en cours)
-- ============================================================================

INSERT INTO submissions (id, project_id, title, cfc_code, description, question_deadline, offer_deadline, status)
VALUES ('80000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Plâtrerie / Peinture', '300', 'Travaux plâtrerie et peinture intérieur - Lots A & B', '2025-02-15', '2025-03-01', 'IN_PROGRESS')
ON CONFLICT (id) DO NOTHING;

INSERT INTO submission_invites (submission_id, company_id)
VALUES ('80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MESSAGES
-- ============================================================================

INSERT INTO message_threads (id, project_id, context_type, context_id, title)
VALUES ('90000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'PROJECT', '30000000-0000-0000-0000-000000000001', 'Fil projet général')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (thread_id, author_id, body)
VALUES ('90000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Le chantier avance bien, 15% réalisés. Première facture EG payée.');

-- ============================================================================
-- MATERIAL CATEGORIES & OPTIONS (Bonus)
-- ============================================================================

INSERT INTO material_categories (id, project_id, name, order_index) VALUES
  ('a0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Revêtement sol cuisine', 1),
  ('a0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Faïence salle de bain', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO material_options (category_id, name, description, is_standard, extra_price) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Carrelage standard gris', 'Grès cérame 60x60 gris clair', true, 0),
  ('a0000000-0000-0000-0000-000000000001', 'Parquet chêne massif', 'Parquet chêne massif huilé 14mm', false, 2500),
  ('a0000000-0000-0000-0000-000000000002', 'Faïence blanche standard', 'Faïence blanche brillante 20x60', true, 0),
  ('a0000000-0000-0000-0000-000000000002', 'Carrelage effet marbre', 'Grès cérame effet marbre Calacatta 30x60', false, 850);

-- ============================================================================
-- AUDIT LOGS (Exemples activité)
-- ============================================================================

INSERT INTO audit_logs (organization_id, project_id, user_id, action, entity_type, entity_id, description) VALUES
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'CREATE', 'PROJECT', '30000000-0000-0000-0000-000000000001', 'Création du projet Résidence Les Amandiers'),
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'CREATE', 'CONTRACT', '60000000-0000-0000-0000-000000000001', 'Création contrat EG Construction SA - 3.1M CHF'),
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'UPDATE', 'LOT', '42000000-0000-0000-0000-000000000002', 'Lot A-02 vendu à Margaux Beaud'),
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'CREATE', 'INVOICE', '62000000-0000-0000-0000-000000000001', 'Facture FV-2024-001 créée - 161'550 CHF'),
  ('00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'PAYMENT', 'INVOICE', '62000000-0000-0000-0000-000000000001', 'Paiement facture FV-2024-001 - 161'550 CHF');

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
  'Seed complété!' AS status,
  (SELECT COUNT(*) FROM projects WHERE organization_id = '00000000-0000-0000-0000-000000000001') AS projects,
  (SELECT COUNT(*) FROM lots WHERE project_id = '30000000-0000-0000-0000-000000000001') AS lots,
  (SELECT COUNT(*) FROM buyers WHERE project_id = '30000000-0000-0000-0000-000000000001') AS buyers,
  (SELECT COUNT(*) FROM contracts WHERE project_id = '30000000-0000-0000-0000-000000000001') AS contracts,
  (SELECT SUM(budget_revised) FROM cfc_budgets WHERE project_id = '30000000-0000-0000-0000-000000000001') AS budget_total_chf,
  (SELECT SUM(paid_total) FROM cfc_budgets WHERE project_id = '30000000-0000-0000-0000-000000000001') AS paid_total_chf;
