/*
  # Communication Module

  ## Overview
  This migration creates the communication module for threads, messages, and notifications.
  Note: message_threads, messages, and notifications tables already exist from previous migrations.
  This migration enhances them with additional features.

  ## Modified Tables

  ### `message_threads` (already exists, add columns if needed)
  - Add `is_archived` (boolean)
  - Add `priority` (enum: LOW, NORMAL, HIGH, URGENT)

  ### `messages` (already exists, verify structure)
  - Ensure all required fields exist

  ### `notifications` (already exists, add columns if needed)
  - Add `priority` (enum: LOW, NORMAL, HIGH, URGENT)
  - Add `action_url` (text)

  ## New Tables

  ### `thread_participants`
  Users participating in a thread
  - `id` (uuid, primary key)
  - `thread_id` (uuid, foreign key to message_threads)
  - `user_id` (uuid, foreign key to users)
  - `role` (enum: OWNER, MEMBER, OBSERVER)
  - `joined_at` (timestamptz)
  - `last_read_at` (timestamptz, nullable)
  - `is_muted` (boolean, default false)

  ### `message_reactions`
  Emoji reactions to messages
  - `id` (uuid, primary key)
  - `message_id` (uuid, foreign key to messages)
  - `user_id` (uuid, foreign key to users)
  - `emoji` (text) - e.g., "👍", "❤️", "🎉"
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on new tables
  - Thread participants can access thread messages
  - Users can manage their own reactions
*/

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'thread_priority') THEN
    CREATE TYPE thread_priority AS ENUM (
      'LOW',
      'NORMAL',
      'HIGH',
      'URGENT'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'thread_participant_role') THEN
    CREATE TYPE thread_participant_role AS ENUM (
      'OWNER',
      'MEMBER',
      'OBSERVER'
    );
  END IF;
END $$;

-- =====================================================
-- 2. ENHANCE MESSAGE_THREADS TABLE
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'is_archived'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN is_archived boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'priority'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN priority thread_priority DEFAULT 'NORMAL' NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_message_threads_archived ON message_threads(is_archived);
CREATE INDEX IF NOT EXISTS idx_message_threads_priority ON message_threads(priority) WHERE priority != 'NORMAL';

-- =====================================================
-- 3. ENHANCE NOTIFICATIONS TABLE
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'priority'
  ) THEN
    ALTER TABLE notifications ADD COLUMN priority thread_priority DEFAULT 'NORMAL' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'action_url'
  ) THEN
    ALTER TABLE notifications ADD COLUMN action_url text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority) WHERE priority != 'NORMAL';

-- =====================================================
-- 4. CREATE THREAD_PARTICIPANTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role thread_participant_role DEFAULT 'MEMBER' NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  last_read_at timestamptz,
  is_muted boolean DEFAULT false NOT NULL,
  CONSTRAINT unique_thread_participant UNIQUE (thread_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_thread_participants_thread_id ON thread_participants(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_user_id ON thread_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_unread ON thread_participants(user_id, last_read_at);

-- =====================================================
-- 5. CREATE MESSAGE_REACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_emoji_per_message UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY - THREAD_PARTICIPANTS
-- =====================================================

ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view participants of their threads" ON thread_participants;
CREATE POLICY "Users can view participants of their threads"
  ON thread_participants
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_participants.thread_id
        AND tp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Thread owners can manage participants" ON thread_participants;
CREATE POLICY "Thread owners can manage participants"
  ON thread_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads mt
      WHERE mt.id = thread_participants.thread_id
        AND mt.created_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = thread_participants.thread_id
        AND tp.user_id = auth.uid()
        AND tp.role = 'OWNER'
    )
  );

-- =====================================================
-- 7. ROW LEVEL SECURITY - MESSAGE_REACTIONS
-- =====================================================

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view reactions on accessible messages" ON message_reactions;
CREATE POLICY "Users can view reactions on accessible messages"
  ON message_reactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_reactions.message_id
    )
  );

DROP POLICY IF EXISTS "Users can manage their own reactions" ON message_reactions;
CREATE POLICY "Users can manage their own reactions"
  ON message_reactions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 8. FUNCTION TO AUTO-ADD THREAD CREATOR AS OWNER
-- =====================================================

CREATE OR REPLACE FUNCTION auto_add_thread_creator_as_participant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO thread_participants (thread_id, user_id, role, joined_at)
  VALUES (NEW.id, NEW.created_by, 'OWNER', NEW.created_at)
  ON CONFLICT (thread_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_add_thread_creator ON message_threads;
CREATE TRIGGER trigger_auto_add_thread_creator
  AFTER INSERT ON message_threads
  FOR EACH ROW
  EXECUTE FUNCTION auto_add_thread_creator_as_participant();

-- =====================================================
-- 9. VIEW FOR THREADS WITH UNREAD COUNTS
-- =====================================================

CREATE OR REPLACE VIEW user_threads_with_unread AS
SELECT
  mt.*,
  tp.user_id,
  tp.role AS participant_role,
  tp.last_read_at,
  tp.is_muted,
  COALESCE(
    (SELECT COUNT(*)
     FROM messages m
     WHERE m.thread_id = mt.id
       AND (tp.last_read_at IS NULL OR m.created_at > tp.last_read_at)
    ), 0
  ) AS unread_count,
  (SELECT MAX(created_at) FROM messages WHERE thread_id = mt.id) AS last_message_at
FROM message_threads mt
INNER JOIN thread_participants tp ON tp.thread_id = mt.id
WHERE mt.is_archived = false;

-- Grant access to view
GRANT SELECT ON user_threads_with_unread TO authenticated;
