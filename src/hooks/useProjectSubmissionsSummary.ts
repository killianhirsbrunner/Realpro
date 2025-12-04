import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SubmissionsSummary {
  total: number;
  draft: number;
  published: number;
  closed: number;
  adjudicated: number;
  averageOffers: number;
  totalEstimatedValue: number;
}

export function useProjectSubmissionsSummary(projectId: string | undefined) {
  const [data, setData] = useState<SubmissionsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchSubmissionsSummary() {
      try {
        setLoading(true);
        setError(null);

        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select(`
            id,
            status,
            submission_offers(total_with_vat)
          `)
          .eq('project_id', projectId);

        if (submissionsError) throw submissionsError;

        const total = submissions?.length || 0;
        const draft = submissions?.filter(s => s.status === 'DRAFT').length || 0;
        const published = submissions?.filter(s => s.status === 'PUBLISHED').length || 0;
        const closed = submissions?.filter(s => s.status === 'CLOSED').length || 0;
        const adjudicated = submissions?.filter(s => s.status === 'ADJUDICATED').length || 0;

        let totalOffers = 0;
        let totalEstimatedValue = 0;

        submissions?.forEach(submission => {
          const offers = (submission as any).submission_offers || [];
          totalOffers += offers.length;

          const winningOffer = offers.find((o: any) => o.is_winner);
          if (winningOffer) {
            totalEstimatedValue += winningOffer.total_with_vat || 0;
          }
        });

        const averageOffers = total > 0 ? Math.round(totalOffers / total) : 0;

        setData({
          total,
          draft,
          published,
          closed,
          adjudicated,
          averageOffers,
          totalEstimatedValue,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissionsSummary();
  }, [projectId]);

  return { data, loading, error };
}
