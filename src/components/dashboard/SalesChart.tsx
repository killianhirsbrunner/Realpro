import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { TrendingUp, Home } from 'lucide-react';

interface SalesDataPoint {
  month: string;
  sold: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  const totalSold = data.reduce((acc, item) => acc + item.sold, 0);
  const avgSold = (totalSold / data.length).toFixed(1);
  const trend = data.length > 1 ? ((data[data.length - 1].sold - data[data.length - 2].sold) / data[data.length - 2].sold * 100).toFixed(1) : '0';
  const isPositiveTrend = parseFloat(trend) > 0;

  return (
    <Card className="group relative overflow-hidden p-6 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-400/5 to-primary-400/5 dark:from-brand-400/10 dark:to-primary-400/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-500/10 to-primary-500/10 dark:from-brand-500/20 dark:to-primary-500/20 p-3 rounded-xl">
            <Home className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Ventes PPE/QPT</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Évolution mensuelle</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">{totalSold}</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isPositiveTrend
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className={`w-3 h-3 ${!isPositiveTrend && 'rotate-180'}`} />
              {Math.abs(parseFloat(trend))}%
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Moy: {avgSold}/mois</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(58, 110, 165)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="rgb(58, 110, 165)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" opacity={0.5} />
          <XAxis
            dataKey="month"
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
            itemStyle={{ color: 'rgb(58, 110, 165)' }}
          />
          <Area
            type="monotone"
            dataKey="sold"
            stroke="#3A6EA5"
            strokeWidth={3}
            fill="url(#salesGradient)"
            dot={{ fill: '#3A6EA5', r: 5, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
