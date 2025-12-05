import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'turquoise' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  turquoise: 'from-realpro-turquoise to-cyan-500',
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
  red: 'from-red-500 to-pink-500',
  purple: 'from-purple-500 to-pink-500'
};

export function MetricCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'turquoise',
  loading = false
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
          {trend && (
            <div className={clsx(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
              trend.isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div>
          {loading ? (
            <>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-2/3" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle || title}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
