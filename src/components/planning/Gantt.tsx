import { useState } from 'react';
import { PlanningTask } from '../../hooks/usePlanning';
import { GanttTask } from './GanttTask';
import { Plus, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface GanttProps {
  tasks: PlanningTask[];
  onTaskClick?: (task: PlanningTask) => void;
  onCreateTask?: () => void;
}

export function Gantt({ tasks, onTaskClick, onCreateTask }: GanttProps) {
  const [zoom, setZoom] = useState(1);

  const projectStart = tasks.length > 0
    ? new Date(Math.min(...tasks.map(t => new Date(t.start_date).getTime())))
    : new Date();

  return (
    <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-neutral-200 bg-neutral-50">
        <h3 className="text-lg font-semibold">Planning Gantt</h3>

        <div className="flex items-center gap-3">
          {onCreateTask && (
            <Button onClick={onCreateTask} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          )}

          <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom * 0.9))}
              className="p-1.5 hover:bg-neutral-100 rounded transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-neutral-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom * 1.1))}
              className="p-1.5 hover:bg-neutral-100 rounded transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center text-neutral-500">
          <p>Aucune tâche planifiée pour ce projet.</p>
          {onCreateTask && (
            <Button onClick={onCreateTask} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Créer la première tâche
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] p-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <GanttTask
                  key={task.id}
                  task={task}
                  projectStart={projectStart.getTime()}
                  zoom={zoom}
                  onClick={() => onTaskClick?.(task)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
