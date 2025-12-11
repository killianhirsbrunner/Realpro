/*
  # Add subscription insert policy for trial creation

  This migration adds an RLS policy that allows users to create a subscription
  for their own organization during the sign-up process.

  ## Changes
  - Add INSERT policy on subscriptions table for authenticated users
  - Users can only create subscriptions for organizations they belong to
*/

-- Policy for creating subscriptions (needed for trial creation)
CREATE POLICY "Users can create subscriptions for their organization"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = subscriptions.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );
