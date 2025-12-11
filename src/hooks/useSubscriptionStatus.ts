import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';

interface SubscriptionStatus {
  isDemo: boolean;
  isExpired: boolean;
  isActive: boolean;
  daysRemaining: number | null;
  trialEnd: string | null;
  planName: string | null;
  planSlug: string | null;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | null;
  limits: {
    projects_max: number;
    users_max: number;
    storage_gb: number;
    is_demo?: boolean;
  } | null;
}

const initialStatus: SubscriptionStatus = {
  isDemo: false,
  isExpired: false,
  isActive: false,
  daysRemaining: null,
  trialEnd: null,
  planName: null,
  planSlug: null,
  status: null,
  limits: null,
};

export function useSubscriptionStatus() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(initialStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setSubscriptionStatus(initialStatus);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer l'organisation de l'utilisateur
      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!userOrgs) {
        setSubscriptionStatus(initialStatus);
        setLoading(false);
        return;
      }

      // Récupérer la souscription avec le plan
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('organization_id', userOrgs.organization_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) {
        console.error('Error fetching subscription:', subError);
        throw subError;
      }

      if (!subscription) {
        setSubscriptionStatus(initialStatus);
        setLoading(false);
        return;
      }

      const plan = subscription.plan;
      const limits = plan?.limits || {};
      const isDemo = subscription.is_demo || limits.is_demo || plan?.slug === 'demo';

      // Calculer si le compte démo a expiré
      let isExpired = false;
      let daysRemaining: number | null = null;

      if (isDemo && subscription.trial_end) {
        const trialEndDate = new Date(subscription.trial_end);
        const now = new Date();
        isExpired = trialEndDate < now;
        daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      }

      // Un compte non-démo en statut TRIAL n'est pas considéré comme expiré
      // mais un compte démo expiré est considéré comme expiré
      const isActive = !isExpired && ['TRIAL', 'ACTIVE'].includes(subscription.status);

      setSubscriptionStatus({
        isDemo,
        isExpired,
        isActive,
        daysRemaining,
        trialEnd: subscription.trial_end,
        planName: plan?.name || null,
        planSlug: plan?.slug || null,
        status: subscription.status,
        limits: {
          projects_max: limits.projects_max || 0,
          users_max: limits.users_max || 0,
          storage_gb: limits.storage_gb || 0,
          is_demo: limits.is_demo,
        },
      });
    } catch (err) {
      console.error('Error in useSubscriptionStatus:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription status'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  // Fonction pour rediriger vers la page d'expiration si nécessaire
  const checkAndRedirectIfExpired = useCallback(() => {
    if (subscriptionStatus.isDemo && subscriptionStatus.isExpired) {
      navigate('/auth/demo-expired');
      return true;
    }
    return false;
  }, [subscriptionStatus.isDemo, subscriptionStatus.isExpired, navigate]);

  // Fonction pour vérifier si on peut créer un projet
  const canCreateProject = useCallback(async (): Promise<{ allowed: boolean; message?: string }> => {
    if (subscriptionStatus.isExpired) {
      return {
        allowed: false,
        message: 'Votre période d\'essai est terminée. Veuillez passer à un plan payant pour continuer.',
      };
    }

    if (!subscriptionStatus.limits) {
      return { allowed: false, message: 'Impossible de vérifier vos quotas.' };
    }

    // Compter les projets existants
    if (!user) return { allowed: false, message: 'Utilisateur non connecté.' };

    const { data: userOrgs } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (!userOrgs) return { allowed: false, message: 'Organisation non trouvée.' };

    const { count } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', userOrgs.organization_id);

    const projectsCount = count || 0;
    const maxProjects = subscriptionStatus.limits.projects_max;

    if (maxProjects !== -1 && projectsCount >= maxProjects) {
      if (subscriptionStatus.isDemo) {
        return {
          allowed: false,
          message: `Limite de ${maxProjects} projet atteinte pour le compte démo. Passez à un plan payant pour créer plus de projets.`,
        };
      }
      return {
        allowed: false,
        message: `Limite de ${maxProjects} projet(s) atteinte. Passez à un plan supérieur pour créer plus de projets.`,
      };
    }

    return { allowed: true };
  }, [subscriptionStatus, user]);

  return {
    ...subscriptionStatus,
    loading,
    error,
    refetch: fetchSubscriptionStatus,
    checkAndRedirectIfExpired,
    canCreateProject,
  };
}

// Hook simplifié pour vérifier si le compte démo est expiré
export function useDemoExpiredCheck(): boolean {
  const { isDemo, isExpired, loading } = useSubscriptionStatus();
  return !loading && isDemo && isExpired;
}

// Hook pour obtenir le nombre de jours restants dans la période démo
export function useDemoDaysRemaining(): number | null {
  const { isDemo, daysRemaining } = useSubscriptionStatus();
  return isDemo ? daysRemaining : null;
}
