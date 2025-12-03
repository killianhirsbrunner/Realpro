import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Organization = {
  id: string;
  name: string;
  defaultLanguage: string;
  plan: string;
  planSlug: string | null;
  subscriptionStatus: string | null;
  billingCycle: string | null;
  currentPeriodEnd: string | null;
  projectsCount: number;
  usersCount: number;
  createdAt: string;
};

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
};

type Stats = {
  organizations: number;
  projects: number;
  users: number;
  activeSubscriptions: number;
};

export function useAdmin() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Non authentifié');
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const [orgsRes, plansRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/functions/v1/admin/organizations`, { headers }),
        fetch(`${apiUrl}/functions/v1/admin/plans`, { headers }),
        fetch(`${apiUrl}/functions/v1/admin/stats`, { headers }),
      ]);

      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        setOrganizations(orgsData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeOrganizationPlan = async (
    orgId: string,
    planSlug: string,
    billingCycle: string = 'MONTHLY'
  ) => {
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Non authentifié');
      }

      const res = await fetch(`${apiUrl}/functions/v1/admin/organizations/${orgId}/plan`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planSlug, billingCycle }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors du changement de plan');
      }

      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    organizations,
    plans,
    stats,
    loading,
    error,
    reload: loadData,
    changeOrganizationPlan,
  };
}
