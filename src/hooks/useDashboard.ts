import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganizationContext } from '../contexts/OrganizationContext';

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
  const { currentOrganization, currentProject } = useOrganizationContext();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!currentOrganization) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // D'abord récupérer les IDs des projets de cette organisation
      const { data: orgProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('organization_id', currentOrganization.id);

      const projectIds = orgProjects?.map(p => p.id) || [];

      // Si aucun projet, retourner des données vides (pas de données par défaut hardcodées)
      if (projectIds.length === 0) {
        setData({
          kpis: {
            projects: 0,
            lotsSold: 0,
            paid: 0,
            delayedPayments: 0,
            activeSoumissions: 0,
            documentsRecent: 0,
            unreadMessages: 0
          },
          salesChart: [],
          cfcChart: [],
          soumissions: [],
          documentsRecent: [],
          planning: [],
          activityFeed: []
        });
        setLoading(false);
        return;
      }

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
        // Filtrer par organization_id
        supabase.from('projects').select('id, status').eq('organization_id', currentOrganization.id),
        // Filtrer les lots par project_id de l'organisation
        supabase.from('lots').select('id, status, created_at').in('project_id', projectIds).eq('status', 'SOLD'),
        // Filtrer les paiements par project_id
        supabase.from('payments').select('amount, status, due_date').in('project_id', projectIds),
        // Filtrer les soumissions par project_id
        supabase.from('submissions').select('id, label, deadline, status').in('project_id', projectIds).eq('status', 'active').limit(5),
        // Filtrer les documents par project_id
        supabase.from('documents').select('id, name, created_at').in('project_id', projectIds).order('created_at', { ascending: false }).limit(5),
        // Filtrer les messages par organization_id ou par project_id
        supabase.from('message_threads').select('id, is_read').in('project_id', projectIds).eq('is_read', false),
        // Filtrer le planning par project_id
        supabase.from('planning_phases').select('id, phase_name, status').in('project_id', projectIds).limit(5),
        // Filtrer les logs d'audit par organization_id
        supabase.from('audit_logs').select('id, action_type, user_id, created_at, users(first_name, last_name)').eq('organization_id', currentOrganization.id).order('created_at', { ascending: false }).limit(8)
      ]);

      const totalPaid = paymentsResult.data
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const delayedPayments = paymentsResult.data
        ?.filter(p => p.status === 'pending' && new Date(p.due_date) < new Date())
        .length || 0;

      const salesChartData = generateMonthlySalesData(lotsResult.data || []);
      const cfcChartData = await fetchCfcData(projectIds);

      const kpiData = {
        projects: projectsResult.data?.length || 0,
        lotsSold: lotsResult.data?.length || 0,
        paid: totalPaid,
        delayedPayments: delayedPayments,
        activeSoumissions: soumissionsResult.data?.length || 0,
        documentsRecent: documentsResult.data?.length || 0,
        unreadMessages: messagesResult.data?.length || 0
      };

      setData({
        kpis: kpiData,
        salesChart: salesChartData,
        cfcChart: cfcChartData,
        soumissions: soumissionsResult.data?.map(s => ({
          id: s.id,
          label: s.label || 'Sans titre',
          deadline: s.deadline ? new Date(s.deadline).toLocaleDateString('fr-CH') : '-',
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
  }, [currentOrganization]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, loading, error, refresh: fetchDashboardData };
}

function generateMonthlySalesData(lots: any[]): Array<{ month: string; sold: number }> {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();

  // Compter les ventes par mois basé sur les données réelles
  const salesByMonth: Record<number, number> = {};

  lots.forEach(lot => {
    if (lot.created_at) {
      const lotMonth = new Date(lot.created_at).getMonth();
      salesByMonth[lotMonth] = (salesByMonth[lotMonth] || 0) + 1;
    }
  });

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    last6Months.push({
      month: months[monthIndex],
      sold: salesByMonth[monthIndex] || 0
    });
  }

  return last6Months;
}

async function fetchCfcData(projectIds: string[]): Promise<Array<{ cfc: string; budget: number; spent: number }>> {
  if (projectIds.length === 0) return [];

  // Récupérer les budgets CFC pour les projets de l'organisation
  const { data: budgets } = await supabase
    .from('cfc_budgets')
    .select('id')
    .in('project_id', projectIds);

  if (!budgets || budgets.length === 0) return [];

  const budgetIds = budgets.map(b => b.id);

  const { data: cfcLines } = await supabase
    .from('cfc_lines')
    .select('code, label, amount_budgeted, amount_spent')
    .in('budget_id', budgetIds)
    .limit(6);

  if (!cfcLines) return [];

  return cfcLines.map(cfc => ({
    cfc: cfc.code || cfc.label || 'CFC',
    budget: parseFloat(cfc.amount_budgeted) || 0,
    spent: parseFloat(cfc.amount_spent) || 0
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
