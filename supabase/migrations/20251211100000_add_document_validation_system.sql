/*
  # Document Validation System

  Enrichit la table documents avec les champs de validation
  et cree les structures pour le workflow de validation.

  ## Nouvelles fonctionnalites
  - Statuts de validation (draft, pending_review, in_review, approved, rejected)
  - Historique des validations
  - Demandes de documents
  - Partage securise avec token

  ## Tables modifiees
  - documents: nouveaux champs validation et partage

  ## Nouvelles tables
  - document_validations: historique des actions
  - document_requests: demandes de documents
*/

-- 1. Enum pour les statuts de validation
DO $$ BEGIN
  CREATE TYPE document_validation_status AS ENUM (
    'draft',
    'pending_review',
    'in_review',
    'approved',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Ajouter les colonnes de validation a documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS validation_status document_validation_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS validation_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_deadline timestamptz,
ADD COLUMN IF NOT EXISTS validated_by uuid REFERENCES users(id),
ADD COLUMN IF NOT EXISTS validated_at timestamptz,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS workflow_instance_id uuid REFERENCES workflow_instances(id);

-- 3. Ajouter les colonnes de partage
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS share_token text UNIQUE,
ADD COLUMN IF NOT EXISTS share_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS share_password_hash text,
ADD COLUMN IF NOT EXISTS share_download_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS share_max_downloads integer;

-- 4. Ajouter les colonnes de contexte ameliorees
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS context_type text CHECK (context_type IN (
  'project', 'lot', 'buyer', 'submission', 'phase', 'contract', 'notary'
)),
ADD COLUMN IF NOT EXISTS context_id uuid;

-- 5. Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_documents_validation_status ON documents(validation_status);
CREATE INDEX IF NOT EXISTS idx_documents_validation_required ON documents(validation_required) WHERE validation_required = true;
CREATE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_context ON documents(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_documents_validation_deadline ON documents(validation_deadline) WHERE validation_deadline IS NOT NULL;

-- 6. Table pour l'historique des validations
CREATE TABLE IF NOT EXISTS document_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'revision_requested', 'reassigned')),
  performed_by uuid NOT NULL REFERENCES users(id),
  performed_at timestamptz DEFAULT now(),
  comment text,
  previous_status document_validation_status,
  new_status document_validation_status,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_validations_document ON document_validations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_validations_performed_by ON document_validations(performed_by);
CREATE INDEX IF NOT EXISTS idx_document_validations_action ON document_validations(action);
CREATE INDEX IF NOT EXISTS idx_document_validations_date ON document_validations(performed_at);

-- 7. Table pour les demandes de documents
CREATE TABLE IF NOT EXISTS document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES users(id),
  assigned_to uuid REFERENCES users(id),
  assigned_to_role text,
  assigned_to_external_email text,
  title text NOT NULL,
  description text,
  category document_category,
  context_type text,
  context_id uuid,
  due_date timestamptz,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'fulfilled', 'cancelled', 'overdue')),
  fulfilled_document_id uuid REFERENCES documents(id),
  fulfilled_at timestamptz,
  reminder_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_requests_project ON document_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_organization ON document_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_assigned ON document_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);
CREATE INDEX IF NOT EXISTS idx_document_requests_due_date ON document_requests(due_date) WHERE due_date IS NOT NULL;

-- 8. RLS pour les nouvelles tables
ALTER TABLE document_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir les validations des documents de leurs projets
CREATE POLICY "Users can view validations for accessible documents"
  ON document_validations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents d
      JOIN projects p ON d.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE d.id = document_validations.document_id
      AND uo.user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent creer des validations pour les documents de leurs projets
CREATE POLICY "Users can create validations for accessible documents"
  ON document_validations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents d
      JOIN projects p ON d.project_id = p.id
      JOIN user_organizations uo ON p.organization_id = uo.organization_id
      WHERE d.id = document_validations.document_id
      AND uo.user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent voir les demandes de leurs projets
CREATE POLICY "Users can view requests in their projects"
  ON document_requests FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent creer des demandes dans leurs projets
CREATE POLICY "Users can create requests in their projects"
  ON document_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent modifier les demandes de leurs projets
CREATE POLICY "Users can update requests in their projects"
  ON document_requests FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )
  );

