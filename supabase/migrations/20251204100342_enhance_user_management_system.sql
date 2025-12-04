/*
  # Enhance User Management System

  1. New Tables
    - `user_permissions` - Granular permissions per user
    - `user_sessions` - Active session tracking
    - `user_invitations` - Invitation system

  2. Enhanced Tables
    - Add fields to users table for 2FA, SSO, etc.

  3. Functions
    - Check user permissions
    - Log audit events
    - Manage user invitations
    - Get user activity

  4. Security
    - Enable RLS on all tables
*/

-- Add enhanced fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'two_factor_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN two_factor_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'two_factor_secret'
  ) THEN
    ALTER TABLE users ADD COLUMN two_factor_secret text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sso_provider'
  ) THEN
    ALTER TABLE users ADD COLUMN sso_provider text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sso_id'
  ) THEN
    ALTER TABLE users ADD COLUMN sso_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'ip_whitelist'
  ) THEN
    ALTER TABLE users ADD COLUMN ip_whitelist jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE users ADD COLUMN company_id uuid;
  END IF;
END $$;

-- User Permissions Table
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module text NOT NULL,
  permission_level text NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module, project_id)
);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_project ON user_permissions(project_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_mod ON user_permissions(module);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  last_activity_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_tok ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_exp ON user_sessions(expires_at);

-- User Invitations Table
CREATE TABLE IF NOT EXISTS user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role_id uuid REFERENCES roles(id),
  project_id uuid REFERENCES projects(id),
  invited_by uuid NOT NULL REFERENCES users(id),
  token text NOT NULL UNIQUE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_invitations_em ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_tok ON user_invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_invitations_st ON user_invitations(status);

-- Function: Check if user has permission
CREATE OR REPLACE FUNCTION check_user_permission(
  p_user_id uuid,
  p_module text,
  p_permission_level text,
  p_project_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_has_permission boolean;
  v_user_role text;
BEGIN
  -- Get user's primary role
  SELECT r.name INTO v_user_role
  FROM users u
  JOIN user_roles ur ON ur.user_id = u.id
  JOIN roles r ON r.id = ur.role_id
  WHERE u.id = p_user_id
  LIMIT 1;

  -- Admin has all permissions
  IF v_user_role = 'ADMIN' THEN
    RETURN true;
  END IF;

  -- Check granular permissions
  SELECT EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = p_user_id
    AND module = p_module
    AND (
      (p_permission_level = 'read' AND permission_level IN ('read', 'write', 'admin'))
      OR (p_permission_level = 'write' AND permission_level IN ('write', 'admin'))
      OR (p_permission_level = 'admin' AND permission_level = 'admin')
    )
    AND (project_id IS NULL OR project_id = p_project_id)
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO v_has_permission;

  RETURN COALESCE(v_has_permission, false);
END;
$$;

-- Function: Log audit event (using existing audit_logs table)
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid DEFAULT NULL,
  p_project_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id uuid;
  v_org_id uuid;
BEGIN
  -- Get organization_id if needed
  IF p_project_id IS NOT NULL THEN
    SELECT organization_id INTO v_org_id FROM projects WHERE id = p_project_id;
  END IF;

  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    project_id,
    organization_id,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_project_id,
    v_org_id,
    p_description,
    p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- Function: Get user activity
CREATE OR REPLACE FUNCTION get_user_activity(
  p_user_id uuid,
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  action text,
  entity_type text,
  entity_id uuid,
  project_id uuid,
  project_name text,
  description text,
  metadata jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.action,
    al.entity_type,
    al.entity_id,
    al.project_id,
    p.name as project_name,
    al.description,
    al.metadata,
    al.created_at
  FROM audit_logs al
  LEFT JOIN projects p ON p.id = al.project_id
  WHERE al.user_id = p_user_id
  ORDER BY al.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Function: Get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  company_name text,
  role_name text,
  is_active boolean,
  last_login_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM users u
    JOIN user_roles ur ON ur.user_id = u.id
    JOIN roles r ON r.id = ur.role_id
    WHERE u.id = auth.uid()
    AND r.name = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    c.name as company_name,
    r.name as role_name,
    COALESCE(u.is_active, true) as is_active,
    u.last_login_at,
    u.created_at
  FROM users u
  LEFT JOIN companies c ON c.id = u.company_id
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id
  ORDER BY u.created_at DESC;
END;
$$;

-- Function: Create user invitation
CREATE OR REPLACE FUNCTION create_user_invitation(
  p_email text,
  p_role_id uuid,
  p_project_id uuid DEFAULT NULL,
  p_invited_by uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_id uuid;
  v_token text;
BEGIN
  -- Generate unique token
  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO user_invitations (
    email,
    role_id,
    project_id,
    invited_by,
    token,
    expires_at
  ) VALUES (
    p_email,
    p_role_id,
    p_project_id,
    p_invited_by,
    v_token,
    now() + interval '7 days'
  )
  RETURNING id INTO v_invitation_id;

  -- Log audit event
  PERFORM log_audit_event(
    p_invited_by,
    'user_invited',
    'user_invitation',
    v_invitation_id,
    p_project_id,
    jsonb_build_object('email', p_email, 'role_id', p_role_id),
    'User invitation created'
  );

  RETURN v_invitation_id;
END;
$$;

-- Enable RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_permissions
CREATE POLICY "Users view own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage permissions"
  ON user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- RLS Policies for user_sessions
CREATE POLICY "Users view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own sessions"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System create sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_invitations
CREATE POLICY "Users view sent invitations"
  ON user_invitations FOR SELECT
  TO authenticated
  USING (invited_by = auth.uid());

CREATE POLICY "Admins manage invitations"
  ON user_invitations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = auth.uid()
      AND r.name = 'ADMIN'
    )
  );

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_permissions_updated_at'
  ) THEN
    CREATE TRIGGER update_user_permissions_updated_at 
    BEFORE UPDATE ON user_permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_invitations_updated_at'
  ) THEN
    CREATE TRIGGER update_user_invitations_updated_at 
    BEFORE UPDATE ON user_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
