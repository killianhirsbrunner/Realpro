import { Building2, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useI18n } from '../lib/i18n';
import { useProjects } from '../hooks/useProjects';

export function ProjectsList() {
  const { t } = useI18n();
  const { projects, loading } = useProjects();

  const getStatusVariant = (
    status: string
  ): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      PLANNING: 'info',
      CONSTRUCTION: 'warning',
      SELLING: 'success',
      COMPLETED: 'default',
      ARCHIVED: 'default',
    };
    return map[status] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('projects.title')}</h1>
          <p className="mt-1 text-gray-500">
            {projects.length} {projects.length === 1 ? 'projet' : 'projets'}
          </p>
        </div>
        <Button>{t('projects.create')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} hover>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <Badge variant={getStatusVariant(project.status)} size="sm">
                      {t(`projects.statuses.${project.status}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {project.city}, {project.postal_code}
                    </span>
                  </div>
                  {project.start_date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Démarré le{' '}
                        {new Date(project.start_date).toLocaleDateString('fr-CH')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('projects.surface')}</span>
                    <span className="font-medium text-gray-900">
                      {project.total_surface?.toLocaleString('fr-CH')} m²
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Voir le projet
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun projet
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre premier projet immobilier
            </p>
            <Button>{t('projects.create')}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
