import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar, CheckCircle, Clock, AlertTriangle, Plus, Edit2, Trash2, User, TrendingUp
} from 'lucide-react';
import { useProjectMilestones, ProjectMilestone } from '../hooks/useProjectMilestones';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProjectMilestonesTimeline() {
  const { projectId } = useParams();
  const {
    milestones,
    loading,
    createMilestone,
    updateMilestone,
    completeMilestone,
    deleteMilestone,
    getMilestoneStats,
    getUpcomingMilestones,
    getDelayedMilestones,
    getCriticalPath,
  } = useProjectMilestones(projectId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'critical'>('timeline');

  const stats = getMilestoneStats();
  const upcomingMilestones = getUpcomingMilestones(30);
  const delayedMilestones = getDelayedMilestones();
  const criticalPath = getCriticalPath();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    milestone_type: 'CUSTOM' as ProjectMilestone['milestone_type'],
    planned_date: '',
    status: 'UPCOMING' as ProjectMilestone['status'],
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.planned_date) {
      toast.error('Nom et date planifiée requis');
      return;
    }

    try {
      await createMilestone(formData);
      toast.success('Jalon créé');
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        milestone_type: 'CUSTOM',
        planned_date: '',
        status: 'UPCOMING',
      });
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleComplete = async (milestoneId: string) => {
    try {
      await completeMilestone(milestoneId, new Date().toISOString());
      toast.success('Jalon complété');
    } catch (error) {
      toast.error('Erreur lors de la complétion');
    }
  };

  const handleDelete = async (milestoneId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jalon ?')) return;

    try {
      await deleteMilestone(milestoneId);
      toast.success('Jalon supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusIcon = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'DELAYED':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DELAYED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getMilestoneTypeLabel = (type: ProjectMilestone['milestone_type']) => {
    const labels: Record<string, string> = {
      START: 'Démarrage',
      PERMIT: 'Permis',
      FOUNDATION: 'Fondations',
      STRUCTURE: 'Gros œuvre',
      CLOSURE: 'Mise hors d\'eau/air',
      FINISH: 'Finitions',
      DELIVERY: 'Livraison',
      WARRANTY: 'Garantie',
      CUSTOM: 'Personnalisé',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jalons du projet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Suivi des étapes clés et des livrables
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nouveau jalon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-500 mt-1">jalons</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Complétés</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.completionRate.toFixed(0)}% du total
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">En retard</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.delayed}
          </div>
          <div className="text-sm text-gray-500 mt-1">nécessitent attention</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progression</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.averageCompletion.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">moyenne</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'timeline'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Liste
        </button>
        <button
          onClick={() => setViewMode('critical')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'critical'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Chemin critique
        </button>
      </div>

      {viewMode === 'timeline' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {index !== milestones.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      {getStatusIcon(milestone.status)}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {milestone.name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              milestone.status
                            )}`}
                          >
                            {milestone.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {getMilestoneTypeLabel(milestone.milestone_type)}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {milestone.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Planifié: {format(new Date(milestone.planned_date), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          {milestone.actual_date && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>
                                Réalisé: {format(new Date(milestone.actual_date), 'dd/MM/yyyy')}
                              </span>
                            </div>
                          )}
                          {milestone.responsible_user && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>
                                {milestone.responsible_user.first_name}{' '}
                                {milestone.responsible_user.last_name}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progression</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {milestone.completion_percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${milestone.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {milestone.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleComplete(milestone.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            title="Marquer comme complété"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingMilestone(milestone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'critical' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Chemin critique
          </h3>
          <div className="space-y-3">
            {criticalPath.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg ${
                  item.isOverdue
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(item.planned_date), 'dd/MM/yyyy')} •{' '}
                      {item.isOverdue ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          En retard de {Math.abs(item.daysUntilDue)} jours
                        </span>
                      ) : (
                        <span>Dans {item.daysUntilDue} jours</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {item.completion_percentage}%
                    </div>
                    <span className={`text-xs ${getStatusColor(item.status)} px-2 py-1 rounded-full`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nouveau jalon
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="Ex: Fin des fondations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  rows={3}
                  placeholder="Description du jalon"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.milestone_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        milestone_type: e.target.value as ProjectMilestone['milestone_type'],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  >
                    <option value="START">Démarrage</option>
                    <option value="PERMIT">Permis</option>
                    <option value="FOUNDATION">Fondations</option>
                    <option value="STRUCTURE">Gros œuvre</option>
                    <option value="CLOSURE">Mise hors d'eau/air</option>
                    <option value="FINISH">Finitions</option>
                    <option value="DELIVERY">Livraison</option>
                    <option value="WARRANTY">Garantie</option>
                    <option value="CUSTOM">Personnalisé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date planifiée *
                  </label>
                  <input
                    type="date"
                    value={formData.planned_date}
                    onChange={(e) => setFormData({ ...formData, planned_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
