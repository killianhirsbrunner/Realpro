import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganizationContext } from '../contexts/OrganizationContext';

export function useOrganizationProjects() {
  const { currentOrganization } = useOrganizationContext();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setProjects([]);
      setLoading(false);
      return;
    }

    loadProjects();
  }, [currentOrganization]);

  async function loadProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { projects, loading, error, refresh: loadProjects };
}

export function useOrganizationUsers() {
  const { currentOrganization } = useOrganizationContext();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setUsers([]);
      setLoading(false);
      return;
    }

    loadUsers();
  }, [currentOrganization]);

  async function loadUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_organizations')
        .select(`
          user_id,
          joined_at,
          users (
            id,
            email,
            first_name,
            last_name,
            avatar_url,
            is_active,
            language
          )
        `)
        .eq('organization_id', currentOrganization!.id);

      if (error) throw error;
      setUsers(data?.map(uo => uo.users).filter(Boolean) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { users, loading, error, refresh: loadUsers };
}

export function useProjectData<T = any>(table: string) {
  const { currentProject } = useOrganizationContext();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentProject) {
      setData([]);
      setLoading(false);
      return;
    }

    loadData();
  }, [currentProject, table]);

  async function loadData() {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('project_id', currentProject!.id);

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, refresh: loadData };
}

export function useOrganizationStats() {
  const { currentOrganization } = useOrganizationContext();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setStats(null);
      setLoading(false);
      return;
    }

    loadStats();
  }, [currentOrganization]);

  async function loadStats() {
    try {
      setLoading(true);

      const [
        projectsResult,
        lotsResult,
        usersResult,
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('id, status')
          .eq('organization_id', currentOrganization!.id),
        supabase
          .from('lots')
          .select('id, status, project_id')
          .in('project_id', await getProjectIds()),
        supabase
          .from('user_organizations')
          .select('user_id')
          .eq('organization_id', currentOrganization!.id),
      ]);

      const stats = {
        totalProjects: projectsResult.data?.length || 0,
        activeProjects: projectsResult.data?.filter(p => p.status !== 'ARCHIVED').length || 0,
        totalLots: lotsResult.data?.length || 0,
        soldLots: lotsResult.data?.filter(l => l.status === 'SOLD').length || 0,
        totalUsers: usersResult.data?.length || 0,
      };

      setStats(stats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function getProjectIds() {
    const { data } = await supabase
      .from('projects')
      .select('id')
      .eq('organization_id', currentOrganization!.id);

    return data?.map(p => p.id) || [];
  }

  return { stats, loading, error, refresh: loadStats };
}

export function useOrganizationDashboard() {
  const { currentOrganization } = useOrganizationContext();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentOrganization) {
      setDashboardData(null);
      setLoading(false);
      return;
    }

    loadDashboardData();
  }, [currentOrganization]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const [
        projectsResult,
        usersResult,
        subscriptionResult,
        invoicesResult,
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('id')
          .eq('organization_id', currentOrganization!.id),
        supabase
          .from('organization_members')
          .select('id')
          .eq('organization_id', currentOrganization!.id),
        supabase
          .from('subscriptions')
          .select('*')
          .eq('organization_id', currentOrganization!.id)
          .eq('status', 'ACTIVE')
          .maybeSingle(),
        supabase
          .from('invoices')
          .select('*')
          .eq('organization_id', currentOrganization!.id)
          .order('date', { ascending: false })
          .limit(10),
      ]);

      setDashboardData({
        organization: currentOrganization,
        stats: {
          projectsUsed: projectsResult.data?.length || 0,
          projectsLimit: currentOrganization.max_projects || 5,
          usersCount: usersResult.data?.length || 0,
          usersLimit: currentOrganization.max_users || 10,
          storageUsed: 0,
          storageLimit: currentOrganization.storage_gb || 50,
        },
        subscription: subscriptionResult.data,
        invoices: invoicesResult.data || [],
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { data: dashboardData, loading, error, refresh: loadDashboardData };
}
