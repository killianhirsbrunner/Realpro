/*
  # Add Subscription Plan Change Tracking

  ## Business Rules
  - UPGRADE: allowed at any time without restriction
  - DOWNGRADE: allowed only 6 months after last plan change

  ## Changes
  1. Add last_plan_change column to subscriptions table
  2. Create function to check if downgrade is allowed
  3. Add trigger to automatically update last_plan_change on plan changes

  ## Security
  - Maintain existing RLS policies
  - Add validation function for plan changes
*/

-- Add last_plan_change column to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'last_plan_change'
  ) THEN
    ALTER TABLE subscriptions
    ADD COLUMN last_plan_change TIMESTAMPTZ DEFAULT NOW();

    -- Set last_plan_change to created_at for existing records
    UPDATE subscriptions
    SET last_plan_change = created_at
    WHERE last_plan_change IS NULL;

    -- Make it NOT NULL after setting values
    ALTER TABLE subscriptions
    ALTER COLUMN last_plan_change SET NOT NULL;
  END IF;
END $$;

-- Create function to determine plan hierarchy
CREATE OR REPLACE FUNCTION get_plan_level(plan_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE LOWER(plan_name)
    WHEN 'starter' THEN 1
    WHEN 'business' THEN 2
    WHEN 'enterprise' THEN 3
    ELSE 0
  END;
END;
$$;

-- Create function to check if plan change is an upgrade
CREATE OR REPLACE FUNCTION is_upgrade(current_plan TEXT, new_plan TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN get_plan_level(new_plan) > get_plan_level(current_plan);
END;
$$;

-- Create function to check if downgrade is allowed (6 months rule)
CREATE OR REPLACE FUNCTION can_downgrade(subscription_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  last_change TIMESTAMPTZ;
  months_elapsed NUMERIC;
BEGIN
  SELECT last_plan_change INTO last_change
  FROM subscriptions
  WHERE id = subscription_id;

  IF last_change IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Calculate months elapsed
  months_elapsed := EXTRACT(EPOCH FROM (NOW() - last_change)) / (60 * 60 * 24 * 30);

  RETURN months_elapsed >= 6;
END;
$$;

-- Create function to validate plan change
CREATE OR REPLACE FUNCTION validate_plan_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  old_plan_level INTEGER;
  new_plan_level INTEGER;
  is_upgrade_change BOOLEAN;
  can_downgrade_now BOOLEAN;
BEGIN
  -- Skip validation on INSERT
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Skip if plan hasn't changed
  IF OLD.plan_name = NEW.plan_name THEN
    RETURN NEW;
  END IF;

  old_plan_level := get_plan_level(OLD.plan_name);
  new_plan_level := get_plan_level(NEW.plan_name);
  is_upgrade_change := new_plan_level > old_plan_level;

  -- UPGRADE: Always allowed
  IF is_upgrade_change THEN
    NEW.last_plan_change := NOW();
    RETURN NEW;
  END IF;

  -- DOWNGRADE: Check 6 months rule
  can_downgrade_now := can_downgrade(OLD.id);

  IF NOT can_downgrade_now THEN
    RAISE EXCEPTION 'Downgrade not allowed. You must wait 6 months after your last plan change. Last change: %', OLD.last_plan_change;
  END IF;

  -- Update last_plan_change on successful downgrade
  NEW.last_plan_change := NOW();

  RETURN NEW;
END;
$$;

-- Create trigger for plan change validation
DROP TRIGGER IF EXISTS validate_subscription_plan_change ON subscriptions;
CREATE TRIGGER validate_subscription_plan_change
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION validate_plan_change();

-- Create helper function to get next downgrade date
CREATE OR REPLACE FUNCTION get_next_downgrade_date(subscription_id UUID)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  last_change TIMESTAMPTZ;
BEGIN
  SELECT last_plan_change INTO last_change
  FROM subscriptions
  WHERE id = subscription_id;

  IF last_change IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN last_change + INTERVAL '6 months';
END;
$$;

-- Add index on last_plan_change for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_last_plan_change
ON subscriptions(last_plan_change);

-- Add helpful comments
COMMENT ON COLUMN subscriptions.last_plan_change IS 'Date of last plan change. Used to enforce 6-month waiting period for downgrades.';
COMMENT ON FUNCTION can_downgrade(UUID) IS 'Returns true if at least 6 months have elapsed since last plan change, allowing downgrade.';
COMMENT ON FUNCTION get_next_downgrade_date(UUID) IS 'Returns the date when downgrade will be allowed (6 months after last change).';
COMMENT ON FUNCTION is_upgrade(TEXT, TEXT) IS 'Returns true if changing from current_plan to new_plan is an upgrade.';
COMMENT ON FUNCTION get_plan_level(TEXT) IS 'Returns numeric level for plan hierarchy: Starter=1, Business=2, Enterprise=3.';
