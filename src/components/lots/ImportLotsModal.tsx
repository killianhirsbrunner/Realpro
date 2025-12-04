import { useState } from 'react';
import { Upload, FileSpreadsheet, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { RealProModal } from '../realpro/RealProModal';

interface ImportLotsModalProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function ImportLotsModal({ projectId, onSuccess }: ImportLotsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const downloadTemplate = () => {
    const csvContent = `Code,Type,Statut,Bâtiment,Étage,Pièces,Surface Habitable,Surface Terrasse,Surface Balcon,Surface Jardin,Prix Base,Prix Extras,Orientation,Ascenseur
A.01.01,APARTMENT,AVAILABLE,Bâtiment A,1,3.5,85.5,0,8.5,0,750000,0,Sud-Ouest,Oui
A.01.02,APARTMENT,AVAILABLE,Bâtiment A,1,4.5,105.2,15.0,0,0,950000,25000,Nord-Est,Oui
A.02.01,DUPLEX,AVAILABLE,Bâtiment A,2,5.5,145.8,20.0,10.5,0,1350000,50000,Sud,Oui`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_lots.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', projectId);

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Importer (Excel)
      </button>

      <RealProModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Importer des lots depuis Excel"
      >
        <div className="space-y-6">
          {/* Instructions */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Instructions
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Téléchargez le modèle Excel ci-dessous</li>
              <li>Remplissez les informations de vos lots</li>
              <li>Enregistrez le fichier au format CSV ou XLSX</li>
              <li>Importez le fichier complété</li>
            </ul>
          </div>

          {/* Download Template */}
          <button
            onClick={downloadTemplate}
            className="w-full px-6 py-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group"
          >
            <Download className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors">
              Télécharger le modèle Excel
            </span>
            <FileSpreadsheet className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
          </button>

          {/* Upload Area */}
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`block px-6 py-12 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${
                uploading
                  ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${uploading ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
              {uploading ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Import en cours...</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    Formats acceptés: CSV, XLSX, XLS
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Import réussi! Les lots ont été ajoutés au projet.
              </p>
            </div>
          )}

          {/* Format Info */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold text-sm text-foreground mb-2">Colonnes requises</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div>• Code (obligatoire)</div>
              <div>• Type (obligatoire)</div>
              <div>• Statut</div>
              <div>• Bâtiment (obligatoire)</div>
              <div>• Étage</div>
              <div>• Pièces</div>
              <div>• Surface Habitable</div>
              <div>• Surface Terrasse</div>
              <div>• Surface Balcon</div>
              <div>• Surface Jardin</div>
              <div>• Prix Base</div>
              <div>• Prix Extras</div>
            </div>
          </div>
        </div>
      </RealProModal>
    </>
  );
}
