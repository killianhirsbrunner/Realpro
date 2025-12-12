import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Home, TrendingUp, FileText, Building2,
  AlertCircle, Calendar, Users, Package, Settings, FolderOpen,
  ArrowRight, Briefcase, Hammer
} from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { supabase } from '../lib/supabase';
import { formatCHF, formatPercent, formatDateCH, formatRelativeTime } from '../lib/utils/format';
import { getStatusLabel } from '../lib/constants/status-labels';

interface ProjectCockpitData {
  project: {
    id: string;
    name: string;
    city: string;
    canton: string;
    status: string;
    type: string;
    total_lots: number;
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
    upcoming_signatures: Array<{
      buyer_name: string;
      lot_number: string;
      date: string;
    }>;
  };
  finance: {
    cfc_budget: number;
    cfc_engagement: number;
    cfc_invoiced: number;
    cfc_paid: number;
    top_cfc_lines: Array<{
      code: string;
      label: string;
      budget: number;
      engagement: number;
      invoiced: number;
      paid: number;
    }>;
  };
  construction: {
    overall_progress: number;
    phases: Array<{
      name: string;
      planned_end: string;
      actual_end: string | null;
      status: string;
    }>;
  };
  submissions: {
    in_progress: number;
    adjudicated: number;
    open_clarifications: number;
    recent: Array<{
      id: string;
      title: string;
      cfc_code: string;
      offers_count: number;
      status: string;
    }>;
  };
  activities: Array<{
    id: string;
    action: string;
    created_at: string;
    user_name: string;
  }>;
}

