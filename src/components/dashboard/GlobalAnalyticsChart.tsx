import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface GlobalAnalyticsChartProps {
  data: {
    month: string;
    ventes: number;
    chantier: number;
    revenus: number;
  }[];
}

export function GlobalAnalyticsChart({ data }: GlobalAnalyticsChartProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
            Performance globale
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Évolution des ventes et de l'avancement des chantiers
          </p>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
          <TrendingUp className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            Taux de vente et avancement chantier
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-800" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="ventes"
                stroke="#9e5eef"
                strokeWidth={3}
                dot={{ fill: '#9e5eef', r: 4 }}
                activeDot={{ r: 6 }}
                name="Taux de vente (%)"
              />
              <Line
                type="monotone"
                dataKey="chantier"
                stroke="#0891b2"
                strokeWidth={2}
                dot={{ fill: '#0891b2', r: 4 }}
                activeDot={{ r: 6 }}
                name="Avancement chantier (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            Revenus mensuels (CHF)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-800" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => `CHF ${value.toLocaleString()}`}
              />
              <Bar
                dataKey="revenus"
                fill="#9e5eef"
                radius={[8, 8, 0, 0]}
                name="Revenus"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
