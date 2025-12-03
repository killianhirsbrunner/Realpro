import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Plan = Database['public']['Tables']['plans']['Row'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans() {
      try {
        const { data, error: fetchError } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        if (isMounted) {
          setPlans(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
          setLoading(false);
        }
      }
    }

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  return { plans, loading, error };
}

export function useSubscription(organizationId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchSubscription() {
      try {
        const { data, error: fetchError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (isMounted) {
          setSubscription(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error('Failed to fetch subscription')
          );
          setLoading(false);
        }
      }
    }

    fetchSubscription();

    return () => {
      isMounted = false;
    };
  }, [organizationId]);

  return { subscription, loading, error };
}
