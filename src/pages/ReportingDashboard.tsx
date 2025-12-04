import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, TrendingUp, DollarSign, Activity, AlertCircle, FileText, Users, Building } from 'lucide-react';
import { useReporting } from '../hooks/useReporting';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { KpiCard } from '../components/reporting/KpiCard';
import { DonutChart } from '../components/reporting/DonutChart';
import { LineChartComponent } from '../components/reporting/LineChart';
import { BarChartComponent } from '../components/reporting/BarChart';
import { Button } from '../components/ui/Button';

export function ReportingDashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useReporting(projectId!, 'dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement du reporting...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const salesData = [
    { name: 'Vendus', value: data.sales.sold, color: '#10b981' },
    { name: 'Réservés', value: data.sales.reserved, color: '#f59e0b' },
    { name: 'Disponibles', value: data.sales.available, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900">
              <Activity className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Reporting & Analytics
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Vue d'ensemble du projet
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Link to={`/projects/${projectId}/reporting/sales`}>
              <Button variant="outline">Voir tous les rapports</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Lots vendus"
          value={`${data.sales.sold}/${data.sales.total}`}
          subtitle={`${Math.round((data.sales.sold / data.sales.total) * 100)}% du projet`}
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="Montant payé"
          value={`CHF ${(data.finance.paid / 1000).toFixed(0)}k`}
          subtitle={`sur ${(data.finance.total_budget / 1000).toFixed(0)}k CHF`}
          icon={DollarSign}
          color="blue"
        />
        <KpiCard
          title="Avancement chantier"
          value={`${data.planning.progress}%`}
          subtitle={`${data.planning.completed}/${data.planning.total_tasks} tâches`}
          icon={Activity}
          color="purple"
        />
        <KpiCard
          title="Tâches en retard"
          value={data.planning.delayed}
          subtitle="Actions requises"
          icon={AlertCircle}
          color={data.planning.delayed > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link to={`/projects/${projectId}/reporting/sales`} className="block">
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Ventes</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              CHF {(data.sales.sold_value / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Valeur totale vendue
            </p>
          </div>
        </Link>

        <Link to={`/projects/${projectId}/reporting/finance`} className="block">
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/20">
                <DollarSign className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Finances</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              {data.finance.overdue > 0 ? (
                <span className="text-red-600">CHF {(data.finance.overdue / 1000).toFixed(0)}k</span>
              ) : (
                <span className="text-green-600">À jour</span>
              )}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {data.finance.overdue > 0 ? 'En retard' : 'Tous les paiements'}
            </p>
          </div>
        </Link>

        <Link to={`/projects/${projectId}/reporting/cfc`} className="block">
          <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/20">
                <Building className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">CFC & Budget</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              {data.cfc.variance >= 0 ? (
                <span className="text-green-600">+CHF {(data.cfc.variance / 1000).toFixed(0)}k</span>
              ) : (
                <span className="text-red-600">-CHF {(Math.abs(data.cfc.variance) / 1000).toFixed(0)}k</span>
              )}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {data.cfc.variance >= 0 ? 'Sous budget' : 'Dépassement'}
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart
          data={salesData}
          title="Répartition des lots"
          subtitle={`${data.sales.total} lots au total`}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Indicateurs clés
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Budget CFC</p>
              <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                CHF {(data.cfc.total_budget / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Engagé</p>
              <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                CHF {(data.cfc.engaged / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Facturé</p>
              <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                CHF {(data.cfc.invoiced / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Payé</p>
              <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                CHF {(data.cfc.paid / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <h4 className="font-medium text-neutral-900 dark:text-white mb-3">
              Avancement planning
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Terminé</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {data.planning.completed} tâches
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">En cours</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {data.planning.in_progress} tâches
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">En retard</span>
                <span className="font-medium text-red-600">
                  {data.planning.delayed} tâches
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
