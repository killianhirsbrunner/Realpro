import { useState } from 'react';
import { Download, FileText, Loader2, ChevronDown } from 'lucide-react';
import { usePdfExports } from '../../hooks/usePdfExports';
import { Button } from '../ui/Button';

interface ExportButtonProps {
  type: 'buyer_dossier' | 'financial_report' | 'lots_csv' | 'cfc_csv' | 'custom';
  label?: string;
  entityId?: string;
  projectId?: string;
  data?: any;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
  onExportComplete?: () => void;
}

export function ExportButton({
  type,
  label,
  entityId,
  projectId,
  data,
  variant = 'outline',
  size = 'md',
  showDropdown = false,
  onExportComplete,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    generating,
    generateBuyerDossier,
    generateFinancialReport,
    exportLotsCSV,
    exportCfcCSV,
    generatePdf,
  } = usePdfExports();

  const handleExport = async (format: 'pdf' | 'html' | 'csv' = 'html') => {
    try {
      switch (type) {
        case 'buyer_dossier':
          if (!entityId) throw new Error('buyerId requis');
          await generateBuyerDossier(entityId, {
            download: format === 'html',
            openInNewTab: format === 'pdf',
          });
          break;

        case 'financial_report':
          if (!projectId) throw new Error('projectId requis');
          await generateFinancialReport(projectId, {
            download: format === 'html',
            openInNewTab: format === 'pdf',
          });
          break;

        case 'lots_csv':
          if (!projectId) throw new Error('projectId requis');
          await exportLotsCSV(projectId);
          break;

        case 'cfc_csv':
          if (!projectId) throw new Error('projectId requis');
          await exportCfcCSV(projectId);
          break;

        case 'custom':
          if (!data) throw new Error('data requis');
          await generatePdf(data.documentType, data.content, {
            organizationId: data.organizationId,
            projectId,
            download: format === 'html',
            openInNewTab: format === 'pdf',
          });
          break;
      }

      onExportComplete?.();
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getLabel = () => {
    if (label) return label;
    switch (type) {
      case 'buyer_dossier':
        return 'Dossier acheteur';
      case 'financial_report':
        return 'Rapport financier';
      case 'lots_csv':
        return 'Export lots CSV';
      case 'cfc_csv':
        return 'Export CFC CSV';
      default:
        return 'Exporter';
    }
  };

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport(type.includes('csv') ? 'csv' : 'html')}
        disabled={generating}
        className="gap-2"
      >
        {generating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {generating ? 'Génération...' : getLabel()}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        disabled={generating}
        className="gap-2"
      >
        {generating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        {generating ? 'Génération...' : getLabel()}
        <ChevronDown className="w-3.5 h-3.5" />
      </Button>

      {isOpen && !generating && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50">
            {!type.includes('csv') && (
              <>
                <button
                  onClick={() => handleExport('html')}
                  className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      Télécharger HTML
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Ouvrir dans le navigateur
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      Ouvrir PDF
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Nouvel onglet (Imprimer en PDF)
                    </div>
                  </div>
                </button>
              </>
            )}
            {type.includes('csv') && (
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
              >
                <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    Télécharger CSV
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Format Excel compatible
                  </div>
                </div>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
