import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProjectHeader } from '../components/project/ProjectHeader';
import { ProjectKPIs } from '../components/project/ProjectKPIs';
import { ProjectTimeline } from '../components/project/ProjectTimeline';
import { ProjectLotsCard } from '../components/project/ProjectLotsCard';
import { ProjectSoumissionsCard } from '../components/project/ProjectSoumissionsCard';
import { ProjectDocumentsCard } from '../components/project/ProjectDocumentsCard';
import { ProjectMessagesCard } from '../components/project/ProjectMessagesCard';
import { ProjectFinanceCard } from '../components/project/ProjectFinanceCard';
import { ProjectQuickActions } from '../components/project/ProjectQuickActions';
import { supabase } from '../lib/supabase';

interface ProjectOverviewData {
  project: {
    id: string;
    name: string;
    city: string;
    canton: string;
    postal_code?: string;
    address?: string | null;
    status: string;
    type: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };
  sales: {
    total_lots: number;
    sold_lots: number;
    reserved_lots: number;
    available_lots: number;
    sales_percentage: number;
    total_revenue: number;
  };
  notary: {
    ready_files: number;
    signed_files: number;
    incomplete_files: number;
  };
  finance: {
    cfc_budget: number;
    cfc_engagement: number;
    cfc_invoiced: number;
    cfc_paid: number;
  };
  construction: {
    overall_progress: number;
    phases: Array<{
      name: string;
      planned_end: string;
      actual_end: string | null;
      status: string;
      progress_percent?: number;
    }>;
  };
  submissions: Array<{
    id: string;
    title: string;
    cfc_code?: string;
    status: string;
    deadline?: string | null;
    offers_count: number;
    estimated_amount?: number;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size?: number;
    uploaded_at: string;
    uploaded_by?: string;
    category?: string;
  }>;
  messages: Array<{
    id: string;
    content: string;
    author_name: string;
    author_role?: string;
    created_at: string;
    is_unread?: boolean;
    priority?: 'high' | 'normal' | 'low';
  }>;
}

