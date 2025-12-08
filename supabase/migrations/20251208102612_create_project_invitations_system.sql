/*
  # Système d'Invitations de Projet

  1. Nouvelles tables
    - `project_invitations`: Invitations sécurisées pour participants externes
    
  2. Modifications tables existantes
    - `project_participants`: Ajout user_id, invitation_id, access_level, permissions
    - `users`: Ajout user_type, primary_project_id
    
  3. Enum
    - `invitation_status`: PENDING, ACCEPTED, EXPIRED, REVOKED
    - `user_type`: INTERNAL, EXTERNAL, BUYER
    
  4. Sécurité
    - RLS activé sur project_invitations
    - Policies pour gérer les invitations
    - Isolation des accès par projet
    
  5. Index
    - Index sur token pour validation rapide
    - Index sur email pour recherche
    - Index sur status et expires_at
*/

-- Enum pour statut d'invitation
DO $$ BEGIN
  CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum pour type d'utilisateur
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('INTERNAL', 'EXTERNAL', 'BUYER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table des invitations de projet
CREATE TABLE IF NOT EXISTS project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Type d'invitation
  role participant_role NOT NULL,
  
  -- Destinataire
  email text NOT NULL,
  first_name text,
  last_name text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Token sécurisé (256 bits)
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  
  -- Statut
  status invitation_status NOT NULL DEFAULT 'PENDING',
  
  -- Qui a invité
  invited_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_at timestamptz NOT NULL DEFAULT now(),
  
  -- Acceptation
  accepted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  
  -- Message personnalisé
  message text,
  
  -- Permissions spécifiques (JSON)
  permissions jsonb DEFAULT '{}',
  
  -- Métadonnées
  metadata jsonb DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Améliorer table project_participants
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS invitation_id uuid REFERENCES project_invitations(id) ON DELETE SET NULL;
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'FULL'; -- FULL, READ_ONLY, LIMITED
ALTER TABLE project_participants ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{}';

-- Améliorer table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'INTERNAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_project_invitations_token ON project_invitations(token);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email ON project_invitations(email);
CREATE INDEX IF NOT EXISTS idx_project_invitations_project_id ON project_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_status ON project_invitations(status);
CREATE INDEX IF NOT EXISTS idx_project_invitations_expires_at ON project_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_project_participants_user_id ON project_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_primary_project_id ON users(primary_project_id);

-- RLS pour project_invitations
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Les admins de l'organisation peuvent gérer les invitations
CREATE POLICY "Organization admins can manage invitations"
  ON project_invitations FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Les invités peuvent voir leurs propres invitations
CREATE POLICY "Invitees can view their invitations"
  ON project_invitations FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_project_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_invitations_updated_at
  BEFORE UPDATE ON project_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_project_invitations_updated_at();

-- Fonction pour générer un token sécurisé
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- RLS amélioré pour project_participants (filtrer par user_id)
DROP POLICY IF EXISTS "Users see only their projects" ON project_participants;

CREATE POLICY "Users see their project participations"
  ON project_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    project_id IN (
      SELECT pp.project_id FROM project_participants pp WHERE pp.user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT p.id FROM projects p WHERE p.organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- RLS pour projects (accès basé sur participation)
DROP POLICY IF EXISTS "Access to projects based on role" ON projects;

CREATE POLICY "Access to projects based on role"
  ON projects FOR SELECT
  TO authenticated
  USING (
    -- Owner de l'organisation
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
    OR
    -- Participant au projet
    id IN (
      SELECT project_id FROM project_participants WHERE user_id = auth.uid()
    )
  );

-- Fonction pour marquer les invitations expirées
CREATE OR REPLACE FUNCTION mark_expired_invitations()
RETURNS void AS $$
BEGIN
  UPDATE project_invitations
  SET status = 'EXPIRED'
  WHERE status = 'PENDING'
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires pour documentation
COMMENT ON TABLE project_invitations IS 'Invitations sécurisées pour participants de projet (courtiers, architectes, etc.)';
COMMENT ON COLUMN project_invitations.token IS 'Token unique et sécurisé pour accepter l''invitation (base64, 32 bytes)';
COMMENT ON COLUMN project_participants.access_level IS 'Niveau d''accès: FULL, READ_ONLY, LIMITED';
COMMENT ON COLUMN project_participants.permissions IS 'Permissions granulaires spécifiques (JSON)';
COMMENT ON COLUMN users.user_type IS 'Type d''utilisateur: INTERNAL (employé org), EXTERNAL (intervenant), BUYER (acheteur)';
COMMENT ON COLUMN users.primary_project_id IS 'Projet principal pour utilisateurs externes (redirection après login)';
