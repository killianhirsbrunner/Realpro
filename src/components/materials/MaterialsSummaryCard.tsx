import { Card } from '../ui/Card';
import { Package, CheckCircle2, FileEdit, Layers } from 'lucide-react';

interface MaterialsSummaryCardProps {
  overview: {
    categoryCount: number;
    optionCount: number;
    completedLots: number;
    totalLots: number;
    pendingRequests: number;
  };
}

export function MaterialsSummaryCard({ overview }: MaterialsSummaryCardProps) {
  const completionRate = overview.totalLots > 0
    ? Math.round((overview.completedLots / overview.totalLots) * 100)
    : 0;

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Catégories</p>
          <p className="text-2xl font-semibold">{overview.categoryCount}</p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Options totales</p>
          <p className="text-2xl font-semibold">{overview.optionCount}</p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Lots complétés</p>
          <p className="text-2xl font-semibold text-green-600">
            {overview.completedLots}/{overview.totalLots}
          </p>
          <div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileEdit className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Modifications</p>
          <p className="text-2xl font-semibold">
            {overview.pendingRequests}
          </p>
          {overview.pendingRequests > 0 && (
            <p className="text-xs text-orange-600 mt-1">en attente</p>
          )}
        </div>
      </div>
    </Card>
  );
}
