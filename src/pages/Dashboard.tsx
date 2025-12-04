import { useI18n } from '../lib/i18n';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DashboardKpis } from '../components/dashboard/DashboardKpis';
import { SalesChart } from '../components/dashboard/SalesChart';
import { CfcChart } from '../components/dashboard/CfcChart';
import { DocumentsRecent } from '../components/dashboard/DocumentsRecent';
import { SoumissionsRecent } from '../components/dashboard/SoumissionsRecent';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { GlobalPlanning } from '../components/dashboard/GlobalPlanning';

export function Dashboard() {
  const { t } = useI18n();
  const { data, loading, error } = useDashboard();

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {t('dashboard.welcome')}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('dashboard.overview')}</p>
      </div>

      <DashboardKpis kpis={data.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart data={data.salesChart} />
        <CfcChart data={data.cfcChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SoumissionsRecent soumissions={data.soumissions} />
        <DocumentsRecent documents={data.documentsRecent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlobalPlanning planning={data.planning} />
        <ActivityFeed activities={data.activityFeed} />
      </div>
    </div>
  );
}
