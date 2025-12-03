/*
  # Advanced Modules: Chat Multilingual & Mobile Mode

  1. Enhancements to Existing Tables
    - Add `body_lang` column to messages table (for multilingual support)
    - Add context fields to message_threads if missing

  2. New Tables
    - `offline_actions` - Queue for offline mobile actions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `device_id` (text)
      - `action_type` (text)
      - `action_url`, `action_method`, `action_body` (jsonb)
      - `status` (enum: PENDING, PROCESSING, SUCCESS, FAILED)
      - `error_message`, `attempts`
      - `created_at`, `processed_at`

  3. Security
    - Enable RLS on offline_actions
    - Add policies for authenticated users

  4. Indexes
    - Performance indexes on foreign keys
*/

-- Add body_lang to messages if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'body_lang'
  ) THEN
    ALTER TABLE messages ADD COLUMN body_lang text NOT NULL DEFAULT 'fr-CH';
    COMMENT ON COLUMN messages.body_lang IS 'Language code (fr-CH, de-CH, it-CH, en-GB)';
  END IF;
END $$;

-- Add organization_id to message_threads if not exists  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    
    -- Populate organization_id from project
    UPDATE message_threads mt
    SET organization_id = p.organization_id
    FROM projects p
    WHERE mt.project_id = p.id AND mt.organization_id IS NULL;
    
    -- Make it required
    ALTER TABLE message_threads ALTER COLUMN organization_id SET NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_message_threads_org ON message_threads(organization_id);
  END IF;
END $$;

-- Add missing context fields to message_threads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'lot_id'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN lot_id uuid REFERENCES lots(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns  
    WHERE table_name = 'message_threads' AND column_name = 'buyer_id'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN buyer_id uuid REFERENCES buyers(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'submission_id'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_threads' AND column_name = 'sav_ticket_id'
  ) THEN
    ALTER TABLE message_threads ADD COLUMN sav_ticket_id uuid REFERENCES sav_tickets(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create enum for offline action status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offline_action_status') THEN
    CREATE TYPE offline_action_status AS ENUM (
      'PENDING',
      'PROCESSING',
      'SUCCESS',
      'FAILED'
    );
  END IF;
END $$;

-- Create offline_actions table
CREATE TABLE IF NOT EXISTS offline_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  action_type text NOT NULL,
  action_url text NOT NULL,
  action_method text NOT NULL DEFAULT 'POST',
  action_body jsonb NOT NULL DEFAULT '{}'::jsonb,
  status offline_action_status NOT NULL DEFAULT 'PENDING',
  error_message text,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_lang ON messages(body_lang);
CREATE INDEX IF NOT EXISTS idx_message_threads_lot ON message_threads(lot_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_buyer ON message_threads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_submission ON message_threads(submission_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_sav ON message_threads(sav_ticket_id);
CREATE INDEX IF NOT EXISTS idx_offline_actions_user ON offline_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_actions_status ON offline_actions(status);
CREATE INDEX IF NOT EXISTS idx_offline_actions_device ON offline_actions(device_id);
CREATE INDEX IF NOT EXISTS idx_offline_actions_created ON offline_actions(created_at);

-- Enable Row Level Security
ALTER TABLE offline_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for offline_actions
CREATE POLICY "Users can view their own offline actions"
  ON offline_actions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own offline actions"
  ON offline_actions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own offline actions"
  ON offline_actions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own offline actions"
  ON offline_actions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Helper function to cleanup old processed offline actions
CREATE OR REPLACE FUNCTION cleanup_old_offline_actions(days_to_keep integer DEFAULT 30)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM offline_actions
  WHERE status IN ('SUCCESS', 'FAILED')
    AND processed_at < now() - (days_to_keep || ' days')::interval;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get message thread with stats
CREATE OR REPLACE FUNCTION get_thread_stats(thread_uuid uuid)
RETURNS TABLE (
  thread_id uuid,
  message_count bigint,
  last_message_at timestamptz,
  last_author_id uuid,
  unread_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    COUNT(m.id),
    MAX(m.created_at),
    (SELECT author_id FROM messages WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1),
    COUNT(m.id) FILTER (WHERE tp.last_read_at IS NULL OR m.created_at > tp.last_read_at) AS unread
  FROM message_threads t
  LEFT JOIN messages m ON m.thread_id = t.id
  LEFT JOIN thread_participants tp ON tp.thread_id = t.id AND tp.user_id = auth.uid()
  WHERE t.id = thread_uuid
  GROUP BY t.id, tp.last_read_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE offline_actions IS 'Queue pour actions offline en mode mobile/chantier';
COMMENT ON COLUMN offline_actions.action_type IS 'Type: CREATE_SAV, CREATE_DIARY_ENTRY, UPLOAD_PHOTO, etc.';
COMMENT ON COLUMN offline_actions.device_id IS 'ID unique de l''appareil pour déduplication';
COMMENT ON COLUMN messages.body_lang IS 'Code langue du message (fr-CH, de-CH, it-CH, en-GB)';