-- 9. Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_document_requests_updated_at ON document_requests;
CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Fonction pour soumettre un document a validation
CREATE OR REPLACE FUNCTION submit_document_for_validation(
  p_document_id uuid,
  p_user_id uuid,
  p_validator_role text DEFAULT NULL,
  p_validator_user_id uuid DEFAULT NULL,
  p_deadline timestamptz DEFAULT NULL,
  p_comment text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_doc documents%ROWTYPE;
BEGIN
  -- Recuperer le document
  SELECT * INTO v_doc FROM documents WHERE id = p_document_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  -- Verifier qu'il est en draft ou rejected (peut etre resoumis)
  IF v_doc.validation_status NOT IN ('draft', 'rejected') THEN
    RAISE EXCEPTION 'Document must be in draft or rejected status to submit for validation';
  END IF;

  -- Mettre a jour le document
  UPDATE documents
  SET
    validation_status = 'pending_review',
    validation_required = true,
    validation_deadline = p_deadline,
    rejection_reason = NULL,
    updated_at = now()
  WHERE id = p_document_id;

  -- Logger l'action
  INSERT INTO document_validations (
    document_id, action, performed_by, comment, previous_status, new_status
  ) VALUES (
    p_document_id, 'submitted', p_user_id, p_comment, v_doc.validation_status, 'pending_review'
  );

  -- Creer une notification pour le validateur (si specifie)
  IF p_validator_user_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id, type, title, message, link_url
    ) VALUES (
      p_validator_user_id,
      'TASK',
      'Document a valider',
      'Un document requiert votre validation: ' || v_doc.name,
      '/projects/' || v_doc.project_id || '/documents?doc=' || p_document_id
    );
  END IF;

  RETURN p_document_id;
END;
$$;

