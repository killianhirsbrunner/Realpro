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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
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
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50 dark:bg-secondary-950',
    },
    {
      label: 'Alertes & Retards',
      value: stats.alerts,
      icon: AlertCircle,
      color: stats.alerts > 0 ? 'text-red-600' : 'text-gray-600',
      bgColor: stats.alerts > 0 ? 'bg-red-50 dark:bg-red-950' : 'bg-gray-50 dark:bg-gray-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {card.label}
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
