import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectStructureTree from '../components/project/ProjectStructureTree';
import { Button } from '../components/ui/Button';
import { Plus, Building2 } from 'lucide-react';
import { useProjectStructure } from '../hooks/useProjectStructure';

export default function ProjectStructurePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { structure, project, loading, error, refetch } = useProjectStructure(projectId!);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);

  if (loading) return <LoadingState message="Chargement de la structure..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!structure || !project) return <ErrorState message="Structure introuvable" />;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Structure' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Structure du Projet</h1>
          <p className="text-gray-600 mt-2">
            Gérez la structure hiérarchique: bâtiments, entrées et étages
          </p>
        </div>

        <Button
          onClick={() => setIsAddingBuilding(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau bâtiment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Bâtiments</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{structure.buildings.length}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Entrées</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {structure.buildings.reduce((acc, b) => acc + b.entrances.length, 0)}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <p className="text-sm font-medium text-gray-600">Étages</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {structure.buildings.reduce(
              (acc, b) => acc + b.entrances.reduce((acc2, e) => acc2 + e.floors.length, 0),
              0
            )}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-secondary-600" />
            <p className="text-sm font-medium text-gray-600">Total Lots</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{structure.totalLots}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Arborescence du Projet</h2>

        {structure.buildings.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aucun bâtiment défini</p>
            <Button onClick={() => setIsAddingBuilding(true)}>
              Créer le premier bâtiment
            </Button>
          </div>
        ) : (
          <ProjectStructureTree
            buildings={structure.buildings}
            onSelectBuilding={(id) => console.log('Building selected:', id)}
            onSelectEntrance={(id) => console.log('Entrance selected:', id)}
            onSelectFloor={(id) => console.log('Floor selected:', id)}
          />
        )}
      </div>
    </div>
  );
}
