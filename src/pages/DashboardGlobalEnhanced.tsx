import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useGlobalDashboard } from '../hooks/useGlobalDashboard';
import { useI18n } from '../lib/i18n';
import {
  Building2,
  Users,
  Wrench,
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
} from 'lucide-react';
import clsx from 'clsx';

export default function DashboardGlobalEnhanced() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data, loading } = useGlobalDashboard();

  const kpis = [
    {
      title: 'Projets actifs',
      value: data?.totalActiveProjects || 0,
      icon: Building2,
      trend: '+12%',
      trendUp: true,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Acheteurs',
      value: data?.totalBuyers || 0,
      icon: Users,
      trend: '+8%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Avenants en attente',
      value: data?.pendingAvenants || 0,
      icon: Wrench,
      trend: '-3',
      trendUp: false,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Volume finances',
      value: `${data?.totalFinancialVolume?.toLocaleString('fr-CH') || 0} CHF`,
      icon: DollarSign,
      trend: '+15%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <PageShell
      title="Tableau de bord global"
      subtitle="Vue d'ensemble de tous vos projets"
      actions={
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      }
      loading={loading}
    >
      <div className="space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trendUp ? TrendingUp : TrendingDown;

            return (
              <Card key={kpi.title} className="p-6 hover:shadow-lg-premium transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1 text-sm font-medium',
                    kpi.trendUp ? 'text-green-600' : 'text-red-600'
                  )}>
                    <TrendIcon className="h-4 w-4" />
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {kpi.value}
                </h3>
              </Card>
            );
          })}
        </div>

        {/* Projets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Mes projets
            </h2>
            <Button variant="outline" onClick={() => navigate('/projects')}>
              Voir tous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.projects?.map((project) => (
              <Card
                key={project.id}
                className="p-6 cursor-pointer hover:shadow-lg-premium hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => navigate(`/projects/${project.id}/dashboard`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    project.status === 'active'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  )}>
                    {project.status === 'active' ? 'Actif' : 'En cours'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {project.address}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Lots:</span>
                      <span className="ml-1 font-medium text-neutral-900 dark:text-neutral-100">
                        {project.soldLots}/{project.totalLots}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Vente:</span>
                      <span className="ml-1 font-medium text-green-600">
                        {Math.round((project.soldLots / project.totalLots) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
                    Ouvrir le projet
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Activité récente
          </h2>

          <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data?.recentActivity?.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <Activity className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                      {activity.title}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </PageShell>
  );
}
