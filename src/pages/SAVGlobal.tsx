import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useOrganization } from '../hooks/useOrganization';
import { useProjects } from '../hooks/useProjects';

export default function SAVGlobal() {
  const { currentOrganization } = useOrganization();
  const { projects } = useProjects(currentOrganization?.id);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Wrench className="w-8 h-8 text-realpro-turquoise" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Service Après-Vente (SAV)
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Gestion des demandes SAV, garanties et interventions après livraison
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">
              0
            </span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            En attente
          </h3>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">
              0
            </span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            En cours
          </h3>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">
              0
            </span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Résolus
          </h3>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 flex-shrink-0">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Accès au SAV par projet
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              Les demandes SAV sont organisées par projet. Sélectionnez un projet ci-dessous pour gérer ses demandes.
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Vos projets
        </h2>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}/sav`}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:border-realpro-turquoise hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-realpro-turquoise transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {project.address}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-realpro-turquoise group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Wrench className="w-4 h-4" />
                    <span>Demandes SAV</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <Wrench className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun projet disponible. Créez un projet pour gérer les demandes SAV.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
