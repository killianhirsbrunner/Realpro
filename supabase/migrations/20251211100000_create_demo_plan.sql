/*
  # Create Demo Plan

  Creates a free demo plan with:
  - 1 project max
  - 1 user max
  - 1 GB storage
  - 14 days trial (which acts as the demo period)
  - No payment required

  Demo accounts expire after 14 days and users are prompted to upgrade.
*/

-- Demo Plan
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
  'Demo',
  'demo',
  '{
    "fr": "Compte démo gratuit pour découvrir RealPro pendant 14 jours",
    "de": "Kostenloses Demo-Konto, um RealPro 14 Tage lang zu entdecken",
    "it": "Account demo gratuito per scoprire RealPro per 14 giorni",
    "en": "Free demo account to discover RealPro for 14 days"
  }'::jsonb,
  0.00,
  0.00,
  'CHF',
  '[
    "1 projet de démonstration",
    "Découverte complète des fonctionnalités",
    "Données de test préchargées",
    "Support par email",
    "Accès 14 jours"
  ]'::jsonb,
  '{
    "projects_max": 1,
    "users_max": 1,
    "storage_gb": 1,
    "api_access": false,
    "is_demo": true
  }'::jsonb,
  true,
  14,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  trial_days = EXCLUDED.trial_days,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Add is_demo column to subscriptions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'is_demo'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN is_demo boolean DEFAULT false;
  END IF;
END $$;

-- Create index for demo subscriptions lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_demo ON subscriptions(is_demo) WHERE is_demo = true;

-- Create a function to check if a demo subscription has expired
CREATE OR REPLACE FUNCTION check_demo_subscription_status(p_organization_id uuid)
RETURNS TABLE (
  is_demo boolean,
  is_expired boolean,
  days_remaining integer,
  trial_end timestamptz
) AS $$
DECLARE
  v_subscription record;
BEGIN
  SELECT s.*, p.limits->>'is_demo' as plan_is_demo
  INTO v_subscription
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.organization_id = p_organization_id
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF v_subscription IS NULL THEN
    RETURN QUERY SELECT false, true, 0, NULL::timestamptz;
    RETURN;
  END IF;

  is_demo := COALESCE(v_subscription.plan_is_demo::boolean, false) OR v_subscription.is_demo;
  trial_end := v_subscription.trial_end;

  IF is_demo AND v_subscription.trial_end IS NOT NULL THEN
    is_expired := v_subscription.trial_end < now();
    days_remaining := GREATEST(0, EXTRACT(days FROM v_subscription.trial_end - now())::integer);
  ELSE
    is_expired := false;
    days_remaining := NULL;
  END IF;

  RETURN QUERY SELECT is_demo, is_expired, days_remaining, trial_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_demo_subscription_status(uuid) TO authenticated;

COMMENT ON FUNCTION check_demo_subscription_status IS 'Check if an organization has an expired demo subscription';
