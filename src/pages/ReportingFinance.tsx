import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useReporting } from '../hooks/useReporting';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { KpiCard } from '../components/reporting/KpiCard';
import { LineChartComponent } from '../components/reporting/LineChart';
import { BarChartComponent } from '../components/reporting/BarChart';

export function ReportingFinance() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: dashboardData } = useReporting(projectId!, 'dashboard');
  const { data: financeData, loading, error } = useReporting(projectId!, 'finance');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement des données financières...</p>
        </div>
      </div>
    );
  }

  if (error || !financeData || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const paymentTimelineData = (financeData.payment_timeline || []).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('fr-CH', { month: 'short', year: '2-digit' }),
    paid: item.paid / 1000,
    pending: item.pending / 1000,
  }));

  const buyerPaymentsData = (financeData.buyer_payments || []).map((buyer: any) => ({
    name: buyer.buyer_name,
    paid: buyer.paid / 1000,
    pending: buyer.pending / 1000,
    overdue: buyer.overdue / 1000,
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
          <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900">
            <DollarSign className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Reporting Finances
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Analyse des paiements et cash-flow
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total budget"
          value={`CHF ${(dashboardData.finance.total_budget / 1000).toFixed(0)}k`}
          icon={DollarSign}
          color="blue"
        />
        <KpiCard
          title="Montant payé"
          value={`CHF ${(dashboardData.finance.paid / 1000).toFixed(0)}k`}
          subtitle={`${Math.round((dashboardData.finance.paid / dashboardData.finance.total_budget) * 100)}% du total`}
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="En attente"
          value={`CHF ${(dashboardData.finance.pending / 1000).toFixed(0)}k`}
          icon={DollarSign}
          color="orange"
        />
        <KpiCard
          title="En retard"
          value={`CHF ${(dashboardData.finance.overdue / 1000).toFixed(0)}k`}
          icon={AlertCircle}
          color={dashboardData.finance.overdue > 0 ? 'red' : 'green'}
        />
      </div>

      <LineChartComponent
        data={paymentTimelineData}
        title="Évolution des paiements"
        subtitle="12 derniers mois (en milliers CHF)"
        lines={[
          { dataKey: 'paid', name: 'Payé', color: '#10b981' },
          { dataKey: 'pending', name: 'En attente', color: '#f59e0b' },
        ]}
      />

      <BarChartComponent
        data={buyerPaymentsData}
        title="Paiements par acheteur"
        subtitle="Répartition du statut des paiements (en milliers CHF)"
        bars={[
          { dataKey: 'paid', name: 'Payé', color: '#10b981' },
          { dataKey: 'pending', name: 'En attente', color: '#f59e0b' },
          { dataKey: 'overdue', name: 'En retard', color: '#ef4444' },
        ]}
      />

      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Détails par acheteur
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Acheteur
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total dû
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Payé
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  En attente
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  En retard
                </th>
              </tr>
            </thead>
            <tbody>
              {(financeData.buyer_payments || []).map((buyer: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-white">
                    {buyer.buyer_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-white">
                    CHF {(buyer.total_due / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                    CHF {(buyer.paid / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-orange-600">
                    CHF {(buyer.pending / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                    {buyer.overdue > 0 ? `CHF ${(buyer.overdue / 1000).toFixed(0)}k` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
