import { FileText, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

interface DocumentPreviewCardProps {
  document: Document;
}

export function DocumentPreviewCard({ document }: DocumentPreviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('doc')) return '📝';
    if (type.includes('xls') || type.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-primary-500/0 group-hover:from-brand-500/5 group-hover:to-primary-500/5 transition-all duration-500" />

      <div className="relative flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-2xl shadow-sm"
        >
          {getFileIcon(document.type)}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {document.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {formatDate(document.uploaded_at)}
                </span>
                {document.size && (
                  <>
                    <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {document.size}
                    </span>
                  </>
                )}
              </div>
              {document.uploaded_by && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Par {document.uploaded_by}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              >
                <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <Download className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
