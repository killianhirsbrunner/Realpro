import { useEffect, useState } from 'react';
import { TrendingUp, Home, FileText, Hammer, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { supabase } from '../lib/supabase';
import { formatCHF, formatPercent, formatDateCH, formatRelativeTime } from '../lib/utils/format';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  total_lots: number;
  sold_lots: number;
  reserved_lots: number;
  available_lots: number;
  total_revenue: number;
  construction_progress: number;
  pending_notary_files: number;
  upcoming_signatures: number;
  cfc_budget: number;
  cfc_engagement: number;
  cfc_invoiced: number;
  alerts_count: number;
}

interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  user_name: string;
  project_name: string;
}

export function PromoterDashboard() {
  const { user, organization } = useCurrentUser();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [organization?.id]);

  async function fetchDashboardData() {
    if (!organization?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch projects with aggregated data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          lots (
            id,
            status,
            price_vat
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // TODO: Fetch additional aggregated data per project
      // - Notary files status
      // - Construction progress from project_phases
      // - CFC data from cfc_budgets
      // - Recent activities from audit_log

      const summaries: ProjectSummary[] = (projectsData || []).map(project => {
        const lots = project.lots || [];
        const totalLots = lots.length;
        const soldLots = lots.filter(l => l.status === 'SOLD').length;
        const reservedLots = lots.filter(l => l.status === 'RESERVED').length;
        const availableLots = lots.filter(l => l.status === 'AVAILABLE').length;
        const totalRevenue = lots
          .filter(l => l.status === 'SOLD')
          .reduce((sum, l) => sum + (l.price_vat || 0), 0);

        return {
          id: project.id,
          name: project.name,
          status: project.status,
          total_lots: totalLots,
          sold_lots: soldLots,
          reserved_lots: reservedLots,
          available_lots: availableLots,
          total_revenue: totalRevenue,
          construction_progress: 0, // TODO: Calculate from phases
          pending_notary_files: 0, // TODO: Count from notary_files
          upcoming_signatures: 0, // TODO: Count from notary_appointments
          cfc_budget: 0, // TODO: Sum from cfc_budgets
          cfc_engagement: 0,
          cfc_invoiced: 0,
          alerts_count: 0, // TODO: Calculate alerts
        };
      });

      setProjects(summaries);

      // Fetch recent activities
      // TODO: Implement audit_log queries
      setActivities([]);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement du tableau de bord..." />;
  if (error) return <ErrorState message={error} retry={fetchDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord promoteur
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de vos projets immobiliers
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Projets actifs"
          value={projects.filter(p => p.status !== 'COMPLETED').length}
          icon={Home}
          variant="default"
        />
        <StatCard
          label="Lots vendus"
          value={projects.reduce((sum, p) => sum + p.sold_lots, 0)}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="Chiffre d'affaires"
          value={formatCHF(projects.reduce((sum, p) => sum + p.total_revenue, 0))}
          icon={FileText}
          variant="success"
        />
        <StatCard
          label="Alertes"
          value={projects.reduce((sum, p) => sum + p.alerts_count, 0)}
          icon={AlertCircle}
          variant={projects.some(p => p.alerts_count > 0) ? 'warning' : 'default'}
        />
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Vos projets</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div>
                    <Card.Title>{project.name}</Card.Title>
                    <Card.Description>
                      {project.total_lots} lots • {project.sold_lots} vendus
                    </Card.Description>
                  </div>
                  <Badge variant="info">{project.status}</Badge>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {/* Sales Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Commercialisation</span>
                      <span className="text-gray-500">
                        {formatPercent((project.sold_lots / project.total_lots) * 100)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(project.sold_lots / project.total_lots) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{project.available_lots} disponibles</span>
                      <span>{project.reserved_lots} réservés</span>
                      <span>{project.sold_lots} vendus</span>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chiffre d'affaires</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCHF(project.total_revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avancement chantier</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPercent(project.construction_progress)}
                      </p>
                    </div>
                  </div>

                  {/* Alerts */}
                  {project.alerts_count > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        {project.alerts_count} point{project.alerts_count > 1 ? 's' : ''} d'attention
                      </span>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {project.pending_notary_files} dossiers notaire
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {project.upcoming_signatures} signatures
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <Card>
            <Card.Content>
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun projet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Commencez par créer votre premier projet immobilier
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Créer un projet
                </button>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <Card.Title>Activité récente</Card.Title>
          <Card.Description>
            Dernières actions sur vos projets
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Aucune activité récente
            </p>
          ) : (
            <div className="space-y-3">
              {activities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.project_name} • {activity.user_name} • {formatRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
