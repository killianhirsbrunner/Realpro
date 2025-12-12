import { useState } from 'react';
import { Building2, MapPin, Calendar, TrendingUp, Package, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealProCard } from '../realpro/RealProCard';
import { RealProButton } from '../realpro/RealProButton';
import { RealProBadge } from '../realpro/RealProBadge';
import { useI18n } from '../../lib/i18n';
import { formatCHF, formatPercent } from '../../lib/utils/format';
import { useProjects } from '../../hooks/useProjects';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    city: string;
    canton: string;
    postal_code?: string;
    status: string;
    type?: string;
    image_url?: string | null;
    start_date?: string | null;
    total_surface?: number | null;
    total_lots?: number;
    sold_lots?: number;
    reserved_lots?: number;
    total_revenue?: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useI18n();
  const { deleteProject } = useProjects();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusType = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      PLANNING: 'info',
      CONSTRUCTION: 'warning',
      SELLING: 'success',
      COMPLETED: 'neutral',
      ARCHIVED: 'neutral',
    };
    return map[status] || 'neutral';
  };

  const salesPercentage = project.total_lots && project.sold_lots
    ? (project.sold_lots / project.total_lots) * 100
    : 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success('Projet supprimé avec succès');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur lors de la suppression du projet');
      setIsDeleting(false);
    }
  };

  return (
    <RealProCard hover padding="sm" className="group overflow-hidden">
      {/* Image du projet */}
      <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl overflow-hidden relative -mx-2 -mt-2 mb-4">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />
          </div>
        )}

        {/* Overlay actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-20">
                  <Link
                    to={`/projects/${project.id}/settings`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>

          <RealProBadge type={getStatusType(project.status)} size="sm">
            {t(`projects.statuses.${project.status}`)}
          </RealProBadge>
        </div>
      </div>

      {/* Contenu */}
      <div className="space-y-4 px-2 pb-2">
        <div>
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-realpro-turquoise transition-colors">
              {project.name}
            </h3>
          </Link>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-2">
            {project.description || 'Aucune description'}
          </p>

          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mt-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{project.city} ({project.canton})</span>
            </div>

            {project.start_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.start_date).toLocaleDateString('fr-CH', { year: 'numeric', month: 'short' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats lots */}
        {project.total_lots !== undefined && (
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                Lots
              </span>
              <div className="flex items-center gap-3">
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">{project.sold_lots || 0} vendus</span>
                <span className="text-neutral-400 dark:text-neutral-500">·</span>
                <span className="text-neutral-600 dark:text-neutral-400">{project.total_lots} total</span>
              </div>
            </div>

            {/* Barre de progression */}
            {salesPercentage > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400">Commercialisation</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{formatPercent(salesPercentage)}</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${salesPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Chiffre d'affaires */}
            {project.total_revenue && project.total_revenue > 0 && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-100 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  CA réalisé
                </span>
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{formatCHF(project.total_revenue)}</span>
              </div>
            )}
          </div>
        )}

        {/* Bouton action */}
        <div className="pt-2">
          <Link to={`/projects/${project.id}`} className="block">
            <RealProButton
              variant="outline"
              className="w-full group-hover:bg-realpro-turquoise group-hover:text-white group-hover:border-realpro-turquoise transition-all"
            >
              Ouvrir le projet
            </RealProButton>
          </Link>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Supprimer le projet ?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Le projet <span className="font-semibold text-neutral-900 dark:text-neutral-100">{project.name}</span> et toutes ses données seront définitivement supprimés.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <RealProButton
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Annuler
              </RealProButton>
              <RealProButton
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </RealProButton>
            </div>
          </div>
        </div>
      )}
    </RealProCard>
  );
}
