import { Card } from '../ui/Card';
import { formatCHF } from '../../lib/utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CFCItem {
  id: string;
  code: string;
  label: string;
  budget: number;
  engaged?: number;
  spent?: number;
  paid?: number;
}

interface CFCTableProps {
  data: CFCItem[];
}

export function CFCTable({ data }: CFCTableProps) {
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + (item.spent || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Budget Total</p>
          <p className="text-2xl font-semibold mt-2">{formatCHF(totalBudget)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Dépensé</p>
          <p className="text-2xl font-semibold mt-2 text-secondary-600">{formatCHF(totalSpent)}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {calculatePercentage(totalSpent, totalBudget)}% du budget
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Restant</p>
          <p className="text-2xl font-semibold mt-2 text-green-600">
            {formatCHF(totalBudget - totalSpent)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {calculatePercentage(totalBudget - totalSpent, totalBudget)}% disponible
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Code CFC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Engagé
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Dépensé
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Reste
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-500">
                    Aucune donnée CFC
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const remaining = item.budget - (item.spent || 0);
                  const percentage = calculatePercentage(item.spent || 0, item.budget);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                          {item.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatCHF(item.budget)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                          {formatCHF(item.engaged || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-secondary-600">
                          {formatCHF(item.spent || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCHF(remaining)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">
                            {percentage}%
                          </span>
                          {percentage > 90 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
