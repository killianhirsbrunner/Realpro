import { Card } from '../ui/Card';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface ComparisonItem {
  id: string;
  label: string;
  values: number[];
}

interface Company {
  id: string;
  name: string;
}

interface SubmissionComparisonTableProps {
  companies: Company[];
  items: ComparisonItem[];
}

export function SubmissionComparisonTable({ companies, items }: SubmissionComparisonTableProps) {
  const getMinMaxForItem = (values: number[]) => {
    const validValues = values.filter(v => v > 0);
    if (validValues.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...validValues),
      max: Math.max(...validValues)
    };
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Poste
            </th>
            {companies.map((company) => (
              <th
                key={company.id}
                className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white"
              >
                {company.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const { min, max } = getMinMaxForItem(item.values);

            return (
              <tr
                key={item.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <td className="py-3 px-4 text-neutral-900 dark:text-white">
                  {item.label}
                </td>
                {item.values.map((value, index) => {
                  const isLowest = value === min && value > 0;
                  const isHighest = value === max && value > 0 && min !== max;

                  return (
                    <td
                      key={index}
                      className={`py-3 px-4 text-right font-medium ${
                        isLowest
                          ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                          : isHighest
                          ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                          : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-2">
                        {value > 0 ? `CHF ${value.toLocaleString()}` : '-'}
                        {isLowest && <TrendingDown className="h-4 w-4" />}
                        {isHighest && <TrendingUp className="h-4 w-4" />}
                        {!isLowest && !isHighest && value > 0 && <Minus className="h-4 w-4 text-neutral-400" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}

          <tr className="bg-neutral-100 dark:bg-neutral-800 font-semibold">
            <td className="py-4 px-4 text-neutral-900 dark:text-white">
              TOTAL
            </td>
            {companies.map((_, index) => {
              const total = items.reduce((sum, item) => sum + (item.values[index] || 0), 0);
              const allTotals = companies.map((_, i) =>
                items.reduce((sum, item) => sum + (item.values[i] || 0), 0)
              );
              const minTotal = Math.min(...allTotals);
              const isLowest = total === minTotal;

              return (
                <td
                  key={index}
                  className={`py-4 px-4 text-right text-lg ${
                    isLowest
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-end gap-2">
                    CHF {total.toLocaleString()}
                    {isLowest && <TrendingDown className="h-5 w-5" />}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
