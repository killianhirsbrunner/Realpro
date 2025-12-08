import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFinance } from '../hooks/useFinance';
import { useFinanceDashboard } from '../hooks/useFinanceDashboard';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  CreditCard,
  ClipboardCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  PieChart,
  BarChart3,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';

export function FinanceHub() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { summary, loading } = useFinanceDashboard();

  const quickActions = [
    {
      title: 'Nouvelle Facture',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/finance/invoices/new',
    },
    {
      title: 'Enregistrer Paiement',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/finance/payments/new',
    },
    {
      title: 'Nouveau CFC',
      icon: ClipboardCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/finance/cfc/new',
    },
    {
      title: 'Créer Rapport',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/finance/reporting/new',
    },
  ];

  const modules = [
    {
      id: 'invoices',
      title: 'Factures',
      description: 'Gestion des factures clients et fournisseurs',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/finance/invoices',
      stats: {
        total: summary?.totalInvoices || 0,
        pending: summary?.pendingInvoices || 0,
        overdue: summary?.overdueInvoices || 0,
      },
    },
    {
      id: 'payments',
      title: 'Paiements',
      description: 'Suivi des paiements et encaissements',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/finance/payments',
      stats: {
        total: summary?.totalPayments || 0,
        received: summary?.paymentsReceived || 0,
        pending: summary?.paymentsPending || 0,
      },
    },
    {
      id: 'cfc',
      title: 'Comptes par Fonction de Coûts',
      description: 'Gestion des CFC et budgets',
      icon: ClipboardCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/finance/cfc',
      stats: {
        total: summary?.totalCFC || 0,
        budget: summary?.totalBudget || 0,
        spent: summary?.totalSpent || 0,
      },
    },
    {
      id: 'contracts',
      title: 'Contrats',
      description: 'Contrats fournisseurs et sous-traitants',
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/finance/contracts',
      stats: {
        active: summary?.activeContracts || 0,
        expiring: summary?.expiringContracts || 0,
      },
    },
    {
      id: 'budgets',
      title: 'Budgets',
      description: 'Planification et suivi budgétaire',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      path: '/finance/budgets',
      stats: {
        planned: summary?.plannedBudget || 0,
        actual: summary?.actualSpent || 0,
      },
    },
    {
      id: 'scenarios',
      title: 'Scénarios Financiers',
      description: 'Simulations et prévisions',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/finance/scenarios',
      stats: {
        scenarios: summary?.scenariosCount || 0,
      },
    },
  ];

  const kpis = [
    {
      title: 'Chiffre d\'Affaires',
      value: `${((summary?.totalRevenue || 0) / 1000000).toFixed(1)}M CHF`,
      change: '+12.3%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Dépenses',
      value: `${((summary?.totalExpenses || 0) / 1000000).toFixed(1)}M CHF`,
      change: '+5.2%',
      isPositive: false,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Marge',
      value: `${summary?.marginPercent || 0}%`,
      change: '+2.1%',
      isPositive: true,
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Trésorerie',
      value: `${((summary?.cashFlow || 0) / 1000000).toFixed(1)}M CHF`,
      change: '+8.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const recentAlerts = [
    {
      type: 'overdue',
      message: '3 factures en retard de paiement',
      severity: 'high',
      icon: AlertCircle,
      action: () => navigate('/finance/invoices?filter=overdue'),
    },
    {
      type: 'budget',
      message: '2 CFC dépassent 90% du budget',
      severity: 'medium',
      icon: AlertCircle,
      action: () => navigate('/finance/cfc?alert=high'),
    },
    {
      type: 'payment',
      message: '5 paiements en attente de validation',
      severity: 'low',
      icon: Clock,
      action: () => navigate('/finance/payments?status=pending'),
    },
  ];

  return (
    <PageShell
      title="Centre Financier"
      subtitle="Gestion financière et comptabilité"
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
          </select>
          <Button onClick={() => navigate('/finance/reporting')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapports
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
                  <div
                    className={clsx(
                      'text-sm font-medium',
                      kpi.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {kpi.change}
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

        {/* Alertes */}
        {recentAlerts.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Alertes et Notifications
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((alert, idx) => {
                const Icon = alert.icon;
                return (
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
                    <div className="flex items-center gap-3">
                      <Icon
                        className={clsx(
                          'w-5 h-5',
                          alert.severity === 'high' && 'text-red-600',
                          alert.severity === 'medium' && 'text-orange-600',
                          alert.severity === 'low' && 'text-blue-600'
                        )}
                      />
                      <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        {alert.message}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Actions Rapides */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className={clsx(
                    'flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800',
                    'hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all'
                  )}
                >
                  <div className={clsx('p-3 rounded-xl', action.bgColor)}>
                    <Icon className={clsx('w-5 h-5', action.color)} />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Modules */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Modules Financiers
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
                          {typeof value === 'number' && value > 1000000
                            ? `${(value / 1000000).toFixed(1)}M`
                            : value}
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
