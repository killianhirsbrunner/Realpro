import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Submission {
  id: string;
  label: string;
  description?: string;
  deadline: string;
  deadline_questions?: string;
  status: string;
  cfc_code?: string;
  budget_estimate?: number;
  offers_count?: number;
  created_at: string;
}

export interface SubmissionDetail extends Submission {
  documents?: any[];
  companies?: any[];
  offers?: any[];
  questions?: any[];
}

export interface Offer {
  id: string;
  submission_id: string;
  company_id: string;
  company_name?: string;
  total_price?: number;
  delivery_delay?: number;
  status: string;
  submitted_at?: string;
  documents?: any[];
}

export function useSubmissions(projectId: string | undefined) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('submissions')
          .select(`
            id,
            label,
            description,
            deadline,
            deadline_questions,
            status,
            cfc_code,
            budget_estimate,
            created_at
          `)
          .eq('project_id', projectId)
          .order('deadline', { ascending: true });

        if (fetchError) throw fetchError;

        setSubmissions(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Erreur lors du chargement des soumissions');
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [projectId]);

  return { submissions, loading, error };
}

export function useSubmissionDetail(submissionId: string | undefined) {
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    async function fetchSubmissionDetail() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', submissionId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setSubmission(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submission detail:', err);
        setError('Erreur lors du chargement de la soumission');
        setLoading(false);
      }
    }

    fetchSubmissionDetail();
  }, [submissionId]);

  return { submission, loading, error };
}
