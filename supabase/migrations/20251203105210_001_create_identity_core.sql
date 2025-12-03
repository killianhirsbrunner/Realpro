/*
  # Identity & Multi-tenant Core Schema
  
  ## Description
  Cette migration crée le cœur du système multi-tenant avec gestion des organisations,
  utilisateurs, rôles et permissions. Support i18n intégré.
  
  ## Nouvelles tables
  
  ### `organizations`
  - `id` (uuid, PK) - Identifiant unique de l'organisation (tenant)
  - `name` (text) - Nom de l'organisation
  - `slug` (text, unique) - Slug URL-friendly
  - `default_language` (language_code) - Langue par défaut de l'organisation
  - `logo_url` (text) - URL du logo
  - `settings` (jsonb) - Configuration flexible
  - `created_at`, `updated_at` - Timestamps
  
  ### `users`
  - `id` (uuid, PK) - Référence auth.users
  - `email` (text, unique) - Email de l'utilisateur
  - `first_name`, `last_name` (text) - Nom complet
  - `language` (language_code) - Langue préférée de l'utilisateur
  - `avatar_url` (text) - URL de l'avatar
  - `phone` (text) - Téléphone
  - `is_active` (boolean) - Compte actif/désactivé
  - `last_login_at` (timestamptz) - Dernière connexion
  - `created_at`, `updated_at` - Timestamps
  
  ### `user_organizations`
  - Relation many-to-many entre users et organizations
  - `user_id` (uuid, FK users)
  - `organization_id` (uuid, FK organizations)
  - `is_default` (boolean) - Organisation par défaut pour l'utilisateur
  - `joined_at` (timestamptz)
  
  ### `roles`
  - `id` (uuid, PK)
  - `name` (text, unique) - Nom technique du rôle
  - `label` (jsonb) - Labels i18n {fr, de, en, it}
  - `description` (jsonb) - Descriptions i18n
  - `is_system` (boolean) - Rôle système non modifiable
  - `created_at`, `updated_at`
  
  ### `permissions`
  - `id` (uuid, PK)
  - `resource` (text) - Ressource (ex: 'projects', 'lots')
  - `action` (text) - Action (ex: 'read', 'create', 'update', 'delete')
  - `name` (text, unique) - Nom complet (ex: 'projects.read')
  - `description` (jsonb) - Descriptions i18n
  - `created_at`
  
  ### `role_permissions`
  - Relation many-to-many entre roles et permissions
  - `role_id` (uuid, FK roles)
  - `permission_id` (uuid, FK permissions)
  
  ### `user_roles`
  - Attribution de rôles aux utilisateurs dans une organisation
  - `id` (uuid, PK)
  - `user_id` (uuid, FK users)
  - `organization_id` (uuid, FK organizations)
  - `role_id` (uuid, FK roles)
  - `assigned_at` (timestamptz)
  - `assigned_by` (uuid, FK users)
  
  ## Enums
  - `language_code`: FR, DE, EN, IT
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Policies restrictives par défaut
  - Accès basé sur l'appartenance à l'organisation
  - Les utilisateurs ne voient que leurs propres données et celles de leurs organisations
  
  ## Index
  - Index sur les clés étrangères
  - Index sur les champs de recherche fréquents
  - Index composites pour les requêtes multi-tenant
*/

-- Enum pour les langues supportées
CREATE TYPE language_code AS ENUM ('FR', 'DE', 'EN', 'IT');

-- Table Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  default_language language_code NOT NULL DEFAULT 'FR',
  logo_url text,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  language language_code NOT NULL DEFAULT 'FR',
  avatar_url text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table User Organizations (relation many-to-many)
CREATE TABLE IF NOT EXISTS user_organizations (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  is_default boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, organization_id)
);

-- Table Roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  label jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb DEFAULT '{}'::jsonb,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL,
  action text NOT NULL,
  name text UNIQUE NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_resource_action UNIQUE (resource, action)
);

-- Table Role Permissions (relation many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Table User Roles (attribution contextualisée par organisation)
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid REFERENCES users(id),
  CONSTRAINT unique_user_org_role UNIQUE (user_id, organization_id, role_id)
);

-- Index pour performance
CREATE INDEX idx_user_organizations_user ON user_organizations(user_id);
CREATE INDEX idx_user_organizations_org ON user_organizations(organization_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Fonction trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour Organizations
CREATE POLICY "Users can view organizations they belong to"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = organizations.id
      AND user_organizations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their organization details"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = organizations.id
      AND p.name = 'organizations.update'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = organizations.id
      AND p.name = 'organizations.update'
    )
  );

-- RLS Policies pour Users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view other users in same organization"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo1
      JOIN user_organizations uo2 ON uo1.organization_id = uo2.organization_id
      WHERE uo1.user_id = auth.uid()
      AND uo2.user_id = users.id
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies pour User Organizations
CREATE POLICY "Users can view their organization memberships"
  ON user_organizations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies pour Roles (lecture publique pour authenticated)
CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies pour Permissions (lecture publique pour authenticated)
CREATE POLICY "Authenticated users can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies pour Role Permissions (lecture publique pour authenticated)
CREATE POLICY "Authenticated users can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies pour User Roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view roles in their organizations"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = user_roles.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );