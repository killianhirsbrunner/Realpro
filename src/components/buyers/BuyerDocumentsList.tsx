import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Download, Upload, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  mime_type?: string;
  created_at: string;
}

interface BuyerDocumentsListProps {
  buyerId: string;
}

export function BuyerDocumentsList({ buyerId }: BuyerDocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [buyerId]);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('buyer_documents')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${buyerId}/${Date.now()}.${fileExt}`;
      const filePath = `buyer-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('buyer_documents')
        .insert({
          buyer_id: buyerId,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: Document) {
    if (!confirm('Supprimer ce document ?')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('buyer_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Erreur lors de la suppression');
    }
  }

  async function handleDownload(doc: Document) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Erreur lors du téléchargement');
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
          Aucun document
        </div>
      ) : (
        documents.map((doc) => (
          <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatFileSize(doc.file_size)} • {format(new Date(doc.created_at), 'dd/MM/yyyy')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </Card>
        ))
      )}

      <div>
        <label className="block">
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full"
            disabled={uploading}
            as="span"
          >
            {uploading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Ajouter un document
              </>
            )}
          </Button>
        </label>
      </div>
    </div>
  );
}
