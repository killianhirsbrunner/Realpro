import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from './useOrganization';

interface ProjectSummary {
  id: string;
  name: string;
  address: string;
  city: string;
  canton: string;
  type: string;
  status: string;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  total_lots: number;
  sold_lots: number;
  reserved_lots: number;
  available_lots: number;
  total_budget: number;
  spent_budget: number;
  health_score: number;
}

interface OrganizationStats {
  total_projects: number;
  active_projects: number;
  total_lots: number;
  sold_lots: number;
  total_revenue: number;
  projects_on_track: number;
  projects_delayed: number;
}

export function useOrganizationProjects() {
  const { organizationId } = useOrganization();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    loadData();
  }, [organizationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          address,
          city,
          canton,
          type,
          status,
          created_at,
          start_date,
          end_date,
          lots (
            id,
            status
          )
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projectsSummary: ProjectSummary[] = (projectsData || []).map((project: any) => {
        const lots = project.lots || [];
        const total_lots = lots.length;
        const sold_lots = lots.filter((l: any) => l.status === 'SOLD').length;
        const reserved_lots = lots.filter((l: any) => l.status === 'RESERVED').length;
        const available_lots = lots.filter((l: any) => l.status === 'AVAILABLE').length;

        const health_score = calculateHealthScore(project, total_lots, sold_lots);

        return {
          id: project.id,
          name: project.name,
          address: project.address,
          city: project.city,
          canton: project.canton,
          type: project.type,
          status: project.status,
          created_at: project.created_at,
          start_date: project.start_date,
          end_date: project.end_date,
          total_lots,
          sold_lots,
          reserved_lots,
          available_lots,
          total_budget: 0,
          spent_budget: 0,
          health_score,
        };
      });

      setProjects(projectsSummary);

      const organizationStats: OrganizationStats = {
        total_projects: projectsSummary.length,
        active_projects: projectsSummary.filter(p => p.status === 'CONSTRUCTION' || p.status === 'SELLING').length,
        total_lots: projectsSummary.reduce((sum, p) => sum + p.total_lots, 0),
        sold_lots: projectsSummary.reduce((sum, p) => sum + p.sold_lots, 0),
        total_revenue: 0,
        projects_on_track: projectsSummary.filter(p => p.health_score >= 70).length,
        projects_delayed: projectsSummary.filter(p => p.health_score < 50).length,
      };

      setStats(organizationStats);
    } catch (err: any) {
      console.error('Error loading organization data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthScore = (project: any, totalLots: number, soldLots: number): number => {
    let score = 70;

    if (project.status === 'COMPLETED') return 100;
    if (project.status === 'ARCHIVED') return 50;

    const salesRate = totalLots > 0 ? (soldLots / totalLots) * 100 : 0;
    if (salesRate > 80) score += 20;
    else if (salesRate > 50) score += 10;
    else if (salesRate < 20) score -= 20;

    if (project.end_date) {
      const now = new Date();
      const endDate = new Date(project.end_date);
      if (endDate < now) {
        score -= 30;
      }
    }

    return Math.max(0, Math.min(100, score));
  };

  return {
    projects,
    stats,
    loading,
    error,
    reload: loadData,
  };
}
