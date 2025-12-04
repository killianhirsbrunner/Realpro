import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ConstructionPhoto {
  id: string;
  project_id: string;
  lot_id: string | null;
  task_id: string | null;
  diary_entry_id: string | null;
  file_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  taken_at: string;
  location: string | null;
  uploaded_by: string;
  created_at: string;
}

export function useConstructionPhotos(projectId: string, lotId?: string) {
  const [photos, setPhotos] = useState<ConstructionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [projectId, lotId]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('construction_photos')
        .select('*')
        .eq('project_id', projectId)
        .order('taken_at', { ascending: false });

      if (lotId) {
        query = query.eq('lot_id', lotId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching construction photos:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (photo: {
    file_url: string;
    caption?: string;
    location?: string;
    lot_id?: string;
    task_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: uploadError } = await supabase
        .from('construction_photos')
        .insert({
          project_id: projectId,
          uploaded_by: user.id,
          taken_at: new Date().toISOString(),
          ...photo,
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      await fetchPhotos();
      return data;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('construction_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) throw deleteError;

      await fetchPhotos();
    } catch (err) {
      console.error('Error deleting photo:', err);
      throw err;
    }
  };

  return {
    photos,
    loading,
    error,
    refresh: fetchPhotos,
    uploadPhoto,
    deletePhoto,
  };
}
