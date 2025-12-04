import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface GlobalDashboardData {
  projectsCount: number;
  totalLots: number;
  globalSalesProgress: number;
  totalRevenue: number;
  projects: Array<{
    id: string;
    name: string;
    code: string;
    city: string;
    canton: string;
    status: string;
    image_url: string | null;
    salesProgress: number;
    constructionProgress: number;
    lotsTotal: number;
    lotsSold: number;
    created_at: string;
  }>;
  activities: Array<{
    id: string;
    title: string;
    description: string;
    created_at: string;
    activity_type: string;
    project_name?: string;
    user_name?: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    date: string;
    project_name: string;
    type: string;
  }>;
}

export function useGlobalDashboard() {
  const [data, setData] = useState<GlobalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGlobalDashboardData();
  }, []);

  const fetchGlobalDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user and organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's organization
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!userOrg) {
        throw new Error('No organization found');
      }

      const organizationId = userOrg.organization_id;

      // Fetch all projects for this organization
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          code,
          city,
          canton,
          status,
          image_url,
          created_at
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch lots data for all projects
      const projectIds = projects?.map(p => p.id) || [];
      const { data: lots } = await supabase
        .from('lots')
        .select('id, project_id, status, price_total')
        .in('project_id', projectIds);

      // Calculate statistics per project
      const projectsWithStats = (projects || []).map(project => {
        const projectLots = lots?.filter(l => l.project_id === project.id) || [];
        const soldLots = projectLots.filter(l => ['SOLD', 'RESERVED'].includes(l.status));
        const salesProgress = projectLots.length > 0
          ? Math.round((soldLots.length / projectLots.length) * 100)
          : 0;

        return {
          ...project,
          salesProgress,
          constructionProgress: 45, // TODO: Calculate from planning_tasks
          lotsTotal: projectLots.length,
          lotsSold: soldLots.length,
        };
      });

      // Calculate global KPIs
      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => ['SOLD', 'RESERVED'].includes(l.status)).length || 0;
      const globalSalesProgress = totalLots > 0 ? Math.round((soldLots / totalLots) * 100) : 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, lot) => sum + (Number(lot.price_total) || 0), 0) || 0;

      // Fetch recent activities
      const { data: activities } = await supabase
        .from('activity_feed')
        .select(`
          id,
          title,
          description,
          activity_type,
          created_at,
          project_id,
          projects!inner(name)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(10);

      const formattedActivities = (activities || []).map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description || '',
        created_at: activity.created_at,
        activity_type: activity.activity_type,
        project_name: (activity as any).projects?.name,
      }));

      // TODO: Fetch upcoming deadlines from planning_tasks
      const upcomingDeadlines: any[] = [];

      setData({
        projectsCount: projects?.length || 0,
        totalLots,
        globalSalesProgress,
        totalRevenue,
        projects: projectsWithStats,
        activities: formattedActivities,
        upcomingDeadlines,
      });
    } catch (err) {
      console.error('Error fetching global dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: fetchGlobalDashboardData };
}
