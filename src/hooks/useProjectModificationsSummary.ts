import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModificationsSummary {
  materialChoices: {
    totalCategories: number;
    totalOptions: number;
    buyersWithChoices: number;
  };
  changeRequests: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    completed: number;
    totalEstimatedCost: number;
  };
}

export function useProjectModificationsSummary(projectId: string | undefined) {
  const [data, setData] = useState<ModificationsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchModificationsSummary() {
      try {
        setLoading(true);
        setError(null);

        const [categoriesResult, optionsResult, choicesResult, requestsResult] = await Promise.all([
          supabase.from('material_categories')
            .select('id')
            .eq('project_id', projectId),
          supabase.from('material_options')
            .select('id, material_categories!inner(project_id)')
            .eq('material_categories.project_id', projectId),
          supabase.from('buyer_choices')
            .select('buyer_id, buyers!inner(project_id)')
            .eq('buyers.project_id', projectId),
          supabase.from('buyer_change_requests')
            .select('status, estimated_cost, buyers!inner(project_id)')
            .eq('buyers.project_id', projectId),
        ]);

        if (categoriesResult.error) throw categoriesResult.error;
        if (optionsResult.error) throw optionsResult.error;
        if (choicesResult.error) throw choicesResult.error;
        if (requestsResult.error) throw requestsResult.error;

        const categories = categoriesResult.data || [];
        const options = optionsResult.data || [];
        const choices = choicesResult.data || [];
        const requests = requestsResult.data || [];

        const uniqueBuyers = new Set(choices.map(c => c.buyer_id)).size;

        setData({
          materialChoices: {
            totalCategories: categories.length,
            totalOptions: options.length,
            buyersWithChoices: uniqueBuyers,
          },
          changeRequests: {
            total: requests.length,
            pending: requests.filter(r => r.status === 'PENDING').length,
            underReview: requests.filter(r => r.status === 'UNDER_REVIEW').length,
            approved: requests.filter(r => r.status === 'APPROVED').length,
            rejected: requests.filter(r => r.status === 'REJECTED').length,
            completed: requests.filter(r => r.status === 'COMPLETED').length,
            totalEstimatedCost: requests.reduce((sum, r) => sum + (r.estimated_cost || 0), 0),
          },
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchModificationsSummary();
  }, [projectId]);

  return { data, loading, error };
}
