/*
  # Communication Logs System

  This migration creates tables for logging all email and SMS communications.

  ## New Tables

  1. `email_logs`
     - Logs all emails sent through the system
     - Tracks delivery status and errors
     - Links to users and organizations

  2. `sms_logs`
     - Logs all SMS sent through the system
     - Tracks delivery status and errors
     - Links to users and organizations

  ## Security

  - RLS enabled
  - Admins can view all logs
  - Users can view their own sent messages
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  to_address text NOT NULL,
  cc_address text[],
  bcc_address text[],
  
  subject text NOT NULL,
  html_body text,
  text_body text,
  
  sent_by uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  
  status text NOT NULL CHECK (status IN (
    'queued',
    'sending',
    'sent',
    'failed',
    'bounced'
  )) DEFAULT 'queued',
  
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  
  provider_id text,
  provider_response jsonb,
  
  error_message text,
  
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_email_logs_sent_by ON email_logs(sent_by);
CREATE INDEX idx_email_logs_org ON email_logs(organization_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_to ON email_logs(to_address);
CREATE INDEX idx_email_logs_created ON email_logs(created_at);

CREATE TABLE IF NOT EXISTS sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  to_number text NOT NULL,
  message text NOT NULL,
  
  sent_by uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  
  status text NOT NULL CHECK (status IN (
    'queued',
    'sending',
    'sent',
    'delivered',
    'failed',
    'undelivered'
  )) DEFAULT 'queued',
  
  sent_at timestamptz,
  delivered_at timestamptz,
  
  provider_id text,
  provider_response jsonb,
  
  error_message text,
  
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_sms_logs_sent_by ON sms_logs(sent_by);
CREATE INDEX idx_sms_logs_org ON sms_logs(organization_id);
CREATE INDEX idx_sms_logs_status ON sms_logs(status);
CREATE INDEX idx_sms_logs_to ON sms_logs(to_number);
CREATE INDEX idx_sms_logs_created ON sms_logs(created_at);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view emails they sent"
  ON email_logs FOR SELECT
  TO authenticated
  USING (sent_by = auth.uid());

CREATE POLICY "Admins can view all emails in their organization"
  ON email_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = email_logs.organization_id
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert email logs"
  ON email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update email logs"
  ON email_logs FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can view SMS they sent"
  ON sms_logs FOR SELECT
  TO authenticated
  USING (sent_by = auth.uid());

CREATE POLICY "Admins can view all SMS in their organization"
  ON sms_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = sms_logs.organization_id
      AND r.name IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert SMS logs"
  ON sms_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update SMS logs"
  ON sms_logs FOR UPDATE
  TO authenticated
  USING (true);
