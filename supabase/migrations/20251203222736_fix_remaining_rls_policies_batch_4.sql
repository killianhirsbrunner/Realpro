/*
  # Fix Remaining RLS Performance Issues - Batch 4

  ## Changes
  - Optimize RLS policies for submissions, project_phases, buyer_choices, thread_participants, message_reactions
*/

-- Submissions
DROP POLICY IF EXISTS "Project team can manage submissions" ON public.submissions;
CREATE POLICY "Project team can manage submissions"
  ON public.submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = submissions.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Submission Invites
DROP POLICY IF EXISTS "Project team and invited companies can view invites" ON public.submission_invites;
CREATE POLICY "Project team and invited companies can view invites"
  ON public.submission_invites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.projects p ON p.id = s.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE s.id = submission_invites.submission_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Project team can manage invites" ON public.submission_invites;
CREATE POLICY "Project team can manage invites"
  ON public.submission_invites FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.projects p ON p.id = s.project_id
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE s.id = submission_invites.submission_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Submission Offers
DROP POLICY IF EXISTS "Companies can manage their own offers" ON public.submission_offers;
CREATE POLICY "Companies can manage their own offers"
  ON public.submission_offers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      JOIN public.user_organizations uo ON uo.organization_id = c.organization_id
      WHERE c.id = submission_offers.company_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Phases
DROP POLICY IF EXISTS "Project participants can view phases" ON public.project_phases;
CREATE POLICY "Project participants can view phases"
  ON public.project_phases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_phases.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "EG and architects can manage phases" ON public.project_phases;
CREATE POLICY "EG and architects can manage phases"
  ON public.project_phases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_phases.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Project Progress Snapshots
DROP POLICY IF EXISTS "Project participants can view snapshots" ON public.project_progress_snapshots;
CREATE POLICY "Project participants can view snapshots"
  ON public.project_progress_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_progress_snapshots.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "EG and architects can create snapshots" ON public.project_progress_snapshots;
CREATE POLICY "EG and architects can create snapshots"
  ON public.project_progress_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = project_progress_snapshots.project_id
      AND uo.user_id = (select auth.uid())
    )
  );

-- Buyer Choices
DROP POLICY IF EXISTS "Buyers can manage their own choices" ON public.buyer_choices;
CREATE POLICY "Buyers can manage their own choices"
  ON public.buyer_choices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.buyers b
      WHERE b.id = buyer_choices.buyer_id
      AND b.user_id = (select auth.uid())
    )
  );

-- Buyer Change Requests
DROP POLICY IF EXISTS "Buyers can view and create their change requests" ON public.buyer_change_requests;
CREATE POLICY "Buyers can view and create their change requests"
  ON public.buyer_change_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lots l
      JOIN public.buyers b ON b.lot_id = l.id
      WHERE l.id = buyer_change_requests.lot_id
      AND b.user_id = (select auth.uid())
    )
  );

-- Thread Participants
DROP POLICY IF EXISTS "Users can view participants of their threads" ON public.thread_participants;
CREATE POLICY "Users can view participants of their threads"
  ON public.thread_participants FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = thread_participants.thread_id
      AND mt.created_by = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Thread owners can manage participants" ON public.thread_participants;
CREATE POLICY "Thread owners can manage participants"
  ON public.thread_participants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = thread_participants.thread_id
      AND mt.created_by = (select auth.uid())
    )
  );

-- Message Reactions
DROP POLICY IF EXISTS "Users can manage their own reactions" ON public.message_reactions;
CREATE POLICY "Users can manage their own reactions"
  ON public.message_reactions FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));
