/*
  # Optimize RLS Policies - Core Modules

  1. Security Improvements
    - Optimize message_reads, message_attachments policies
    - Optimize user_permissions, user_sessions policies
    - Optimize documents, projects policies
    - Use (select auth.uid()) for better performance

  2. Changes
    - Update 10 policies across 6 tables
*/

-- message_reads policies
DROP POLICY IF EXISTS "Users can view their own read receipts" ON message_reads;
CREATE POLICY "Users can view their own read receipts"
  ON message_reads FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can mark messages as read" ON message_reads;
CREATE POLICY "Users can mark messages as read"
  ON message_reads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their read receipts" ON message_reads;
CREATE POLICY "Users can update their read receipts"
  ON message_reads FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- message_attachments policies
DROP POLICY IF EXISTS "Users can view attachments of accessible messages" ON message_attachments;
CREATE POLICY "Users can view attachments of accessible messages"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      INNER JOIN message_threads mt ON mt.id = m.thread_id
      INNER JOIN thread_participants tp ON tp.thread_id = mt.id
      WHERE tp.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can upload attachments to their messages" ON message_attachments;
CREATE POLICY "Users can upload attachments to their messages"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own attachments" ON message_attachments;
CREATE POLICY "Users can delete their own attachments"
  ON message_attachments FOR DELETE
  TO authenticated
  USING (uploaded_by = (select auth.uid()));

-- user_permissions policies
DROP POLICY IF EXISTS "Users view own permissions" ON user_permissions;
CREATE POLICY "Users view own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_sessions policies
DROP POLICY IF EXISTS "Users view own sessions" ON user_sessions;
CREATE POLICY "Users view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users delete own sessions" ON user_sessions;
CREATE POLICY "Users delete own sessions"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "System create sessions" ON user_sessions;
CREATE POLICY "System create sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- documents policies (simplified)
DROP POLICY IF EXISTS "Users can view documents based on visibility" ON documents;
CREATE POLICY "Users can view documents based on visibility"
  ON documents FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE uo.user_id = (select auth.uid())
    )
    OR
    (visibility = 'BUYER' AND buyer_id IN (
      SELECT id FROM buyers WHERE user_id = (select auth.uid())
    ))
  );

-- projects policies
DROP POLICY IF EXISTS "Users can access project reporting" ON projects;
CREATE POLICY "Users can access project reporting"
  ON projects FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = (select auth.uid())
    )
  );
