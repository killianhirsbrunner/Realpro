import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome')}
        </h1>
        <p className="mt-1 text-gray-500">{t('dashboard.overview')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend && (
                    <span className="text-sm font-medium text-green-600">
                      {stat.trend}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeProject && (
        <Card>
          <CardHeader>
            <CardTitle>{activeProject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">{t('lots.available')}</p>
                <p className="mt-1 text-2xl font-semibold text-green-600">
                  {statusCounts.available}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('lots.reserved')}</p>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">
                  {statusCounts.reserved}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('lots.sold')}</p>
                <p className="mt-1 text-2xl font-semibold text-blue-600">
                  {statusCounts.sold}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('dashboard.stats.salesRate')}</p>
                <p className="mt-1 text-2xl font-semibold text-purple-600">
                  {salesRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouveau prospect ajouté
                  </p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Lot A-102 réservé
                  </p>
                  <p className="text-xs text-gray-500">Il y a 5 heures</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Document ajouté au projet
                  </p>
                  <p className="text-xs text-gray-500">Hier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {t('crm.newProspect')}
                </p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {t('lots.title')}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
