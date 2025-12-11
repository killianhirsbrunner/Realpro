import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, DoorOpen, Layers } from 'lucide-react';

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
    <div className="space-y-3">
      {buildings.map((building) => {
        const isExpanded = expandedBuildings.has(building.id);
        return (
          <div
            key={building.id}
            className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-800/50"
          >
            <button
              onClick={() => toggleBuilding(building.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              )}
              <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30">
                <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{building.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Code: {building.code}</p>
              </div>
              <span className="px-3 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-lg text-sm font-medium">
                {building.entrances.length} entrée{building.entrances.length > 1 ? 's' : ''}
              </span>
            </button>

            {isExpanded && (
              <div className="pl-8 pb-3 pr-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50">
                {building.entrances.map((entrance) => {
                  const isEntranceExpanded = expandedEntrances.has(entrance.id);
                  return (
                    <div key={entrance.id} className="mt-3">
                      <button
                        onClick={() => toggleEntrance(entrance.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                      >
                        {isEntranceExpanded ? (
                          <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        )}
                        <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                          <DoorOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">{entrance.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Code: {entrance.code}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
                          {entrance.floors.length} étage{entrance.floors.length > 1 ? 's' : ''}
                        </span>
                      </button>

                      {isEntranceExpanded && (
                        <div className="pl-8 mt-2 space-y-1">
                          {entrance.floors.map((floor) => (
                            <button
                              key={floor.id}
                              onClick={() => onSelectFloor?.(floor.id)}
                              className="w-full flex items-center gap-3 p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors group"
                            >
                              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                  {floor.name}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Niveau {floor.level}</p>
                              </div>
                              <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium">
                                {floor.lotsCount} lot{floor.lotsCount > 1 ? 's' : ''}
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
