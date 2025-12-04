import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';

interface Organization {
  id: string;
  name: string;
  slug: string;
  default_language: string;
  logo_url: string | null;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  billing_cycle: 'MONTHLY' | 'YEARLY';
  current_period_start: string;
  current_period_end: string;
  trial_start: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  plan: {
    id: string;
    name: string;
    slug: string;
    limits: {
      projects_max: number;
      users_max: number;
      storage_gb: number;
      api_access?: boolean;
      custom_branding?: boolean;
      dedicated_support?: boolean;
    };
    features: string[];
  };
}

interface OrganizationData {
  organization: Organization | null;
  subscription: Subscription | null;
  canCreateProject: boolean;
  canAddUser: boolean;
  projectsCount: number;
  usersCount: number;
}

export function useOrganization() {
  const { user } = useCurrentUser();
  const [data, setData] = useState<OrganizationData>({
    organization: null,
    subscription: null,
    canCreateProject: false,
    canAddUser: false,
    projectsCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchOrganizationData();
  }, [user]);

  async function fetchOrganizationData() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data: userOrgs, error: userOrgsError } = await supabase
        .from('user_organizations')
        .select('organization_id, is_default')
        .eq('user_id', user.id);

      if (userOrgsError) throw userOrgsError;

      if (!userOrgs || userOrgs.length === 0) {
        setData({
          organization: null,
          subscription: null,
          canCreateProject: false,
          canAddUser: false,
          projectsCount: 0,
          usersCount: 0,
        });
        setLoading(false);
        return;
      }

      const defaultOrg = userOrgs.find((org) => org.is_default);
      const orgId = defaultOrg?.organization_id || userOrgs[0].organization_id;

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .maybeSingle();

      if (orgError) throw orgError;

      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('organization_id', orgId)
        .eq('status', 'ACTIVE')
        .or('status.eq.TRIAL')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Subscription error:', subscriptionError);
      }

      const [projectsResult, usersResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId),
        supabase
          .from('user_organizations')
          .select('user_id', { count: 'exact', head: true })
          .eq('organization_id', orgId),
      ]);

      const projectsCount = projectsResult.count || 0;
      const usersCount = usersResult.count || 0;

      const limits = subscription?.plan?.limits || {
        projects_max: 0,
        users_max: 0,
        storage_gb: 0,
      };

      const canCreateProject =
        limits.projects_max === -1 || projectsCount < limits.projects_max;
      const canAddUser = limits.users_max === -1 || usersCount < limits.users_max;

      setData({
        organization: org,
        subscription: subscription as Subscription | null,
        canCreateProject,
        canAddUser,
        projectsCount,
        usersCount,
      });
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch organization'));
    } finally {
      setLoading(false);
    }
  }

  return {
    ...data,
    loading,
    error,
    refetch: fetchOrganizationData,
  };
}
