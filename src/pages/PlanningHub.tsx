import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePlanning } from '../hooks/usePlanning';
import {
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Package,
  ArrowRight,
  Plus,
  FileText,
  Camera,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

export function PlanningHub() {
  const navigate = useNavigate();
  const [projectId] = useState<string | null>(null);
  const { milestones, loading } = usePlanning(projectId || undefined);

  const quickActions = [
    {
      title: 'Ajouter Jalon',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/planning/milestones/new',
    },
    {
      title: 'Nouvelle Phase',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/planning/phases/new',
    },
    {
      title: 'Ajouter Photos',
      icon: Camera,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/planning/photos/upload',
    },
    {
      title: 'Journal Chantier',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/planning/diary/new',
    },
  ];

  const modules = [
    {
      id: 'gantt',
      title: 'Diagramme de Gantt',
      description: 'Visualisation chronologique des tâches',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/planning/gantt',
      stats: { tasks: 156, progress: '67%' },
    },
    {
      id: 'milestones',
      title: 'Jalons',
      description: 'Étapes clés et échéances importantes',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/planning/milestones',
      stats: { total: milestones?.length || 0, upcoming: 5 },
    },
    {
      id: 'phases',
      title: 'Phases de Construction',
      description: 'Gestion des phases du projet',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/planning/phases',
      stats: { active: 3, total: 8 },
    },
    {
      id: 'resources',
      title: 'Ressources',
      description: 'Allocation des ressources humaines et matérielles',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/planning/resources',
      stats: { allocated: 45, available: 12 },
    },
    {
      id: 'diary',
      title: 'Journal de Chantier',
      description: 'Suivi quotidien des activités',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/planning/diary',
      stats: { entries: 234 },
    },
    {
      id: 'photos',
      title: 'Photos Chantier',
      description: 'Documentation visuelle de l\'avancement',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      path: '/planning/photos',
      stats: { photos: 1250, albums: 18 },
    },
  ];

  const kpis = [
    {
      title: 'Avancement Global',
      value: '67%',
      change: '+5% cette semaine',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Jalons Atteints',
      value: '12/18',
      change: '6 en cours',
      isPositive: true,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tâches en Retard',
      value: '8',
      change: '-2 depuis hier',
      isPositive: true,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Ressources Utilisées',
      value: '78%',
      change: '45/58 allouées',
      isPositive: true,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const upcomingMilestones = [
    {
      title: 'Fin des fondations',
      date: '2024-12-15',
      status: 'on_track',
      progress: 85,
    },
    {
      title: 'Pose de la charpente',
      date: '2024-12-22',
      status: 'at_risk',
      progress: 45,
    },
    {
      title: 'Inspection qualité',
      date: '2024-12-28',
      status: 'on_track',
      progress: 20,
    },
  ];

  const criticalAlerts = [
    {
      type: 'delay',
      message: '2 tâches critiques en retard',
      severity: 'high',
      icon: AlertTriangle,
    },
    {
      type: 'resource',
      message: 'Pénurie de matériaux prévue',
      severity: 'medium',
      icon: AlertCircle,
    },
  ];

  return (
    <PageShell
      title="Centre de Planning"
      subtitle="Planification et suivi de l'avancement des travaux"
      loading={loading}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/planning/gantt')}>
            <Calendar className="w-4 h-4 mr-2" />
            Vue Gantt
          </Button>
          <Button onClick={() => navigate('/planning/milestones/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Jalon
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {kpi.value}
                </h3>
                <p className="text-xs text-neutral-500">{kpi.change}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jalons à venir */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Prochains Jalons
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/planning/milestones')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingMilestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {new Date(milestone.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        milestone.status === 'on_track'
                          ? 'success'
                          : milestone.status === 'at_risk'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {milestone.status === 'on_track'
                        ? 'En bonne voie'
                        : 'À risque'}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Avancement
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all',
                          milestone.status === 'on_track'
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                        )}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alertes critiques */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Alertes Critiques
            </h3>

            <div className="space-y-3 mb-6">
              {criticalAlerts.map((alert, idx) => {
                const Icon = alert.icon;
                return (
                  <div
                    key={idx}
                    className={clsx(
                      'flex items-center gap-3 p-4 rounded-lg',
                      alert.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                        : 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-5 h-5',
                        alert.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                      )}
                    />
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {alert.message}
                    </span>
                  </div>
                );
              })}
            </div>

            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              Actions Rapides
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
                  >
                    <div className={clsx('p-2 rounded-lg', action.bgColor)}>
                      <Icon className={clsx('w-4 h-4', action.color)} />
                    </div>
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 text-center">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Modules */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Modules de Planning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(module.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={clsx('p-3 rounded-xl', module.bgColor)}>
                      <Icon className={clsx('h-6 w-6', module.color)} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                  </div>

                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {module.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {module.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {value}
                        </span>
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
