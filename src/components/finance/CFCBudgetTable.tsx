interface CFCBudgetTableProps {
  cfcs: Array<{
    id: string;
    cfcCode: string;
    designation: string;
    budget: number;
    engaged: number;
    invoiced: number;
    paid: number;
    engagedAmount: number;
    invoicedAmount: number;
    paidAmount: number;
  }>;
}

export function CFCBudgetTable({ cfcs }: CFCBudgetTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-700 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 min-w-[45px] text-right">
        {value.toFixed(1)}%
      </span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                CFC
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Désignation
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Engagé
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Facturé
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Payé
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {cfcs.map((cfc) => (
              <tr
                key={cfc.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {cfc.cfcCode}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {cfc.designation}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatCurrency(cfc.budget)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <ProgressBar value={cfc.engaged} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {formatCurrency(cfc.engagedAmount)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <ProgressBar value={cfc.invoiced} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {formatCurrency(cfc.invoicedAmount)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <ProgressBar value={cfc.paid} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {formatCurrency(cfc.paidAmount)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cfcs.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Aucun budget CFC pour ce projet
          </p>
        </div>
      )}
    </div>
  );
}
