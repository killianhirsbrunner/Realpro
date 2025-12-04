import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SalesDataPoint {
  month: string;
  sold: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Ventes PPE/QPT</h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            style={{ fontSize: '12px' }}
          />
          <YAxis style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="sold"
            stroke="#3A6EA5"
            strokeWidth={3}
            dot={{ fill: '#3A6EA5', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
