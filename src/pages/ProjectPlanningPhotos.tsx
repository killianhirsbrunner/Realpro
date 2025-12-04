import { useParams, Link } from 'react-router-dom';
import { useConstructionPhotos } from '../hooks/useConstructionPhotos';
import { PhotoGallery } from '../components/planning/PhotoGallery';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ProjectPlanningPhotos() {
  const { projectId } = useParams<{ projectId: string }>();
  const { photos, loading, error } = useConstructionPhotos(projectId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/projects/${projectId}/planning`}
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au planning
          </Link>
          <h1 className="text-3xl font-bold">Photos du chantier</h1>
          <p className="text-neutral-600 mt-1">
            {photos.length} photo{photos.length > 1 ? 's' : ''} disponible{photos.length > 1 ? 's' : ''}
          </p>
        </div>

        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Ajouter des photos
        </Button>
      </div>

      <PhotoGallery photos={photos} />
    </div>
  );
}
