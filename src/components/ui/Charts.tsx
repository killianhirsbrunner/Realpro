import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';

interface ChartProps {
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  className?: string;
}

interface LineChartProps extends ChartProps {
  lines?: Array<{ dataKey: string; color?: string; name?: string }>;
}

interface BarChartProps extends ChartProps {
  bars?: Array<{ dataKey: string; color?: string; name?: string }>;
  stacked?: boolean;
}

interface PieChartProps extends Omit<ChartProps, 'xAxisKey'> {
  nameKey?: string;
  colors?: string[];
}

interface AreaChartProps extends ChartProps {
  areas?: Array<{ dataKey: string; color?: string; name?: string }>;
  stacked?: boolean;
}

// Line Chart Component
export function LineChart({
  data,
  lines = [],
  xAxisKey = 'name',
  height = 300,
  className = '',
}: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartColors = designTokens.colors.chart;

  const axisColor = isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
  const gridColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xAxisKey} stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
              border: `1px solid ${gridColor}`,
              borderRadius: designTokens.radius.md,
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color || chartColors[index % chartColors.length]}
              strokeWidth={2}
              name={line.name || line.dataKey}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar Chart Component
export function BarChart({
  data,
  bars = [],
  xAxisKey = 'name',
  stacked = false,
  height = 300,
  className = '',
}: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartColors = designTokens.colors.chart;

  const axisColor = isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
  const gridColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xAxisKey} stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
              border: `1px solid ${gridColor}`,
              borderRadius: designTokens.radius.md,
            }}
          />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color || chartColors[index % chartColors.length]}
              name={bar.name || bar.dataKey}
              stackId={stacked ? 'stack' : undefined}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie Chart Component
export function PieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  colors,
  height = 300,
  className = '',
}: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartColors = colors || designTokens.colors.chart;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
              border: `1px solid ${isDark ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
              borderRadius: designTokens.radius.md,
            }}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Area Chart Component
export function AreaChart({
  data,
  areas = [],
  xAxisKey = 'name',
  stacked = false,
  height = 300,
  className = '',
}: AreaChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartColors = designTokens.colors.chart;

  const axisColor = isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
  const gridColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            {areas.map((area, index) => {
              const color = area.color || chartColors[index % chartColors.length];
              return (
                <linearGradient key={area.dataKey} id={`color-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xAxisKey} stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
              border: `1px solid ${gridColor}`,
              borderRadius: designTokens.radius.md,
            }}
          />
          <Legend />
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.color || chartColors[index % chartColors.length]}
              fill={`url(#color-${area.dataKey})`}
              name={area.name || area.dataKey}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
