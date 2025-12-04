import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface SettingCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  link: string;
  badge?: string;
}

export function SettingCard({ title, description, icon: Icon, link, badge }: SettingCardProps) {
  return (
    <Link to={link}>
      <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card hover:shadow-lg transition-all p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          {badge && (
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-lg">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            {description}
          </p>
        )}

        <div className="flex items-center text-brand-600 dark:text-brand-400 text-sm font-medium group-hover:gap-2 transition-all">
          Configurer
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
