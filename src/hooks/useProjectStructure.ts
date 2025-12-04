import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

interface ProjectStructure {
  buildings: Building[];
  totalLots: number;
}

export function useProjectStructure(projectId: string) {
  const [structure, setStructure] = useState<ProjectStructure | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchStructure();
  }, [projectId]);

  async function fetchStructure() {
    try {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      const { data: lots } = await supabase
        .from('lots')
        .select('id, building_code, entrance_code, floor_level, floor_name')
        .eq('project_id', projectId);

      const buildingsMap = new Map<string, Building>();
      let totalLots = 0;

      (lots || []).forEach((lot) => {
        totalLots++;
        const buildingCode = lot.building_code || 'A';
        const entranceCode = lot.entrance_code || '1';
        const floorLevel = lot.floor_level || 0;
        const floorName = lot.floor_name || `Étage ${floorLevel}`;

        if (!buildingsMap.has(buildingCode)) {
          buildingsMap.set(buildingCode, {
            id: buildingCode,
            name: `Bâtiment ${buildingCode}`,
            code: buildingCode,
            entrances: [],
          });
        }

        const building = buildingsMap.get(buildingCode)!;
        let entrance = building.entrances.find(e => e.code === entranceCode);

        if (!entrance) {
          entrance = {
            id: `${buildingCode}-${entranceCode}`,
            name: `Entrée ${entranceCode}`,
            code: entranceCode,
            floors: [],
          };
          building.entrances.push(entrance);
        }

        let floor = entrance.floors.find(f => f.level === floorLevel);

        if (!floor) {
          floor = {
            id: `${buildingCode}-${entranceCode}-${floorLevel}`,
            name: floorName,
            level: floorLevel,
            lotsCount: 0,
          };
          entrance.floors.push(floor);
        }

        floor.lotsCount++;
      });

      const buildings = Array.from(buildingsMap.values());

      buildings.forEach(building => {
        building.entrances.sort((a, b) => a.code.localeCompare(b.code));
        building.entrances.forEach(entrance => {
          entrance.floors.sort((a, b) => a.level - b.level);
        });
      });

      buildings.sort((a, b) => a.code.localeCompare(b.code));

      setStructure({
        buildings,
        totalLots,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch structure'));
    } finally {
      setLoading(false);
    }
  }

  return { structure, project, loading, error, refetch: fetchStructure };
}
