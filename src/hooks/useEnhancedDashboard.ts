import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EnhancedDashboardData {
  analyticsData: {
    month: string;
    ventes: number;
    chantier: number;
    revenus: number;
  }[];
  financialData: {
    totalBudget: number;
    engaged: number;
    paid: number;
    remaining: number;
  };
  upcomingDeadlines: {
    id: string;
    title: string;
    date: string;
    project_name: string;
    project_id: string;
    type: 'milestone' | 'task' | 'notary' | 'payment';
  }[];
}

export function useEnhancedDashboard(organizationId: string) {
  const [data, setData] = useState<EnhancedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (organizationId) {
      fetchEnhancedData();
    }
  }, [organizationId]);

  const fetchEnhancedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('organization_id', organizationId);

      const projectIds = projects?.map(p => p.id) || [];

      const analyticsData = generateMockAnalytics();

      const { data: cfcData } = await supabase
        .from('cfc_lines')
        .select(`
          amount_budgeted,
          amount_committed,
          amount_spent,
          budget:cfc_budgets!inner(project_id)
        `)
        .in('budget.project_id', projectIds);

      const totalBudget = cfcData?.reduce((sum, line) => sum + (Number(line.amount_budgeted) || 0), 0) || 0;
      const engaged = cfcData?.reduce((sum, line) => sum + (Number(line.amount_committed) || 0), 0) || 0;
      const paid = cfcData?.reduce((sum, line) => sum + (Number(line.amount_spent) || 0), 0) || 0;
      const remaining = totalBudget - engaged;

      const financialData = {
        totalBudget,
        engaged,
        paid,
        remaining: remaining > 0 ? remaining : 0,
      };

      const { data: milestones } = await supabase
        .from('planning_tasks')
        .select(`
          id,
          name,
          start_date,
          type,
          project_id,
          projects!inner(name)
        `)
        .in('project_id', projectIds)
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true })
        .limit(10);

      const upcomingDeadlines = (milestones || []).map(m => ({
        id: m.id,
        title: m.name,
        date: m.start_date,
        project_name: (m as any).projects?.name || '',
        project_id: m.project_id,
        type: (m.type || 'task') as 'milestone' | 'task' | 'notary' | 'payment',
      }));

      setData({
        analyticsData,
        financialData,
        upcomingDeadlines,
      });
    } catch (err) {
      console.error('Error fetching enhanced dashboard data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: fetchEnhancedData };
}

function generateMockAnalytics() {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  return months.map((month, idx) => ({
    month,
    ventes: 45 + idx * 8 + Math.random() * 5,
    chantier: 30 + idx * 10 + Math.random() * 5,
    revenus: 500000 + idx * 100000 + Math.random() * 50000,
  }));
}
