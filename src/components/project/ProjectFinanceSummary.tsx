interface FinanceData {
  cfcBudget: number;
  engaged: number;
  invoiced: number;
  paid: number;
  remaining: number;
}

interface ProjectFinanceSummaryProps {
  finance: FinanceData;
}

export default function ProjectFinanceSummary({ finance }: ProjectFinanceSummaryProps) {
  const engagedPercent = finance.cfcBudget > 0 ? (finance.engaged / finance.cfcBudget) * 100 : 0;
  const invoicedPercent = finance.cfcBudget > 0 ? (finance.invoiced / finance.cfcBudget) * 100 : 0;
  const paidPercent = finance.cfcBudget > 0 ? (finance.paid / finance.cfcBudget) * 100 : 0;

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="font-semibold text-lg text-gray-900">Finances</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Budget CFC</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            CHF {finance.cfcBudget.toLocaleString('fr-CH')}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 font-medium">Restant</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            CHF {finance.remaining.toLocaleString('fr-CH')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Engagé</span>
            <span className="font-semibold text-gray-900">{engagedPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${engagedPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            CHF {finance.engaged.toLocaleString('fr-CH')}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Facturé</span>
            <span className="font-semibold text-gray-900">{invoicedPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${invoicedPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            CHF {finance.invoiced.toLocaleString('fr-CH')}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Payé</span>
            <span className="font-semibold text-gray-900">{paidPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            CHF {finance.paid.toLocaleString('fr-CH')}
          </p>
        </div>
      </div>
    </div>
  );
}
