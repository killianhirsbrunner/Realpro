import { Card } from '../ui/Card';
import { Wallet, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import type { FinanceSummary } from '../../hooks/useFinance';

interface FinanceOverviewCardProps {
  summary: FinanceSummary;
}

export function FinanceOverviewCard({ summary }: FinanceOverviewCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900">
            <Wallet className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total facturé</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalInvoiced.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          Montant total des acomptes
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total payé</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          {summary.percentPaid.toFixed(1)}% des factures
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">En retard</p>
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">
              CHF {summary.totalLate.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          {summary.percentLate.toFixed(1)}% du total
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900">
            <TrendingDown className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Restant dû</p>
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              CHF {summary.totalDue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          À encaisser
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Progression des encaissements
            </p>
            <p className="text-sm font-semibold text-green-600">
              {summary.percentPaid.toFixed(1)}% encaissé
            </p>
          </div>

          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-600 transition-all"
                style={{ width: `${summary.percentPaid}%` }}
                title="Payé"
              />
              <div
                className="bg-red-600 transition-all"
                style={{ width: `${summary.percentLate}%` }}
                title="En retard"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Payé: CHF {summary.totalPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded" />
              <span className="text-neutral-600 dark:text-neutral-400">
                En retard: CHF {summary.totalLate.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neutral-400 rounded" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Restant: CHF {summary.totalDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
