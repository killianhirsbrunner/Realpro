import { ReactNode } from 'react';
import { RealProCard } from './RealProCard';

interface RealProChartCardProps {
  title: string;
  subtitle?: string;
  chart: ReactNode;
  actions?: ReactNode;
}

export function RealProChartCard({
  title,
  subtitle,
  chart,
  actions
}: RealProChartCardProps) {
  return (
    <RealProCard>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div>{chart}</div>
    </RealProCard>
  );
}
