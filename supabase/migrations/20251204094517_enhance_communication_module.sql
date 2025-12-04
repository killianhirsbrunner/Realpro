/*
  # Enhance Communication & Collaboration Module

  1. New Tables
    - `message_reads`
      - Tracks read/unread status per user per message
      - Used for "unread message" indicators
      - One read record per user per message
    
    - `message_attachments`
      - Structured file attachments (better than JSONB)
      - Links to messages
      - Stores file metadata with previews

  2. Enhancements
    - Add indexes for performance
    - Add helper functions for unread counts
    - Add triggers for auto-notifications

  3. Security
    - RLS policies for read receipts
    - RLS policies for attachments
*/

-- Create message_reads table if not exists
CREATE TABLE IF NOT EXISTS message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  read_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  
  -- One read record per user per message
  UNIQUE(message_id, user_id)
);

-- Create message_attachments table if not exists
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  
  -- For image/document previews
  thumbnail_url text,
  mime_type text,
  
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_reads_user ON message_reads(user_id, read_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reads_message ON message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON message_attachments(message_id);

-- Enable Row Level Security
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reads
CREATE POLICY "Users can view their own read receipts"
  ON message_reads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark messages as read"
  ON message_reads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their read receipts"
  ON message_reads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for message_attachments
CREATE POLICY "Users can view attachments of accessible messages"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN message_threads mt ON mt.id = m.thread_id
      JOIN thread_participants tp ON tp.thread_id = mt.id
      WHERE m.id = message_attachments.message_id
      AND tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload attachments to their messages"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_attachments.message_id
      AND m.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own attachments"
  ON message_attachments FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Function to get unread message count for a user in a thread
CREATE OR REPLACE FUNCTION get_unread_count_for_thread(
  p_user_id uuid,
  p_thread_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM messages m
  WHERE m.thread_id = p_thread_id
  AND m.author_id != p_user_id
  AND NOT EXISTS (
    SELECT 1 FROM message_reads mr
    WHERE mr.message_id = m.id
    AND mr.user_id = p_user_id
  );
  
  RETURN COALESCE(v_count, 0);
END;
$$;

-- Function to mark all messages in a thread as read
CREATE OR REPLACE FUNCTION mark_thread_read(
  p_user_id uuid,
  p_thread_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO message_reads (message_id, user_id, read_at)
  SELECT m.id, p_user_id, now()
  FROM messages m
  WHERE m.thread_id = p_thread_id
  AND m.author_id != p_user_id
  AND NOT EXISTS (
    SELECT 1 FROM message_reads mr
    WHERE mr.message_id = m.id
    AND mr.user_id = p_user_id
  )
  ON CONFLICT (message_id, user_id) DO NOTHING;
END;
$$;

-- Function to notify thread participants of new messages
CREATE OR REPLACE FUNCTION notify_thread_participants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_thread message_threads%ROWTYPE;
  v_author users%ROWTYPE;
  v_participant RECORD;
BEGIN
  -- Get thread and author details
  SELECT * INTO v_thread FROM message_threads WHERE id = NEW.thread_id;
  SELECT * INTO v_author FROM users WHERE id = NEW.author_id;
  
  -- Notify all thread participants except the author
  FOR v_participant IN
    SELECT tp.user_id
    FROM thread_participants tp
    WHERE tp.thread_id = NEW.thread_id
    AND tp.user_id != NEW.author_id
    AND tp.is_muted = false
  LOOP
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      link_url
    ) VALUES (
      v_participant.user_id,
      'MESSAGE',
      v_author.first_name || ' ' || v_author.last_name || ' a envoyé un message',
      LEFT(NEW.content, 100),
      '/messages/' || NEW.thread_id
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Trigger to create notifications when new messages are posted
DROP TRIGGER IF EXISTS trigger_notify_thread_participants ON messages;
CREATE TRIGGER trigger_notify_thread_participants
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_thread_participants();

-- Update thread updated_at when new message is posted
CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE message_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_thread_timestamp ON messages;
CREATE TRIGGER trigger_update_thread_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_thread_timestamp();
