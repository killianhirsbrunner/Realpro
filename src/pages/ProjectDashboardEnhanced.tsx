import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProjectDashboard } from '../hooks/useProjectDashboard';
import {
  Home,
  DollarSign,
  ClipboardList,
  MessageSquare,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

export default function ProjectDashboardEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data, loading } = useProjectDashboard(projectId!);

  const kpis = [
    {
      title: 'Lots vendus',
      value: `${data?.soldLots || 0}/${data?.totalLots || 0}`,
      percentage: data?.salesPercentage || 0,
      icon: Home,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Avenants en attente',
      value: data?.pendingAvenants || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      action: () => navigate(`/projects/${projectId}/modifications`),
    },
    {
      title: 'Soumissions actives',
      value: data?.activeTenders || 0,
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      action: () => navigate(`/projects/${projectId}/submissions`),
    },
    {
      title: 'Messages non lus',
      value: data?.unreadMessages || 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      action: () => navigate(`/projects/${projectId}/communication`),
    },
  ];

  return (
    <PageShell
      title={data?.project?.name || 'Projet'}
      subtitle={data?.project?.address}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/projects/${projectId}/settings`)}>
            Paramètres
          </Button>
          <Button onClick={() => navigate(`/projects/${projectId}/lots/new`)}>
            Actions rapides
          </Button>
        </div>
      }
      loading={loading}
    >
      <div className="space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <Card
                key={kpi.title}
                className={clsx(
                  'p-6 transition-all duration-200',
                  kpi.action && 'cursor-pointer hover:shadow-lg-premium hover:-translate-y-0.5'
                )}
                onClick={kpi.action}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {kpi.value}
                </h3>
                {kpi.percentage !== undefined && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${kpi.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {kpi.percentage}% de vente
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CRM Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                CRM
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/crm`)}
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Prospects</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {data?.crm?.prospects || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Réservations</span>
                <span className="font-semibold text-orange-600">
                  {data?.crm?.reservations || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Acheteurs</span>
                <span className="font-semibold text-green-600">
                  {data?.crm?.buyers || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Finances Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Finances
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/finances`)}
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Budget total</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {data?.finances?.totalBudget?.toLocaleString('fr-CH') || 0} CHF
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Engagé</span>
                <span className="font-semibold text-orange-600">
                  {data?.finances?.committed?.toLocaleString('fr-CH') || 0} CHF
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Facturé</span>
                <span className="font-semibold text-green-600">
                  {data?.finances?.invoiced?.toLocaleString('fr-CH') || 0} CHF
                </span>
              </div>
            </div>
          </Card>

        </div>

        {/* Documents récents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Documents récents</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/projects/${projectId}/documents`)}
            >
              Voir tous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.recentDocuments?.map((doc) => (
              <Card
                key={doc.id}
                className="p-4 cursor-pointer hover:shadow-lg-premium transition-all duration-200"
              >
                <FileText className="h-8 w-8 text-primary-600 mb-3" />
                <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                  {doc.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {doc.category}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  {doc.updatedAt}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Tâches à venir */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tâches à venir</h3>
          </div>

          <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data?.upcomingTasks?.map((task) => (
              <div key={task.id} className="p-4 flex items-start gap-4">
                <div className={clsx(
                  'p-2 rounded-lg',
                  task.priority === 'high' && 'bg-red-50 dark:bg-red-900/20',
                  task.priority === 'medium' && 'bg-orange-50 dark:bg-orange-900/20',
                  task.priority === 'low' && 'bg-blue-50 dark:bg-blue-900/20'
                )}>
                  <Clock className={clsx(
                    'h-4 w-4',
                    task.priority === 'high' && 'text-red-600',
                    task.priority === 'medium' && 'text-orange-600',
                    task.priority === 'low' && 'text-blue-600'
                  )} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {task.title}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {task.description}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                    Échéance: {task.dueDate}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </PageShell>
  );
}
