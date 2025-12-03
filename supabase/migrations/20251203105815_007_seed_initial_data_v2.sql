/*
  # Seed Initial Data (Version corrigée)
  
  ## Description
  Crée les données de base pour démarrer l'application avec casting correct des enums.
*/

-- === PLANS D'ABONNEMENT SAAS ===

INSERT INTO plans (name, slug, description, price_monthly, price_yearly, currency, features, limits, is_active, trial_days, sort_order)
VALUES
  (
    'Basic',
    'basic',
    '{"fr": "Idéal pour les petits promoteurs", "en": "Perfect for small developers"}'::jsonb,
    99.00,
    990.00,
    'CHF',
    '[{"fr": "1 projet actif", "en": "1 active project"}, {"fr": "5 utilisateurs", "en": "5 users"}]'::jsonb,
    '{"projects_max": 1, "users_max": 5, "storage_gb": 10}'::jsonb,
    true,
    14,
    1
  ),
  (
    'Pro',
    'pro',
    '{"fr": "Pour promoteurs professionnels", "en": "For professional developers"}'::jsonb,
    249.00,
    2490.00,
    'CHF',
    '[{"fr": "10 projets actifs", "en": "10 active projects"}, {"fr": "25 utilisateurs", "en": "25 users"}]'::jsonb,
    '{"projects_max": 10, "users_max": 25, "storage_gb": 100, "api_access": true}'::jsonb,
    true,
    14,
    2
  ),
  (
    'Enterprise',
    'enterprise',
    '{"fr": "Solution sur mesure", "en": "Custom solution"}'::jsonb,
    999.00,
    9990.00,
    'CHF',
    '[{"fr": "Projets illimités", "en": "Unlimited projects"}, {"fr": "Support dédié 24/7", "en": "Dedicated 24/7 support"}]'::jsonb,
    '{"projects_max": -1, "users_max": -1, "storage_gb": -1, "sso": true}'::jsonb,
    true,
    30,
    3
  );

-- === ORGANISATION DEMO ===

INSERT INTO organizations (name, slug, default_language, is_active)
VALUES ('Demo Promoteur SA', 'demo-promoteur', 'FR', true);

-- === UTILISATEUR DEMO ===

INSERT INTO users (id, email, first_name, last_name, language, is_active)
VALUES (gen_random_uuid(), 'demo@example.com', 'Jean', 'Dupont', 'FR', true);

INSERT INTO user_organizations (user_id, organization_id, is_default)
SELECT u.id, o.id, true
FROM users u, organizations o
WHERE u.email = 'demo@example.com' AND o.slug = 'demo-promoteur';

INSERT INTO user_roles (user_id, organization_id, role_id, assigned_at)
SELECT u.id, o.id, r.id, now()
FROM users u, organizations o, roles r
WHERE u.email = 'demo@example.com' AND o.slug = 'demo-promoteur' AND r.name = 'org_admin';

INSERT INTO subscriptions (organization_id, plan_id, status, billing_cycle, current_period_start, current_period_end, trial_start, trial_end)
SELECT o.id, p.id, 'TRIAL'::subscription_status, 'MONTHLY'::billing_cycle, now(), now() + interval '1 month', now(), now() + interval '14 days'
FROM organizations o, plans p
WHERE o.slug = 'demo-promoteur' AND p.slug = 'pro';

-- === PROJET DEMO ===

INSERT INTO projects (organization_id, name, code, description, address, city, postal_code, country, status, start_date, total_surface, created_by)
SELECT o.id, 'Résidence du Lac', 'RDL-2024', 'Ensemble résidentiel haut de gamme', 'Chemin des Rives 15', 'Lausanne', '1006', 'CH', 'SELLING'::project_status, '2024-01-01'::date, 3500.00, u.id
FROM organizations o, users u
WHERE o.slug = 'demo-promoteur' AND u.email = 'demo@example.com';

INSERT INTO buildings (project_id, name, code, floors_count, total_lots)
SELECT p.id, 'Bâtiment A', 'A', 5, 12 FROM projects p WHERE p.code = 'RDL-2024'
UNION ALL
SELECT p.id, 'Bâtiment B', 'B', 5, 12 FROM projects p WHERE p.code = 'RDL-2024'
UNION ALL
SELECT p.id, 'Bâtiment C', 'C', 4, 8 FROM projects p WHERE p.code = 'RDL-2024';

INSERT INTO floors (building_id, level, name)
SELECT b.id, -1, 'Sous-sol' FROM buildings b WHERE b.code = 'A'
UNION ALL
SELECT b.id, 0, 'Rez-de-chaussée' FROM buildings b WHERE b.code = 'A'
UNION ALL
SELECT b.id, 1, '1er étage' FROM buildings b WHERE b.code = 'A'
UNION ALL
SELECT b.id, 2, '2ème étage' FROM buildings b WHERE b.code = 'A';

