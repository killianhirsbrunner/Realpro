import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, Badge, Progress, Skeleton } from '@realpro/ui';
import { Building2, TrendingUp, Users, Calendar } from 'lucide-react';
import { useProjects } from '@/features/projects';
import { formatCurrency } from '@realpro/shared-utils';
import { PROJECT_STATUS_LABELS, type ProjectStatus } from '@realpro/entities';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  loading?: boolean;
}

function StatCard({ title, value, subtitle, icon, trend, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-20 mt-2" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
            )}
            {trend && (
              <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier
              </p>
            )}
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const statusVariants: Record<ProjectStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  PLANNING: 'info',
  CONSTRUCTION: 'warning',
  SELLING: 'success',
  COMPLETED: 'neutral',
  ARCHIVED: 'neutral',
};

export function DashboardPage() {
  const { data: projects, isLoading, error } = useProjects();

  // Calculate stats from projects
  const stats = {
    activeProjects: projects?.filter(p => ['PLANNING', 'CONSTRUCTION', 'SELLING'].includes(p.status)).length || 0,
    totalLots: projects?.reduce((sum, p) => sum + (p.total_lots || 0), 0) || 0,
    soldLots: projects?.reduce((sum, p) => sum + (p.sold_lots || 0), 0) || 0,
    totalRevenue: projects?.reduce((sum, p) => sum + (p.total_revenue || 0), 0) || 0,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Vue d'ensemble de vos projets immobiliers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets actifs"
          value={stats.activeProjects}
          icon={<Building2 className="w-6 h-6 text-primary-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Unités vendues"
          value={stats.soldLots}
          subtitle={`sur ${stats.totalLots} disponibles`}
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Chiffre d'affaires"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="ventes confirmées"
          icon={<Users className="w-6 h-6 text-primary-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Taux de vente"
          value={stats.totalLots > 0 ? `${Math.round((stats.soldLots / stats.totalLots) * 100)}%` : '0%'}
          subtitle="tous projets confondus"
          icon={<Calendar className="w-6 h-6 text-primary-600" />}
          loading={isLoading}
        />
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Projets en cours
            </h2>
            <Link
              to="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Voir tous les projets
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-neutral-500">
              <p>Erreur lors du chargement des projets</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => {
                const progress = project.total_lots > 0
                  ? Math.round((project.sold_lots / project.total_lots) * 100)
                  : 0;

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg gap-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        <Badge variant={statusVariants[project.status]}>
                          {PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {project.city || 'Localisation non définie'}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {project.sold_lots}/{project.total_lots} unités
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          vendues
                        </p>
                      </div>
                      <div className="w-32">
                        <Progress value={progress} size="md" showValue />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun projet pour le moment</p>
              <Link
                to="/projects"
                className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Créer votre premier projet
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
