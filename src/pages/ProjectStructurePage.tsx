import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectStructureTree from '../components/project/ProjectStructureTree';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Plus, Building2, DoorOpen, Layers, Home } from 'lucide-react';
import { useProjectStructure } from '../hooks/useProjectStructure';

export default function ProjectStructurePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { structure, project, loading, error, refetch } = useProjectStructure(projectId!);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);

  if (loading) return <LoadingState message="Chargement de la structure..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!structure || !project) return <ErrorState message="Structure introuvable" />;

  const totalEntrances = structure.buildings.reduce((acc, b) => acc + b.entrances.length, 0);
  const totalFloors = structure.buildings.reduce(
    (acc, b) => acc + b.entrances.reduce((acc2, e) => acc2 + e.floors.length, 0),
    0
  );

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Structure' },
        ]}
      />

      <RealProTopbar
        title="Structure du Projet"
        subtitle="Gérez la structure hiérarchique: bâtiments, entrées et étages"
        actions={
          <RealProButton
            variant="primary"
            onClick={() => setIsAddingBuilding(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau bâtiment
          </RealProButton>
        }
      />

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Bâtiments</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {structure.buildings.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Entrées</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {totalEntrances}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <DoorOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Étages</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {totalFloors}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Lots</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {structure.totalLots}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Arborescence */}
      <RealProCard padding="lg">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Arborescence du Projet
        </h2>

        {structure.buildings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucun bâtiment défini
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Commencez par créer le premier bâtiment de votre projet
            </p>
            <RealProButton variant="primary" onClick={() => setIsAddingBuilding(true)}>
              <Plus className="w-4 h-4" />
              Créer le premier bâtiment
            </RealProButton>
          </div>
        ) : (
          <ProjectStructureTree
            buildings={structure.buildings}
            onSelectBuilding={(id) => console.log('Building selected:', id)}
            onSelectEntrance={(id) => console.log('Entrance selected:', id)}
            onSelectFloor={(id) => console.log('Floor selected:', id)}
          />
        )}
      </RealProCard>
    </div>
  );
}
