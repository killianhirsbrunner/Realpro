import { useState, useMemo } from 'react';
import { format, differenceInDays, startOfMonth, addMonths, eachMonthOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { PlanningTask } from '../../hooks/usePlanning';
import { GanttTaskBar } from './GanttTaskBar';

interface PlanningGanttChartProps {
  tasks: PlanningTask[];
  onTaskUpdate?: (taskId: string, updates: Partial<PlanningTask>) => void;
}

export function PlanningGanttChart({ tasks, onTaskUpdate }: PlanningGanttChartProps) {
  const [zoom, setZoom] = useState(1);
  const [viewStart, setViewStart] = useState(new Date());

  const monthsToShow = Math.max(12, Math.ceil(12 / zoom));

  const timelineMonths = useMemo(() => {
    const start = startOfMonth(viewStart);
    const end = addMonths(start, monthsToShow);
    return eachMonthOfInterval({ start, end });
  }, [viewStart, monthsToShow]);

  const projectStart = useMemo(() => {
    if (tasks.length === 0) return new Date();
    const dates = tasks.map(t => new Date(t.start_date));
    return new Date(Math.min(...dates.map(d => d.getTime())));
  }, [tasks]);

  const dayWidth = 20 * zoom;

  const getTaskPosition = (task: PlanningTask) => {
    const startDate = new Date(task.start_date);
    const endDate = new Date(task.end_date);
    const offsetDays = differenceInDays(startDate, projectStart);
    const durationDays = differenceInDays(endDate, startDate) + 1;

    return {
      left: offsetDays * dayWidth,
      width: durationDays * dayWidth,
    };
  };

  const tasksByPhase = useMemo(() => {
    const phases = ['preparation', 'gros_oeuvre', 'second_oeuvre', 'finitions', 'livraison'];
    const grouped: Record<string, PlanningTask[]> = {};

    phases.forEach(phase => {
      grouped[phase] = tasks.filter(t => t.phase === phase);
    });

    grouped['other'] = tasks.filter(t => !t.phase || !phases.includes(t.phase));

    return grouped;
  }, [tasks]);

  const phaseLabels: Record<string, string> = {
    preparation: 'Préparation',
    gros_oeuvre: 'Gros Œuvre',
    second_oeuvre: 'Second Œuvre',
    finitions: 'Finitions',
    livraison: 'Livraison',
    other: 'Autres',
  };

  const milestones = tasks.filter(t => t.type === 'milestone');

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card overflow-hidden">

      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Planning Gantt
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewStart(addMonths(viewStart, -3))}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            title="3 mois précédents"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewStart(addMonths(viewStart, 3))}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            title="3 mois suivants"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />

          <button
            onClick={() => setZoom(Math.min(zoom + 0.25, 2))}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            disabled={zoom >= 2}
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            disabled={zoom <= 0.5}
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">

          <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 sticky top-0 z-10">
            <div className="w-64 flex-shrink-0 px-6 py-3 border-r border-neutral-200 dark:border-neutral-800">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tâches
              </span>
            </div>

            <div className="flex">
              {timelineMonths.map((month, idx) => (
                <div
                  key={idx}
                  className="border-r border-neutral-200 dark:border-neutral-800 px-4 py-3 text-center"
                  style={{ width: `${30 * dayWidth}px` }}
                >
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {format(month, 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {Object.entries(tasksByPhase).map(([phase, phaseTasks]) => {
              if (phaseTasks.length === 0) return null;

              return (
                <div key={phase} className="border-b border-neutral-200 dark:border-neutral-800">

                  <div className="flex bg-neutral-50/50 dark:bg-neutral-800/30">
                    <div className="w-64 flex-shrink-0 px-6 py-3 border-r border-neutral-200 dark:border-neutral-800">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {phaseLabels[phase] || phase}
                      </span>
                    </div>
                    <div className="flex-1" />
                  </div>

                  {phaseTasks.map((task, idx) => {
                    const position = getTaskPosition(task);

                    return (
                      <div
                        key={task.id}
                        className="flex hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <div className="w-64 flex-shrink-0 px-6 py-4 border-r border-neutral-200 dark:border-neutral-800">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                task.status === 'completed'
                                  ? 'bg-green-500'
                                  : task.status === 'in_progress'
                                  ? 'bg-brand-500'
                                  : task.status === 'delayed'
                                  ? 'bg-red-500'
                                  : 'bg-neutral-300'
                              }`}
                            />
                            <span className="text-sm text-neutral-900 dark:text-white truncate">
                              {task.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 relative py-4">
                          <GanttTaskBar
                            task={task}
                            position={position}
                            onUpdate={onTaskUpdate}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {milestones.map((milestone) => {
            const position = getTaskPosition(milestone);
            return (
              <div
                key={milestone.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${position.left + 256}px`,
                  top: 0,
                  bottom: 0,
                }}
              >
                <div className="w-0.5 h-full bg-brand-400 opacity-40" />
                <div className="absolute top-0 -left-2 w-4 h-4 bg-brand-600 rotate-45 border-2 border-white dark:border-neutral-900" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
