import { type ReactNode } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative w-full bg-white dark:bg-neutral-900 rounded-xl shadow-xl',
            'transform transition-all',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
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
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200 dark:border-neutral-800">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
