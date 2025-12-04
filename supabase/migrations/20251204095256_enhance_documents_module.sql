/*
  # Enhance Documents Module

  1. Enhancements
    - Add document status (draft, published, locked)
    - Add visibility/permission fields
    - Add entity linking (lot_id, buyer_id, submission_id, etc.)
    - Add metadata for better organization
    - Improve version tracking
    - Add search optimization

  2. Indexes
    - Performance indexes for document queries
    - Full-text search support

  3. Functions
    - Initialize standard folder structure
    - Search documents
    - Get document tree
*/

-- Add new columns to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'locked', 'archived')),
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'internal' CHECK (visibility IN ('public', 'internal', 'restricted', 'private')),
ADD COLUMN IF NOT EXISTS lot_id uuid REFERENCES lots(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES buyers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS submission_id uuid REFERENCES submissions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);
CREATE INDEX IF NOT EXISTS idx_documents_lot ON documents(lot_id) WHERE lot_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_buyer ON documents(buyer_id) WHERE buyer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_submission ON documents(submission_id) WHERE submission_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING gin(tags);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('french', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('french', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('french', COALESCE(NEW.tags::text, '')), 'C');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_document_search ON documents;
CREATE TRIGGER trigger_update_document_search
BEFORE INSERT OR UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_document_search_vector();

-- Function to initialize standard folder structure for a project
CREATE OR REPLACE FUNCTION initialize_project_folders(
  p_project_id uuid,
  p_created_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_folder_names text[] := ARRAY[
    '01 - Juridique',
    '02 - Plans',
    '03 - Contrats',
    '04 - Soumissions',
    '05 - Commercial',
    '06 - Dossiers acheteurs',
    '07 - Chantier / PV',
    '08 - Photos',
    '09 - Comptabilité',
    '10 - Documents divers'
  ];
  v_folder_name text;
BEGIN
  FOREACH v_folder_name IN ARRAY v_folder_names
  LOOP
    INSERT INTO documents (
      project_id,
      name,
      is_folder,
      category,
      status,
      visibility,
      uploaded_by,
      version_number
    ) VALUES (
      p_project_id,
      v_folder_name,
      true,
      'DOCUMENT',
      'published',
      'internal',
      p_created_by,
      1
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

-- Function to search documents with full-text search
CREATE OR REPLACE FUNCTION search_documents(
  p_project_id uuid,
  p_query text,
  p_tags text[] DEFAULT NULL,
  p_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category text,
  file_url text,
  tags jsonb,
  rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.description,
    d.category::text,
    d.file_url,
    d.tags,
    ts_rank(d.search_vector, to_tsquery('french', p_query)) as rank
  FROM documents d
  WHERE d.project_id = p_project_id
  AND d.is_folder = false
  AND d.search_vector @@ to_tsquery('french', p_query)
  AND (p_tags IS NULL OR d.tags ?| p_tags)
  AND (p_category IS NULL OR d.category::text = p_category)
  ORDER BY rank DESC;
END;
$$;

-- Function to get document tree structure
CREATE OR REPLACE FUNCTION get_document_tree(
  p_project_id uuid,
  p_parent_folder_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  is_folder boolean,
  file_type text,
  file_size bigint,
  created_at timestamptz,
  updated_at timestamptz,
  uploaded_by_name text,
  child_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.is_folder,
    d.file_type,
    d.file_size,
    d.created_at,
    d.updated_at,
    u.first_name || ' ' || u.last_name as uploaded_by_name,
    (
      SELECT COUNT(*)
      FROM documents child
      WHERE child.parent_folder_id = d.id
    ) as child_count
  FROM documents d
  LEFT JOIN users u ON u.id = d.uploaded_by
  WHERE d.project_id = p_project_id
  AND (
    (p_parent_folder_id IS NULL AND d.parent_folder_id IS NULL)
    OR
    (d.parent_folder_id = p_parent_folder_id)
  )
  ORDER BY d.is_folder DESC, d.name ASC;
END;
$$;

-- Update document_versions table if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_versions' 
    AND column_name = 'file_type'
  ) THEN
    ALTER TABLE document_versions
    ADD COLUMN file_type text,
    ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add RLS policy for document visibility
CREATE POLICY "Users can view documents based on visibility"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_participants pp
      WHERE pp.project_id = documents.project_id
      AND pp.user_id = auth.uid()
    )
    AND (
      visibility = 'public'
      OR visibility = 'internal'
      OR (visibility = 'private' AND uploaded_by = auth.uid())
      OR (visibility = 'restricted' AND (
        (buyer_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM buyers b
          WHERE b.id = documents.buyer_id
          AND b.user_id = auth.uid()
        ))
        OR uploaded_by = auth.uid()
      ))
    )
  );

-- Trigger to auto-link documents based on tags
CREATE OR REPLACE FUNCTION auto_link_document()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If document has lot tag, try to link it
  IF NEW.tags ? 'lot' THEN
    UPDATE documents
    SET lot_id = (
      SELECT id FROM lots
      WHERE project_id = NEW.project_id
      AND code = NEW.tags->>'lot'
      LIMIT 1
    )
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_link_document ON documents;
CREATE TRIGGER trigger_auto_link_document
AFTER INSERT OR UPDATE OF tags ON documents
FOR EACH ROW
EXECUTE FUNCTION auto_link_document();
