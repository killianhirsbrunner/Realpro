import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type ExportStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface ProjectExport {
  id: string;
  organization_id: string;
  project_id: string;
  created_by_id: string;
  status: ExportStatus;
  file_name?: string;
  file_url?: string;
  file_size?: number;
  storage_path?: string;
  export_type: string;
  include_documents: boolean;
  include_sav: boolean;
  include_audit_log: boolean;
  include_site_diary: boolean;
  error_message?: string;
  error_details?: any;
  total_documents: number;
  total_sav_tickets: number;
  total_lots: number;
  total_buyers: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  project?: any;
  created_by?: any;
}

export function useProjectExports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const listExports = useCallback(async (projectId: string): Promise<ProjectExport[]> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-exports/projects/${projectId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exports');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createExport = useCallback(async (projectId: string): Promise<ProjectExport | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-exports/projects/${projectId}`,
        {
          method: 'POST',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create export');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExport = useCallback(async (exportId: string): Promise<ProjectExport | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-exports/${exportId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch export');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExport = useCallback(async (exportId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-exports/${exportId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete export');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDownloadUrl = useCallback(async (exportId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-exports/${exportId}/download`,
        { headers }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get download URL');
      }

      const data = await response.json();
      return data.signedUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const getStatusLabel = (status: ExportStatus): string => {
    const labels: Record<ExportStatus, string> = {
      PENDING: 'En attente',
      PROCESSING: 'Génération en cours',
      SUCCESS: 'Terminé',
      FAILED: 'Échec',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: ExportStatus): string => {
    const colors: Record<ExportStatus, string> = {
      PENDING: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
      PROCESSING: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
      SUCCESS: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      FAILED: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    };
    return colors[status] || colors.PENDING;
  };

  return {
    loading,
    error,
    listExports,
    createExport,
    getExport,
    deleteExport,
    getDownloadUrl,
    formatFileSize,
    getStatusLabel,
    getStatusColor,
  };
}