export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<ProjectOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  async function fetchProjectData(id: string) {
    try {
      setLoading(true);
      setError(null);

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton, postal_code, address, status, type, description, start_date, end_date')
        .eq('id', id)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!project) throw new Error('Project not found');

      const { data: lots } = await supabase
        .from('lots')
        .select('id, status, price_total')
        .eq('project_id', id);

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
      const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, l) => sum + (l.price_total || 0), 0) || 0;

      const { data: notaryFiles } = await supabase
        .from('notary_files')
        .select('status')
        .eq('project_id', id);

      const readyFiles = notaryFiles?.filter(f => f.status === 'READY').length || 0;
      const signedFiles = notaryFiles?.filter(f => f.status === 'SIGNED').length || 0;
      const incompleteFiles = notaryFiles?.filter(f =>
        f.status === 'INCOMPLETE' || f.status === 'IN_PROGRESS'
      ).length || 0;

      const { data: cfcBudgets } = await supabase
        .from('cfc_budgets')
        .select('budget_initial, budget_revised, engagement_total, invoiced_total, paid_total')
        .eq('project_id', id);

      const cfcTotal = (cfcBudgets || []).reduce((acc, cfc) => ({
        budget: acc.budget + (cfc.budget_revised || cfc.budget_initial || 0),
        engagement: acc.engagement + (cfc.engagement_total || 0),
        invoiced: acc.invoiced + (cfc.invoiced_total || 0),
        paid: acc.paid + (cfc.paid_total || 0),
      }), { budget: 0, engagement: 0, invoiced: 0, paid: 0 });

      const { data: phases } = await supabase
        .from('project_phases')
        .select('name, planned_end_date, actual_end_date, status, progress_percent')
        .eq('project_id', id)
        .order('order_index');

      const overallProgress = phases && phases.length > 0
        ? phases.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / phases.length
        : 0;

      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, title, cfc_code, status, deadline, estimated_amount')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: documents } = await supabase
        .from('project_documents')
        .select('id, name, file_type, file_size, uploaded_at, uploaded_by_name, category')
        .eq('project_id', id)
        .order('uploaded_at', { ascending: false })
        .limit(10);

      const { data: messages } = await supabase
        .from('project_messages')
        .select('id, content, author_name, author_role, created_at, is_read, priority')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      const projectData: ProjectOverviewData = {
        project: {
          ...project,
        },
        sales: {
          total_lots: totalLots,
          sold_lots: soldLots,
          reserved_lots: reservedLots,
          available_lots: availableLots,
          sales_percentage: totalLots > 0 ? (soldLots / totalLots) * 100 : 0,
          total_revenue: totalRevenue,
        },
        notary: {
          ready_files: readyFiles,
          signed_files: signedFiles,
          incomplete_files: incompleteFiles,
        },
        finance: {
          cfc_budget: cfcTotal.budget,
          cfc_engagement: cfcTotal.engagement,
          cfc_invoiced: cfcTotal.invoiced,
          cfc_paid: cfcTotal.paid,
        },
        construction: {
          overall_progress: Math.round(overallProgress),
          phases: (phases || []).map(p => ({
            name: p.name,
            planned_end: p.planned_end_date || '',
            actual_end: p.actual_end_date,
            status: p.status,
            progress_percent: p.progress_percent || undefined,
          })),
        },
        submissions: (submissions || []).map(s => ({
          id: s.id,
          title: s.title,
          cfc_code: s.cfc_code || undefined,
          status: s.status,
          deadline: s.deadline || null,
          offers_count: 0,
          estimated_amount: s.estimated_amount || undefined,
        })),
        documents: (documents || []).map(d => ({
          id: d.id,
          name: d.name,
          type: d.file_type || 'application/pdf',
          size: d.file_size || undefined,
          uploaded_at: d.uploaded_at,
          uploaded_by: d.uploaded_by_name || undefined,
          category: d.category || undefined,
        })),
        messages: (messages || []).map(m => ({
          id: m.id,
          content: m.content,
          author_name: m.author_name,
          author_role: m.author_role || undefined,
          created_at: m.created_at,
          is_unread: !m.is_read,
          priority: m.priority as 'high' | 'normal' | 'low' | undefined,
        })),
      };

      setData(projectData);
    } catch (err: any) {
      console.error('Error fetching project data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement du cockpit projet..." />;
  if (error) return <ErrorState message={error} retry={() => projectId && fetchProjectData(projectId)} />;
  if (!data) return <ErrorState message="Projet introuvable" />;

  const { project, sales, notary, finance, construction, documents, messages, submissions } = data;

  const lotsData = {
    total: sales.total_lots,
    available: sales.available_lots,
    reserved: sales.reserved_lots,
    sold: sales.sold_lots,
    totalRevenue: sales.total_revenue,
    averagePrice: sales.total_lots > 0 ? sales.total_revenue / sales.sold_lots : 0,
  };

  const financeData = {
    cfc_budget: finance.cfc_budget,
    cfc_engagement: finance.cfc_engagement,
    cfc_invoiced: finance.cfc_invoiced,
    cfc_paid: finance.cfc_paid,
    sales_revenue: sales.total_revenue,
    pending_payments: 0,
  };

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name },
        ]}
      />

      <ProjectHeader
        project={project}
        progress={construction.overall_progress}
      />

      <ProjectKPIs
        sales={sales}
        notary={notary}
        finance={finance}
        construction={construction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {construction.phases.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avancement chantier</h2>
            <ProjectTimeline phases={construction.phases} />
          </div>
        )}

        <ProjectLotsCard
          projectId={project.id}
          lots={lotsData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectSoumissionsCard
          projectId={project.id}
          soumissions={submissions}
          stats={{
            published: submissions.filter(s => s.status === 'PUBLISHED').length,
            adjudicated: submissions.filter(s => s.status === 'ADJUDICATED').length,
          }}
        />

        <ProjectDocumentsCard
          projectId={project.id}
          documents={documents}
          totalCount={documents.length}
        />
      </div>

      <ProjectMessagesCard
        projectId={project.id}
        messages={messages}
        unreadCount={messages.filter(m => m.is_unread).length}
      />

      <ProjectFinanceCard
        projectId={project.id}
        finance={financeData}
      />

      <ProjectQuickActions projectId={project.id} />
    </div>
  );
}
