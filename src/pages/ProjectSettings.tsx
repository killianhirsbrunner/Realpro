import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Trash2, AlertTriangle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useProjects } from '../hooks/useProjects';
import { toast } from 'sonner';

export function ProjectSettings() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { deleteProject } = useProjects();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectId || deleteConfirmText !== 'SUPPRIMER') return;

    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success('Projet supprimé avec succès');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur lors de la suppression du projet');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-600" />
            Paramètres du projet
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Configuration et paramètres avancés
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Informations générales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nom du projet
              </label>
              <Input type="text" placeholder="Nom du projet" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
                rows={3}
                placeholder="Description du projet"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Ville
                </label>
                <Input type="text" placeholder="Ville" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Canton
                </label>
                <Input type="text" placeholder="Canton" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Paramètres avancés
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Activer les notifications
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Recevoir des notifications pour ce projet
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Partage public
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Permettre le partage public du projet
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Zone dangereuse
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                La suppression du projet est irréversible. Toutes les données (lots, acheteurs, documents, finances, etc.) seront définitivement perdues.
              </p>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer le projet
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button>Enregistrer les modifications</Button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg mx-4 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Supprimer définitivement ce projet ?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Cette action est irréversible. Toutes les données associées au projet seront définitivement supprimées :
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4 list-disc list-inside">
                  <li>Tous les lots et leurs informations</li>
                  <li>Tous les acheteurs et dossiers</li>
                  <li>Tous les documents et contrats</li>
                  <li>Toutes les données financières (CFC, factures, paiements)</li>
                  <li>Tous les messages et communications</li>
                  <li>Toutes les soumissions et offres</li>
                  <li>Tout l'historique et le planning</li>
                </ul>
                <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                  Pour confirmer, tapez <span className="font-mono font-bold text-red-600">SUPPRIMER</span> ci-dessous :
                </p>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={deleteConfirmText !== 'SUPPRIMER' || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
