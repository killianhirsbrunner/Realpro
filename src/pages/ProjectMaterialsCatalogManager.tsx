import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProButton } from '../components/realpro/RealProButton';
import { MaterialCategoryCard } from '../components/materials/MaterialCategoryCard';
import { MaterialOptionPanel } from '../components/materials/MaterialOptionPanel';
import { useMaterialCategories } from '../hooks/useMaterialCategories';
import { useMaterialOptions } from '../hooks/useMaterialOptions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';

export default function ProjectMaterialsCatalogManager() {
  const { projectId } = useParams<{ projectId: string }>();
  const { categories, loading: categoriesLoading } = useMaterialCategories(projectId!);
  const { options, loading: optionsLoading, createOption, updateOption } = useMaterialOptions();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const loading = categoriesLoading || optionsLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const getOptionsForCategory = (categoryId: string) => {
    return options.filter(opt => opt.category_id === categoryId);
  };

  const handleSaveOptions = async (updatedOptions: any[]) => {
    for (const option of updatedOptions) {
      if (option.id.startsWith('temp-')) {
        await createOption({
          category_id: selectedCategory.id,
          label: option.label,
          description: option.description,
          price: option.price,
          is_standard: option.is_standard
        });
      } else {
        await updateOption(option.id, {
          label: option.label,
          description: option.description,
          price: option.price,
          is_standard: option.is_standard
        });
      }
    }
  };

  return (
    <div className="px-10 py-8 space-y-10">
      <RealProTopbar
        title="Catalogue matériaux"
        subtitle="Gérez les catégories et options de matériaux disponibles pour ce projet"
        actions={
          <RealProButton variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une catégorie
          </RealProButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <MaterialCategoryCard
            key={category.id}
            category={category}
            optionsCount={getOptionsForCategory(category.id).length}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <Settings className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Aucune catégorie
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Commencez par créer des catégories de matériaux
          </p>
          <RealProButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Créer la première catégorie
          </RealProButton>
        </div>
      )}

      {selectedCategory && (
        <MaterialOptionPanel
          category={selectedCategory}
          options={getOptionsForCategory(selectedCategory.id)}
          onClose={() => setSelectedCategory(null)}
          onSave={handleSaveOptions}
        />
      )}
    </div>
  );
}
