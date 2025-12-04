import { useParams } from 'react-router-dom';
import { useMaterialCategories } from '../hooks/useMaterialCategories';
import { MaterialsSummaryCard } from '../components/materials/MaterialsSummaryCard';
import { CategoryCard } from '../components/materials/CategoryCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ProjectMaterialsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { categories, loading, error } = useMaterialCategories(projectId!);

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

  const totalOptions = categories.reduce((sum, cat) => sum + (cat.options?.length || 0), 0);

  const overview = {
    categoryCount: categories.length,
    optionCount: totalOptions,
    completedLots: 0,
    totalLots: 0,
    pendingRequests: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Choix matériaux</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les catégories et options de matériaux pour ce projet
          </p>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      <MaterialsSummaryCard overview={overview} />

      {categories.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <p>Aucune catégorie de matériaux définie pour ce projet.</p>
          <Button variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Créer la première catégorie
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={{
                ...category,
                optionCount: category.options?.length || 0,
              }}
              projectId={projectId!}
            />
          ))}
        </div>
      )}
    </div>
  );
}