INSERT INTO lots (project_id, building_id, floor_id, code, type, status, rooms_count, surface_living, surface_balcony, surface_total, price_base, price_total, orientation, has_elevator, floor_level)
SELECT p.id, b.id, f.id, 'A-101', 'APARTMENT'::lot_type, 'SOLD'::lot_status, 3.5, 85.5, 12.0, 97.5, 720000, 720000, 'Sud-Ouest', true, 0
FROM projects p JOIN buildings b ON b.project_id = p.id JOIN floors f ON f.building_id = b.id
WHERE p.code = 'RDL-2024' AND b.code = 'A' AND f.level = 0
UNION ALL
SELECT p.id, b.id, f.id, 'A-102', 'APARTMENT'::lot_type, 'RESERVED'::lot_status, 4.5, 110.0, 18.0, 128.0, 895000, 895000, 'Sud', true, 0
FROM projects p JOIN buildings b ON b.project_id = p.id JOIN floors f ON f.building_id = b.id
WHERE p.code = 'RDL-2024' AND b.code = 'A' AND f.level = 0
UNION ALL
SELECT p.id, b.id, f.id, 'A-201', 'APARTMENT'::lot_type, 'AVAILABLE'::lot_status, 3.5, 88.0, 15.0, 103.0, 750000, 750000, 'Ouest', true, 1
FROM projects p JOIN buildings b ON b.project_id = p.id JOIN floors f ON f.building_id = b.id
WHERE p.code = 'RDL-2024' AND b.code = 'A' AND f.level = 1
UNION ALL
SELECT p.id, b.id, f.id, 'A-P01', 'PARKING'::lot_type, 'SOLD'::lot_status, NULL, NULL, NULL, 12.5, 35000, 35000, NULL, false, -1
FROM projects p JOIN buildings b ON b.project_id = p.id JOIN floors f ON f.building_id = b.id
WHERE p.code = 'RDL-2024' AND b.code = 'A' AND f.level = -1;

-- === ACTEURS ===

INSERT INTO companies (organization_id, name, type, city, email)
SELECT o.id, 'Constructions Léman SA', 'EG'::company_type, 'Lausanne', 'info@leman.ch' FROM organizations o WHERE o.slug = 'demo-promoteur'
UNION ALL
SELECT o.id, 'Atelier Architecture', 'ARCHITECT'::company_type, 'Lausanne', 'contact@aam.ch' FROM organizations o WHERE o.slug = 'demo-promoteur'
UNION ALL
SELECT o.id, 'Étude Notaire Dupuis', 'NOTARY'::company_type, 'Lausanne', 'etude@dupuis.ch' FROM organizations o WHERE o.slug = 'demo-promoteur';

INSERT INTO project_participants (project_id, company_id, role, joined_at)
SELECT p.id, c.id, 
  CASE c.type 
    WHEN 'EG' THEN 'EG'::participant_role
    WHEN 'ARCHITECT' THEN 'ARCHITECT'::participant_role
    WHEN 'NOTARY' THEN 'NOTARY'::participant_role
  END, now()
FROM projects p, companies c, organizations o
WHERE p.code = 'RDL-2024' AND c.organization_id = o.id AND o.slug = 'demo-promoteur';

-- === PROSPECTS ===

INSERT INTO prospects (project_id, first_name, last_name, email, phone, status, source, budget_min, budget_max, assigned_to)
SELECT p.id, 'Marie', 'Martin', 'marie.martin@example.com', '+41 78 123 4567', 'VISIT_SCHEDULED'::prospect_status, 'Website', 700000, 900000, u.id
FROM projects p, users u
WHERE p.code = 'RDL-2024' AND u.email = 'demo@example.com';

-- === BUDGET CFC ===

INSERT INTO cfc_budgets (project_id, name, version, total_amount, status, created_by)
SELECT p.id, 'Budget CFC Principal', 'v1.0', 8500000, 'ACTIVE'::budget_status, u.id
FROM projects p, users u
WHERE p.code = 'RDL-2024' AND u.email = 'demo@example.com';

INSERT INTO cfc_lines (budget_id, code, label, amount_budgeted)
SELECT b.id, '211', 'Installation du chantier', 150000 FROM cfc_budgets b WHERE b.name = 'Budget CFC Principal'
UNION ALL
SELECT b.id, '213', 'Gros œuvre', 3200000 FROM cfc_budgets b WHERE b.name = 'Budget CFC Principal'
UNION ALL
SELECT b.id, '220', 'Installations électriques', 680000 FROM cfc_budgets b WHERE b.name = 'Budget CFC Principal';