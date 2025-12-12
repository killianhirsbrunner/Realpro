interface SalesData {
  projectId: string;
  projectName: string;
  lotsSold: number;
  lotsTotal: number;
  percentage: number;
  revenue: number;
}

interface ProjectSalesSummaryProps {
  sales: SalesData[];
}

export default function ProjectSalesSummary({ sales }: ProjectSalesSummaryProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-6">
      <h3 className="font-semibold text-lg text-neutral-900">Commercialisation</h3>

      {sales.length === 0 && (
        <p className="text-neutral-500 text-sm">Aucune donnée de vente disponible.</p>
      )}

      {sales.map((item) => (
        <div key={item.projectId} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-neutral-900">{item.projectName}</p>
            <p className="text-sm font-semibold text-green-600">{item.percentage}%</p>
          </div>

          <p className="text-sm text-neutral-600">
            {item.lotsSold} lots vendus sur {item.lotsTotal}
          </p>

          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${item.percentage}%` }}
            />
          </div>

          <p className="text-sm text-neutral-700 font-medium">
            CHF {item.revenue.toLocaleString('fr-CH')}
          </p>
        </div>
      ))}
    </div>
  );
}
