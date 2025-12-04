/*
  # Module Notaire - Gestion juridique et actes

  1. New Tables
    - `buyer_dossiers`
      - `id` (uuid, primary key)
      - `buyer_id` (uuid, foreign key to buyers)
      - `project_id` (uuid, foreign key to projects)
      - `status` (text) - incomplete / waiting_notary / act_v1 / act_v2 / final / signed
      - `missing_fields` (jsonb) - array of missing documents/info
      - `notary_id` (uuid, foreign key to users)
      - `sent_to_notary_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `act_versions`
      - `id` (uuid, primary key)
      - `buyer_id` (uuid, foreign key to buyers)
      - `dossier_id` (uuid, foreign key to buyer_dossiers)
      - `version_number` (integer)
      - `file_url` (text)
      - `file_name` (text)
      - `uploaded_by` (uuid, foreign key to users)
      - `uploaded_by_role` (text) - notary / promoter / admin
      - `notes` (text)
      - `created_at` (timestamptz)

    - `notary_messages`
      - `id` (uuid, primary key)
      - `buyer_id` (uuid, foreign key to buyers)
      - `dossier_id` (uuid, foreign key to buyer_dossiers)
      - `sender_id` (uuid, foreign key to users)
      - `content` (text)
      - `attachments` (jsonb)
      - `read_at` (timestamptz)
      - `created_at` (timestamptz)

    - `notary_documents`
      - `id` (uuid, primary key)
      - `dossier_id` (uuid, foreign key to buyer_dossiers)
      - `document_type` (text) - identity / income_proof / financing_proof / signature_power / other
      - `file_url` (text)
      - `file_name` (text)
      - `uploaded_by` (uuid, foreign key to users)
      - `verified_by` (uuid, foreign key to users)
      - `verified_at` (timestamptz)
      - `created_at` (timestamptz)

    - `signature_appointments`
      - `id` (uuid, primary key)
      - `dossier_id` (uuid, foreign key to buyer_dossiers)
      - `buyer_id` (uuid, foreign key to buyers)
      - `notary_id` (uuid, foreign key to users)
      - `scheduled_at` (timestamptz)
      - `location` (text)
      - `status` (text) - scheduled / confirmed / completed / cancelled
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on project access
*/

-- Create buyer_dossiers table
CREATE TABLE IF NOT EXISTS buyer_dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'waiting_notary', 'act_v1', 'act_v2', 'final', 'signed')),
  missing_fields jsonb DEFAULT '[]'::jsonb,
  notary_id uuid REFERENCES users(id) ON DELETE SET NULL,
  sent_to_notary_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create act_versions table
CREATE TABLE IF NOT EXISTS act_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  dossier_id uuid NOT NULL REFERENCES buyer_dossiers(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_by_role text NOT NULL CHECK (uploaded_by_role IN ('notary', 'promoter', 'admin')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create notary_messages table
CREATE TABLE IF NOT EXISTS notary_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  dossier_id uuid NOT NULL REFERENCES buyer_dossiers(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create notary_documents table
CREATE TABLE IF NOT EXISTS notary_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES buyer_dossiers(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('identity', 'income_proof', 'financing_proof', 'signature_power', 'other')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create signature_appointments table
CREATE TABLE IF NOT EXISTS signature_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES buyer_dossiers(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  notary_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buyer_dossiers_buyer ON buyer_dossiers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_dossiers_project ON buyer_dossiers(project_id);
CREATE INDEX IF NOT EXISTS idx_buyer_dossiers_notary ON buyer_dossiers(notary_id);
CREATE INDEX IF NOT EXISTS idx_buyer_dossiers_status ON buyer_dossiers(status);

CREATE INDEX IF NOT EXISTS idx_act_versions_buyer ON act_versions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_act_versions_dossier ON act_versions(dossier_id);

CREATE INDEX IF NOT EXISTS idx_notary_messages_buyer ON notary_messages(buyer_id);
CREATE INDEX IF NOT EXISTS idx_notary_messages_dossier ON notary_messages(dossier_id);
CREATE INDEX IF NOT EXISTS idx_notary_messages_sender ON notary_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_notary_documents_dossier ON notary_documents(dossier_id);

CREATE INDEX IF NOT EXISTS idx_signature_appointments_dossier ON signature_appointments(dossier_id);
CREATE INDEX IF NOT EXISTS idx_signature_appointments_buyer ON signature_appointments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_signature_appointments_notary ON signature_appointments(notary_id);

-- Enable RLS
ALTER TABLE buyer_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE act_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notary_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notary_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_appointments ENABLE ROW LEVEL SECURITY;

-- Policies for buyer_dossiers
CREATE POLICY "Users can view dossiers in their projects"
  ON buyer_dossiers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = buyer_dossiers.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create dossiers in their projects"
  ON buyer_dossiers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = buyer_dossiers.project_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update dossiers in their projects"
  ON buyer_dossiers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = buyer_dossiers.project_id
      AND pp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = buyer_dossiers.project_id
      AND pp.user_id = auth.uid()
    )
  );

-- Policies for act_versions
CREATE POLICY "Users can view act versions in their projects"
  ON act_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = act_versions.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create act versions in their projects"
  ON act_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = act_versions.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

-- Policies for notary_messages
CREATE POLICY "Users can view messages in their projects"
  ON notary_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = notary_messages.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their projects"
  ON notary_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = notary_messages.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

-- Policies for notary_documents
CREATE POLICY "Users can view documents in their projects"
  ON notary_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = notary_documents.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents in their projects"
  ON notary_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = notary_documents.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

-- Policies for signature_appointments
CREATE POLICY "Users can view appointments in their projects"
  ON signature_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = signature_appointments.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments in their projects"
  ON signature_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = signature_appointments.dossier_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update appointments in their projects"
  ON signature_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = signature_appointments.dossier_id
      AND pp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyer_dossiers bd
      JOIN project_participants pp ON pp.project_id = bd.project_id
      WHERE bd.id = signature_appointments.dossier_id
      AND pp.user_id = auth.uid()
    )
  );