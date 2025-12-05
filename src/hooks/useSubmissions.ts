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

export function useSubmissionClarifications(submissionId: string | undefined) {
  const [clarifications, setClarifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchClarifications() {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('submission_clarifications')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setClarifications(data || []);
    } catch (err: any) {
      console.error('Error fetching clarifications:', err);
      setError('Erreur lors du chargement des clarifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClarifications();
  }, [submissionId]);

  return { clarifications, loading, error, refetch: fetchClarifications };
}

export function useSubmissionCompanies(submissionId: string | undefined) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCompanies() {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('submission_companies')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCompanies(data || []);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, [submissionId]);

  return { companies, loading, error, refetch: fetchCompanies };
}
