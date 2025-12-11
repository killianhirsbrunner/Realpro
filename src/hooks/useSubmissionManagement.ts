import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type SubmissionStatus = 'draft' | 'active' | 'closed' | 'evaluation' | 'awarded' | 'cancelled';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'submitted';
export type OfferStatus = 'draft' | 'submitted' | 'withdrawn' | 'accepted' | 'rejected';

export interface Submission {
  id: string;
  project_id: string;
  reference: string;
  title: string;
  description: string | null;
  cfc_code: string | null;
  budget_estimate: number | null;
  question_deadline: string | null;
  offer_deadline: string;
  status: SubmissionStatus;
  clarifications_open: boolean;
  published_at: string | null;
  closed_at: string | null;
  awarded_at: string | null;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionInvite {
  id: string;
  submission_id: string;
  company_id: string;
  status: InviteStatus;
  invited_at: string;
  invited_by_id: string | null;
  responded_at: string | null;
  company?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    contact_person: string | null;
  };
}

export interface SubmissionOffer {
  id: string;
  submission_id: string;
  company_id: string;
  reference: string | null;
  total_excl_vat: number;
  total_incl_vat: number;
  vat_rate: number;
  delay_days: number | null;
  notes: string | null;
  status: OfferStatus;
  submitted_at: string | null;
  is_winner: boolean;
  score: number | null;
  created_at: string;
  company?: {
    id: string;
    name: string;
  };
  items?: OfferItem[];
}

