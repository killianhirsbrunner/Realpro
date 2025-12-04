import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useMaterialCategories } from '../hooks/useMaterialCategories';
import { useMaterialOptions } from '../hooks/useMaterialOptions';
import { MaterialOptionCard } from '../components/materials/MaterialOptionCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ProjectMaterialsCatalog() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const { categories, loading: categoriesLoading } = useMaterialCategories(projectId!);
  const { options, loading: optionsLoading } = useMaterialOptions(categoryId || undefined);

  const category = categories.find(c => c.id === categoryId);

  if (categoriesLoading || optionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Catégorie non trouvée</p>
        <Link to={`/projects/${projectId}/materials`}>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux catégories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/projects/${projectId}/materials`}
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux catégories
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-neutral-600 mt-1">{category.description}</p>
            )}
          </div>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle option
          </Button>
        </div>
      </div>

      {options.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <p>Aucune option disponible dans cette catégorie.</p>
          <Button variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la première option
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option) => (
            <MaterialOptionCard key={option.id} option={option} />
          ))}
        </div>
      )}
    </div>
  );
}
