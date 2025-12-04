import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CFCDetail } from '../../hooks/useCFC';

interface CfcProgressCardProps {
  cfc: CFCDetail;
}

export function CfcProgressCard({ cfc }: CfcProgressCardProps) {
  const variance = cfc.budget_current - cfc.engaged;
  const percentEngaged = cfc.budget_current > 0 ? (cfc.engaged / cfc.budget_current) * 100 : 0;
  const percentInvoiced = cfc.budget_current > 0 ? (cfc.invoiced / cfc.budget_current) * 100 : 0;
  const percentPaid = cfc.budget_current > 0 ? (cfc.paid / cfc.budget_current) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Progression financière
          </h3>
          <div className="flex items-center gap-2">
            {variance >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-semibold ${
              variance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {variance >= 0 ? 'Sous budget' : 'Dépassement'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Budget</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {cfc.budget_current.toLocaleString()}
            </p>
            {cfc.budget_initial !== cfc.budget_current && (
              <p className="text-xs text-neutral-500 mt-1">
                Initial: CHF {cfc.budget_initial.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Engagé</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {cfc.engaged.toLocaleString()}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {percentEngaged.toFixed(1)}% du budget
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Facturé</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {cfc.invoiced.toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {percentInvoiced.toFixed(1)}% du budget
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Payé</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {cfc.paid.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {percentPaid.toFixed(1)}% du budget
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Écart budgétaire
            </p>
            <p className={`text-lg font-bold ${
              variance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              CHF {variance.toLocaleString()}
            </p>
          </div>
          {variance < 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Attention:</strong> Ce poste CFC est en dépassement budgétaire. Une révision
                est recommandée.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
