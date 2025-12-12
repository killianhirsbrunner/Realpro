import { TrendingUp, Building2, FileText, AlertCircle } from 'lucide-react';

interface OverviewCardsProps {
  stats: {
    activeProjects: number;
    totalLots: number;
    soldLots: number;
    salesRate: number;
    pendingDocuments: number;
    pendingModifications: number;
    totalRevenue: number;
    alerts: number;
  };
}

export default function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      label: 'Projets actifs',
      value: stats.activeProjects,
      icon: Building2,
      color: 'text-brand-600',
      bgColor: 'bg-brand-50 dark:bg-blue-950',
    },
    {
      label: 'Taux de vente',
      value: `${stats.salesRate}%`,
      subtitle: `${stats.soldLots}/${stats.totalLots} lots`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Documents en attente',
      value: stats.pendingDocuments,
      icon: FileText,
      color: 'text-brand-600',
      bgColor: 'bg-brand-50 dark:bg-brand-950',
    },
    {
      label: 'Alertes & Retards',
      value: stats.alerts,
      icon: AlertCircle,
      color: stats.alerts > 0 ? 'text-red-600' : 'text-neutral-600',
      bgColor: stats.alerts > 0 ? 'bg-red-50 dark:bg-red-950' : 'bg-neutral-50 dark:bg-neutral-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-6 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  {card.label}
                </p>
                <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
