import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProButton } from '../components/realpro/RealProButton';
import { MaterialOptionCardChoice } from '../components/materials/MaterialOptionCardChoice';
import { ModificationRequestPanel } from '../components/materials/ModificationRequestPanel';
import { useLotDetails } from '../hooks/useLotDetails';
import { useMaterialCategories } from '../hooks/useMaterialCategories';
import { useMaterialOptions } from '../hooks/useMaterialOptions';
import { useLotChoices, useModificationRequests } from '../hooks/useMaterialSelections';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function ProjectMaterialsLotChoices() {
  const { projectId, lotId } = useParams<{ projectId: string; lotId: string }>();
  const navigate = useNavigate();

  const { lot, loading: lotLoading } = useLotDetails(lotId!);
  const { categories, loading: categoriesLoading } = useMaterialCategories(projectId!);
  const { options, loading: optionsLoading } = useMaterialOptions();
  const { choices, updateChoice, loading: choicesLoading } = useLotChoices(lotId!);
  const { createRequest } = useModificationRequests(lotId!);

  const loading = lotLoading || categoriesLoading || optionsLoading || choicesLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const selectedOptionIds = choices.map(c => c.option_id);

  const handleToggleOption = async (optionId: string) => {
    const isSelected = selectedOptionIds.includes(optionId);
    await updateChoice(optionId, !isSelected);
  };

  const handleSubmitModification = async (description: string, estimatedPrice?: number) => {
    await createRequest(description, estimatedPrice);
  };

  return (
    <div className="px-10 py-8 space-y-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/dashboard/projects/${projectId}/materials`)}
          className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <RealProTopbar
            title={`Choix matériaux — Lot ${lot?.number}`}
            subtitle={lot?.type || ''}
            actions={
              <div className="flex gap-3">
                <RealProButton
                  variant="outline"
                  onClick={() => navigate(`/dashboard/projects/${projectId}/materials/lots/${lotId}/appointments`)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Rendez-vous fournisseurs
                </RealProButton>
              </div>
            }
          />
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((category) => {
          const categoryOptions = options.filter(opt => opt.category_id === category.id);

          if (categoryOptions.length === 0) return null;

          return (
            <section key={category.id}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryOptions.map((option) => (
                  <MaterialOptionCardChoice
                    key={option.id}
                    option={option}
                    isSelected={selectedOptionIds.includes(option.id)}
                    onToggle={() => handleToggleOption(option.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Aucune option disponible
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Le catalogue de matériaux est en cours de préparation
          </p>
        </div>
      )}

      <ModificationRequestPanel
        lotId={lotId!}
        onSubmit={handleSubmitModification}
      />
    </div>
  );
}
