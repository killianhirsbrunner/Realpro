-- Module Exports PDF Professionnels
-- Système de génération et gestion de documents PDF professionnels

-- Table generated_documents
CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  title text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  generated_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_generated_docs_org ON generated_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_generated_docs_project ON generated_documents(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_generated_docs_type ON generated_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_generated_docs_created ON generated_documents(created_at DESC);

-- Table document_templates
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_type text NOT NULL,
  name text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_templates_org ON document_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_doc_templates_type ON document_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_doc_templates_default ON document_templates(organization_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- Policies for generated_documents
CREATE POLICY "Users can view organization documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents in own org"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
    AND generated_by = auth.uid()
  );

CREATE POLICY "Users can delete organization documents"
  ON generated_documents FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

-- Policies for document_templates
CREATE POLICY "Users can view organization templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create templates in own org"
  ON document_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update organization templates"
  ON document_templates FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete organization templates"
  ON document_templates FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT uo.organization_id
      FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_doc_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for document_templates
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_doc_templates_updated_at();
