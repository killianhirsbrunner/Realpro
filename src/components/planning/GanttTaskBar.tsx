import { useState } from 'react';
import { PlanningTask } from '../../hooks/usePlanning';

interface GanttTaskBarProps {
  task: PlanningTask;
  position: { left: number; width: number };
  onUpdate?: (taskId: string, updates: Partial<PlanningTask>) => void;
}

export function GanttTaskBar({ task, position, onUpdate }: GanttTaskBarProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getTaskColor = () => {
    if (task.status === 'completed') return 'bg-green-500 hover:bg-green-600';
    if (task.status === 'delayed') return 'bg-red-500 hover:bg-red-600';
    if (task.status === 'in_progress') return 'bg-brand-500 hover:bg-brand-600';
    if (task.status === 'blocked') return 'bg-secondary-500 hover:bg-secondary-600';
    return 'bg-neutral-400 hover:bg-neutral-500';
  };

  const getPriorityBorder = () => {
    if (task.priority === 'critical') return 'border-2 border-red-600';
    if (task.priority === 'high') return 'border-2 border-secondary-500';
    return '';
  };

  return (
    <div
      className={`
        absolute rounded-lg cursor-move transition-all
        ${getTaskColor()}
        ${getPriorityBorder()}
        ${isDragging ? 'opacity-70 shadow-lg' : 'shadow-md'}
        group
      `}
      style={{
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      title={`${task.name} - ${task.progress}%`}
    >

      <div className="relative h-full flex items-center px-3">

        <div
          className="absolute inset-0 bg-white/20 rounded-lg transition-all"
          style={{ width: `${task.progress}%` }}
        />

        <span className="relative z-10 text-xs font-medium text-white truncate">
          {task.name}
        </span>

        {task.progress > 0 && (
          <span className="relative z-10 ml-auto text-xs font-semibold text-white">
            {task.progress}%
          </span>
        )}
      </div>

      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-ew-resize" />
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-ew-resize" />
    </div>
  );
}
