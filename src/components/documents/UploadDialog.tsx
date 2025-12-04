import { useState, useRef } from 'react';
import { X, Upload, FileText, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface UploadDialogProps {
  projectId: string;
  folder: string;
  onSuccess?: () => void;
}

export function UploadDialog({ projectId, folder, onSuccess }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);

      for (const file of files) {
        const filePath = `${projectId}/${folder}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        await supabase.from('documents').insert({
          project_id: projectId,
          name: file.name,
          type: file.type,
          size: file.size,
          folder: folder,
          storage_path: urlData.publicUrl,
          status: 'active',
          version: 1,
        });
      }

      setFiles([]);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Importer
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Importer des documents
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Dossier : {folder}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-12 text-center cursor-pointer hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
              >
                <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-900 dark:text-white font-medium mb-1">
                  Glissez vos fichiers ici
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  ou cliquez pour sélectionner
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                    Fichiers sélectionnés ({files.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
              >
                {uploading ? 'Importation...' : `Importer ${files.length} fichier${files.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
