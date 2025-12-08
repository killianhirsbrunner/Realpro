import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  FileText,
  Download,
  Calendar,
  Target,
  PieChart,
  Activity,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';

export function ReportingHub() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const reportCategories = [
    {
      id: 'sales',
      title: 'Rapports Ventes',
      description: 'Performance commerciale et taux de conversion',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/reporting/sales',
      stats: {
        reports: 12,
        lastUpdate: 'Aujourd\'hui',
      },
    },
    {
      id: 'finance',
      title: 'Rapports Financiers',
      description: 'CA, marges, budgets et trésorerie',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/reporting/finance',
      stats: {
        reports: 8,
        lastUpdate: 'Aujourd\'hui',
      },
    },
    {
      id: 'cfc',
      title: 'Rapports CFC',
      description: 'Comptes par fonction de coûts détaillés',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/reporting/cfc',
      stats: {
        reports: 15,
        lastUpdate: 'Hier',
      },
    },
    {
      id: 'construction',
      title: 'Rapports Construction',
      description: 'Avancement des travaux et planning',
      icon: Building2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/reporting/construction',
      stats: {
        reports: 10,
        lastUpdate: 'Aujourd\'hui',
      },
    },
    {
      id: 'crm',
      title: 'Rapports CRM',
      description: 'Performance commerciale et conversion',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      path: '/reporting/crm',
      stats: {
        reports: 6,
        lastUpdate: 'Aujourd\'hui',
      },
    },
    {
      id: 'custom',
      title: 'Rapports Personnalisés',
      description: 'Créez vos propres rapports sur mesure',
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/reporting/custom',
      stats: {
        reports: 4,
        lastUpdate: 'Cette semaine',
      },
    },
  ];

  const kpis = [
    {
      title: 'Rapports Générés',
      value: '247',
      change: '+18 ce mois',
      isPositive: true,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Exports Créés',
      value: '89',
      change: '+12 cette semaine',
      isPositive: true,
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Vues Tableau de Bord',
      value: '1,245',
      change: '+156 ce mois',
      isPositive: true,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Rapports Planifiés',
      value: '12',
      change: 'Actifs',
      isPositive: true,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentReports = [
    {
      id: '1',
      title: 'Ventes Mensuelles',
      category: 'Ventes',
      date: 'Aujourd\'hui à 14:30',
      status: 'completed',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: '2',
      title: 'Budget CFC Global',
      category: 'Finance',
      date: 'Aujourd\'hui à 10:15',
      status: 'completed',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: '3',
      title: 'Avancement Projets',
      category: 'Construction',
      date: 'Hier à 16:45',
      status: 'completed',
      icon: Building2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: '4',
      title: 'Performance Commerciale',
      category: 'CRM',
      date: 'Hier à 09:30',
      status: 'completed',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const quickActions = [
    {
      title: 'Rapport Ventes',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/reporting/sales/new'),
    },
    {
      title: 'Rapport Finance',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/reporting/finance/new'),
    },
    {
      title: 'Rapport CFC',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/reporting/cfc/new'),
    },
    {
      title: 'Rapport Personnalisé',
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: () => navigate('/reporting/custom/new'),
    },
  ];

  const scheduledReports = [
    {
      name: 'Ventes Hebdomadaires',
      frequency: 'Chaque lundi 9h',
      recipients: 3,
      active: true,
    },
    {
      name: 'Budget Mensuel',
      frequency: 'Le 1er de chaque mois',
      recipients: 5,
      active: true,
    },
    {
      name: 'Performance CRM',
      frequency: 'Chaque vendredi 17h',
      recipients: 2,
      active: true,
    },
  ];

  return (
    <PageShell
      title="Centre de Reporting"
      subtitle="Rapports et analyses de performance"
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
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => navigate('/reporting/custom/new')}>
            <FileText className="w-4 h-4 mr-2" />
            Nouveau Rapport
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
          {/* Rapports Récents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Rapports Récents
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/reporting/history')}>
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {recentReports.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                  >
                    <div className={clsx('p-3 rounded-lg', report.bgColor)}>
                      <Icon className={clsx('w-5 h-5', report.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {report.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {report.category}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs text-neutral-500">{report.date}</span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      Terminé
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Rapports Planifiés */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Rapports Planifiés
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reporting/scheduled')}
              >
                Gérer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {scheduledReports.map((report, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {report.name}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {report.frequency}
                      </p>
                    </div>
                    <Badge variant={report.active ? 'success' : 'default'} size="sm">
                      {report.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-3">
                    <Users className="w-3 h-3" />
                    <span>{report.recipients} destinataires</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions Rapides */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Générer un Rapport
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
                >
                  <div className={clsx('p-3 rounded-xl', action.bgColor)}>
                    <Icon className={clsx('w-5 h-5', action.color)} />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-center">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Catégories de Rapports */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Catégories de Rapports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(category.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={clsx('p-3 rounded-xl', category.bgColor)}>
                      <Icon className={clsx('h-6 w-6', category.color)} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                  </div>

                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {category.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>{category.stats.reports} rapports disponibles</span>
                    <span>MAJ: {category.stats.lastUpdate}</span>
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
