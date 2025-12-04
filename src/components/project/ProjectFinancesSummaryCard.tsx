import { Wallet, FileText, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { useProjectFinanceSummary } from '@/hooks/useProjectFinanceSummary';
import { Link } from 'react-router-dom';

interface ProjectFinancesSummaryCardProps {
  projectId: string;
}

export default function ProjectFinancesSummaryCard({ projectId }: ProjectFinancesSummaryCardProps) {
  const { data, loading } = useProjectFinanceSummary(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const cfcUsagePercent = data.cfc.totalBudget > 0
    ? Math.round((data.cfc.spent / data.cfc.totalBudget) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Finances</h3>
            <p className="text-sm text-gray-500">Budget & Trésorerie</p>
          </div>
        </div>
        <Link
          to={`/projects/${projectId}/finances`}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Voir détails →
        </Link>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Budget CFC</span>
            </div>
            <span className="text-sm font-semibold text-blue-900">{cfcUsagePercent}%</span>
          </div>
          <div className="space-y-2 text-xs text-blue-800">
            <div className="flex justify-between">
              <span>Budgété</span>
              <span className="font-medium">
                {(data.cfc.totalBudget / 1000000).toFixed(2)}M CHF
              </span>
            </div>
            <div className="flex justify-between">
              <span>Engagé</span>
              <span className="font-medium">
                {(data.cfc.committed / 1000000).toFixed(2)}M CHF
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dépensé</span>
              <span className="font-medium">
                {(data.cfc.spent / 1000000).toFixed(2)}M CHF
              </span>
            </div>
          </div>
          <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(cfcUsagePercent, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Contrats</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{data.contracts.total}</p>
            <p className="text-xs text-gray-600">{data.contracts.active} actifs</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Factures</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{data.invoices.total}</p>
            <p className="text-xs text-gray-600">{data.invoices.paid} payées</p>
          </div>
        </div>

        {data.invoices.overdue > 0 && (
          <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <div className="text-xs text-red-800">
              <span className="font-medium">{data.invoices.overdue}</span> factures en retard
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">Acomptes acheteurs</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-green-600">
              {(data.buyerInstallments.receivedAmount / 1000).toFixed(0)}K
            </span>
            <span className="text-sm text-gray-500">
              / {(data.buyerInstallments.expectedAmount / 1000).toFixed(0)}K CHF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
