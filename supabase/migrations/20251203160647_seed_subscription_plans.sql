/*
  # Seed Subscription Plans

  Crée les plans d'abonnement par défaut pour le SaaS immobilier.

  Plans créés:
  - **Starter** (199 CHF/mois, 1990 CHF/an)
    - 3 projets max
    - 5 utilisateurs max
    - 10 GB stockage
    - Support email

  - **Professional** (499 CHF/mois, 4990 CHF/an)
    - 15 projets max
    - 25 utilisateurs max
    - 50 GB stockage
    - Support prioritaire
    - API access

  - **Enterprise** (999 CHF/mois, 9990 CHF/an)
    - Projets illimités
    - Utilisateurs illimités
    - 200 GB stockage
    - Support 24/7
    - API access
    - Custom branding
    - Dedicated success manager
*/

-- Starter Plan
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  currency,
  features,
  limits,
  is_active,
  trial_days,
  sort_order
)
VALUES (
  gen_random_uuid(),
  'Starter',
  'starter',
  '{
    "fr": "Parfait pour débuter avec des projets de petite taille",
    "de": "Perfekt für den Einstieg mit kleinen Projekten",
    "it": "Perfetto per iniziare con progetti di piccole dimensioni",
    "en": "Perfect for getting started with small projects"
  }'::jsonb,
  199.00,
  1990.00,
  'CHF',
  '[
    "Gestion de projets",
    "Lots et ventes",
    "CRM acquéreurs",
    "Documents et templates",
    "Support email"
  ]'::jsonb,
  '{
    "projects_max": 3,
    "users_max": 5,
    "storage_gb": 10,
    "api_access": false
  }'::jsonb,
  true,
  14,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();

-- Professional Plan
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  currency,
  features,
  limits,
  is_active,
  trial_days,
  sort_order
)
VALUES (
  gen_random_uuid(),
  'Professional',
  'professional',
  '{
    "fr": "Pour les promoteurs gérant plusieurs projets simultanément",
    "de": "Für Entwickler, die mehrere Projekte gleichzeitig verwalten",
    "it": "Per i promotori che gestiscono più progetti contemporaneamente",
    "en": "For developers managing multiple projects simultaneously"
  }'::jsonb,
  499.00,
  4990.00,
  'CHF',
  '[
    "Toutes les fonctionnalités Starter",
    "Soumissions et adjudications",
    "Finance et CFC",
    "Choix matériaux",
    "Planning chantier",
    "Rendez-vous fournisseurs",
    "API access",
    "Support prioritaire"
  ]'::jsonb,
  '{
    "projects_max": 15,
    "users_max": 25,
    "storage_gb": 50,
    "api_access": true
  }'::jsonb,
  true,
  14,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();

-- Enterprise Plan
INSERT INTO plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  currency,
  features,
  limits,
  is_active,
  trial_days,
  sort_order
)
VALUES (
  gen_random_uuid(),
  'Enterprise',
  'enterprise',
  '{
    "fr": "Solution complète pour les grands promoteurs et groupes immobiliers",
    "de": "Komplettlösung für große Entwickler und Immobiliengruppen",
    "it": "Soluzione completa per grandi promotori e gruppi immobiliari",
    "en": "Complete solution for large developers and real estate groups"
  }'::jsonb,
  999.00,
  9990.00,
  'CHF',
  '[
    "Toutes les fonctionnalités Professional",
    "Projets illimités",
    "Utilisateurs illimités",
    "Stockage étendu",
    "Custom branding",
    "Dedicated success manager",
    "Support 24/7",
    "Formation équipe",
    "SLA garanti"
  ]'::jsonb,
  '{
    "projects_max": -1,
    "users_max": -1,
    "storage_gb": 200,
    "api_access": true,
    "custom_branding": true,
    "dedicated_support": true
  }'::jsonb,
  true,
  14,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();
