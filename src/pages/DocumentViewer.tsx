import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, Calendar, Hash, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface DocumentData {
  id: string;
  name: string;
  type?: string;
  size?: number;
  version?: number;
  created_at: string;
  folder?: string;
  storage_path?: string;
}

export function DocumentViewer() {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !documentId) return;

    async function fetchDocument() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .eq('project_id', projectId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Document non trouvé');
          return;
        }

        setDocument(data);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Erreur lors du chargement du document');
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [projectId, documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error || 'Document non trouvé'}</p>
          <Link
            to={`/projects/${projectId}/documents`}
            className="inline-block mt-4 text-primary-600 hover:underline"
          >
            Retour aux documents
          </Link>
        </div>
      </div>
    );
  }

  const isPDF = document.type?.includes('pdf');
  const isImage = document.type?.includes('image');

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/documents`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux documents
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {document.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {document.folder && (
                  <span>{document.folder}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(document.created_at).toLocaleDateString('fr-CH')}
                </span>
                {document.version && (
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Version {document.version}
                  </span>
                )}
                <span>{formatFileSize(document.size)}</span>
              </div>
            </div>
          </div>

          {document.storage_path && (
            <a href={document.storage_path} download>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {isPDF && document.storage_path ? (
          <iframe
            src={document.storage_path}
            className="w-full h-[800px]"
            title={document.name}
          />
        ) : isImage && document.storage_path ? (
          <div className="p-8 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800">
            <img
              src={document.storage_path}
              alt={document.name}
              className="max-w-full max-h-[800px] object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Prévisualisation non disponible pour ce type de fichier
            </p>
            {document.storage_path && (
              <a href={document.storage_path} download>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le fichier
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
