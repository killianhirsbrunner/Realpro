import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProjectSettings() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();

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
                La suppression du projet est irréversible. Toutes les données seront définitivement perdues.
              </p>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
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
    </div>
  );
}
