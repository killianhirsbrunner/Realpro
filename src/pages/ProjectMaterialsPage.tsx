import { useParams } from 'react-router-dom';
import { useMaterialCategories } from '../hooks/useMaterialCategories';
import { MaterialsSummaryCard } from '../components/materials/MaterialsSummaryCard';
import { CategoryCard } from '../components/materials/CategoryCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Plus, Package, Palette, CheckCircle, AlertCircle, Layers } from 'lucide-react';

export default function ProjectMaterialsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { categories, loading, error, project } = useMaterialCategories(projectId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
            Erreur lors du chargement
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {error.message}
          </p>
        </div>
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
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project?.name || 'Projet', href: `/projects/${projectId}` },
          { label: 'Matériaux' },
        ]}
      />

      <RealProTopbar
        title="Choix Matériaux"
        subtitle="Gérez les catégories et options de matériaux pour ce projet"
        actions={
          <RealProButton variant="primary">
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </RealProButton>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Catégories</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {categories.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Layers className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Options</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {totalOptions}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Lots complétés</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {overview.completedLots}/{overview.totalLots}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Demandes en attente</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {overview.pendingRequests}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Liste des catégories */}
      <RealProCard padding="lg">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Catégories de matériaux
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucune catégorie définie
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Créez des catégories pour organiser les choix de matériaux
            </p>
            <RealProButton variant="primary">
              <Plus className="w-4 h-4" />
              Créer la première catégorie
            </RealProButton>
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
      </RealProCard>
    </div>
  );
}