// Composant StatCard interne avec support dark mode
function CockpitStatCard({ label, value, icon: Icon, variant = 'default' }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'info';
}) {
  const variants = {
    default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    info: 'bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 text-realpro-turquoise',
  };

  return (
    <RealProCard padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${variants[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </RealProCard>
  );
}

// Composant MiniCard pour les KPI financiers
function MiniKPICard({ label, value, color = 'default' }: {
  label: string;
  value: string;
  color?: 'default' | 'brand' | 'success';
}) {
  const colors = {
    default: 'text-neutral-900 dark:text-neutral-100',
    brand: 'text-realpro-turquoise',
    success: 'text-green-600 dark:text-green-400',
  };

  return (
    <RealProCard padding="md">
      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${colors[color]}`}>{value}</p>
    </RealProCard>
  );
}

export function ProjectCockpit() {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<ProjectCockpitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchDashboardData(projectId);
    }
  }, [projectId]);

  async function fetchDashboardData(id: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch project info
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton, status, type')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      // Fetch lots statistics
      const { data: lots, error: lotsError } = await supabase
        .from('lots')
        .select('id, status, price_total')
        .eq('project_id', id);

      if (lotsError) throw lotsError;

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
      const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, l) => sum + (l.price_total || 0), 0) || 0;

      // Fetch notary files statistics
      const { data: notaryFiles } = await supabase
        .from('notary_files')
        .select('status, appointment_date, buyers(first_name, last_name), lots(lot_number)')
        .eq('project_id', id);

      const readyFiles = notaryFiles?.filter(f => f.status === 'READY').length || 0;
      const signedFiles = notaryFiles?.filter(f => f.status === 'SIGNED').length || 0;
      const incompleteFiles = notaryFiles?.filter(f => f.status === 'INCOMPLETE' || f.status === 'IN_PROGRESS').length || 0;

      const upcomingSignatures = (notaryFiles || [])
        .filter(f => f.appointment_date && f.status === 'READY')
        .sort((a, b) => new Date(a.appointment_date!).getTime() - new Date(b.appointment_date!).getTime())
        .slice(0, 5)
        .map(f => ({
          buyer_name: `${f.buyers?.first_name || ''} ${f.buyers?.last_name || ''}`.trim(),
          lot_number: f.lots?.lot_number || '',
          date: f.appointment_date!,
        }));

      // Fetch CFC budgets
      const { data: cfcBudgets } = await supabase
        .from('cfc_budgets')
        .select('name, total_amount')
        .eq('project_id', id)
        .order('total_amount', { ascending: false })
        .limit(5);

      const cfcTotal = (cfcBudgets || []).reduce((acc, cfc) => ({
        budget: acc.budget + (cfc.total_amount || 0),
        engagement: acc.engagement,
        invoiced: acc.invoiced,
        paid: acc.paid,
      }), { budget: 0, engagement: 0, invoiced: 0, paid: 0 });

      // Fetch construction phases
      const { data: phases } = await supabase
        .from('project_phases')
        .select('name, planned_end_date, actual_end_date, status, progress_percent')
        .eq('project_id', id)
        .order('order_index');

      const overallProgress = phases && phases.length > 0
        ? phases.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / phases.length
        : 0;

      // Fetch submissions statistics
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, title, reference, status')
        .eq('project_id', id);

      const submissionsInProgress = submissions?.filter(s => s.status === 'PUBLISHED').length || 0;
      const submissionsAdjudicated = submissions?.filter(s => s.status === 'ADJUDICATED').length || 0;

      const dashboardData: ProjectCockpitData = {
        project: {
          ...project,
          total_lots: totalLots,
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
          upcoming_signatures: upcomingSignatures,
        },
        finance: {
          cfc_budget: cfcTotal.budget,
          cfc_engagement: cfcTotal.engagement,
          cfc_invoiced: cfcTotal.invoiced,
          cfc_paid: cfcTotal.paid,
          top_cfc_lines: (cfcBudgets || []).map(cfc => ({
            code: (cfc as any).cfc_code || '',
            label: (cfc as any).label || '',
            budget: (cfc as any).budget_revised || (cfc as any).budget_initial || 0,
            engagement: (cfc as any).engagement_total || 0,
            invoiced: (cfc as any).invoiced_total || 0,
            paid: (cfc as any).paid_total || 0,
          })),
        },
        construction: {
          overall_progress: Math.round(overallProgress),
          phases: (phases || []).map(p => ({
            name: p.name,
            planned_end: p.planned_end_date || '',
            actual_end: p.actual_end_date,
            status: p.status,
          })),
        },
        submissions: {
          in_progress: submissionsInProgress,
          adjudicated: submissionsAdjudicated,
          open_clarifications: 0,
          recent: (submissions || []).slice(0, 5).map(s => ({
            id: s.id,
            title: s.title,
            cfc_code: (s as any).cfc_code || '',
            offers_count: ((s as any).submission_offers as any)?.length || 0,
            status: s.status,
          })),
        },
        activities: [],
      };

      setData(dashboardData);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement du cockpit projet..." />;
  if (error) return <ErrorState message={error} retry={() => fetchDashboardData(projectId!)} />;
  if (!data) return <ErrorState message="Projet introuvable" />;

  const { project, sales, notary, finance, construction, submissions, activities } = data;

  const getStatusBadgeType = (status: string): 'success' | 'warning' | 'info' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
      PLANNING: 'info',
      CONSTRUCTION: 'warning',
      SELLING: 'success',
      COMPLETED: 'neutral',
      ARCHIVED: 'neutral',
    };
    return map[status] || 'neutral';
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {project.name}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-medium">{project.type || 'PPE'}</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span>{project.city} ({project.canton})</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span>{project.total_lots} lots</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RealProBadge type={getStatusBadgeType(project.status)}>
            {getStatusLabel('project', project.status)}
          </RealProBadge>
          <Link to={`/projects/${project.id}/settings`}>
            <RealProButton variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Paramètres
            </RealProButton>
          </Link>
          <Link to={`/projects/${project.id}/documents`}>
            <RealProButton variant="outline" size="sm">
              <FolderOpen className="w-4 h-4" />
              Documents
            </RealProButton>
          </Link>
        </div>
      </div>

      {/* Section 1: Ventes & Lots */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Ventes & lots</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <CockpitStatCard label="Lots totaux" value={sales.total_lots} icon={Home} variant="default" />
          <CockpitStatCard label="Vendus" value={sales.sold_lots} icon={TrendingUp} variant="success" />
          <CockpitStatCard label="Réservés" value={sales.reserved_lots} icon={Calendar} variant="warning" />
          <CockpitStatCard label="Disponibles" value={sales.available_lots} icon={Package} variant="info" />
        </div>

        <RealProCard>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Taux de commercialisation</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
              {formatPercent(sales.sales_percentage)}
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 mb-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${sales.sales_percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Chiffre d'affaires : <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCHF(sales.total_revenue)}</span>
            </p>
            <Link
              to={`/projects/${project.id}/lots`}
              className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
            >
              Voir le programme de vente
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RealProCard>
      </section>

      {/* Section 2: Acheteurs & Notaire */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Acheteurs & notaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <RealProCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Dossiers prêts</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{notary.ready_files}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </RealProCard>

          <RealProCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Dossiers signés</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{notary.signed_files}</p>
              </div>
              <div className="p-3 bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 rounded-xl">
                <Users className="h-6 w-6 text-realpro-turquoise" />
              </div>
            </div>
          </RealProCard>

          <RealProCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Dossiers incomplets</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{notary.incomplete_files}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </RealProCard>
        </div>

        <RealProCard>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Signatures à venir</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Prochains rendez-vous de signature planifiés</p>
          </div>

          {notary.upcoming_signatures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Acheteur</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Lot</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notary.upcoming_signatures.map((sig, idx) => (
                    <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">{sig.buyer_name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100">{sig.lot_number}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDateCH(sig.date)}</td>
                      <td className="py-3 px-4 text-right">
                        <RealProButton size="sm" variant="secondary">Confirmer</RealProButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">
              Aucune signature planifiée cette semaine.
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              to={`/projects/${project.id}/notary`}
              className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
            >
              Voir tous les dossiers notaire
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RealProCard>
      </section>

      {/* Section 3: Budget CFC & Contrats */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Budget CFC & contrats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <MiniKPICard label="Budget initial" value={formatCHF(finance.cfc_budget)} />
          <MiniKPICard label="Engagé" value={formatCHF(finance.cfc_engagement)} color="brand" />
          <MiniKPICard label="Facturé" value={formatCHF(finance.cfc_invoiced)} color="brand" />
          <MiniKPICard label="Payé" value={formatCHF(finance.cfc_paid)} color="success" />
        </div>

        <RealProCard>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Détail par poste CFC</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Top 5 des postes les plus importants</p>
          </div>

          {finance.top_cfc_lines.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">CFC</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Budget révisé</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Engagé</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Facturé</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Payé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finance.top_cfc_lines.map(line => (
                      <tr key={line.code} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{line.code}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{line.label}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-right text-sm text-neutral-900 dark:text-neutral-100">{formatCHF(line.budget)}</td>
                        <td className="py-3 px-4 font-mono text-right text-sm text-neutral-900 dark:text-neutral-100">{formatCHF(line.engagement)}</td>
                        <td className="py-3 px-4 font-mono text-right text-sm text-neutral-900 dark:text-neutral-100">{formatCHF(line.invoiced)}</td>
                        <td className="py-3 px-4 font-mono text-right text-sm text-neutral-900 dark:text-neutral-100">{formatCHF(line.paid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-4">
                <Link
                  to={`/projects/${project.id}/cfc`}
                  className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
                >
                  Voir le détail CFC
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/projects/${project.id}/finances`}
                  className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
                >
                  Voir les contrats entreprises
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">
              Aucun budget CFC n'a été saisi pour ce projet.
            </p>
          )}
        </RealProCard>
      </section>

      {/* Section 4: Chantier & Planning */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Chantier & planning</h2>

        <RealProCard className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Avancement global</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
              {formatPercent(construction.overall_progress)}
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
            <div
              className="bg-realpro-turquoise h-3 rounded-full transition-all"
              style={{ width: `${construction.overall_progress}%` }}
            />
          </div>
        </RealProCard>

        {construction.phases.length > 0 && (
          <RealProCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Phase</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Prévu</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Réel</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {construction.phases.map((phase, idx) => (
                    <tr key={idx} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                      <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{phase.name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDateCH(phase.planned_end)}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{phase.actual_end ? formatDateCH(phase.actual_end) : '—'}</td>
                      <td className="py-3 px-4">
                        <RealProBadge type={phase.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                          {getStatusLabel('phase', phase.status)}
                        </RealProBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Link
                to={`/projects/${project.id}/construction`}
                className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
              >
                Voir le planning détaillé
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RealProCard>
        )}
      </section>

      {/* Section 5: Soumissions & Adjudications */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Soumissions & adjudications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <CockpitStatCard label="En cours" value={submissions.in_progress} icon={Briefcase} variant="info" />
          <CockpitStatCard label="Adjugées" value={submissions.adjudicated} icon={TrendingUp} variant="success" />
          <CockpitStatCard label="Clarifications ouvertes" value={submissions.open_clarifications} icon={AlertCircle} variant="warning" />
        </div>

        {submissions.recent.length > 0 && (
          <RealProCard>
            <div className="space-y-3">
              {submissions.recent.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{sub.title}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      CFC {sub.cfc_code} • {sub.offers_count} offres
                    </p>
                  </div>
                  <RealProBadge type="neutral" size="sm">{getStatusLabel('submission', sub.status)}</RealProBadge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Link
                to={`/projects/${project.id}/submissions`}
                className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
              >
                Gérer les soumissions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RealProCard>
        )}
      </section>

      {/* Section 6: Activité récente */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Activité récente</h2>
        <RealProCard>
          {activities.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 py-8 text-center">
              Aucune activité récente
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-realpro-turquoise" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{activity.action}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {activity.user_name} • {formatRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              to={`/projects/${project.id}/communication`}
              className="text-sm text-realpro-turquoise hover:text-realpro-turquoise/80 font-medium inline-flex items-center gap-1"
            >
              Voir tous les messages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RealProCard>
      </section>
    </div>
  );
}
