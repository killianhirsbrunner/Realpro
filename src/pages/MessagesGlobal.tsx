import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, Inbox, Send, Users } from 'lucide-react';
import { useOrganization } from '../hooks/useOrganization';
import { useProjects } from '../hooks/useProjects';

export default function MessagesGlobal() {
  const { currentOrganization } = useOrganization();
  const { projects } = useProjects(currentOrganization?.id);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-realpro-turquoise" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Messagerie instantanée pour communiquer avec votre équipe et vos clients
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Accès aux messages par projet
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Les conversations sont organisées par projet. Sélectionnez un projet ci-dessous pour accéder à sa messagerie.
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Vos projets
        </h2>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}/messages`}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-realpro-turquoise hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-realpro-turquoise transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.address}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-realpro-turquoise group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Inbox className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun projet disponible. Créez un projet pour commencer à échanger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
