import { PlanningTask } from '../../hooks/usePlanning';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface GanttTaskProps {
  task: PlanningTask;
  projectStart: number;
  zoom: number;
  onClick?: () => void;
}

export function GanttTask({ task, projectStart, zoom, onClick }: GanttTaskProps) {
  const start = new Date(task.start_date).getTime();
  const end = new Date(task.end_date).getTime();
  const duration = end - start;

  const pxPerDay = 4 * zoom;
  const width = Math.max((duration / (1000 * 3600 * 24)) * pxPerDay, 40);
  const left = ((start - projectStart) / (1000 * 3600 * 24)) * pxPerDay;

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-brand-500';
      case 'delayed':
        return 'bg-red-500';
      case 'blocked':
        return 'bg-brand-500';
      default:
        return 'bg-neutral-400';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'delayed':
        return <AlertTriangle className="w-3 h-3" />;
      case 'blocked':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getProgressColor = () => {
    if (task.progress === 100) return 'bg-green-600';
    if (task.progress >= 75) return 'bg-brand-500';
    if (task.progress >= 50) return 'bg-yellow-500';
    return 'bg-brand-500';
  };

  return (
    <div
      className="flex items-center gap-4 group"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="w-64 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`${getStatusColor()} text-white p-1 rounded`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{task.name}</div>
            {task.phase && (
              <div className="text-xs text-neutral-500 capitalize">
                {task.phase.replace('_', ' ')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="relative h-8 bg-neutral-100 rounded-lg overflow-hidden">
          <div
            className={`absolute top-0 h-full rounded-lg transition-all ${getStatusColor()} opacity-80`}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
          >
            <div
              className={`h-full ${getProgressColor()} opacity-70 transition-all`}
              style={{ width: `${task.progress}%` }}
            />

            {width > 60 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {task.progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-16 text-right flex-shrink-0">
        <div className="text-sm font-semibold">{task.progress}%</div>
        {task.priority !== 'medium' && (
          <div className={`text-xs ${task.priority === 'high' || task.priority === 'critical' ? 'text-red-600' : 'text-neutral-500'}`}>
            {task.priority === 'critical' ? '🔥' : task.priority === 'high' ? '⬆️' : '⬇️'}
          </div>
        )}
      </div>
    </div>
  );
}
