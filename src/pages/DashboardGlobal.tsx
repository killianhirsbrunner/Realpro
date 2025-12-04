import { Link } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import { useProjects } from '../hooks/useProjects';
import { useI18n } from '../lib/i18n';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Building2,
  Plus,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  Home,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function DashboardGlobal() {
  const { t } = useI18n();
  const { organization, subscription, canCreateProject, projectsCount, loading: orgLoading } = useOrganization();
  const { projects, loading: projectsLoading } = useProjects();

  if (orgLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const totalLots = projects.reduce((sum, p) => sum + (p.total_lots || 0), 0);
  const soldLots = projects.reduce((sum, p) => sum + (p.sold_lots || 0), 0);
  const reservedLots = projects.reduce((sum, p) => sum + (p.reserved_lots || 0), 0);
  const totalRevenue = projects.reduce((sum, p) => sum + (p.total_revenue || 0), 0);

  const kpis = [
    {
      label: 'Projets actifs',
      value: projects.filter(p => p.status !== 'ARCHIVED').length,
      total: projectsCount,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Lots vendus',
      value: soldLots,
      total: totalLots,
      icon: CheckCircle2,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20'
    },
    {
      label: 'Lots réservés',
      value: reservedLots,
      total: totalLots,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      label: 'Chiffre d\'affaires',
      value: `CHF ${(totalRevenue / 1000000).toFixed(1)}M`,
      total: null,
      icon: TrendingUp,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20'
    }
  ];

  const getProjectStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      PLANNING: { label: 'Planification', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
      CONSTRUCTION: { label: 'En construction', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' },
      SELLING: { label: 'En vente', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' },
      COMPLETED: { label: 'Terminé', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' },
      ARCHIVED: { label: 'Archivé', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }
    };

    const config = statusConfig[status] || statusConfig.PLANNING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {organization?.name || 'Dashboard'}
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Vue d'ensemble de tous vos projets immobiliers
          </p>
        </div>

        {subscription && (
          <div className="text-right">
            <Badge className="mb-1">
              {subscription.status === 'TRIAL' ? 'Essai gratuit' : subscription.plan.name}
            </Badge>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {subscription.plan.limits.projects_max === -1
                ? 'Projets illimités'
                : `${projectsCount} / ${subscription.plan.limits.projects_max} projets`}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {kpi.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      {kpi.value}
                    </p>
                    {kpi.total !== null && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        / {kpi.total}
                      </p>
                    )}
                  </div>
                  {kpi.total !== null && (
                    <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${kpi.bgColor}`}
                        style={{ width: `${(kpi.value / kpi.total) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Vos projets
        </h2>
        <Link to="/projects/new">
          <Button
            className="gap-2"
            disabled={!canCreateProject}
            title={!canCreateProject ? 'Limite de projets atteinte pour votre plan' : ''}
          >
            <Plus className="w-4 h-4" />
            Créer un projet
          </Button>
        </Link>
      </div>

      {!canCreateProject && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900 dark:text-orange-100">
                Limite de projets atteinte
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Vous avez atteint la limite de {subscription?.plan.limits.projects_max} projets pour votre plan {subscription?.plan.name}.
                Passez à un plan supérieur pour créer plus de projets.
              </p>
              <Link to="/billing" className="inline-block mt-2">
                <Button size="sm" variant="outline" className="text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                  Mettre à niveau
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Aucun projet pour le moment
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Commencez par créer votre premier projet immobilier pour centraliser la gestion de vos lots, acheteurs et documents.
            </p>
            <Link to="/projects/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Créer mon premier projet
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}/dashboard`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {project.city}, {project.canton}
                      </p>
                    </div>
                    {getProjectStatusBadge(project.status || 'PLANNING')}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Lots</span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {project.total_lots || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Vendus</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {project.sold_lots || 0} ({project.total_lots ? Math.round(((project.sold_lots || 0) / project.total_lots) * 100) : 0}%)
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary-600 dark:bg-primary-500"
                        style={{
                          width: `${project.total_lots ? ((project.sold_lots || 0) / project.total_lots) * 100 : 0}%`
                        }}
                      />
                    </div>

                    {project.total_revenue && project.total_revenue > 0 && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <span className="text-neutral-600 dark:text-neutral-400">Volume</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          CHF {(project.total_revenue / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
