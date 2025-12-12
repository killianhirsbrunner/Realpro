import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDateCH } from '../../lib/utils/format';
import clsx from 'clsx';

interface Phase {
  name: string;
  planned_end: string;
  actual_end: string | null;
  status: string;
  progress_percent?: number;
}

interface ProjectTimelineProps {
  phases: Phase[];
}

export function ProjectTimeline({ phases }: ProjectTimelineProps) {
  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return CheckCircle;
      case 'IN_PROGRESS':
        return Clock;
      case 'DELAYED':
        return AlertCircle;
      default:
        return Circle;
    }
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'IN_PROGRESS':
        return 'text-brand-600 bg-brand-50';
      case 'DELAYED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-neutral-400 bg-neutral-50';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: 'Terminé',
      IN_PROGRESS: 'En cours',
      DELAYED: 'En retard',
      PENDING: 'À venir',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      COMPLETED: 'success',
      IN_PROGRESS: 'info',
      DELAYED: 'danger',
      PENDING: 'default',
    };
    return map[status] || 'default';
  };

  if (phases.length === 0) {
    return (
      <Card>
        <Card.Content>
          <p className="text-sm text-neutral-500 text-center py-8">
            Aucune phase de construction définie
          </p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Content className="p-0">
        <div className="divide-y divide-neutral-100">
          {phases.map((phase, index) => {
            const Icon = getPhaseIcon(phase.status);
            const isLate = phase.status === 'DELAYED' ||
              (phase.status === 'IN_PROGRESS' &&
               new Date(phase.planned_end) < new Date() &&
               !phase.actual_end);

            return (
              <div
                key={index}
                className={clsx(
                  'p-6 hover:bg-neutral-50/50 transition-colors',
                  index === 0 && 'rounded-t-lg',
                  index === phases.length - 1 && 'rounded-b-lg'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    'p-3 rounded-xl flex-shrink-0 transition-all',
                    getPhaseColor(phase.status)
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 mb-1">
                          {phase.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <span className="text-neutral-500">Prévu:</span>
                            <span className={clsx(
                              'font-medium',
                              isLate && 'text-red-600'
                            )}>
                              {formatDateCH(phase.planned_end)}
                            </span>
                          </span>
                          {phase.actual_end && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span className="flex items-center gap-1">
                                <span className="text-neutral-500">Réel:</span>
                                <span className="font-medium text-green-600">
                                  {formatDateCH(phase.actual_end)}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <Badge variant={getStatusVariant(phase.status)} size="sm">
                        {getStatusLabel(phase.status)}
                      </Badge>
                    </div>

                    {phase.progress_percent !== undefined && phase.status === 'IN_PROGRESS' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-neutral-500">Progression</span>
                          <span className="font-semibold text-neutral-900">
                            {phase.progress_percent}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${phase.progress_percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {isLate && !phase.actual_end && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">
                          Retard de {Math.ceil((new Date().getTime() - new Date(phase.planned_end).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
}