export interface OfferItem {
  id: string;
  offer_id: string;
  line_number: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface SubmissionWithRelations extends Submission {
  invites: SubmissionInvite[];
  offers: SubmissionOffer[];
  invites_count: number;
  offers_count: number;
  min_offer: number | null;
  max_offer: number | null;
  avg_offer: number | null;
}

export interface CreateSubmissionData {
  projectId: string;
  title: string;
  description?: string;
  cfcCode?: string;
  budgetEstimate?: number;
  questionDeadline?: Date;
  offerDeadline: Date;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

export interface OfferEvaluation {
  offerId: string;
  criteriaId: string;
  score: number;
  comment?: string;
}

// ============================================================================
// Status Configuration
// ============================================================================

export const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; icon: string; nextStatuses: SubmissionStatus[] }
> = {
  draft: {
    label: 'Brouillon',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
    icon: 'FileText',
    nextStatuses: ['active', 'cancelled'],
  },
  active: {
    label: 'Active',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    icon: 'Play',
    nextStatuses: ['closed', 'cancelled'],
  },
  closed: {
    label: 'Cloturee',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    icon: 'Lock',
    nextStatuses: ['evaluation', 'cancelled'],
  },
  evaluation: {
    label: 'Evaluation',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    icon: 'BarChart',
    nextStatuses: ['awarded', 'cancelled'],
  },
  awarded: {
    label: 'Adjugee',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    icon: 'Award',
    nextStatuses: [],
  },
  cancelled: {
    label: 'Annulee',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    icon: 'XCircle',
    nextStatuses: [],
  },
};

export const INVITE_STATUS_CONFIG: Record<InviteStatus, { label: string; color: string }> = {
  pending: {
    label: 'En attente',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  },
  accepted: {
    label: 'Accepte',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  declined: {
    label: 'Decline',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  },
  submitted: {
    label: 'Offre soumise',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  },
};

export const OFFER_STATUS_CONFIG: Record<OfferStatus, { label: string; color: string }> = {
  draft: {
    label: 'Brouillon',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
  },
  submitted: {
    label: 'Soumise',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  withdrawn: {
    label: 'Retiree',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  },
  accepted: {
    label: 'Retenue',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  },
  rejected: {
    label: 'Rejetee',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  },
};

// ============================================================================
// Default Evaluation Criteria
// ============================================================================

export const DEFAULT_EVALUATION_CRITERIA: EvaluationCriteria[] = [
  { id: 'price', name: 'Prix', weight: 40, maxScore: 10 },
  { id: 'quality', name: 'Qualite technique', weight: 25, maxScore: 10 },
  { id: 'delay', name: 'Delai de livraison', weight: 15, maxScore: 10 },
  { id: 'references', name: 'References', weight: 10, maxScore: 10 },
  { id: 'guarantee', name: 'Garanties', weight: 10, maxScore: 10 },
];

// ============================================================================
// Hook: useSubmissionManagement
// ============================================================================

export function useSubmissionManagement(projectId: string) {
  const [submissions, setSubmissions] = useState<SubmissionWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch submissions with relations
      const { data: submissionsData, error: fetchError } = await supabase
        .from('submissions')
        .select(`
          *,
          invites:submission_invites(
            id,
            company_id,
            status,
            invited_at,
            responded_at,
            company:companies(id, name, email, phone, contact_person)
          ),
          offers:submission_offers(
            id,
            company_id,
            reference,
            total_excl_vat,
            total_incl_vat,
            vat_rate,
            delay_days,
            notes,
            status,
            submitted_at,
            is_winner,
            score,
            created_at,
            company:companies(id, name),
            items:submission_offer_items(*)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Process data with computed fields
      const processedSubmissions: SubmissionWithRelations[] = (submissionsData || []).map((s: any) => {
        const offers = s.offers || [];
        const submittedOffers = offers.filter((o: any) => o.status === 'submitted');
        const prices = submittedOffers.map((o: any) => o.total_excl_vat).filter(Boolean);

        return {
          ...s,
          invites: s.invites || [],
          offers: offers,
          invites_count: (s.invites || []).length,
          offers_count: submittedOffers.length,
          min_offer: prices.length > 0 ? Math.min(...prices) : null,
          max_offer: prices.length > 0 ? Math.max(...prices) : null,
          avg_offer: prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : null,
        };
      });

      setSubmissions(processedSubmissions);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  /**
   * Create a new submission
   */
  const createSubmission = useCallback(
    async (data: CreateSubmissionData) => {
      try {
        // Generate reference
        const count = submissions.length + 1;
        const reference = `SOU-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

        const { data: newSubmission, error: insertError } = await supabase
          .from('submissions')
          .insert({
            project_id: data.projectId,
            reference,
            title: data.title,
            description: data.description || null,
            cfc_code: data.cfcCode || null,
            budget_estimate: data.budgetEstimate || null,
            question_deadline: data.questionDeadline?.toISOString() || null,
            offer_deadline: data.offerDeadline.toISOString(),
            status: 'draft',
            clarifications_open: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadSubmissions();
        return newSubmission;
      } catch (err) {
        console.error('Error creating submission:', err);
        throw err;
      }
    },
    [submissions.length, loadSubmissions]
  );

  /**
   * Update submission status
   */
  const updateStatus = useCallback(
    async (submissionId: string, newStatus: SubmissionStatus) => {
      try {
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };

        // Set timestamps based on status
        if (newStatus === 'active') {
          updateData.published_at = new Date().toISOString();
        } else if (newStatus === 'closed') {
          updateData.closed_at = new Date().toISOString();
        } else if (newStatus === 'awarded') {
          updateData.awarded_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('submissions')
          .update(updateData)
          .eq('id', submissionId);

        if (updateError) throw updateError;

        await loadSubmissions();
      } catch (err) {
        console.error('Error updating status:', err);
        throw err;
      }
    },
    [loadSubmissions]
  );

  /**
   * Invite a company to bid
   */
  const inviteCompany = useCallback(
    async (submissionId: string, companyId: string) => {
      try {
        const { error: insertError } = await supabase.from('submission_invites').insert({
          submission_id: submissionId,
          company_id: companyId,
          status: 'pending',
          invited_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        await loadSubmissions();
      } catch (err) {
        console.error('Error inviting company:', err);
        throw err;
      }
    },
    [loadSubmissions]
  );

  /**
   * Remove company invitation
   */
  const removeInvite = useCallback(
    async (inviteId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('submission_invites')
          .delete()
          .eq('id', inviteId);

        if (deleteError) throw deleteError;

        await loadSubmissions();
      } catch (err) {
        console.error('Error removing invite:', err);
        throw err;
      }
    },
    [loadSubmissions]
  );

  /**
   * Accept an offer (award the tender)
   */
  const acceptOffer = useCallback(
    async (offerId: string, submissionId: string) => {
      try {
        // Mark the selected offer as accepted
        const { error: acceptError } = await supabase
          .from('submission_offers')
          .update({
            status: 'accepted',
            is_winner: true,
          })
          .eq('id', offerId);

        if (acceptError) throw acceptError;

        // Mark other offers as rejected
        const { error: rejectError } = await supabase
          .from('submission_offers')
          .update({ status: 'rejected' })
          .eq('submission_id', submissionId)
          .neq('id', offerId)
          .eq('status', 'submitted');

        if (rejectError) throw rejectError;

        // Update submission status to awarded
        await updateStatus(submissionId, 'awarded');
      } catch (err) {
        console.error('Error accepting offer:', err);
        throw err;
      }
    },
    [updateStatus]
  );

  /**
   * Score an offer
   */
  const scoreOffer = useCallback(
    async (offerId: string, score: number) => {
      try {
        const { error: updateError } = await supabase
          .from('submission_offers')
          .update({ score })
          .eq('id', offerId);

        if (updateError) throw updateError;

        await loadSubmissions();
      } catch (err) {
        console.error('Error scoring offer:', err);
        throw err;
      }
    },
    [loadSubmissions]
  );

  /**
   * Delete a submission
   */
  const deleteSubmission = useCallback(
    async (submissionId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('submissions')
          .delete()
          .eq('id', submissionId);

        if (deleteError) throw deleteError;

        await loadSubmissions();
      } catch (err) {
        console.error('Error deleting submission:', err);
        throw err;
      }
    },
    [loadSubmissions]
  );

  // Computed stats
  const stats = {
    total: submissions.length,
    draft: submissions.filter((s) => s.status === 'draft').length,
    active: submissions.filter((s) => s.status === 'active').length,
    closed: submissions.filter((s) => s.status === 'closed').length,
    evaluation: submissions.filter((s) => s.status === 'evaluation').length,
    awarded: submissions.filter((s) => s.status === 'awarded').length,
    cancelled: submissions.filter((s) => s.status === 'cancelled').length,
    totalBudget: submissions.reduce((sum, s) => sum + (s.budget_estimate || 0), 0),
    totalOffersReceived: submissions.reduce((sum, s) => sum + s.offers_count, 0),
  };

  return {
    submissions,
    loading,
    error,
    stats,
    refresh: loadSubmissions,
    createSubmission,
    updateStatus,
    inviteCompany,
    removeInvite,
    acceptOffer,
    scoreOffer,
    deleteSubmission,
  };
}

// ============================================================================
// Hook: useSubmissionDetail
// ============================================================================

export function useSubmissionDetailEnhanced(submissionId: string | undefined) {
  const [submission, setSubmission] = useState<SubmissionWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmission = useCallback(async () => {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select(`
          *,
          invites:submission_invites(
            id,
            company_id,
            status,
            invited_at,
            responded_at,
            company:companies(id, name, email, phone, contact_person)
          ),
          offers:submission_offers(
            id,
            company_id,
            reference,
            total_excl_vat,
            total_incl_vat,
            vat_rate,
            delay_days,
            notes,
            status,
            submitted_at,
            is_winner,
            score,
            created_at,
            company:companies(id, name),
            items:submission_offer_items(*)
          )
        `)
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Process with computed fields
      const offers = data.offers || [];
      const submittedOffers = offers.filter((o: any) => o.status === 'submitted');
      const prices = submittedOffers.map((o: any) => o.total_excl_vat).filter(Boolean);

      setSubmission({
        ...data,
        invites: data.invites || [],
        offers: offers,
        invites_count: (data.invites || []).length,
        offers_count: submittedOffers.length,
        min_offer: prices.length > 0 ? Math.min(...prices) : null,
        max_offer: prices.length > 0 ? Math.max(...prices) : null,
        avg_offer: prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : null,
      });
    } catch (err) {
      console.error('Error loading submission:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  return { submission, loading, error, refresh: loadSubmission };
}

// ============================================================================
// Hook: useOfferComparison
// ============================================================================

export function useOfferComparison(submissionId: string | undefined) {
  const [offers, setOffers] = useState<SubmissionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffers = useCallback(async () => {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('submission_offers')
        .select(`
          *,
          company:companies(id, name),
          items:submission_offer_items(*)
        `)
        .eq('submission_id', submissionId)
        .in('status', ['submitted', 'accepted', 'rejected'])
        .order('total_excl_vat', { ascending: true });

      if (fetchError) throw fetchError;

      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Computed comparison data
  const comparison = {
    offers,
    lowestPrice: offers.length > 0 ? Math.min(...offers.map((o) => o.total_excl_vat)) : null,
    highestPrice: offers.length > 0 ? Math.max(...offers.map((o) => o.total_excl_vat)) : null,
    averagePrice:
      offers.length > 0
        ? offers.reduce((sum, o) => sum + o.total_excl_vat, 0) / offers.length
        : null,
    shortestDelay: offers.filter((o) => o.delay_days).length > 0
      ? Math.min(...offers.filter((o) => o.delay_days).map((o) => o.delay_days!))
      : null,
    priceSpread:
      offers.length > 1
        ? Math.max(...offers.map((o) => o.total_excl_vat)) - Math.min(...offers.map((o) => o.total_excl_vat))
        : 0,
  };

  return { offers, comparison, loading, error, refresh: loadOffers };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate weighted score for an offer
 */
export function calculateWeightedScore(
  scores: Record<string, number>,
  criteria: EvaluationCriteria[]
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const criterion of criteria) {
    const score = scores[criterion.id] || 0;
    const normalizedScore = (score / criterion.maxScore) * 100;
    weightedSum += normalizedScore * (criterion.weight / 100);
    totalWeight += criterion.weight;
  }

  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return '-';
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calculate price deviation from average
 */
export function calculateDeviation(price: number, average: number): number {
  if (!average) return 0;
  return ((price - average) / average) * 100;
}

/**
 * Get deadline status
 */
export function getDeadlineStatus(deadline: string): { label: string; color: string; daysLeft: number } {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { label: 'Expiree', color: 'text-red-600', daysLeft };
  } else if (daysLeft === 0) {
    return { label: "Aujourd'hui", color: 'text-amber-600', daysLeft };
  } else if (daysLeft <= 3) {
    return { label: `${daysLeft}j restants`, color: 'text-amber-600', daysLeft };
  } else if (daysLeft <= 7) {
    return { label: `${daysLeft}j restants`, color: 'text-blue-600', daysLeft };
  } else {
    return { label: `${daysLeft}j restants`, color: 'text-green-600', daysLeft };
  }
}
