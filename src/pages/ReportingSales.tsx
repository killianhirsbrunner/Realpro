import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useReporting } from '../hooks/useReporting';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { KpiCard } from '../components/reporting/KpiCard';
import { DonutChart } from '../components/reporting/DonutChart';
import { BarChartComponent } from '../components/reporting/BarChart';

export function ReportingSales() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: dashboardData } = useReporting(projectId!, 'dashboard');
  const { data: salesData, loading, error } = useReporting(projectId!, 'sales');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement des données ventes...</p>
        </div>
      </div>
    );
  }

  if (error || !salesData || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const lotsStatusData = salesData.lots_status || [];
  const brokerPerformanceData = (salesData.broker_performance || []).map((broker: any) => ({
    name: broker.broker_name,
    lots_sold: broker.lots_sold,
    total_value: broker.total_value / 1000,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/reporting`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au reporting
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Reporting Ventes
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Analyse commerciale et performance des courtiers
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total lots"
          value={dashboardData.sales.total}
          icon={TrendingUp}
          color="blue"
        />
        <KpiCard
          title="Lots vendus"
          value={dashboardData.sales.sold}
          subtitle={`${Math.round((dashboardData.sales.sold / dashboardData.sales.total) * 100)}% du projet`}
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="Valeur vendue"
          value={`CHF ${(dashboardData.sales.sold_value / 1000000).toFixed(1)}M`}
          subtitle={`sur ${(dashboardData.sales.total_value / 1000000).toFixed(1)}M CHF`}
          icon={DollarSign}
          color="blue"
        />
        <KpiCard
          title="Taux de vente"
          value={`${Math.round((dashboardData.sales.sold / dashboardData.sales.total) * 100)}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart
          data={lotsStatusData}
          title="Répartition des lots"
          subtitle="Par statut de vente"
        />

        <BarChartComponent
          data={brokerPerformanceData}
          title="Performance des courtiers"
          subtitle="Nombre de lots vendus"
          bars={[
            { dataKey: 'lots_sold', name: 'Lots vendus', color: '#10b981' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Détails par courtier
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Courtier
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Lots vendus
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Valeur totale
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Commission (3%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {(salesData.broker_performance || []).map((broker: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-white">
                      {broker.broker_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-white">
                      {broker.lots_sold}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-white">
                      CHF {(broker.total_value / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                      CHF {(broker.commission / 1000).toFixed(1)}k
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
