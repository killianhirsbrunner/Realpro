/*
  # Choices & Materials Module

  ## Overview
  This migration creates the choices module for managing material catalogs and buyer choices.

  ## New Tables

  ### `material_categories`
  Categories of materials (e.g., "Flooring", "Kitchen", "Bathroom")
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `name` (text)
  - `description` (text, nullable)
  - `order_index` (integer)
  - `created_at`, `updated_at` (timestamptz)

  ### `material_options`
  Available material options within a category
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key to material_categories)
  - `name` (text)
  - `description` (text, nullable)
  - `manufacturer` (text, nullable)
  - `reference` (text, nullable) - Manufacturer reference
  - `is_standard` (boolean) - Is this the standard/included option
  - `price_delta` (numeric) - Price difference from standard (can be negative)
  - `image_url` (text, nullable)
  - `technical_sheet_id` (uuid, nullable, foreign key to documents)
  - `available` (boolean, default true)
  - `order_index` (integer)
  - `created_at`, `updated_at` (timestamptz)

  ### `buyer_choices`
  Choices made by buyers for their lots
  - `id` (uuid, primary key)
  - `buyer_id` (uuid, foreign key to buyers)
  - `lot_id` (uuid, foreign key to lots)
  - `material_option_id` (uuid, foreign key to material_options)
  - `quantity` (numeric, default 1)
  - `chosen_at` (timestamptz)
  - `locked` (boolean, default false) - Cannot be changed after deadline
  - `notes` (text, nullable)

  ### `buyer_change_requests`
  Requests for modifications beyond material choices
  - `id` (uuid, primary key)
  - `buyer_id` (uuid, foreign key to buyers)
  - `lot_id` (uuid, foreign key to lots)
  - `title` (text)
  - `description` (text)
  - `estimated_cost` (numeric, nullable)
  - `status` (enum: PENDING, UNDER_REVIEW, APPROVED, REJECTED, COMPLETED)
  - `submitted_at` (timestamptz)
  - `reviewed_at` (timestamptz, nullable)
  - `reviewed_by_id` (uuid, nullable, foreign key to users)
  - `review_notes` (text, nullable)
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Project team can manage catalogs
  - Buyers can view options and make choices for their lots
  - Only project team can approve change requests
*/

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'change_request_status') THEN
    CREATE TYPE change_request_status AS ENUM (
      'PENDING',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
      'COMPLETED'
    );
  END IF;
END $$;

-- =====================================================
-- 2. CREATE MATERIAL_CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS material_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_material_categories_project_id ON material_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_material_categories_order ON material_categories(project_id, order_index);

-- =====================================================
-- 3. CREATE MATERIAL_OPTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS material_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES material_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  manufacturer text,
  reference text,
  is_standard boolean DEFAULT false NOT NULL,
  price_delta numeric DEFAULT 0 NOT NULL,
  image_url text,
  technical_sheet_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  available boolean DEFAULT true NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_material_options_category_id ON material_options(category_id);
CREATE INDEX IF NOT EXISTS idx_material_options_available ON material_options(available);
CREATE INDEX IF NOT EXISTS idx_material_options_standard ON material_options(is_standard) WHERE is_standard = true;
CREATE INDEX IF NOT EXISTS idx_material_options_order ON material_options(category_id, order_index);

-- =====================================================
-- 4. CREATE BUYER_CHOICES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS buyer_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  material_option_id uuid NOT NULL REFERENCES material_options(id) ON DELETE CASCADE,
  quantity numeric DEFAULT 1 NOT NULL,
  chosen_at timestamptz DEFAULT now() NOT NULL,
  locked boolean DEFAULT false NOT NULL,
  notes text,
  CONSTRAINT unique_buyer_option_per_lot UNIQUE (buyer_id, lot_id, material_option_id)
);

