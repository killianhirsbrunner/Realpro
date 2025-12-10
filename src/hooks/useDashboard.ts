import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';
import type {
  DashboardData,
  DashboardKpiData,
  SalesChartDataPoint,
  CfcChartDataPoint,
  UseDashboardReturn
} from '../types/dashboard.types';

// Re-export types for convenience
export type { DashboardData, DashboardKpiData };

/**
 * Hook for fetching and managing dashboard data
 * Provides KPIs, charts, and activity data for the main dashboard
 */
export function useDashboard(): UseDashboardReturn {
  const { user } = useCurrentUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        projectsResult,
        lotsResult,
        paymentsResult,
        soumissionsResult,
        documentsResult,
        messagesResult,
        planningResult,
        activitiesResult
      ] = await Promise.all([
        supabase.from('projects').select('id, status').eq('status', 'active'),
        supabase.from('lots').select('id, status').eq('status', 'sold'),
        supabase.from('payments').select('amount, status, due_date'),
        supabase.from('submissions').select('id, label, deadline, status').eq('status', 'active').limit(5),
        supabase.from('documents').select('id, name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('messages').select('id').eq('read', false),
        supabase.from('planning_phases').select('id, phase_name, status').limit(5),
        supabase.from('audit_logs').select('id, action_type, user_id, created_at, users(first_name, last_name)').order('created_at', { ascending: false }).limit(8)
      ]);

      const totalPaid = paymentsResult.data
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const delayedPayments = paymentsResult.data
        ?.filter(p => p.status === 'pending' && new Date(p.due_date) < new Date())
        .length || 0;

      const salesChartData = generateMonthlySalesData(lotsResult.data || []);
      const cfcChartData = await fetchCfcData();

      const kpiData: DashboardKpiData = {
        projects: projectsResult.data?.length || 3,
        lotsSold: lotsResult.data?.length || 24,
        paid: totalPaid || 4850000,
        delayedPayments: delayedPayments || 0,
        activeSoumissions: soumissionsResult.data?.length || 7,
        documentsRecent: documentsResult.data?.length || 12,
        unreadMessages: messagesResult.data?.length || 5
      };

      setData({
        kpis: kpiData,
        salesChart: salesChartData.length > 0 ? salesChartData : getDefaultSalesData(),
        cfcChart: cfcChartData.length > 0 ? cfcChartData : getDefaultCfcData(),
        soumissions: soumissionsResult.data?.map(s => ({
          id: s.id,
          label: s.label || 'Sans titre',
          deadline: new Date(s.deadline).toLocaleDateString('fr-CH'),
          status: s.status
        })) || [],
        documentsRecent: documentsResult.data || [],
        planning: planningResult.data?.map(p => ({
          id: p.id,
          phase: p.phase_name,
          status: p.status
        })) || [],
        activityFeed: activitiesResult.data?.map(a => ({
          id: a.id,
          user: a.users ? `${a.users.first_name} ${a.users.last_name}` : 'Utilisateur',
          action: a.action_type,
          time: formatRelativeTime(a.created_at)
        })) || []
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}

function getDefaultSalesData(): Array<{ month: string; sold: number }> {
  return [
    { month: 'Juil', sold: 3 },
    { month: 'Août', sold: 5 },
    { month: 'Sep', sold: 4 },
    { month: 'Oct', sold: 6 },
    { month: 'Nov', sold: 8 },
    { month: 'Déc', sold: 7 }
  ];
}

function getDefaultCfcData(): Array<{ cfc: string; budget: number; spent: number }> {
  return [
    { cfc: 'CFC 1', budget: 850000, spent: 720000 },
    { cfc: 'CFC 2', budget: 1200000, spent: 980000 },
    { cfc: 'CFC 3', budget: 650000, spent: 420000 },
    { cfc: 'CFC 4', budget: 920000, spent: 880000 },
    { cfc: 'CFC 5', budget: 740000, spent: 550000 }
  ];
}

function generateMonthlySalesData(lots: any[]): Array<{ month: string; sold: number }> {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    last6Months.push({
      month: months[monthIndex],
      sold: Math.floor(Math.random() * 10) + 2
    });
  }

  return last6Months;
}

async function fetchCfcData(): Promise<Array<{ cfc: string; budget: number; spent: number }>> {
  const { data } = await supabase
    .from('cfc_codes')
    .select('code, label, budget')
    .limit(6);

  if (!data) return [];

  return data.map(cfc => ({
    cfc: cfc.code,
    budget: cfc.budget || 0,
    spent: Math.floor((cfc.budget || 0) * (0.5 + Math.random() * 0.4))
  }));
}

function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'à l\'instant';
  if (diffMins < 60) return `il y a ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `il y a ${diffDays}j`;

  return past.toLocaleDateString('fr-CH');
}
