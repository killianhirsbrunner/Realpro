import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Home, TrendingUp, FileText, Hammer, Building2,
  AlertCircle, Calendar, Users, Package
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { formatCHF, formatPercent, formatDateCH, formatRelativeTime } from '../lib/utils/format';
import { getStatusLabel, LOT_STATUS_COLORS } from '../lib/constants/status-labels';

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
        .select('id, status, price_vat')
        .eq('project_id', id);

      if (lotsError) throw lotsError;

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
      const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, l) => sum + (l.price_vat || 0), 0) || 0;

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
        .select('cfc_code, label, budget_initial, budget_revised, engagement_total, invoiced_total, paid_total')
        .eq('project_id', id)
        .order('budget_revised', { ascending: false })
        .limit(5);

      const cfcTotal = (cfcBudgets || []).reduce((acc, cfc) => ({
        budget: acc.budget + (cfc.budget_initial || 0),
        engagement: acc.engagement + (cfc.engagement_total || 0),
        invoiced: acc.invoiced + (cfc.invoiced_total || 0),
        paid: acc.paid + (cfc.paid_total || 0),
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
        .select('id, title, cfc_code, status, submission_offers(count)')
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
            code: cfc.cfc_code,
            label: cfc.label || '',
            budget: cfc.budget_revised || cfc.budget_initial || 0,
            engagement: cfc.engagement_total || 0,
            invoiced: cfc.invoiced_total || 0,
            paid: cfc.paid_total || 0,
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
            cfc_code: s.cfc_code || '',
            offers_count: (s.submission_offers as any)?.length || 0,
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {project.name}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span>{project.type || 'PPE'}</span>
            <span>•</span>
            <span>{project.city} ({project.canton})</span>
            <span>•</span>
            <span>{project.total_lots} lots</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">{getStatusLabel('project', project.status)}</Badge>
          <Button variant="secondary">Paramètres du projet</Button>
          <Button variant="secondary">Documents</Button>
        </div>
      </div>

      {/* Block 1: Sales KPIs */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ventes & lots</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Lots totaux"
            value={sales.total_lots}
            icon={Home}
            variant="default"
          />
          <StatCard
            label="Vendus"
            value={sales.sold_lots}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            label="Réservés"
            value={sales.reserved_lots}
            icon={Calendar}
            variant="warning"
          />
          <StatCard
            label="Disponibles"
            value={sales.available_lots}
            icon={Package}
            variant="info"
          />
        </div>

        <Card>
          <Card.Content>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Taux de commercialisation</span>
              <span className="text-gray-900 font-semibold">
                {formatPercent(sales.sales_percentage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${sales.sales_percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Chiffre d'affaires: <span className="font-semibold text-gray-900">{formatCHF(sales.total_revenue)}</span>
              </p>
              <a
                href={`/projects/${project.id}/lots`}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Voir le programme de vente →
              </a>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Block 2: Buyers & Notary */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acheteurs & notaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dossiers prêts</p>
                  <p className="text-2xl font-bold text-gray-900">{notary.ready_files}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dossiers signés</p>
                  <p className="text-2xl font-bold text-gray-900">{notary.signed_files}</p>
                </div>
                <div className="p-3 bg-brand-50 rounded-xl">
                  <Users className="h-6 w-6 text-brand-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dossiers incomplets</p>
                  <p className="text-2xl font-bold text-gray-900">{notary.incomplete_files}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Signatures à venir</Card.Title>
            <Card.Description>
              Prochains rendez-vous de signature planifiés
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {notary.upcoming_signatures.length > 0 ? (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Acheteur</Table.Head>
                    <Table.Head>Lot</Table.Head>
                    <Table.Head>Date de signature</Table.Head>
                    <Table.Head>Action</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {notary.upcoming_signatures.map((sig, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{sig.buyer_name}</Table.Cell>
                      <Table.Cell>{sig.lot_number}</Table.Cell>
                      <Table.Cell>{formatDateCH(sig.date)}</Table.Cell>
                      <Table.Cell>
                        <Button size="sm" variant="secondary">Confirmer</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune signature planifiée cette semaine.
              </p>
            )}
          </Card.Content>
        </Card>

        <div className="mt-4">
          <a
            href={`/projects/${project.id}/notary`}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Voir tous les dossiers notaire →
          </a>
        </div>
      </section>

      {/* Block 3: CFC & Finance */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget CFC & contrats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <Card.Content>
              <p className="text-xs text-gray-500 mb-1">Budget initial</p>
              <p className="text-lg font-semibold text-gray-900">{formatCHF(finance.cfc_budget)}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <p className="text-xs text-gray-500 mb-1">Engagé</p>
              <p className="text-lg font-semibold text-brand-600">{formatCHF(finance.cfc_engagement)}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <p className="text-xs text-gray-500 mb-1">Facturé</p>
              <p className="text-lg font-semibold text-orange-600">{formatCHF(finance.cfc_invoiced)}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <p className="text-xs text-gray-500 mb-1">Payé</p>
              <p className="text-lg font-semibold text-green-600">{formatCHF(finance.cfc_paid)}</p>
            </Card.Content>
          </Card>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Détail par poste CFC</Card.Title>
            <Card.Description>
              Top 5 des postes les plus importants
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {finance.top_cfc_lines.length > 0 ? (
              <>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>CFC</Table.Head>
                      <Table.Head className="text-right">Budget révisé</Table.Head>
                      <Table.Head className="text-right">Engagé</Table.Head>
                      <Table.Head className="text-right">Facturé</Table.Head>
                      <Table.Head className="text-right">Payé</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {finance.top_cfc_lines.map(line => (
                      <Table.Row key={line.code}>
                        <Table.Cell>
                          <div>
                            <div className="font-medium text-sm">{line.code}</div>
                            <div className="text-xs text-gray-500">{line.label}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-mono text-right text-sm">{formatCHF(line.budget)}</Table.Cell>
                        <Table.Cell className="font-mono text-right text-sm">{formatCHF(line.engagement)}</Table.Cell>
                        <Table.Cell className="font-mono text-right text-sm">{formatCHF(line.invoiced)}</Table.Cell>
                        <Table.Cell className="font-mono text-right text-sm">{formatCHF(line.paid)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <a href={`/projects/${project.id}/cfc`} className="text-brand-600 hover:text-brand-700 font-medium">
                    Voir le détail CFC →
                  </a>
                  <a href={`/projects/${project.id}/contracts`} className="text-brand-600 hover:text-brand-700 font-medium">
                    Voir les contrats entreprises →
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucun budget CFC n'a été saisi pour ce projet.
              </p>
            )}
          </Card.Content>
        </Card>
      </section>

      {/* Block 4: Construction */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chantier & planning</h2>
        <Card className="mb-4">
          <Card.Content>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Avancement global</span>
              <span className="text-gray-900 font-semibold">
                {formatPercent(construction.overall_progress)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-brand-600 h-3 rounded-full transition-all"
                style={{ width: `${construction.overall_progress}%` }}
              />
            </div>
          </Card.Content>
        </Card>

        {construction.phases.length > 0 && (
          <Card>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Phase</Table.Head>
                    <Table.Head>Prévu</Table.Head>
                    <Table.Head>Réel</Table.Head>
                    <Table.Head>Statut</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {construction.phases.map((phase, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell className="font-medium">{phase.name}</Table.Cell>
                      <Table.Cell>{formatDateCH(phase.planned_end)}</Table.Cell>
                      <Table.Cell>{phase.actual_end ? formatDateCH(phase.actual_end) : '—'}</Table.Cell>
                      <Table.Cell>
                        <Badge variant={phase.status === 'COMPLETED' ? 'success' : 'info'}>
                          {getStatusLabel('phase', phase.status)}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <div className="mt-4">
                <a
                  href={`/projects/${project.id}/construction`}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Voir le planning détaillé →
                </a>
              </div>
            </Card.Content>
          </Card>
        )}
      </section>

      {/* Block 5: Submissions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Soumissions & adjudications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <Card.Content>
              <p className="text-sm text-gray-500">Soumissions en cours</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.in_progress}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <p className="text-sm text-gray-500">Soumissions adjugées</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.adjudicated}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <p className="text-sm text-gray-500">Clarifications ouvertes</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.open_clarifications}</p>
            </Card.Content>
          </Card>
        </div>

        {submissions.recent.length > 0 && (
          <Card>
            <Card.Content>
              <div className="space-y-3">
                {submissions.recent.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sub.title}</p>
                      <p className="text-sm text-gray-500">
                        CFC {sub.cfc_code} • {sub.offers_count} offres
                      </p>
                    </div>
                    <Badge>{getStatusLabel('submission', sub.status)}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href={`/projects/${project.id}/submissions`}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Gérer les soumissions →
                </a>
              </div>
            </Card.Content>
          </Card>
        )}
      </section>

      {/* Block 6: Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <Card>
          <Card.Content>
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-brand-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user_name} • {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <a
                href={`/projects/${project.id}/communication`}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Voir tous les messages →
              </a>
            </div>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}
