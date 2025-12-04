import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Document {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  category: string;
  file_url: string | null;
  file_size: number | null;
  file_type: string | null;
  version_number: number;
  parent_folder_id: string | null;
  is_folder: boolean;
  tags: any;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  status?: string;
  visibility?: string;
  lot_id?: string | null;
  buyer_id?: string | null;
  submission_id?: string | null;
  uploaded_by_name?: string;
  child_count?: number;
}

export function useDocuments(projectId: string, folderId?: string | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Document | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchDocuments();
      if (folderId) {
        fetchCurrentFolder();
      }
    }
  }, [projectId, folderId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_document_tree', {
        p_project_id: projectId,
        p_parent_folder_id: folderId || null,
      });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentFolder = async () => {
    if (!folderId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', folderId)
        .single();

      if (fetchError) throw fetchError;

      setCurrentFolder(data);
    } catch (err) {
      console.error('Error fetching current folder:', err);
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name,
          is_folder: true,
          parent_folder_id: parentId || folderId,
          category: 'DOCUMENT',
          uploaded_by: user.user.id,
          version_number: 1,
          status: 'published',
          visibility: 'internal',
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchDocuments();
      return data;
    } catch (err) {
      console.error('Error creating folder:', err);
      throw err;
    }
  };

  const uploadFile = async (file: File, metadata: {
    folderId?: string;
    description?: string;
    tags?: any;
    category?: string;
    lot_id?: string;
    buyer_id?: string;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const filePath = `projects/${projectId}/${metadata.folderId || 'root'}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name: file.name,
          description: metadata.description,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type,
          parent_folder_id: metadata.folderId || folderId,
          is_folder: false,
          category: metadata.category || 'DOCUMENT',
          tags: metadata.tags || {},
          uploaded_by: user.user.id,
          version_number: 1,
          status: 'published',
          visibility: 'internal',
          lot_id: metadata.lot_id,
          buyer_id: metadata.buyer_id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchDocuments();
      return data;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const doc = documents.find((d) => d.id === documentId);

      if (doc && doc.file_url) {
        const path = doc.file_url.split('/').slice(-3).join('/');
        await supabase.storage.from('documents').remove([path]);
      }

      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  const updateDocument = async (documentId: string, updates: {
    name?: string;
    description?: string;
    tags?: any;
    status?: string;
    visibility?: string;
  }) => {
    try {
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const searchDocuments = async (query: string, filters?: {
    tags?: string[];
    category?: string;
  }) => {
    try {
      const { data, error: searchError } = await supabase.rpc('search_documents', {
        p_project_id: projectId,
        p_query: query,
        p_tags: filters?.tags || null,
        p_category: filters?.category || null,
      });

      if (searchError) throw searchError;

      return data || [];
    } catch (err) {
      console.error('Error searching documents:', err);
      throw err;
    }
  };

  const initializeFolders = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      await supabase.rpc('initialize_project_folders', {
        p_project_id: projectId,
        p_created_by: user.user.id,
      });

      await fetchDocuments();
    } catch (err) {
      console.error('Error initializing folders:', err);
      throw err;
    }
  };

  return {
    documents,
    currentFolder,
    loading,
    error,
    refresh: fetchDocuments,
    createFolder,
    uploadFile,
    deleteDocument,
    updateDocument,
    searchDocuments,
    initializeFolders,
  };
}
