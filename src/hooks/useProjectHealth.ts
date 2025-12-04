import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info';
}

interface ProjectHealth {
  risks: Risk[];
  alerts: Alert[];
}

export function useProjectHealth(projectId: string) {
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchHealth();
  }, [projectId]);

  async function fetchHealth() {
    try {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton, start_date, end_date')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      const risks: Risk[] = [];
      const alerts: Alert[] = [];

      const { data: lots } = await supabase
        .from('lots')
        .select('id, status')
        .eq('project_id', projectId);

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const salesRate = totalLots > 0 ? (soldLots / totalLots) * 100 : 0;

      if (salesRate < 30) {
        risks.push({
          id: 'low-sales',
          title: 'Taux de commercialisation faible',
          description: `Seulement ${salesRate.toFixed(1)}% des lots sont vendus. Actions commerciales recommandées.`,
          severity: 'high',
        });
      } else if (salesRate < 50) {
        alerts.push({
          id: 'moderate-sales',
          title: 'Commercialisation en cours',
          description: `${salesRate.toFixed(1)}% des lots sont vendus. Continuez les efforts commerciaux.`,
          type: 'info',
        });
      }

      const { data: phases } = await supabase
        .from('project_phases')
        .select('id, name, status, planned_end_date')
        .eq('project_id', projectId);

      const delayedPhases = phases?.filter(p => p.status === 'DELAYED') || [];

      if (delayedPhases.length > 0) {
        risks.push({
          id: 'delayed-phases',
          title: `${delayedPhases.length} phase(s) en retard`,
          description: 'Des phases du planning accusent un retard. Ajustement du calendrier nécessaire.',
          severity: 'high',
        });
      }

      const { data: cfcBudgets } = await supabase
        .from('cfc_budgets')
        .select('budget_initial, budget_revised, engagement_total')
        .eq('project_id', projectId);

      const totalBudget = (cfcBudgets || []).reduce((sum, cfc) =>
        sum + (cfc.budget_revised || cfc.budget_initial || 0), 0
      );
      const totalEngaged = (cfcBudgets || []).reduce((sum, cfc) =>
        sum + (cfc.engagement_total || 0), 0
      );
      const engagementRate = totalBudget > 0 ? (totalEngaged / totalBudget) * 100 : 0;

      if (engagementRate > 95) {
        alerts.push({
          id: 'high-engagement',
          title: 'Budget presque entièrement engagé',
          description: `${engagementRate.toFixed(1)}% du budget est engagé. Surveillez les dépenses.`,
          type: 'warning',
        });
      }

      const { data: notaryFiles } = await supabase
        .from('notary_files')
        .select('id, status')
        .eq('project_id', projectId);

      const incompleteFiles = notaryFiles?.filter(f =>
        f.status === 'INCOMPLETE' || f.status === 'IN_PROGRESS'
      ).length || 0;

      if (incompleteFiles > 5) {
        alerts.push({
          id: 'notary-backlog',
          title: 'Dossiers notaire en attente',
          description: `${incompleteFiles} dossiers notaire nécessitent une attention.`,
          type: 'info',
        });
      }

      setHealth({ risks, alerts });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch health'));
    } finally {
      setLoading(false);
    }
  }

  return { health, project, loading, error, refetch: fetchHealth };
}
