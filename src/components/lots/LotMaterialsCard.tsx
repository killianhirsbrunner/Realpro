import { Card } from '../ui/Card';
import { Palette, CheckCircle } from 'lucide-react';

interface LotMaterialsCardProps {
  lot: {
    materials?: Array<{
      id: string;
      category: string;
      choice: string;
    }>;
  };
}

export function LotMaterialsCard({ lot }: LotMaterialsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Choix matériaux
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {lot.materials?.length || 0} choix
        </span>
      </div>

      {!lot.materials || lot.materials.length === 0 ? (
        <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
          <Palette className="h-5 w-5" />
          <p className="text-sm">Aucun choix enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lot.materials.map((material) => (
            <div
              key={material.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  {material.category}
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {material.choice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
