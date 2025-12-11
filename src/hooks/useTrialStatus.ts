/**
 * RealPro | © 2024-2025 Realpro SA. Tous droits réservés.
 * Hook for managing trial subscription status
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from './useOrganization';

export interface TrialStatus {
  isTrialActive: boolean;
  isTrialExpired: boolean;
  hasActiveSubscription: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | null;
  planName: string | null;
}

interface SubscriptionData {
  id: string;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  trial_start: string | null;
  trial_end: string | null;
  current_period_end: string;
  plans: {
    name: string;
    slug: string;
  } | null;
}

const DEFAULT_TRIAL_STATUS: TrialStatus = {
  isTrialActive: false,
  isTrialExpired: false,
  hasActiveSubscription: false,
  daysRemaining: 0,
  trialEndDate: null,
  subscriptionStatus: null,
  planName: null,
};

export function useTrialStatus() {
  const { currentOrganization } = useOrganization();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>(DEFAULT_TRIAL_STATUS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDaysRemaining = (endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const fetchTrialStatus = useCallback(async () => {
    if (!currentOrganization?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          status,
          trial_start,
          trial_end,
          current_period_end,
          plans (
            name,
            slug
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching subscription:', fetchError);
        setError(fetchError.message);
        setTrialStatus(DEFAULT_TRIAL_STATUS);
        return;
      }

      if (!data) {
        // No subscription found - user needs to set up trial
        setTrialStatus({
          ...DEFAULT_TRIAL_STATUS,
          isTrialExpired: false,
          hasActiveSubscription: false,
        });
        return;
      }

      const subscription = data as unknown as SubscriptionData;
      const status = subscription.status;
      const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;
      const now = new Date();

      let isTrialActive = false;
      let isTrialExpired = false;
      let hasActiveSubscription = false;
      let daysRemaining = 0;

      switch (status) {
        case 'TRIAL':
          if (trialEnd) {
            isTrialActive = trialEnd > now;
            isTrialExpired = trialEnd <= now;
            daysRemaining = calculateDaysRemaining(trialEnd);
          }
          break;
        case 'ACTIVE':
          hasActiveSubscription = true;
          break;
        case 'EXPIRED':
        case 'CANCELLED':
          isTrialExpired = true;
          break;
        case 'PAST_DUE':
          // Allow access but show warning
          hasActiveSubscription = true;
          break;
      }

      setTrialStatus({
        isTrialActive,
        isTrialExpired,
        hasActiveSubscription,
        daysRemaining,
        trialEndDate: trialEnd,
        subscriptionStatus: status,
        planName: subscription.plans?.name || null,
      });
    } catch (err) {
      console.error('Error in fetchTrialStatus:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la vérification du statut');
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.id]);

  useEffect(() => {
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  // Refresh trial status
  const refresh = useCallback(() => {
    setLoading(true);
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  return {
    ...trialStatus,
    loading,
    error,
    refresh,
  };
}

// Utility hook to check if user can access the app
export function useCanAccessApp(): { canAccess: boolean; loading: boolean; reason?: string } {
  const {
    isTrialActive,
    isTrialExpired,
    hasActiveSubscription,
    loading,
    subscriptionStatus
  } = useTrialStatus();

  if (loading) {
    return { canAccess: true, loading: true };
  }

  // User has active paid subscription
  if (hasActiveSubscription) {
    return { canAccess: true, loading: false };
  }

  // User is in active trial
  if (isTrialActive) {
    return { canAccess: true, loading: false };
  }

  // No subscription at all - allow access to set up trial
  if (!subscriptionStatus) {
    return { canAccess: true, loading: false };
  }

  // Trial expired
  if (isTrialExpired) {
    return {
      canAccess: false,
      loading: false,
      reason: 'Votre période d\'essai de 14 jours est terminée. Veuillez souscrire à un abonnement pour continuer.'
    };
  }

  return { canAccess: true, loading: false };
}
