import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Document {
  id: string;
  name: string;
  type?: string;
  size?: number;
  created_at: string;
  folder?: string;
  version?: number;
  storage_path?: string;
  status?: string;
}

export interface Folder {
  name: string;
  files: Document[];
  count: number;
}

const DEFAULT_FOLDERS = [
  '01 - Juridique',
  '02 - Plans',
  '03 - Contrats',
  '04 - Soumissions',
  '05 - Commercial',
  '06 - Dossiers acheteurs',
  '07 - Chantier / PV',
  '08 - Marketing',
  '09 - CFC / Budgets',
];

export function useDocuments(projectId: string | undefined) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tree, setTree] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchDocuments() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('id, name, type, size, created_at, folder, version, storage_path, status')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const docs = data || [];
        setDocuments(docs);

        const folderMap = new Map<string, Document[]>();

        DEFAULT_FOLDERS.forEach(folder => {
          folderMap.set(folder, []);
        });

        docs.forEach(doc => {
          const folder = doc.folder || '01 - Juridique';
          if (!folderMap.has(folder)) {
            folderMap.set(folder, []);
          }
          folderMap.get(folder)?.push(doc);
        });

        const treeData: Folder[] = Array.from(folderMap.entries()).map(([name, files]) => ({
          name,
          files,
          count: files.length,
        }));

        setTree(treeData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Erreur lors du chargement des documents');
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [projectId]);

  return { documents, tree, loading, error };
}
