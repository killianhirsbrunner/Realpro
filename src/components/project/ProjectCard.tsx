import { useState } from 'react';
import { Building2, MapPin, Calendar, TrendingUp, Users, Package, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
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
  const navigate = useNavigate();
  const { deleteProject } = useProjects();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      PLANNING: 'info',
      CONSTRUCTION: 'warning',
      SELLING: 'success',
      COMPLETED: 'default',
      ARCHIVED: 'default',
    };
    return map[status] || 'default';
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
    <Card hover className="group transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-400 group-hover:text-gray-500 transition-colors" />
            </div>
          )}

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <Link
                      to={`/projects/${project.id}/settings`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>

            <Badge variant={getStatusVariant(project.status)} size="sm" className="backdrop-blur-sm bg-white/90">
              {t(`projects.statuses.${project.status}`)}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                {project.name}
              </h3>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {project.description || 'Aucune description'}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
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

          {project.total_lots !== undefined && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  Lots
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-medium">{project.sold_lots || 0} vendus</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{project.total_lots} total</span>
                </div>
              </div>

              {salesPercentage > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Commercialisation</span>
                    <span className="text-gray-900 font-semibold">{formatPercent(salesPercentage)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${salesPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {project.total_revenue && project.total_revenue > 0 && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    CA réalisé
                  </span>
                  <span className="text-gray-900 font-semibold">{formatCHF(project.total_revenue)}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <Link to={`/projects/${project.id}`}>
              <Button
                variant="outline"
                className="w-full group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all"
              >
                Ouvrir le projet
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Supprimer le projet ?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Le projet <span className="font-semibold">{project.name}</span> et toutes ses données seront définitivement supprimés.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
