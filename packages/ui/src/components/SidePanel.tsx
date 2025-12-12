import { type ReactNode } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  footer?: ReactNode;
}

export function SidePanel({
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  children,
  footer,
}: SidePanelProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 w-full bg-white dark:bg-neutral-900 shadow-xl flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          sizeClasses[size],
          positionClasses[position]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
