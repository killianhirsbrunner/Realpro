import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { RealProCard } from '../realpro/RealProCard';

interface BrokerPerformanceChartProps {
  data: {
    month: string;
    sales: number;
    reservations: number;
    commission: number;
  }[];
}

export function BrokerPerformanceChart({ data }: BrokerPerformanceChartProps) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      month: new Date(item.month).toLocaleDateString('fr-CH', {
        month: 'short',
        year: 'numeric'
      })
    }));
  }, [data]);

  return (
    <RealProCard className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          Performance des ventes
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Évolution des ventes et réservations par mois
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorSales)"
            name="Ventes"
          />
          <Area
            type="monotone"
            dataKey="reservations"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorReservations)"
            name="Réservations"
          />
        </AreaChart>
      </ResponsiveContainer>
    </RealProCard>
  );
}
