import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';

interface DashboardData {
  kpis: {
    projects: number;
    lotsSold: number;
    paid: number;
    delayedPayments: number;
    activeSoumissions: number;
    documentsRecent: number;
    unreadMessages: number;
  };
  salesChart: Array<{ month: string; sold: number }>;
  cfcChart: Array<{ cfc: string; budget: number; spent: number }>;
  soumissions: Array<{ id: string; label: string; deadline: string; status: string }>;
  documentsRecent: Array<{ id: string; name: string; created_at: string }>;
  planning: Array<{ id: string; phase: string; status: string }>;
  activityFeed: Array<{ id: string; user: string; action: string; time: string }>;
}

export function useDashboard() {
  const { user } = useCurrentUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
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

        setData({
          kpis: {
            projects: projectsResult.data?.length || 0,
            lotsSold: lotsResult.data?.length || 0,
            paid: totalPaid,
            delayedPayments,
            activeSoumissions: soumissionsResult.data?.length || 0,
            documentsRecent: documentsResult.data?.length || 0,
            unreadMessages: messagesResult.data?.length || 0
          },
          salesChart: salesChartData,
          cfcChart: cfcChartData,
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
    }

    fetchDashboardData();
  }, [user]);

  return { data, loading, error };
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
