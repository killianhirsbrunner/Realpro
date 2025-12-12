import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface AuthLayoutProps {
  /** Main content */
  children: ReactNode;
  /** Logo element */
  logo?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Side panel content (for split layout) */
  sideContent?: ReactNode;
  /** Side panel background class */
  sideBgClass?: string;
  /** Layout variant */
  variant?: 'centered' | 'split';
  /** Additional classes */
  className?: string;
}

export function AuthLayout({
  children,
  logo,
  footer,
  sideContent,
  sideBgClass = 'bg-gradient-to-br from-brand-400 to-brand-600',
  variant = 'centered',
  className,
}: AuthLayoutProps) {
  if (variant === 'split') {
    return (
      <div className={clsx('min-h-screen flex', className)}>
        {/* Left side - Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Logo */}
            {logo && <div className="flex justify-center mb-8">{logo}</div>}

            {/* Form card */}
            <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {footer}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Visual */}
        <div
          className={clsx(
            'hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center',
            sideBgClass
          )}
        >
          {sideContent || (
            <div className="px-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Bienvenue sur Realpro
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                La suite complète pour la gestion immobilière professionnelle en Suisse.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Centered variant (default)
  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col justify-center',
        'bg-neutral-50 dark:bg-neutral-950',
        'px-6 py-12 lg:px-8',
        className
      )}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        {logo && <div className="flex justify-center mb-8">{logo}</div>}

        {/* Form card */}
        <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
