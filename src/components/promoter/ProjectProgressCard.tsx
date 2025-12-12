import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: string;
  lotsTotal: number;
  lotsSold: number;
}

interface ProjectProgressCardProps {
  projects: Project[];
}

export default function ProjectProgressCard({ projects }: ProjectProgressCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200';
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'En cours';
      case 'PLANNING':
        return 'Planification';
      case 'COMPLETED':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Avancement des projets
        </h2>
        <Link
          to="/projects"
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
        >
          Voir tous <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">Aucun projet actif</p>
          <Link
            to="/projects/wizard"
            className="mt-4 inline-block text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            Créer votre premier projet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}/overview`}
              className="block group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {project.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {project.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {project.progress}%
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {project.lotsSold}/{project.lotsTotal} lots
                  </p>
                </div>
              </div>

              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
