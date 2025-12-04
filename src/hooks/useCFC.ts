import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CFCLine {
  id: string;
  project_id: string;
  cfc_number: string;
  label: string;
  budget_initial: number;
  budget_current: number;
  engaged: number;
  invoiced: number;
  paid: number;
  variance: number;
  parent_cfc_id?: string;
  created_at: string;
}

export interface CFCSummary {
  totalBudget: number;
  totalEngaged: number;
  totalInvoiced: number;
  totalPaid: number;
  totalVariance: number;
  percentEngaged: number;
  percentInvoiced: number;
  percentPaid: number;
}

export interface CFCContract {
  id: string;
  company_name: string;
  amount: number;
  status: string;
  date_signed?: string;
}

export interface CFCInvoice {
  id: string;
  label: string;
  amount: number;
  status: string;
  date_issued?: string;
  date_due?: string;
}

export interface CFCDetail extends CFCLine {
  contracts?: CFCContract[];
  invoices?: CFCInvoice[];
}

export function useCFC(projectId: string | undefined) {
  const [cfcLines, setCfcLines] = useState<CFCLine[]>([]);
  const [summary, setSummary] = useState<CFCSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchCFC() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('cfc_lines')
          .select('*')
          .eq('project_id', projectId)
          .order('cfc_number');

        if (fetchError) throw fetchError;

        const lines = data || [];
        setCfcLines(lines);

        const calculatedSummary: CFCSummary = {
          totalBudget: lines.reduce((sum, line) => sum + (line.budget_current || 0), 0),
          totalEngaged: lines.reduce((sum, line) => sum + (line.engaged || 0), 0),
          totalInvoiced: lines.reduce((sum, line) => sum + (line.invoiced || 0), 0),
          totalPaid: lines.reduce((sum, line) => sum + (line.paid || 0), 0),
          totalVariance: 0,
          percentEngaged: 0,
          percentInvoiced: 0,
          percentPaid: 0,
        };

        calculatedSummary.totalVariance = calculatedSummary.totalBudget - calculatedSummary.totalEngaged;
        calculatedSummary.percentEngaged = calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalEngaged / calculatedSummary.totalBudget) * 100
          : 0;
        calculatedSummary.percentInvoiced = calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalInvoiced / calculatedSummary.totalBudget) * 100
          : 0;
        calculatedSummary.percentPaid = calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalPaid / calculatedSummary.totalBudget) * 100
          : 0;

        setSummary(calculatedSummary);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CFC:', err);
        setError('Erreur lors du chargement du budget CFC');
        setLoading(false);
      }
    }

    fetchCFC();
  }, [projectId]);

  return { cfcLines, summary, loading, error };
}

export function useCFCDetail(cfcId: string | undefined) {
  const [cfcDetail, setCfcDetail] = useState<CFCDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cfcId) {
      setLoading(false);
      return;
    }

    async function fetchCFCDetail() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('cfc_lines')
          .select('*')
          .eq('id', cfcId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setCfcDetail(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CFC detail:', err);
        setError('Erreur lors du chargement du détail CFC');
        setLoading(false);
      }
    }

    fetchCFCDetail();
  }, [cfcId]);

  return { cfcDetail, loading, error };
}
