import { TrendingUp, Package, DollarSign, Users, Activity, FileText, Clock, CheckCircle } from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { useI18n } from '../lib/i18n';
import { useProjects } from '../hooks/useProjects';
import { useLots } from '../hooks/useLots';

export function Dashboard() {
  const { t } = useI18n();
  const { projects, loading: projectsLoading } = useProjects();
  const activeProject = projects[0];
  const { lots, statusCounts, loading: lotsLoading } = useLots(activeProject?.id);

  const salesRate = statusCounts.total > 0
    ? Math.round(((statusCounts.sold + statusCounts.reserved) / statusCounts.total) * 100)
    : 0;

  const totalRevenue = lots
    .filter((l) => l.status === 'SOLD' || l.status === 'RESERVED')
    .reduce((sum, lot) => sum + (lot.price_total || 0), 0);

  const stats = [
    {
      name: t('dashboard.stats.totalLots'),
      value: statusCounts.total,
      icon: Package,
      color: 'bg-blue-500',
      trend: null,
    },
    {
      name: t('dashboard.stats.available'),
      value: statusCounts.available,
      icon: Package,
      color: 'bg-green-500',
      trend: null,
    },
    {
      name: t('dashboard.stats.salesRate'),
      value: `${salesRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+12%',
    },
    {
      name: t('dashboard.stats.totalRevenue'),
      value: `${(totalRevenue / 1000000).toFixed(1)}M CHF`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: '+8.2%',
    },
  ];

  if (projectsLoading || lotsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {t('dashboard.welcome')}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('dashboard.overview')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('dashboard.stats.totalLots')}
          value={statusCounts.total}
          icon={Package}
          variant="default"
        />
        <KpiCard
          title={t('dashboard.stats.available')}
          value={statusCounts.available}
          icon={Activity}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <KpiCard
          title={t('dashboard.stats.salesRate')}
          value={`${salesRate}%`}
          icon={TrendingUp}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard
          title={t('dashboard.stats.totalRevenue')}
          value={`${(totalRevenue / 1000000).toFixed(1)}M CHF`}
          icon={DollarSign}
          variant="warning"
          trend={{ value: 8.2, isPositive: true }}
        />
      </div>

      {activeProject && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{activeProject.name}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Vue d'ensemble du projet</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors duration-150">
              Voir détails
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('lots.available')}</p>
              <p className="mt-2 text-3xl font-semibold text-accent-green">
                {statusCounts.available}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('lots.reserved')}</p>
              <p className="mt-2 text-3xl font-semibold text-accent-orange">
                {statusCounts.reserved}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('lots.sold')}</p>
              <p className="mt-2 text-3xl font-semibold text-primary-600 dark:text-primary-400">
                {statusCounts.sold}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{t('dashboard.stats.salesRate')}</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700 dark:text-primary-300">
                {salesRate}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              {t('dashboard.recentActivity')}
            </h3>
            <Clock className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Nouveau prospect ajouté
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Lot A-102 réservé
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Il y a 5 heures</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Document ajouté au projet
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Hier</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-5">
            {t('dashboard.quickActions')}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button className="group p-5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] text-left">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {t('crm.newProspect')}
              </p>
            </button>

            <button className="group p-5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] text-left">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {t('lots.title')}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
