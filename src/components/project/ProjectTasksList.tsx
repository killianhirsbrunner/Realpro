import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
  category?: string;
}

interface ProjectTasksListProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
}

const priorityColors = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  high: { bg: 'bg-red-100', text: 'text-red-700' },
};

const statusIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  cancelled: Circle,
};

export default function ProjectTasksList({ tasks, onTaskClick, onToggleComplete }: ProjectTasksListProps) {
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tâches en cours ({groupedTasks.pending.length})
        </h3>
        <div className="space-y-3">
          {groupedTasks.pending.map((task) => {
            const StatusIcon = statusIcons[task.status];
            const priorityStyle = priorityColors[task.priority];
            return (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete?.(task.id);
                    }}
                    className="mt-0.5 text-gray-400 hover:text-blue-600"
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span className={`px-2 py-1 ${priorityStyle.bg} ${priorityStyle.text} rounded text-xs font-medium whitespace-nowrap`}>
                        {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                      {task.assignee && (
                        <span>{task.assignee}</span>
                      )}
                      {task.category && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {groupedTasks.pending.length === 0 && (
            <p className="text-gray-500 text-sm py-4">Aucune tâche en cours</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tâches terminées ({groupedTasks.completed.length})
        </h3>
        <div className="space-y-3">
          {groupedTasks.completed.slice(0, 5).map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task.id)}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 line-through">{task.title}</p>
                  {task.assignee && (
                    <p className="text-sm text-gray-500 mt-1">{task.assignee}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {groupedTasks.completed.length === 0 && (
            <p className="text-gray-500 text-sm py-4">Aucune tâche terminée</p>
          )}
        </div>
      </div>
    </div>
  );
}
