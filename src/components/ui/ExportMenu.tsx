import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Printer, ChevronDown } from 'lucide-react';
import { RealProButton } from '../realpro/RealProButton';
import type { ExportColumn } from '../../lib/utils/export';
import { exportToCSV, exportToExcel, exportToPDF } from '../../lib/utils/export';

interface ExportMenuProps<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export function ExportMenu<T extends Record<string, any>>({
  data,
  columns,
  filename,
  title,
  subtitle,
  disabled = false,
}: ExportMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (data.length === 0) return;

    setExporting(true);
    setIsOpen(false);

    const options = { filename, title, subtitle };

    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, columns, options);
          break;
        case 'excel':
          exportToExcel(data, columns, options);
          break;
        case 'pdf':
          exportToPDF(data, columns, options);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <RealProButton
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || exporting || data.length === 0}
      >
        <Download className="w-4 h-4" />
        {exporting ? 'Export...' : 'Exporter'}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </RealProButton>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg z-50 py-2">
          <button
            onClick={() => handleExport('csv')}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportMenu;
