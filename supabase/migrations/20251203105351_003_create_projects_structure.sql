/*
  # Projects & Structure Schema
  
  ## Description
  Crée la structure hiérarchique des projets immobiliers :
  Projet → Bâtiments → Entrées → Étages → Lots
  
  ## Nouvelles tables
  
  ### `projects`
  - `id` (uuid, PK)
  - `organization_id` (uuid, FK) - Multi-tenant
  - `name` (text) - Nom du projet
  - `code` (text) - Code unique du projet
  - `description` (text)
  - `address` (text)
  - `city` (text)
  - `postal_code` (text)
  - `country` (text)
  - `status` (project_status) - PLANNING, CONSTRUCTION, SELLING, COMPLETED, ARCHIVED
  - `start_date`, `end_date` (date)
  - `total_surface` (numeric) - Surface totale m²
  - `total_volume` (numeric) - Volume m³
  - `image_url` (text) - Image principale
  - `settings` (jsonb) - Configuration projet (TVA, langues, etc.)
  - `created_by` (uuid, FK users)
  - `created_at`, `updated_at`
  
  ### `buildings`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `name` (text) - Ex: "Bâtiment A"
  - `code` (text) - Code bâtiment
  - `floors_count` (integer)
  - `total_lots` (integer)
  - `description` (text)
  - `created_at`, `updated_at`
  
  ### `entrances`
  - `id` (uuid, PK)
  - `building_id` (uuid, FK buildings)
  - `name` (text) - Ex: "Entrée 1"
  - `code` (text)
  - `created_at`, `updated_at`
  
  ### `floors`
  - `id` (uuid, PK)
  - `building_id` (uuid, FK buildings)
  - `entrance_id` (uuid, FK entrances) - Nullable
  - `level` (integer) - Niveau (-2, -1, 0, 1, 2...)
  - `name` (text) - Ex: "Rez-de-chaussée", "1er étage"
  - `created_at`, `updated_at`
  
  ### `lots`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK projects)
  - `building_id` (uuid, FK buildings)
  - `floor_id` (uuid, FK floors)
  - `code` (text) - Code lot unique dans le projet
  - `type` (lot_type) - APARTMENT, COMMERCIAL, PARKING, STORAGE, VILLA
  - `status` (lot_status) - AVAILABLE, RESERVED, OPTION, SOLD, DELIVERED
  - `rooms_count` (numeric) - Nombre de pièces
  - `surface_living` (numeric) - Surface habitable m²
  - `surface_terrace` (numeric) - Surface terrasse m²
  - `surface_balcony` (numeric) - Surface balcon m²
  - `surface_garden` (numeric) - Surface jardin m²
  - `surface_total` (numeric) - Surface totale m²
  - `price_base` (numeric) - Prix de base CHF
  - `price_extras` (numeric) - Prix des options CHF
  - `price_total` (numeric) - Prix total CHF
  - `orientation` (text) - Ex: "Sud-Ouest"
  - `has_elevator` (boolean)
  - `floor_level` (integer) - Niveau de l'étage
  - `metadata` (jsonb) - Données flexibles
  - `created_at`, `updated_at`
  
  ## Enums
  - `project_status`: PLANNING, CONSTRUCTION, SELLING, COMPLETED, ARCHIVED
  - `lot_type`: APARTMENT, COMMERCIAL, PARKING, STORAGE, VILLA, HOUSE
  - `lot_status`: AVAILABLE, RESERVED, OPTION, SOLD, DELIVERED
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Filtrage par organization_id via projects
  - Utilisateurs voient uniquement les projets de leurs organisations
  
  ## Index
  - Index sur organization_id, project_id, building_id pour performance
  - Index sur les codes et statuts pour recherches fréquentes
*/

-- Enums
CREATE TYPE project_status AS ENUM ('PLANNING', 'CONSTRUCTION', 'SELLING', 'COMPLETED', 'ARCHIVED');
CREATE TYPE lot_type AS ENUM ('APARTMENT', 'COMMERCIAL', 'PARKING', 'STORAGE', 'VILLA', 'HOUSE');
CREATE TYPE lot_status AS ENUM ('AVAILABLE', 'RESERVED', 'OPTION', 'SOLD', 'DELIVERED');

