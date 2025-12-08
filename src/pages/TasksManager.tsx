import { useEffect, useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../lib/supabase';
import { ModernCard } from '../components/ui/ModernCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MetricCard } from '../components/ui/MetricCard';
import {
  CheckCircle,
  Circle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  User,
  Flag,
  Filter,
  Search,
  LayoutGrid,
  List,
  X,
  Save,
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import clsx from 'clsx';
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

type ViewMode = 'list' | 'kanban';
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  assigned_to_id?: string;
  assigned_to?: {
    first_name: string;
    last_name: string;
  };
  project_id?: string;
  project?: {
    name: string;
  };
  created_at: string;
  completed_at?: string;
}

export function TasksManager() {
  const { user, organization } = useCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as TaskPriority,
    due_date: '',
    assigned_to_id: ''
  });

  useEffect(() => {
    if (organization) {
      loadTasks();
    }
  }, [organization]);

  const loadTasks = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:users!tasks_assigned_to_id_fkey(first_name, last_name),
          project:projects(name)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!organization || !user) return;
    if (!newTask.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...newTask,
          organization_id: organization.id,
          created_by_id: user.id
        })
        .select(`
          *,
          assigned_to:users!tasks_assigned_to_id_fkey(first_name, last_name),
          project:projects(name)
        `)
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
      setShowNewTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: '',
        assigned_to_id: ''
      });
      toast.success('Tâche créée avec succès');
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select(`
          *,
          assigned_to:users!tasks_assigned_to_id_fkey(first_name, last_name),
          project:projects(name)
        `)
        .single();

      if (error) throw error;

      setTasks(tasks.map(t => t.id === taskId ? data : t));
      toast.success('Tâche mise à jour');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Tâche supprimée');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'DONE' ? 'TODO' :
                                   task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    const updates: any = { status: newStatus };
    if (newStatus === 'DONE') {
      updates.completed_at = new Date().toISOString();
    } else {
      updates.completed_at = null;
    }
    await updateTask(task.id, updates);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'ALL' && task.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && task.priority !== filterPriority) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300';
      case 'LOW':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300';
    }
  };

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'future';
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestionnaire de Tâches
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organisez et suivez toutes vos tâches
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowNewTaskForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total"
          value={stats.total}
          icon={<CheckSquare className="w-5 h-5" />}
          subtitle="Toutes les tâches"
          color="turquoise"
        />
        <MetricCard
          title="À faire"
          value={stats.todo}
          icon={<Circle className="w-5 h-5" />}
          subtitle="Pas encore commencées"
          color="blue"
        />
        <MetricCard
          title="En cours"
          value={stats.inProgress}
          icon={<Clock className="w-5 h-5" />}
          subtitle="En cours de traitement"
          color="orange"
        />
        <MetricCard
          title="Terminées"
          value={stats.done}
          icon={<CheckCircle className="w-5 h-5" />}
          subtitle="Complétées"
          color="green"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="TODO">À faire</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="DONE">Terminé</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
          <option value="ALL">Toutes priorités</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">Haute</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="LOW">Basse</option>
        </select>

        {/* View Mode */}
        <div className="flex gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={clsx(
              'p-2 rounded',
              viewMode === 'kanban' ? 'bg-realpro-turquoise text-white' : 'text-gray-600 dark:text-gray-400'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded',
              viewMode === 'list' ? 'bg-realpro-turquoise text-white' : 'text-gray-600 dark:text-gray-400'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map(status => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {status === 'TODO' && 'À faire'}
                  {status === 'IN_PROGRESS' && 'En cours'}
                  {status === 'DONE' && 'Terminé'}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </div>

              <div className="space-y-2">
                {filteredTasks.filter(t => t.status === status).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={() => toggleTaskStatus(task)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask(task.id)}
                    getPriorityColor={getPriorityColor}
                    getDueDateStatus={getDueDateStatus}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={() => toggleTaskStatus(task)}
              onEdit={() => setEditingTask(task)}
              onDelete={() => deleteTask(task.id)}
              getPriorityColor={getPriorityColor}
              getDueDateStatus={getDueDateStatus}
              isListView
            />
          ))}
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskForm && (
        <TaskFormModal
          title="Nouvelle tâche"
          task={newTask}
          onSave={createTask}
          onCancel={() => setShowNewTaskForm(false)}
          onChange={setNewTask}
        />
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getPriorityColor: (priority: TaskPriority) => string;
  getDueDateStatus: (dueDate?: string) => string | null;
  isListView?: boolean;
}

function TaskCard({ task, onToggleStatus, onEdit, onDelete, getPriorityColor, getDueDateStatus, isListView }: TaskCardProps) {
  const dueDateStatus = getDueDateStatus(task.due_date);

  return (
    <div className={clsx(
      'group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition-all',
      task.status === 'DONE' && 'opacity-60'
    )}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleStatus}
          className="mt-1 flex-shrink-0"
        >
          {task.status === 'DONE' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : task.status === 'IN_PROGRESS' ? (
            <Clock className="w-5 h-5 text-orange-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-realpro-turquoise" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={clsx(
              'font-medium text-gray-900 dark:text-white',
              task.status === 'DONE' && 'line-through'
            )}>
              {task.title}
            </h4>
            <span className={clsx(
              'px-2 py-0.5 text-xs font-semibold rounded-full border flex-shrink-0',
              getPriorityColor(task.priority)
            )}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {task.due_date && (
              <div className={clsx(
                'flex items-center gap-1',
                dueDateStatus === 'overdue' && 'text-red-600',
                dueDateStatus === 'today' && 'text-orange-600',
                dueDateStatus === 'tomorrow' && 'text-yellow-600'
              )}>
                <Calendar className="w-3 h-3" />
                {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
              </div>
            )}

            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.assigned_to.first_name} {task.assigned_to.last_name}
              </div>
            )}

            {task.project && (
              <div className="flex items-center gap-1">
                📁 {task.project.name}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface TaskFormModalProps {
  title: string;
  task: any;
  onSave: () => void;
  onCancel: () => void;
  onChange: (task: any) => void;
}

function TaskFormModal({ title, task, onSave, onCancel, onChange }: TaskFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => onChange({ ...task, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              placeholder="Titre de la tâche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) => onChange({ ...task, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              rows={3}
              placeholder="Description détaillée..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <select
                value={task.priority}
                onChange={(e) => onChange({ ...task, priority: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date d'échéance
              </label>
              <input
                type="date"
                value={task.due_date}
                onChange={(e) => onChange({ ...task, due_date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}
