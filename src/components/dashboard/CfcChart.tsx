import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Coins, AlertTriangle } from 'lucide-react';

interface CfcDataPoint {
  cfc: string;
  budget: number;
  spent: number;
}

interface CfcChartProps {
  data: CfcDataPoint[];
}

export function CfcChart({ data }: CfcChartProps) {
  const totalBudget = data.reduce((acc, item) => acc + item.budget, 0);
  const totalSpent = data.reduce((acc, item) => acc + item.spent, 0);
  const spentPercentage = ((totalSpent / totalBudget) * 100).toFixed(1);
  const isOverBudget = totalSpent > totalBudget;
  const budgetRemaining = totalBudget - totalSpent;

  return (
    <Card className="group relative overflow-hidden p-6 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-400/5 to-blue-400/5 dark:from-primary-400/10 dark:to-blue-400/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/20 dark:to-blue-500/20 p-3 rounded-xl">
            <Coins className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">CFC — Budget vs Dépensé</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Suivi par code des frais de construction</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">{spentPercentage}%</span>
            {isOverBudget && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3 h-3" />
                Dépassé
              </div>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Reste: {(budgetRemaining / 1000).toFixed(0)}K CHF
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(58, 110, 165)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="rgb(58, 110, 165)" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(100, 116, 139)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="rgb(100, 116, 139)" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" opacity={0.5} />
          <XAxis
            dataKey="cfc"
            style={{ fontSize: '12px' }}
            stroke="currentColor"
            className="text-neutral-500 dark:text-neutral-400"
          />
          <YAxis
            style={{ fontSize: '12px' }}
            stroke="currentColor"
            className="text-neutral-500 dark:text-neutral-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(229, 231, 235)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            formatter={(value: number) => `CHF ${value.toLocaleString('fr-CH')}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            iconType="circle"
          />
          <Bar
            dataKey="budget"
            fill="url(#budgetGradient)"
            name="Budget"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          <Bar
            dataKey="spent"
            fill="url(#spentGradient)"
            name="Dépensé"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
