import { useState } from 'react';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  type ExportColumn,
  type ExportOptions,
} from '../lib/utils/export';
import { useToast } from './useToast';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

interface UseExportOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  title?: string;
  subtitle?: string;
  dateRange?: string;
}

export function useExport<T extends Record<string, any>>() {
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  const doExport = async (
    format: ExportFormat,
    options: UseExportOptions<T>
  ) => {
    if (options.data.length === 0) {
      showToast('warning', 'Aucune donnée à exporter');
      return;
    }

    setExporting(true);

    try {
      const exportOptions: ExportOptions = {
        filename: options.filename,
        title: options.title,
        subtitle: options.subtitle,
        dateRange: options.dateRange,
      };

      switch (format) {
        case 'csv':
          exportToCSV(options.data, options.columns, exportOptions);
          showToast('success', 'Export CSV généré avec succès');
          break;
        case 'excel':
          exportToExcel(options.data, options.columns, exportOptions);
          showToast('success', 'Export Excel généré avec succès');
          break;
        case 'pdf':
          exportToPDF(options.data, options.columns, exportOptions);
          // Pour PDF, la notification sera après l'impression
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('error', 'Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  return {
    exporting,
    exportCSV: (options: UseExportOptions<T>) => doExport('csv', options),
    exportExcel: (options: UseExportOptions<T>) => doExport('excel', options),
    exportPDF: (options: UseExportOptions<T>) => doExport('pdf', options),
    export: doExport,
  };
}
