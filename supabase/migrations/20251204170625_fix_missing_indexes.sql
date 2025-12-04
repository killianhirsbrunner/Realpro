/*
  # Add Missing Indexes on Foreign Keys

  1. Performance Improvements
    - Add 12 missing indexes on foreign keys
    - Remove 1 duplicate index

  2. Changes
    - Indexes for act_versions, construction_photos, documents, etc.
    - Drop duplicate documents.tags index
*/

-- Add missing indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_act_versions_uploaded_by
  ON act_versions(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_construction_photos_uploaded_by
  ON construction_photos(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_documents_contract_id
  ON documents(contract_id);

CREATE INDEX IF NOT EXISTS idx_generated_documents_generated_by
  ON generated_documents(generated_by);

CREATE INDEX IF NOT EXISTS idx_message_attachments_uploaded_by
  ON message_attachments(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_notary_documents_uploaded_by
  ON notary_documents(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_notary_documents_verified_by
  ON notary_documents(verified_by);

CREATE INDEX IF NOT EXISTS idx_planning_tasks_responsible_user_id
  ON planning_tasks(responsible_user_id);

CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by
  ON user_invitations(invited_by);

CREATE INDEX IF NOT EXISTS idx_user_invitations_project_id
  ON user_invitations(project_id);

CREATE INDEX IF NOT EXISTS idx_user_invitations_role_id
  ON user_invitations(role_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_granted_by
  ON user_permissions(granted_by);

-- Remove duplicate index
DROP INDEX IF EXISTS documents_tags_idx;
