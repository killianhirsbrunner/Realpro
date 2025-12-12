import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnotations } from '../hooks/useAnnotations';
import { MessageSquare, X } from 'lucide-react';

interface PlanAnnotationsProps {
  documentId: string;
  projectId: string;
  planUrl: string;
  lotId?: string;
}

export function PlanAnnotations({ documentId, projectId, planUrl, lotId }: PlanAnnotationsProps) {
  const { t } = useTranslation();
  const { annotations, loading, addAnnotation, deleteAnnotation } = useAnnotations(documentId, projectId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const comment = prompt(t('annotations.promptComment'));
    if (!comment) return;

    try {
      await addAnnotation(x, y, comment, lotId);
    } catch (error) {
      console.error('Failed to add annotation:', error);
    }
  };

  const handleDelete = async (annotationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('annotations.confirmDelete'))) return;

    try {
      await deleteAnnotation(annotationId);
    } catch (error) {
      console.error('Failed to delete annotation:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative h-[480px] w-full cursor-crosshair overflow-hidden rounded-2xl border border-neutral-300 bg-neutral-900 dark:border-neutral-600"
        onClick={handleClick}
      >
        <img
          src={planUrl}
          alt="Plan"
          className="h-full w-full object-contain"
        />

        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${annotation.x * 100}%`, top: `${annotation.y * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAnnotation(annotation.id === selectedAnnotation ? null : annotation.id);
            }}
          >
            <div className="relative">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-neutral-900">
                <MessageSquare className="h-3 w-3" />
              </div>

              {selectedAnnotation === annotation.id && (
                <div className="absolute left-8 top-0 z-10 w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-neutral-900 dark:text-neutral-50">
                        {annotation.author.firstName} {annotation.author.lastName}
                      </p>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                        {annotation.comment}
                      </p>
                      <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                        {new Date(annotation.created_at).toLocaleString('fr-CH')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(annotation.id, e)}
                      className="ml-2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {t('annotations.help')} {annotations.length} {t('annotations.count')}
      </p>
    </div>
  );
}