-- Table Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  description text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'CH',
  status project_status NOT NULL DEFAULT 'PLANNING',
  start_date date,
  end_date date,
  total_surface numeric(10,2),
  total_volume numeric(10,2),
  image_url text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_project_code_per_org UNIQUE (organization_id, code)
);

-- Table Buildings
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  floors_count integer DEFAULT 0,
  total_lots integer DEFAULT 0,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_building_code_per_project UNIQUE (project_id, code)
);

-- Table Entrances
CREATE TABLE IF NOT EXISTS entrances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_entrance_code_per_building UNIQUE (building_id, code)
);

-- Table Floors
CREATE TABLE IF NOT EXISTS floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  entrance_id uuid REFERENCES entrances(id) ON DELETE SET NULL,
  level integer NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Lots
CREATE TABLE IF NOT EXISTS lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  floor_id uuid REFERENCES floors(id) ON DELETE SET NULL,
  code text NOT NULL,
  type lot_type NOT NULL DEFAULT 'APARTMENT',
  status lot_status NOT NULL DEFAULT 'AVAILABLE',
  rooms_count numeric(3,1),
  surface_living numeric(10,2),
  surface_terrace numeric(10,2) DEFAULT 0,
  surface_balcony numeric(10,2) DEFAULT 0,
  surface_garden numeric(10,2) DEFAULT 0,
  surface_total numeric(10,2),
  price_base numeric(12,2),
  price_extras numeric(12,2) DEFAULT 0,
  price_total numeric(12,2),
  orientation text,
  has_elevator boolean DEFAULT false,
  floor_level integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_lot_code_per_project UNIQUE (project_id, code)
);

-- Index pour performance
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_code ON projects(code);
CREATE INDEX idx_buildings_project ON buildings(project_id);
CREATE INDEX idx_entrances_building ON entrances(building_id);
CREATE INDEX idx_floors_building ON floors(building_id);
CREATE INDEX idx_lots_project ON lots(project_id);
CREATE INDEX idx_lots_building ON lots(building_id);
CREATE INDEX idx_lots_floor ON lots(floor_id);
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_lots_type ON lots(type);

-- Triggers pour updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entrances_updated_at
  BEFORE UPDATE ON entrances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_floors_updated_at
  BEFORE UPDATE ON floors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lots_updated_at
  BEFORE UPDATE ON lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour Projects
CREATE POLICY "Users can view projects in their organizations"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects in their organizations"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = projects.organization_id
      AND p.name = 'projects.create'
    )
  );

CREATE POLICY "Users can update projects with permission"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = projects.organization_id
      AND p.name = 'projects.update'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = projects.organization_id
      AND p.name = 'projects.update'
    )
  );

-- RLS Policies pour Buildings (via projects)
CREATE POLICY "Users can view buildings in their projects"
  ON buildings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = buildings.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage buildings with permission"
  ON buildings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE p.id = buildings.project_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('projects.update', 'projects.create')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE p.id = buildings.project_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('projects.update', 'projects.create')
    )
  );

-- RLS Policies pour Entrances (via buildings)
CREATE POLICY "Users can view entrances in their projects"
  ON entrances FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buildings b
      JOIN projects p ON b.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE b.id = entrances.building_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage entrances with permission"
  ON entrances FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buildings b
      JOIN projects p ON b.project_id = p.id
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE b.id = entrances.building_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('projects.update', 'projects.create')
    )
  );

-- RLS Policies pour Floors (via buildings)
CREATE POLICY "Users can view floors in their projects"
  ON floors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buildings b
      JOIN projects p ON b.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE b.id = floors.building_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage floors with permission"
  ON floors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buildings b
      JOIN projects p ON b.project_id = p.id
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE b.id = floors.building_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('projects.update', 'projects.create')
    )
  );

-- RLS Policies pour Lots
CREATE POLICY "Users can view lots in their projects"
  ON lots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE p.id = lots.project_id
      AND uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage lots with permission"
  ON lots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE p.id = lots.project_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('lots.create', 'lots.update')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_roles ur ON p.organization_id = ur.organization_id
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions perm ON rp.permission_id = perm.id
      WHERE p.id = lots.project_id
      AND ur.user_id = auth.uid()
      AND perm.name IN ('lots.create', 'lots.update')
    )
  );