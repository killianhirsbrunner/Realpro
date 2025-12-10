import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { RealProLogo } from '../branding/RealProLogo';

interface RealProModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function RealProModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: RealProModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div
        className={`
          relative
          bg-white
          dark:bg-neutral-900
          rounded-3xl
          shadow-panel
          p-8
          md:p-10
          w-full
          ${sizes[size]}
          animate-scaleIn
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <RealProLogo size="sm" />
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