CREATE INDEX IF NOT EXISTS idx_buyer_choices_buyer_id ON buyer_choices(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_choices_lot_id ON buyer_choices(lot_id);
CREATE INDEX IF NOT EXISTS idx_buyer_choices_option_id ON buyer_choices(material_option_id);

-- =====================================================
-- 5. CREATE BUYER_CHANGE_REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS buyer_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  estimated_cost numeric,
  status change_request_status DEFAULT 'PENDING' NOT NULL,
  submitted_at timestamptz DEFAULT now() NOT NULL,
  reviewed_at timestamptz,
  reviewed_by_id uuid REFERENCES users(id),
  review_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_buyer_change_requests_buyer_id ON buyer_change_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_change_requests_lot_id ON buyer_change_requests(lot_id);
CREATE INDEX IF NOT EXISTS idx_buyer_change_requests_status ON buyer_change_requests(status);

-- =====================================================
-- 6. ROW LEVEL SECURITY - MATERIAL_CATEGORIES
-- =====================================================

ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project participants can view categories" ON material_categories;
CREATE POLICY "Project participants can view categories"
  ON material_categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = material_categories.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM buyers b
      WHERE b.project_id = material_categories.project_id
        AND b.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = material_categories.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

DROP POLICY IF EXISTS "Project team can manage categories" ON material_categories;
CREATE POLICY "Project team can manage categories"
  ON material_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = material_categories.project_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.role IN ('EG', 'ARCHITECT')
        AND pp.status = 'ACTIVE'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_organizations uo
      JOIN user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN roles r ON r.id = ur.role_id
      JOIN projects p ON p.organization_id = uo.organization_id
      WHERE p.id = material_categories.project_id
        AND uo.user_id = auth.uid()
        AND r.name IN ('ADMIN', 'DEVELOPER')
    )
  );

-- =====================================================
-- 7. ROW LEVEL SECURITY - MATERIAL_OPTIONS
-- =====================================================

ALTER TABLE material_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Material options follow category access" ON material_options;
CREATE POLICY "Material options follow category access"
  ON material_options
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM material_categories WHERE id = material_options.category_id
    )
  );

-- =====================================================
-- 8. ROW LEVEL SECURITY - BUYER_CHOICES
-- =====================================================

ALTER TABLE buyer_choices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can manage their own choices" ON buyer_choices;
CREATE POLICY "Buyers can manage their own choices"
  ON buyer_choices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyers b
      WHERE b.id = buyer_choices.buyer_id
        AND b.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM buyers b
      JOIN project_participants pp ON pp.project_id = b.project_id
      WHERE b.id = buyer_choices.buyer_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
  );

-- =====================================================
-- 9. ROW LEVEL SECURITY - BUYER_CHANGE_REQUESTS
-- =====================================================

ALTER TABLE buyer_change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can view and create their change requests" ON buyer_change_requests;
CREATE POLICY "Buyers can view and create their change requests"
  ON buyer_change_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyers b
      WHERE b.id = buyer_change_requests.buyer_id
        AND b.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM buyers b
      JOIN project_participants pp ON pp.project_id = b.project_id
      WHERE b.id = buyer_change_requests.buyer_id
        AND (pp.user_id = auth.uid() OR pp.contact_id IN (
          SELECT c.id FROM contacts c WHERE c.email = (SELECT email FROM users WHERE id = auth.uid())
        ))
        AND pp.status = 'ACTIVE'
    )
  );

-- =====================================================
-- 10. UPDATE TIMESTAMP TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_choices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_material_categories_updated_at ON material_categories;
CREATE TRIGGER trigger_update_material_categories_updated_at
  BEFORE UPDATE ON material_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_choices_updated_at();

DROP TRIGGER IF EXISTS trigger_update_material_options_updated_at ON material_options;
CREATE TRIGGER trigger_update_material_options_updated_at
  BEFORE UPDATE ON material_options
  FOR EACH ROW
  EXECUTE FUNCTION update_choices_updated_at();

DROP TRIGGER IF EXISTS trigger_update_buyer_change_requests_updated_at ON buyer_change_requests;
CREATE TRIGGER trigger_update_buyer_change_requests_updated_at
  BEFORE UPDATE ON buyer_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_choices_updated_at();

-- =====================================================
-- 11. FUNCTION TO PREVENT LOCKED CHOICE CHANGES
-- =====================================================

CREATE OR REPLACE FUNCTION prevent_locked_choice_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.locked = true AND NEW.material_option_id != OLD.material_option_id THEN
    RAISE EXCEPTION 'Cannot change locked buyer choice';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_locked_changes ON buyer_choices;
CREATE TRIGGER trigger_prevent_locked_changes
  BEFORE UPDATE ON buyer_choices
  FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_choice_changes();
