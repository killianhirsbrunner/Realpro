import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PageShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  loading?: boolean;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1], // easeInOutQuart
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

const maxWidthClasses = {
  full: 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
};

export function PageShell({
  children,
  title,
  subtitle,
  actions,
  loading = false,
  maxWidth = '7xl',
}: PageShellProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${maxWidthClasses[maxWidth]} mx-auto p-8`}
    >
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
