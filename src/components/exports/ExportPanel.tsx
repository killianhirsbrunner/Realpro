import { FileText, Table, FileSpreadsheet, Download } from 'lucide-react';
import { ExportButton } from './ExportButton';

interface ExportPanelProps {
  projectId?: string;
  buyerId?: string;
  title?: string;
  availableExports: Array<{
    type: 'buyer_dossier' | 'financial_report' | 'lots_csv' | 'cfc_csv';
    label: string;
    description: string;
    icon?: React.ReactNode;
  }>;
}

export function ExportPanel({ projectId, buyerId, title = 'Exports disponibles', availableExports }: ExportPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'buyer_dossier':
        return <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
      case 'financial_report':
        return <FileSpreadsheet className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
      case 'lots_csv':
      case 'cfc_csv':
        return <Table className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
      default:
        return <Download className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {availableExports.map((exportOption, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{exportOption.icon || getIcon(exportOption.type)}</div>
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">
                  {exportOption.label}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {exportOption.description}
                </div>
              </div>
            </div>

            <ExportButton
              type={exportOption.type}
              entityId={buyerId}
              projectId={projectId}
              showDropdown={!exportOption.type.includes('csv')}
              variant="outline"
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
