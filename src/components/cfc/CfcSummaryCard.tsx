import { Card } from '../ui/Card';
import { DollarSign, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import type { CFCSummary } from '../../hooks/useCFC';

interface CfcSummaryCardProps {
  summary: CFCSummary;
}

export function CfcSummaryCard({ summary }: CfcSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900">
            <DollarSign className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Budget total</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalBudget.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          Base du projet
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Engagé</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalEngaged.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          {summary.percentEngaged.toFixed(1)}% du budget
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Facturé</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalInvoiced.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          {summary.percentInvoiced.toFixed(1)}% du budget
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Payé</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              CHF {summary.totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          {summary.percentPaid.toFixed(1)}% du budget
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Progression financière
            </p>
            <p className={`text-sm font-semibold ${
              summary.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Écart: CHF {summary.totalVariance.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-400">Engagé</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {summary.percentEngaged.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 transition-all"
                  style={{ width: `${Math.min(summary.percentEngaged, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-400">Facturé</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {summary.percentInvoiced.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${Math.min(summary.percentInvoiced, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-400">Payé</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {summary.percentPaid.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{ width: `${Math.min(summary.percentPaid, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
