import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Building, TrendingUp, AlertTriangle } from 'lucide-react';
import { useReporting } from '../hooks/useReporting';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { KpiCard } from '../components/reporting/KpiCard';
import { BarChartComponent } from '../components/reporting/BarChart';

export function ReportingCFC() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: dashboardData } = useReporting(projectId!, 'dashboard');
  const { data: cfcData, loading, error } = useReporting(projectId!, 'cfc');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement des données CFC...</p>
        </div>
      </div>
    );
  }

  if (error || !cfcData || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const cfcOverviewData = (cfcData.cfc_overview || []).map((item: any) => ({
    name: item.cfc,
    budget: item.budget / 1000,
    engaged: item.engaged / 1000,
    invoiced: item.invoiced / 1000,
    paid: item.paid / 1000,
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
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900">
            <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Reporting CFC & Budget
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Analyse des coûts par code de frais de construction
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Budget total"
          value={`CHF ${(dashboardData.cfc.total_budget / 1000000).toFixed(1)}M`}
          icon={Building}
          color="blue"
        />
        <KpiCard
          title="Engagé"
          value={`CHF ${(dashboardData.cfc.engaged / 1000000).toFixed(1)}M`}
          subtitle={`${Math.round((dashboardData.cfc.engaged / dashboardData.cfc.total_budget) * 100)}% du budget`}
          icon={TrendingUp}
          color="orange"
        />
        <KpiCard
          title="Facturé"
          value={`CHF ${(dashboardData.cfc.invoiced / 1000000).toFixed(1)}M`}
          subtitle={`${Math.round((dashboardData.cfc.invoiced / dashboardData.cfc.total_budget) * 100)}% du budget`}
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="Écart budget"
          value={`${dashboardData.cfc.variance >= 0 ? '+' : ''}CHF ${(dashboardData.cfc.variance / 1000).toFixed(0)}k`}
          subtitle={dashboardData.cfc.variance >= 0 ? 'Sous budget' : 'Dépassement'}
          icon={AlertTriangle}
          color={dashboardData.cfc.variance >= 0 ? 'green' : 'red'}
        />
      </div>

      <BarChartComponent
        data={cfcOverviewData}
        title="Budget vs Engagé vs Facturé vs Payé"
        subtitle="Par code CFC (en milliers CHF)"
        bars={[
          { dataKey: 'budget', name: 'Budget', color: '#3b82f6' },
          { dataKey: 'engaged', name: 'Engagé', color: '#f59e0b' },
          { dataKey: 'invoiced', name: 'Facturé', color: '#10b981' },
          { dataKey: 'paid', name: 'Payé', color: '#8b5cf6' },
        ]}
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Détails par CFC
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    CFC
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Libellé
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Budget
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Engagé
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Facturé
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Payé
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Écart
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {(cfcData.cfc_overview || []).map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="py-3 px-4 text-sm font-mono font-medium text-neutral-900 dark:text-white">
                      {item.cfc}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">
                      {item.label}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-white">
                      CHF {(item.budget / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-orange-600">
                      CHF {(item.engaged / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-600">
                      CHF {(item.invoiced / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-purple-600">
                      CHF {(item.paid / 1000).toFixed(0)}k
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.variance >= 0 ? '+' : ''}CHF {(item.variance / 1000).toFixed(0)}k
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      item.variance_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.variance_percentage >= 0 ? '+' : ''}{item.variance_percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Analyse des écarts
          </h3>
          <div className="space-y-3">
            {(cfcData.cfc_variance || []).slice(0, 5).map((item: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  item.status === 'over_budget'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : item.status === 'under_budget'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-neutral-900 dark:text-white">
                    {item.cfc}
                  </span>
                  <span className={`font-semibold ${
                    item.status === 'over_budget'
                      ? 'text-red-600'
                      : item.status === 'under_budget'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    {item.variance >= 0 ? '+' : ''}CHF {(item.variance / 1000).toFixed(0)}k
                  </span>
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  {item.status === 'over_budget' ? 'Dépassement budget' :
                   item.status === 'under_budget' ? 'Sous budget' : 'Dans les clous'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
