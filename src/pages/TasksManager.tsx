import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Clock, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type Task = {
  id: string;
  organizationId: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
  } | null;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  dueDate?: string | null;
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  completedAt?: string | null;
  createdAt: string;
};

export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('open');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    type: 'GENERIC',
  });

  const userId = '20000000-0000-0000-0000-000000000001';
  const organizationId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/tasks`;

      const response = await fetch(`${apiUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des tâches');

      const json = await response.json();
      setTasks(json);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les tâches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/tasks`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          organizationId,
          title: newTask.title,
          description: newTask.description || null,
          dueDate: newTask.dueDate || null,
          type: newTask.type,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      setNewTask({ title: '', description: '', dueDate: '', type: 'GENERIC' });
      setShowNewTaskForm(false);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Impossible de créer la tâche');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/tasks`;

      const response = await fetch(`${apiUrl}/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Erreur');

      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Impossible de compléter la tâche');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Supprimer cette tâche ?')) return;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/tasks`;

      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur');

      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Impossible de supprimer la tâche');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'open') return task.status !== 'DONE' && task.status !== 'CANCELLED';
    if (filter === 'done') return task.status === 'DONE';
    return true;
  });

  const openCount = tasks.filter(t => t.status !== 'DONE' && t.status !== 'CANCELLED').length;
  const doneCount = tasks.filter(t => t.status === 'DONE').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Gestion · Tâches
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Mes tâches
        </h1>
        <p className="text-sm text-gray-500">
          Gérez vos tâches et celles de votre équipe
        </p>
      </header>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Toutes ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'open'
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Ouvertes ({openCount})
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'done'
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Terminées ({doneCount})
          </button>
        </div>

        <Button onClick={() => setShowNewTaskForm(!showNewTaskForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {showNewTaskForm && (
        <Card className="bg-brand-50 border-brand-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Créer une nouvelle tâche
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Titre
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="Ex: Vérifier dossier notaire lot A101"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Description (optionnel)
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                rows={3}
                placeholder="Détails supplémentaires..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                >
                  <option value="GENERIC">Générique</option>
                  <option value="BUYER_FILE">Dossier acquéreur</option>
                  <option value="NOTARY">Notaire</option>
                  <option value="SUBMISSION">Soumission</option>
                  <option value="MATERIAL_CHOICE">Choix matériaux</option>
                  <option value="PAYMENT">Paiement</option>
                  <option value="PLANNING">Planning</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTask}>
                Créer la tâche
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNewTaskForm(false);
                  setNewTask({ title: '', description: '', dueDate: '', type: 'GENERIC' });
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      {filteredTasks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'done' ? 'Aucune tâche terminée' : 'Aucune tâche en cours'}
            </h3>
            <p className="text-sm text-gray-500">
              {filter === 'done'
                ? 'Les tâches terminées apparaîtront ici'
                : 'Créez votre première tâche pour commencer'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskItem({
  task,
  onComplete,
  onDelete,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isDone = task.status === 'DONE';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <Card className={isDone ? 'bg-gray-50' : ''}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => !isDone && onComplete(task.id)}
          className={`flex-shrink-0 mt-1 ${isDone ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={isDone}
        >
          {isDone ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-brand-600 transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`text-sm font-medium ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <TaskTypeBadge type={task.type} />
              <TaskStatusBadge status={task.status} />
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {task.project && (
              <span className="flex items-center gap-1">
                📁 {task.project.name}
              </span>
            )}
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {isOverdue && ' (En retard)'}
              </span>
            )}
            {task.assignedTo && (
              <span>
                Assignée à {task.assignedTo.firstName} {task.assignedTo.lastName}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
        </button>
      </div>
    </Card>
  );
}

function TaskTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    GENERIC: 'Générique',
    BUYER_FILE: 'Dossier',
    NOTARY: 'Notaire',
    SUBMISSION: 'Soumission',
    MATERIAL_CHOICE: 'Matériaux',
    PAYMENT: 'Paiement',
    PLANNING: 'Planning',
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      {labels[type] || type}
    </span>
  );
}

function TaskStatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let variant: 'default' | 'success' | 'warning' | 'danger' = 'default';
  let label = status;

  if (s === 'OPEN') {
    label = 'Ouvert';
    variant = 'default';
  } else if (s === 'IN_PROGRESS') {
    label = 'En cours';
    variant = 'warning';
  } else if (s === 'DONE') {
    label = 'Terminé';
    variant = 'success';
  } else if (s === 'CANCELLED') {
    label = 'Annulé';
    variant = 'danger';
  }

  return <Badge variant={variant}>{label}</Badge>;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
