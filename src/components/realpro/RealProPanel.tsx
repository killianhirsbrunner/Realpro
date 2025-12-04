import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { RealProButton } from './RealProButton';

interface RealProPanelProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  width?: 'sm' | 'md' | 'lg';
}

export function RealProPanel({
  title,
  children,
  isOpen,
  onClose,
  width = 'md'
}: RealProPanelProps) {
  const widths = {
    sm: 'w-96',
    md: 'w-[28rem]',
    lg: 'w-[36rem]',
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      <div
        className={`
          fixed
          right-0
          top-0
          h-full
          ${widths[width]}
          bg-white
          dark:bg-neutral-900
          border-l
          border-neutral-200
          dark:border-neutral-800
          shadow-panel
          p-8
          flex
          flex-col
          gap-6
          z-50
          animate-slideLeft
        `}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
