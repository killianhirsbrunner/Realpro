import { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, User, Tag, History, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  version_number: number;
  created_at: string;
  updated_at: string;
  uploaded_by?: string;
  tags?: any;
  category?: string;
}

interface DocumentPreviewPanelProps {
  documentId: string;
  onClose: () => void;
}

export function DocumentPreviewPanel({ documentId, onClose }: DocumentPreviewPanelProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [uploaderName, setUploaderName] = useState<string>('');

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  async function fetchDocument() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      setDocument(data);

      if (data.uploaded_by) {
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('id', data.uploaded_by)
          .single();

        if (userData) {
          setUploaderName(`${userData.first_name} ${userData.last_name}`);
        }
      }
    } catch (err) {
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (document?.file_url) {
      window.open(document.file_url, '_blank');
    }
  };

  const isPDF = document?.file_type?.includes('pdf');
  const isImage = document?.file_type?.startsWith('image/');

  if (loading) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-white dark:bg-neutral-900 shadow-2xl z-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Aperçu du document
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white break-words">
                  {document.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {formatFileSize(document.file_size)} • Version {document.version_number}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowVersions(!showVersions)}
              >
                <History className="h-4 w-4 mr-2" />
                Versions
              </Button>
            </div>
          </div>

          {document.description && (
            <Card className="p-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Description
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {document.description}
              </p>
            </Card>
          )}

          {document.file_url && (isPDF || isImage) && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Prévisualisation
              </h4>
              <Card className="p-2 overflow-hidden">
                {isPDF && (
                  <iframe
                    src={document.file_url}
                    className="w-full h-[500px] rounded-lg"
                    title={document.name}
                  />
                )}
                {isImage && (
                  <img
                    src={document.file_url}
                    alt={document.name}
                    className="w-full rounded-lg"
                  />
                )}
              </Card>
            </div>
          )}

          <Card className="p-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Informations
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <div className="text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">Créé le </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {format(new Date(document.created_at), 'dd/MM/yyyy à HH:mm')}
                  </span>
                </div>
              </div>
              {uploaderName && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-neutral-400" />
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Uploadé par </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {uploaderName}
                    </span>
                  </div>
                </div>
              )}
              {document.category && (
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-neutral-400" />
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Catégorie </span>
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {document.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {showVersions && (
            <Card className="p-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Historique des versions
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Version {document.version_number} (Actuelle)
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {format(new Date(document.updated_at), 'dd/MM/yyyy à HH:mm')}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900">
                    Actuelle
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
