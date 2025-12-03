/*
  # Fix Remaining RLS Performance Issues - Batch 2 (Fixed)

  ## Changes
  - Optimize RLS policies for message_threads, messages, material_categories, subscriptions, payment_methods
*/

-- Message Threads
DROP POLICY IF EXISTS "Users can view threads in their projects" ON public.message_threads;
CREATE POLICY "Users can view threads in their projects"
  ON public.message_threads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = message_threads.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Messages
DROP POLICY IF EXISTS "Users can view messages in accessible threads" ON public.messages;
CREATE POLICY "Users can view messages in accessible threads"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      JOIN public.projects p ON p.id = mt.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE mt.id = messages.thread_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Material Categories
DROP POLICY IF EXISTS "Project participants can view categories" ON public.material_categories;
CREATE POLICY "Project participants can view categories"
  ON public.material_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = material_categories.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage categories" ON public.material_categories;
CREATE POLICY "Project team can manage categories"
  ON public.material_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = material_categories.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Subscriptions
DROP POLICY IF EXISTS "Users can view their organization subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their organization subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = subscriptions.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      JOIN public.user_roles ur ON ur.user_id = uo.user_id AND ur.organization_id = uo.organization_id
      JOIN public.roles r ON r.id = ur.role_id
      WHERE uo.organization_id = subscriptions.organization_id
      AND uo.user_id = (select auth.uid())
      AND r.name = 'ADMIN'
    )
  );

-- Subscription Invoices
DROP POLICY IF EXISTS "Users can view their organization invoices" ON public.subscription_invoices;
CREATE POLICY "Users can view their organization invoices"
  ON public.subscription_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions s
      JOIN public.user_organizations uo ON uo.organization_id = s.organization_id
      WHERE s.id = subscription_invoices.subscription_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Payment Methods
DROP POLICY IF EXISTS "Users can view their organization payment methods" ON public.payment_methods;
CREATE POLICY "Users can view their organization payment methods"
  ON public.payment_methods FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = payment_methods.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Datatrans Customers
DROP POLICY IF EXISTS "Users can view their organization datatrans data" ON public.datatrans_customers;
CREATE POLICY "Users can view their organization datatrans data"
  ON public.datatrans_customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = datatrans_customers.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );

-- Datatrans Transactions (check if organization_id exists)
DROP POLICY IF EXISTS "Users can view their organization transactions" ON public.datatrans_transactions;
CREATE POLICY "Users can view their organization transactions"
  ON public.datatrans_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations
      WHERE user_organizations.organization_id = datatrans_transactions.organization_id
      AND user_organizations.user_id = (select auth.uid())
    )
  );
