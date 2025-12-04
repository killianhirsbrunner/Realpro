import { BuyerProgressWithLot } from '../../hooks/useBuyerProgress';
import { Card } from '../ui/Card';
import { Home, TrendingUp } from 'lucide-react';

interface BuyerProgressCardProps {
  progress: BuyerProgressWithLot;
  onClick?: () => void;
}

export function BuyerProgressCard({ progress, onClick }: BuyerProgressCardProps) {
  const phases = [
    { label: 'Gros œuvre', value: progress.gros_oeuvre_progress, color: 'bg-brand-500' },
    { label: 'Second œuvre', value: progress.second_oeuvre_progress, color: 'bg-brand-500' },
    { label: 'Finitions', value: progress.finitions_progress, color: 'bg-green-500' },
  ];

  return (
    <Card
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-5 h-5 text-neutral-500" />
            <h3 className="text-lg font-semibold">Lot {progress.lot.code}</h3>
          </div>
          <p className="text-sm text-neutral-600">
            {progress.buyer.first_name} {progress.buyer.last_name}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-brand-600">
            {progress.global_progress}%
          </div>
          <p className="text-xs text-neutral-500">Progression</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {phases.map((phase) => (
          <div key={phase.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-700">{phase.label}</span>
              <span className="font-medium">{phase.value}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`${phase.color} h-2 rounded-full transition-all`}
                style={{ width: `${phase.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {progress.current_phase && (
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-50 text-brand-700 rounded text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Phase actuelle :</span>
          <span className="capitalize">{progress.current_phase.replace('_', ' ')}</span>
        </div>
      )}

      {progress.milestone_reached && (
        <div className="mt-3 text-sm text-neutral-600">
          <span className="font-medium">Dernière étape :</span> {progress.milestone_reached}
        </div>
      )}

      {progress.notes && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-sm text-neutral-700 line-clamp-2">{progress.notes}</p>
        </div>
      )}
    </Card>
  );
}
