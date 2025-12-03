import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings, FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProjectKPIs } from '../components/project/ProjectKPIs';
import { ProjectTimeline } from '../components/project/ProjectTimeline';
import { ProjectQuickActions } from '../components/project/ProjectQuickActions';
import { supabase } from '../lib/supabase';
import { getStatusLabel } from '../lib/constants/status-labels';

interface ProjectOverviewData {
  project: {
    id: string;
    name: string;
    city: string;
    canton: string;
    status: string;
    type: string;
    description?: string | null;
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
        .select('id, name, city, canton, status, type, description')
        .eq('id', id)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!project) throw new Error('Project not found');

      const { data: lots } = await supabase
        .from('lots')
        .select('id, status, price_vat')
        .eq('project_id', id);

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
      const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, l) => sum + (l.price_vat || 0), 0) || 0;

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

  const { project, sales, notary, finance, construction } = data;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name },
        ]}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {project.name}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{project.type || 'PPE'}</span>
            <span>•</span>
            <span>{project.city} ({project.canton})</span>
            {project.description && (
              <>
                <span>•</span>
                <span className="line-clamp-1">{project.description}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info" className="text-sm px-3 py-1.5">
            {getStatusLabel('project', project.status)}
          </Badge>

          <Link to={`/projects/${project.id}/documents`}>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </Button>
          </Link>

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>

          <Link to={`/projects/${project.id}/settings`}>
            <Button variant="secondary" className="gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </Button>
          </Link>
        </div>
      </div>

      <ProjectKPIs
        sales={sales}
        notary={notary}
        finance={finance}
        construction={construction}
      />

      {construction.phases.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Planning & phases</h2>
          <ProjectTimeline phases={construction.phases} />
        </section>
      )}

      <ProjectQuickActions projectId={project.id} />
    </div>
  );
}
