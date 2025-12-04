import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface CfcDataPoint {
  cfc: string;
  budget: number;
  spent: number;
}

interface CfcChartProps {
  data: CfcDataPoint[];
}

export function CfcChart({ data }: CfcChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">CFC — Budget vs Dépensé</h2>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="cfc"
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
          <Legend />
          <Bar dataKey="budget" fill="#3A6EA5" name="Budget" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" fill="#64748B" name="Dépensé" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
