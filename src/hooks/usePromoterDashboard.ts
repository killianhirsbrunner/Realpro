import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalProjects: number;
  totalRevenuePotential: number;
  totalInvoices: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  totalSavTickets: {
    open: number;
    inProgress: number;
    closed: number;
  };
  projects: ProjectOverview[];
}

interface ProjectOverview {
  id: string;
  name: string;
  city: string;
  status: string;
  sales: {
    totalLots: number;
    soldLots: number;
    reservedLots: number;
    availableLots: number;
    salesPercentage: number;
    revenuePotential: number;
    revenueRealized: number;
  };
  finance: {
    budget: number;
    committed: number;
    invoiced: number;
    paid: number;
  };
  sav: {
    open: number;
    inProgress: number;
    avgResolutionDays: number;
  };
  construction: {
    progress: number;
    currentPhase: string;
  };
}

interface ProjectDetail {
  project: any;
  lots: any[];
  recentActivity: any[];
}

export function usePromoterDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/promoter-dashboard/overview`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetail = async (projectId: string): Promise<ProjectDetail | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/promoter-dashboard/project/${projectId}`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project detail: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchOverview,
    fetchProjectDetail,
  };
}
