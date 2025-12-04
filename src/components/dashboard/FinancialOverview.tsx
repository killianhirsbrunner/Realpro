import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialOverviewProps {
  data: {
    totalBudget: number;
    engaged: number;
    paid: number;
    remaining: number;
  };
}

export function FinancialOverview({ data }: FinancialOverviewProps) {
  const pieData = [
    { name: 'Payé', value: data.paid, color: '#10b981' },
    { name: 'Engagé', value: data.engaged - data.paid, color: '#f59e0b' },
    { name: 'Disponible', value: data.remaining, color: '#6b7280' },
  ];

  const engagementRate = ((data.engaged / data.totalBudget) * 100).toFixed(1);
  const paymentRate = ((data.paid / data.totalBudget) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Vue financière globale
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `CHF ${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Budget total
              </span>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                CHF {data.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-3 border border-green-200 dark:border-green-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Payé
                </span>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-semibold">{paymentRate}%</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                CHF {data.paid.toLocaleString()}
              </p>
            </div>

            <div className="bg-secondary-50 dark:bg-secondary-950/20 rounded-xl p-3 border border-secondary-200 dark:border-secondary-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  Engagé (non payé)
                </span>
                <span className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">
                  {engagementRate}%
                </span>
              </div>
              <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                CHF {(data.engaged - data.paid).toLocaleString()}
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Disponible
                </span>
                <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs font-semibold">
                    {((data.remaining / data.totalBudget) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                CHF {data.remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
