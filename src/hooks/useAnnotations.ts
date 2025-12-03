import { useState, useEffect } from 'react';

export interface Annotation {
  id: string;
  document_id: string;
  project_id: string;
  lot_id: string | null;
  author_id: string;
  page: number;
  x: number;
  y: number;
  comment: string;
  created_at: string;
  author: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function useAnnotations(documentId: string, projectId: string) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnnotations = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/annotations/document/${documentId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) throw new Error('Failed to load annotations');

      const data = await response.json();
      setAnnotations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAnnotation = async (
    x: number,
    y: number,
    comment: string,
    lotId?: string,
    page?: number
  ) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/annotations/add`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentId,
          projectId,
          lotId,
          page,
          x,
          y,
          comment,
        }),
      });

      if (!response.ok) throw new Error('Failed to add annotation');

      await loadAnnotations();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAnnotation = async (annotationId: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/annotations/${annotationId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete annotation');

      await loadAnnotations();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (documentId && projectId) {
      loadAnnotations();
    }
  }, [documentId, projectId]);

  return {
    annotations,
    loading,
    error,
    addAnnotation,
    deleteAnnotation,
    refresh: loadAnnotations,
  };
}
