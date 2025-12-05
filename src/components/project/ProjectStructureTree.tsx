import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Home, Layers } from 'lucide-react';

interface Floor {
  id: string;
  name: string;
  level: number;
  lotsCount: number;
}

interface Entrance {
  id: string;
  name: string;
  code: string;
  floors: Floor[];
}

interface Building {
  id: string;
  name: string;
  code: string;
  entrances: Entrance[];
}

interface ProjectStructureTreeProps {
  buildings: Building[];
  onSelectBuilding?: (buildingId: string) => void;
  onSelectEntrance?: (entranceId: string) => void;
  onSelectFloor?: (floorId: string) => void;
}

export default function ProjectStructureTree({
  buildings,
  onSelectBuilding,
  onSelectEntrance,
  onSelectFloor,
}: ProjectStructureTreeProps) {
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set());
  const [expandedEntrances, setExpandedEntrances] = useState<Set<string>>(new Set());

  const toggleBuilding = (buildingId: string) => {
    const newExpanded = new Set(expandedBuildings);
    if (newExpanded.has(buildingId)) {
      newExpanded.delete(buildingId);
    } else {
      newExpanded.add(buildingId);
    }
    setExpandedBuildings(newExpanded);
  };

  const toggleEntrance = (entranceId: string) => {
    const newExpanded = new Set(expandedEntrances);
    if (newExpanded.has(entranceId)) {
      newExpanded.delete(entranceId);
    } else {
      newExpanded.add(entranceId);
    }
    setExpandedEntrances(newExpanded);
  };

  return (
    <div className="space-y-2">
      {buildings.map((building) => {
        const isExpanded = expandedBuildings.has(building.id);
        return (
          <div key={building.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleBuilding(building.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
              <Building2 className="w-5 h-5 text-brand-600" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{building.name}</p>
                <p className="text-sm text-gray-500">Code: {building.code}</p>
              </div>
              <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-medium">
                {building.entrances.length} entrées
              </span>
            </button>

            {isExpanded && (
              <div className="pl-8 pb-2">
                {building.entrances.map((entrance) => {
                  const isEntranceExpanded = expandedEntrances.has(entrance.id);
                  return (
                    <div key={entrance.id} className="mt-2">
                      <button
                        onClick={() => toggleEntrance(entrance.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {isEntranceExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                        <Home className="w-4 h-4 text-green-600" />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{entrance.name}</p>
                          <p className="text-xs text-gray-500">Code: {entrance.code}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {entrance.floors.length} étages
                        </span>
                      </button>

                      {isEntranceExpanded && (
                        <div className="pl-8 mt-2 space-y-1">
                          {entrance.floors.map((floor) => (
                            <button
                              key={floor.id}
                              onClick={() => onSelectFloor?.(floor.id)}
                              className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Layers className="w-4 h-4 text-brand-600" />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">{floor.name}</p>
                                <p className="text-xs text-gray-500">Niveau {floor.level}</p>
                              </div>
                              <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs">
                                {floor.lotsCount} lots
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
