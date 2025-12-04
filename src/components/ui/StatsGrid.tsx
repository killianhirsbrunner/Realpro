import { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClass = colorClasses[stat.color || 'neutral'];

        return (
          <div
            key={index}
            className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </span>
              {Icon && (
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {stat.value}
              </span>
              {stat.trend && (
                <span
                  className={`text-sm font-medium ${
                    stat.trend.direction === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.trend.direction === 'up' ? '+' : '-'}
                  {stat.trend.value}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
