import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardData {
  sales: {
    total: number;
    sold: number;
    reserved: number;
    available: number;
    total_value: number;
    sold_value: number;
  };
  finance: {
    total_budget: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  planning: {
    total_tasks: number;
    completed: number;
    in_progress: number;
    delayed: number;
    progress: number;
  };
  cfc: {
    total_budget: number;
    engaged: number;
    invoiced: number;
    paid: number;
    variance: number;
  };
}

export function useReporting(projectId: string, reportType?: 'dashboard' | 'sales' | 'finance' | 'cfc' | 'buyers' | 'planning' | 'submissions') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchReportingData();
    }
  }, [projectId, reportType]);

  const fetchReportingData = async () => {
    try {
      setLoading(true);
      setError(null);

      let result;

      switch (reportType) {
        case 'sales':
          result = await supabase.rpc('get_sales_reporting', { p_project_id: projectId });
          break;
        case 'finance':
          result = await supabase.rpc('get_finance_reporting', { p_project_id: projectId });
          break;
        case 'cfc':
          result = await supabase.rpc('get_cfc_reporting', { p_project_id: projectId });
          break;
        case 'buyers':
          result = await supabase.rpc('get_buyers_reporting', { p_project_id: projectId });
          break;
        case 'planning':
          result = await supabase.rpc('get_planning_reporting', { p_project_id: projectId });
          break;
        case 'submissions':
          result = await supabase.rpc('get_submissions_reporting', { p_project_id: projectId });
          break;
        case 'dashboard':
        default:
          result = await supabase.rpc('get_project_dashboard', { p_project_id: projectId });
          break;
      }

      if (result.error) throw result.error;

      setData(result.data);
    } catch (err) {
      console.error('Error fetching reporting data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchReportingData,
  };
}
