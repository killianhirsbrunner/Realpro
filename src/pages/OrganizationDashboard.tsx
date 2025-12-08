import { Link } from 'react-router-dom';
import { useOrganizationProjects } from '../hooks/useOrganizationProjects';
import { useOrganization } from '../hooks/useOrganization';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { KpiCard } from '../components/ui/KpiCard';
import {
  Building2,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Home,
  Package,
  DollarSign,
  BarChart3,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function OrganizationDashboard() {
  const { organization } = useOrganization();
  const { projects, stats, loading, error } = useOrganizationProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CONSTRUCTION':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'SELLING':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'COMPLETED':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'Planification';
      case 'CONSTRUCTION':
        return 'Construction';
      case 'SELLING':
        return 'Commercialisation';
      case 'COMPLETED':
        return 'Terminé';
      case 'ARCHIVED':
        return 'Archivé';
      default:
        return status;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {organization?.name || 'Mon Organisation'}
              </h1>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                Vue d'ensemble de tous vos projets immobiliers
              </p>
            </div>
            <Link to="/projects/new">
              <Button variant="primary" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Nouveau Projet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <KpiCard
              title="Projets Actifs"
              value={stats.active_projects}
              subtitle={`sur ${stats.total_projects} total`}
              icon={<Building2 className="w-5 h-5" />}
              trend={stats.active_projects > 0 ? 'up' : undefined}
            />
            <KpiCard
              title="Lots Vendus"
              value={stats.sold_lots}
              subtitle={`sur ${stats.total_lots} total`}
              icon={<Home className="w-5 h-5" />}
              trend={
                stats.total_lots > 0 && (stats.sold_lots / stats.total_lots) * 100 > 50
                  ? 'up'
                  : undefined
              }
            />
            <KpiCard
              title="Projets On Track"
              value={stats.projects_on_track}
              subtitle="santé > 70%"
              icon={<CheckCircle2 className="w-5 h-5" />}
              trend={stats.projects_on_track > 0 ? 'up' : undefined}
            />
            <KpiCard
              title="Projets en Retard"
              value={stats.projects_delayed}
              subtitle="santé < 50%"
              icon={<AlertCircle className="w-5 h-5" />}
              variant={stats.projects_delayed > 0 ? 'danger' : 'default'}
            />
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Vos Projets
            </h2>
            <Link to="/projects">
              <Button variant="ghost" className="gap-2">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 mb-4">
                <Building2 className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Aucun projet pour le moment
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Créez votre premier projet immobilier pour commencer
              </p>
              <Link to="/projects/new">
                <Button variant="primary" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Créer mon premier projet
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/projects/${project.id}/cockpit`}>
                    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <MapPin className="w-4 h-4" />
                            <span>{project.city}, {project.canton}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {project.total_lots}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Lots total
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {project.sold_lots}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Vendus
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {project.available_lots}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            Disponibles
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Santé du projet
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold ${getHealthColor(
                            project.health_score
                          )}`}
                        >
                          {project.health_score}%
                        </span>
                      </div>

                      {project.total_lots > 0 && (
                        <div className="mt-3">
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                              style={{
                                width: `${
                                  (project.sold_lots / project.total_lots) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            {Math.round((project.sold_lots / project.total_lots) * 100)}%
                            commercialisé
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
