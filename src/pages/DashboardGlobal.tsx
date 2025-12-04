import { Link } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import { useGlobalDashboard } from '../hooks/useGlobalDashboard';
import { useI18n } from '../lib/i18n';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { GlobalKpiCard } from '../components/global-dashboard/GlobalKpiCard';
import { GlobalProjectCard } from '../components/global-dashboard/GlobalProjectCard';
import { ActivityFeedItem } from '../components/global-dashboard/ActivityFeedItem';
import {
  Building2,
  Plus,
  TrendingUp,
  Home,
  DollarSign,
  Sparkles,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export function DashboardGlobal() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const { organization, subscription, canCreateProject, projectsCount, loading: orgLoading } = useOrganization();
  const { data: dashboardData, loading: dashboardLoading } = useGlobalDashboard();

  const loading = orgLoading || dashboardLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-brand-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-brand-900/20 border border-primary-100 dark:border-primary-900/30 p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {getGreeting()}, {user?.first_name || 'Utilisateur'}
                </h1>
              </div>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                {organization?.name} - Vue d'ensemble de tous vos projets
              </p>
              <Link to="/projects/new">
                <Button
                  size="lg"
                  className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  disabled={!canCreateProject}
                  title={!canCreateProject ? 'Limite de projets atteinte pour votre plan' : ''}
                >
                  <Plus className="w-5 h-5" />
                  Créer un nouveau projet
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {subscription && (
              <div className="text-right bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Votre abonnement
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {subscription.status === 'TRIAL' ? 'Essai gratuit' : subscription.plan.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {subscription.plan.limits.projects_max === -1
                    ? 'Projets illimités'
                    : `${projectsCount} / ${subscription.plan.limits.projects_max} projets`}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-brand-200/20 dark:from-primary-900/10 dark:to-brand-900/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      {/* Warning if limit reached */}
      {!canCreateProject && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
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
        </div>
      )}

      {/* Global KPIs */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlobalKpiCard
            title="Projets actifs"
            value={dashboardData.projectsCount}
            icon={Building2}
            subtitle={`${dashboardData.projectsCount} projet${dashboardData.projectsCount > 1 ? 's' : ''} en cours`}
          />
          <GlobalKpiCard
            title="Lots totaux"
            value={dashboardData.totalLots}
            icon={Home}
            subtitle="Tous projets confondus"
          />
          <GlobalKpiCard
            title="Taux de vente global"
            value={`${dashboardData.globalSalesProgress}%`}
            icon={TrendingUp}
            trend={{
              value: 5,
              isPositive: true
            }}
          />
          <GlobalKpiCard
            title="Chiffre d'affaires"
            value={`CHF ${(dashboardData.totalRevenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            subtitle="Ventes réalisées"
          />
        </div>
      )}

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
          Vos projets ({dashboardData?.projectsCount || 0})
        </h2>

        {!dashboardData || dashboardData.projects.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Aucun projet pour le moment
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Commencez par créer votre premier projet immobilier pour centraliser la gestion de vos lots, acheteurs et documents.
            </p>
            <Link to="/projects/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Créer mon premier projet
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboardData.projects.map((project) => (
              <GlobalProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {dashboardData && dashboardData.activities.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Activité récente
            </h2>
            <Link to="/activity" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dashboardData.activities.slice(0, 6).map((activity) => (
              <ActivityFeedItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
