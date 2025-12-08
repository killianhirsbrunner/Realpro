import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useGlobalDashboard } from '../hooks/useGlobalDashboard';
import { MODULES, getModulesByCategory } from '../lib/modules/config';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  DollarSign,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';

export function DashboardAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { stats, loading } = useGlobalDashboard();

  const globalKPIs = [
    {
      title: 'Projets Actifs',
      value: stats?.activeProjects || 0,
      change: '+2 ce mois',
      changePercent: '+12%',
      isPositive: true,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/projects',
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M CHF`,
      change: 'vs mois dernier',
      changePercent: '+18%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/finance',
    },
    {
      title: 'Prospects Actifs',
      value: stats?.activeProspects || 0,
      change: 'qualifiés',
      changePercent: `${stats?.qualifiedProspects || 0}`,
      isPositive: true,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/crm',
    },
    {
      title: 'Taux de Conversion',
      value: '24%',
      change: 'vs mois dernier',
      changePercent: '+3.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/crm/pipeline',
    },
  ];

  const modulePerformance = [
    {
      id: 'crm',
      module: MODULES.crm,
      health: 92,
      activity: 'high',
      alerts: 2,
      trend: 'up',
    },
    {
      id: 'finance',
      module: MODULES.finance,
      health: 88,
      activity: 'medium',
      alerts: 5,
      trend: 'up',
    },
    {
      id: 'planning',
      module: MODULES.planning,
      health: 75,
      activity: 'high',
      alerts: 8,
      trend: 'down',
    },
    {
      id: 'construction',
      module: MODULES.construction,
      health: 82,
      activity: 'medium',
      alerts: 3,
      trend: 'up',
    },
    {
      id: 'sav',
      module: MODULES.sav,
      health: 95,
      activity: 'low',
      alerts: 1,
      trend: 'up',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'project',
      title: 'Nouveau projet créé',
      description: 'Résidence Les Cèdres - Lausanne',
      time: 'Il y a 2h',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: '2',
      type: 'sale',
      title: 'Nouvelle vente',
      description: 'Lot A3.05 - 850\'000 CHF',
      time: 'Il y a 3h',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: '3',
      type: 'prospect',
      title: 'Prospect qualifié',
      description: 'Jean Dupont - Budget 1.2M CHF',
      time: 'Il y a 5h',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Jalon atteint',
      description: 'Fin des fondations - Projet Cèdres',
      time: 'Il y a 1j',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const criticalAlerts = [
    {
      severity: 'high',
      message: '3 factures en retard de paiement',
      module: 'Finance',
      action: () => navigate('/finance/invoices?filter=overdue'),
    },
    {
      severity: 'medium',
      message: '2 jalons à risque de retard',
      module: 'Planning',
      action: () => navigate('/planning/milestones?status=at_risk'),
    },
    {
      severity: 'low',
      message: '5 tickets SAV en attente',
      module: 'SAV',
      action: () => navigate('/sav/tickets?status=pending'),
    },
  ];

  return (
    <PageShell
      title="Analytics Global"
      subtitle="Vue d'ensemble de votre activité et performances"
      loading={loading}
      actions={
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPIs Globaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalKPIs.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.title}
                className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer"
                onClick={() => navigate(kpi.link)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                  <div
                    className={clsx(
                      'text-sm font-medium',
                      kpi.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {kpi.changePercent}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {kpi.value}
                </h3>
                <p className="text-xs text-neutral-500">{kpi.change}</p>
              </Card>
            );
          })}
        </div>

        {/* Alertes Critiques */}
        {criticalAlerts.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Alertes Critiques
              </h3>
              <Badge variant="warning">{criticalAlerts.length}</Badge>
            </div>

            <div className="space-y-3">
              {criticalAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors',
                    alert.severity === 'high' && 'border-l-4 border-red-500',
                    alert.severity === 'medium' && 'border-l-4 border-orange-500',
                    alert.severity === 'low' && 'border-l-4 border-blue-500'
                  )}
                  onClick={alert.action}
                >
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      {alert.message}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Module: {alert.module}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance des Modules */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Performance des Modules
            </h3>

            <div className="space-y-4">
              {modulePerformance.map((item) => {
                const Icon = item.module.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(item.module.routes[0]?.path || '/')
                    }
                  >
                    <div className={clsx('p-3 rounded-xl', item.module.bgColor)}>
                      <Icon className={clsx('w-5 h-5', item.module.color)} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {item.module.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {item.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {item.health}%
                          </span>
                        </div>
                      </div>

                      <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
                        <div
                          className={clsx(
                            'h-full rounded-full transition-all',
                            item.health >= 90
                              ? 'bg-green-500'
                              : item.health >= 70
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          )}
                          style={{ width: `${item.health}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <span>Activité: {item.activity}</span>
                        {item.alerts > 0 && (
                          <Badge variant="warning" size="sm">
                            {item.alerts} alertes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Activité Récente */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Activité Récente
              </h3>
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    <div className={clsx('p-2 rounded-lg', activity.bgColor)}>
                      <Icon className={clsx('w-4 h-4', activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {activity.title}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Navigation Rapide vers Modules */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Accès Rapide aux Modules
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {getModulesByCategory('business').map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => navigate(module.routes[0]?.path || '/')}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
                >
                  <div className={clsx('p-3 rounded-xl', module.bgColor)}>
                    <Icon className={clsx('w-6 h-6', module.color)} />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-center">
                    {module.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
