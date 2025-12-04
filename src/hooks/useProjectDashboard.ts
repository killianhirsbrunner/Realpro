import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProjectDashboardData {
  project: {
    id: string;
    name: string;
    city?: string;
    canton?: string;
    status: string;
    type?: string;
  };
  kpis: {
    soldLots: number;
    totalLots: number;
    buyersWaiting: number;
    documentsPending: number;
    nextNotaryDate: string | null;
    totalPaid: number;
    constructionProgress: number;
  };
  sales: {
    lotsTotal: number;
    lotsSold: number;
    lotsReserved: number;
    lotsFree: number;
  };
  finance: {
    cfcBudget: number;
    cfcEngaged: number;
    cfcInvoiced: number;
    cfcPaid: number;
  };
  planning: {
    progressPct: number;
    nextMilestone?: {
      name: string;
      plannedEnd: string;
    } | null;
  };
  notary: {
    buyerFilesTotal: number;
    readyForNotary: number;
    signed: number;
  };
  submissions: {
    open: number;
    adjudicated: number;
  };
  deadlines: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    type: 'submission' | 'payment' | 'notary' | 'construction' | 'meeting';
    status: 'upcoming' | 'urgent' | 'overdue' | 'completed';
    link?: string;
  }>;
  recentDocuments: Array<{
    id: string;
    name: string;
    type: string;
    uploaded_at: string;
    uploaded_by: string;
  }>;
  recentMessages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender_name: string;
    thread_id: string;
  }>;
}

export function useProjectDashboard(projectId: string) {
  const [data, setData] = useState<ProjectDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (projectId) {
      loadDashboardData();
    }
  }, [projectId]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/project-dashboard`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du dashboard');
      }

      const dashboardData = await response.json();

      const [documentsResult, messagesResult] = await Promise.all([
        supabase
          .from('documents')
          .select('id, name, type, uploaded_at, uploaded_by')
          .eq('project_id', projectId)
          .order('uploaded_at', { ascending: false })
          .limit(5),
        supabase
          .from('messages')
          .select('id, content, created_at, sender_name, thread_id')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const deadlines = await generateDeadlines(projectId);

      setData({
        ...dashboardData,
        deadlines,
        recentDocuments: documentsResult.data || [],
        recentMessages: messagesResult.data || [],
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function generateDeadlines(projectId: string) {
    const deadlines: ProjectDashboardData['deadlines'] = [];

    const [submissionsResult, paymentsResult] = await Promise.all([
      supabase
        .from('submissions')
        .select('id, title, closing_date, status')
        .eq('project_id', projectId)
        .in('status', ['OPEN', 'ANALYZING'])
        .order('closing_date', { ascending: true })
        .limit(3),
      supabase
        .from('buyer_payments')
        .select('id, amount, due_date, status, buyers(first_name, last_name)')
        .eq('project_id', projectId)
        .eq('status', 'PENDING')
        .order('due_date', { ascending: true })
        .limit(3),
    ]);

    if (submissionsResult.data) {
      submissionsResult.data.forEach((sub) => {
        const daysUntil = Math.ceil(
          (new Date(sub.closing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        deadlines.push({
          id: sub.id,
          title: sub.title,
          description: 'Date limite de soumission',
          date: sub.closing_date,
          type: 'submission',
          status: daysUntil < 0 ? 'overdue' : daysUntil <= 7 ? 'urgent' : 'upcoming',
          link: `/projects/${projectId}/submissions/${sub.id}`,
        });
      });
    }

    if (paymentsResult.data) {
      paymentsResult.data.forEach((payment: any) => {
        const daysUntil = Math.ceil(
          (new Date(payment.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const buyerName = payment.buyers ? `${payment.buyers.first_name} ${payment.buyers.last_name}` : 'Acheteur';
        deadlines.push({
          id: payment.id,
          title: `Paiement ${buyerName}`,
          description: `CHF ${payment.amount?.toLocaleString('fr-CH')}`,
          date: payment.due_date,
          type: 'payment',
          status: daysUntil < 0 ? 'overdue' : daysUntil <= 7 ? 'urgent' : 'upcoming',
        });
      });
    }

    return deadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return { data, loading, error, refresh: loadDashboardData };
}
