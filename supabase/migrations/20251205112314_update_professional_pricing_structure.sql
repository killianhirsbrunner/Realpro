/*
  # Mise à jour Professionnelle des Plans Tarifaires
  
  ## Nouvelle Structure Professionnelle
  
  ### 1. Plan Starter
  - **2 projets** (réduit de 3)
  - **10 utilisateurs** (augmenté de 5)
  - **Stockage illimité** (au lieu de 10GB)
  - Prix: 199 CHF/mois
  
  ### 2. Plan Professional  
  - **5 projets** (réduit de 15 pour être plus cohérent)
  - **Utilisateurs illimités**
  - **Stockage illimité**
  - Prix: 499 CHF/mois
  
  ### 3. Plan Enterprise
  - **10 projets** (au lieu d'illimité)
  - **Utilisateurs illimités**
  - **Stockage illimité**
  - **Au-delà: offre sur mesure**
  - Prix: 999 CHF/mois
  
  ### Changements Clés:
  - Stockage illimité sur TOUS les plans
  - Structure progressive: 2 → 5 → 10 projets
  - Utilisateurs illimités dès Professional
  - Enterprise = pour groupes jusqu'à 10 projets
  - Au-delà de 10 projets = Custom/Sur-mesure
  
  ## Sécurité
  - Mise à jour des limites existantes via UPDATE
  - Préservation des abonnements existants
  - Pas de suppression de données
*/

-- Mise à jour Plan STARTER
UPDATE plans
SET
  limits = jsonb_set(
    jsonb_set(
      jsonb_set(
        limits,
        '{projects_max}', '2'
      ),
      '{users_max}', '10'
    ),
    '{storage_gb}', '-1'  -- -1 = illimité
  ),
  features = '[
    "Jusqu''à 2 projets actifs",
    "10 utilisateurs inclus",
    "Stockage illimité",
    "Gestion de projets & lots",
    "CRM acquéreurs",
    "Documents & templates",
    "Planning de base",
    "Rapports standards",
    "Support email 48h",
    "14 jours d''essai gratuit"
  ]'::jsonb,
  description = jsonb_build_object(
    'fr', 'Idéal pour démarrer avec 1-2 petits projets',
    'de', 'Ideal zum Starten mit 1-2 kleinen Projekten',
    'it', 'Ideale per iniziare con 1-2 piccoli progetti',
    'en', 'Perfect to start with 1-2 small projects'
  ),
  updated_at = now()
WHERE slug = 'starter';

-- Mise à jour Plan PROFESSIONAL
UPDATE plans
SET
  price_monthly = 499.00,
  price_yearly = 4990.00,
  limits = jsonb_set(
    jsonb_set(
      jsonb_set(
        limits,
        '{projects_max}', '5'
      ),
      '{users_max}', '-1'  -- -1 = illimité
    ),
    '{storage_gb}', '-1'  -- -1 = illimité
  ),
  features = '[
    "Jusqu''à 5 projets actifs",
    "Utilisateurs illimités",
    "Stockage illimité",
    "Toutes fonctionnalités Starter",
    "Soumissions & adjudications",
    "Finance avancée & CFC",
    "Choix matériaux personnalisables",
    "Planning chantier détaillé",
    "Rendez-vous fournisseurs",
    "Exports PDF professionnels",
    "Rapports financiers avancés",
    "API access REST",
    "Intégrations tierces",
    "Branding personnalisé (logo)",
    "Support prioritaire 24h",
    "Formation en ligne incluse"
  ]'::jsonb,
  description = jsonb_build_object(
    'fr', 'Pour les promoteurs gérant 3-5 projets simultanément',
    'de', 'Für Entwickler mit 3-5 gleichzeitigen Projekten',
    'it', 'Per promotori con 3-5 progetti simultanei',
    'en', 'For developers managing 3-5 simultaneous projects'
  ),
  updated_at = now()
WHERE slug = 'professional';

-- Mise à jour Plan ENTERPRISE
UPDATE plans
SET
  price_monthly = 999.00,
  price_yearly = 9990.00,
  limits = jsonb_set(
    jsonb_set(
      jsonb_set(
        limits,
        '{projects_max}', '10'  -- Max 10 projets (plus = sur mesure)
      ),
      '{users_max}', '-1'  -- illimité
    ),
    '{storage_gb}', '-1'  -- illimité
  ),
  features = '[
    "Jusqu''à 10 projets actifs",
    "Utilisateurs illimités",
    "Stockage illimité",
    "Toutes fonctionnalités Professional",
    "Multi-organisations",
    "Rôles & permissions avancés",
    "Workflow personnalisables",
    "Automatisations métier",
    "Analytics & Business Intelligence",
    "Exports de données complets",
    "API GraphQL avancée",
    "Webhooks & intégrations custom",
    "Branding complet white-label",
    "Dedicated success manager",
    "Support 24/7 téléphone",
    "Formation équipe sur site",
    "SLA garanti 99.9%",
    "Revue de compte trimestrielle",
    "Migration de données incluse"
  ]'::jsonb,
  description = jsonb_build_object(
    'fr', 'Pour les groupes immobiliers gérant jusqu''à 10 projets. Au-delà: offre sur mesure.',
    'de', 'Für Immobiliengruppen mit bis zu 10 Projekten. Darüber hinaus: maßgeschneidertes Angebot.',
    'it', 'Per gruppi immobiliari con fino a 10 progetti. Oltre: offerta su misura.',
    'en', 'For real estate groups managing up to 10 projects. Beyond: custom offer.'
  ),
  updated_at = now()
WHERE slug = 'enterprise';

-- Ajout d'un commentaire dans la table pour indiquer la politique
COMMENT ON COLUMN plans.limits IS 'Limites du plan. -1 = illimité. projects_max: Starter=2, Pro=5, Enterprise=10 (plus = custom)';

-- Création d'une fonction helper pour vérifier les limites
CREATE OR REPLACE FUNCTION check_project_limit(org_id uuid)
RETURNS TABLE(
  current_projects bigint,
  max_projects int,
  can_create_project boolean,
  needs_upgrade boolean
) AS $$
DECLARE
  v_plan_limits jsonb;
  v_max_projects int;
  v_current_count bigint;
BEGIN
  -- Récupérer les limites du plan de l'organisation
  SELECT p.limits INTO v_plan_limits
  FROM organizations o
  JOIN subscriptions s ON s.organization_id = o.id
  JOIN plans p ON p.id = s.plan_id
  WHERE o.id = org_id
    AND s.status = 'active'
  LIMIT 1;

  -- Si pas de plan trouvé, limites par défaut
  IF v_plan_limits IS NULL THEN
    v_max_projects := 1;
  ELSE
    v_max_projects := (v_plan_limits->>'projects_max')::int;
  END IF;

  -- Compter les projets actifs
  SELECT COUNT(*) INTO v_current_count
  FROM projects
  WHERE organization_id = org_id;

  -- Retourner les résultats
  RETURN QUERY SELECT
    v_current_count,
    v_max_projects,
    -- Peut créer si illimité (-1) ou si sous la limite
    CASE
      WHEN v_max_projects = -1 THEN true
      WHEN v_current_count < v_max_projects THEN true
      ELSE false
    END as can_create,
    -- Doit upgrader si limite atteinte
    CASE
      WHEN v_max_projects = -1 THEN false
      WHEN v_current_count >= v_max_projects THEN true
      ELSE false
    END as needs_upgrade;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accorder les permissions
GRANT EXECUTE ON FUNCTION check_project_limit TO authenticated;