-- 11. Fonction pour valider/rejeter un document
CREATE OR REPLACE FUNCTION validate_document(
  p_document_id uuid,
  p_user_id uuid,
  p_approved boolean,
  p_comment text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_doc documents%ROWTYPE;
  v_new_status document_validation_status;
  v_action text;
BEGIN
  SELECT * INTO v_doc FROM documents WHERE id = p_document_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  IF v_doc.validation_status NOT IN ('pending_review', 'in_review') THEN
    RAISE EXCEPTION 'Document is not pending validation';
  END IF;

  IF p_approved THEN
    v_new_status := 'approved';
    v_action := 'approved';
  ELSE
    v_new_status := 'rejected';
    v_action := 'rejected';

    IF p_comment IS NULL OR p_comment = '' THEN
      RAISE EXCEPTION 'Comment is required when rejecting a document';
    END IF;
  END IF;

  UPDATE documents
  SET
    validation_status = v_new_status,
    validated_by = p_user_id,
    validated_at = now(),
    rejection_reason = CASE WHEN NOT p_approved THEN p_comment ELSE NULL END,
    updated_at = now()
  WHERE id = p_document_id;

  INSERT INTO document_validations (
    document_id, action, performed_by, comment, previous_status, new_status
  ) VALUES (
    p_document_id, v_action, p_user_id, p_comment, v_doc.validation_status, v_new_status
  );

  -- Notifier l'auteur du document
  IF v_doc.uploaded_by IS NOT NULL THEN
    INSERT INTO notifications (
      user_id, type, title, message, link_url
    ) VALUES (
      v_doc.uploaded_by,
      CASE WHEN p_approved THEN 'SYSTEM' ELSE 'TASK' END,
      CASE WHEN p_approved THEN 'Document valide' ELSE 'Document refuse' END,
      CASE WHEN p_approved
        THEN 'Votre document "' || v_doc.name || '" a ete valide.'
        ELSE 'Votre document "' || v_doc.name || '" a ete refuse. Motif: ' || p_comment
      END,
      '/projects/' || v_doc.project_id || '/documents?doc=' || p_document_id
    );
  END IF;

  RETURN p_document_id;
END;
$$;

-- 12. Fonction pour creer un lien de partage
CREATE OR REPLACE FUNCTION create_document_share_link(
  p_document_id uuid,
  p_user_id uuid,
  p_expires_in_days integer DEFAULT 7,
  p_max_downloads integer DEFAULT NULL,
  p_password text DEFAULT NULL
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token text;
  v_doc documents%ROWTYPE;
BEGIN
  SELECT * INTO v_doc FROM documents WHERE id = p_document_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  -- Generer un token unique
  v_token := encode(gen_random_bytes(32), 'hex');

  UPDATE documents
  SET
    share_token = v_token,
    share_expires_at = now() + (p_expires_in_days || ' days')::interval,
    share_max_downloads = p_max_downloads,
    share_password_hash = CASE
      WHEN p_password IS NOT NULL THEN crypt(p_password, gen_salt('bf'))
      ELSE NULL
    END,
    share_download_count = 0,
    updated_at = now()
  WHERE id = p_document_id;

  RETURN v_token;
END;
$$;

-- 13. Fonction pour verifier et incrementer le compteur de telechargement
CREATE OR REPLACE FUNCTION verify_share_link(
  p_token text,
  p_password text DEFAULT NULL
) RETURNS TABLE (
  document_id uuid,
  file_url text,
  name text,
  is_valid boolean,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_doc documents%ROWTYPE;
BEGIN
  SELECT * INTO v_doc FROM documents WHERE share_token = p_token;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false, 'Invalid share link';
    RETURN;
  END IF;

  -- Verifier l'expiration
  IF v_doc.share_expires_at < now() THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false, 'Share link has expired';
    RETURN;
  END IF;

  -- Verifier le nombre max de telechargements
  IF v_doc.share_max_downloads IS NOT NULL AND v_doc.share_download_count >= v_doc.share_max_downloads THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false, 'Maximum downloads reached';
    RETURN;
  END IF;

  -- Verifier le mot de passe si requis
  IF v_doc.share_password_hash IS NOT NULL THEN
    IF p_password IS NULL OR v_doc.share_password_hash != crypt(p_password, v_doc.share_password_hash) THEN
      RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false, 'Invalid password';
      RETURN;
    END IF;
  END IF;

  -- Incrementer le compteur
  UPDATE documents
  SET share_download_count = share_download_count + 1
  WHERE id = v_doc.id;

  RETURN QUERY SELECT v_doc.id, v_doc.file_url, v_doc.name, true, NULL::text;
END;
$$;

-- 14. Fonction pour obtenir les documents en attente de validation pour un projet
CREATE OR REPLACE FUNCTION get_pending_validations(
  p_project_id uuid
) RETURNS TABLE (
  id uuid,
  name text,
  category document_category,
  validation_status document_validation_status,
  validation_deadline timestamptz,
  uploaded_by uuid,
  uploaded_by_name text,
  created_at timestamptz,
  days_pending integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.name,
    d.category,
    d.validation_status,
    d.validation_deadline,
    d.uploaded_by,
    COALESCE(u.first_name || ' ' || u.last_name, 'Utilisateur inconnu') as uploaded_by_name,
    d.created_at,
    EXTRACT(DAY FROM now() - d.created_at)::integer as days_pending
  FROM documents d
  LEFT JOIN users u ON d.uploaded_by = u.id
  WHERE d.project_id = p_project_id
  AND d.validation_status IN ('pending_review', 'in_review')
  ORDER BY
    CASE WHEN d.validation_deadline IS NOT NULL THEN 0 ELSE 1 END,
    d.validation_deadline ASC NULLS LAST,
    d.created_at ASC;
END;
$$;

-- 15. Vue pour les statistiques de validation par projet
CREATE OR REPLACE VIEW document_validation_stats AS
SELECT
  d.project_id,
  COUNT(*) FILTER (WHERE d.validation_status = 'draft') as draft_count,
  COUNT(*) FILTER (WHERE d.validation_status = 'pending_review') as pending_count,
  COUNT(*) FILTER (WHERE d.validation_status = 'in_review') as reviewing_count,
  COUNT(*) FILTER (WHERE d.validation_status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE d.validation_status = 'rejected') as rejected_count,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE d.validation_deadline < now() AND d.validation_status IN ('pending_review', 'in_review')) as overdue_count
FROM documents d
WHERE d.is_folder = false
GROUP BY d.project_id;

-- 16. Ajouter le type document_validation au workflow engine (si la colonne existe)
DO $$
BEGIN
  -- Mettre a jour le CHECK constraint si necessaire
  -- Cette partie est conditionnelle car le workflow engine peut ne pas exister
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workflow_definitions') THEN
    -- Le workflow_type check sera mis a jour manuellement si necessaire
    NULL;
  END IF;
END $$;

-- 17. Commentaires sur les tables
COMMENT ON TABLE document_validations IS 'Historique des actions de validation sur les documents';
COMMENT ON TABLE document_requests IS 'Demandes de documents entre intervenants';
COMMENT ON COLUMN documents.validation_status IS 'Statut de validation: draft, pending_review, in_review, approved, rejected';
COMMENT ON COLUMN documents.share_token IS 'Token unique pour le partage public temporaire';
