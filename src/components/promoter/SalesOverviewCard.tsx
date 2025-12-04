import { TrendingUp, TrendingDown } from 'lucide-react';

interface SalesData {
  projectId: string;
  projectName: string;
  lotsTotal: number;
  lotsSold: number;
  lotsReserved: number;
  percentage: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

interface SalesOverviewCardProps {
  sales: SalesData[];
}

export default function SalesOverviewCard({ sales }: SalesOverviewCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Commercialisation
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Vue par projet
        </p>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée de vente</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sales.map((sale) => (
            <div key={sale.projectId} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sale.projectName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sale.lotsSold} vendus · {sale.lotsReserved} réservés
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {sale.trend === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {sale.trend === 'down' && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {sale.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-green-600 h-full"
                    style={{
                      width: `${(sale.lotsSold / sale.lotsTotal) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-yellow-500 h-full"
                    style={{
                      width: `${(sale.lotsReserved / sale.lotsTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span className="text-gray-600 dark:text-gray-400">Vendus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">Réservés</span>
                  </div>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(sale.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
