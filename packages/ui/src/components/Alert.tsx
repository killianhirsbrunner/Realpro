import { type ReactNode } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /** Alert variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert description/content */
  children: ReactNode;
  /** Custom icon (overrides default) */
  icon?: ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Show close button */
  dismissible?: boolean;
  /** Close callback */
  onDismiss?: () => void;
  /** Action element */
  action?: ReactNode;
  /** Additional classes */
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { icon: ReactNode; containerClass: string; iconClass: string; titleClass: string }
> = {
  info: {
    icon: <Info />,
    containerClass: 'bg-info-50 border-info-200 dark:bg-info-950 dark:border-info-800',
    iconClass: 'text-info-500 dark:text-info-400',
    titleClass: 'text-info-800 dark:text-info-200',
  },
  success: {
    icon: <CheckCircle />,
    containerClass: 'bg-success-50 border-success-200 dark:bg-success-950 dark:border-success-800',
    iconClass: 'text-success-500 dark:text-success-400',
    titleClass: 'text-success-800 dark:text-success-200',
  },
  warning: {
    icon: <AlertTriangle />,
    containerClass: 'bg-warning-50 border-warning-200 dark:bg-warning-950 dark:border-warning-800',
    iconClass: 'text-warning-500 dark:text-warning-400',
    titleClass: 'text-warning-800 dark:text-warning-200',
  },
  error: {
    icon: <AlertCircle />,
    containerClass: 'bg-error-50 border-error-200 dark:bg-error-950 dark:border-error-800',
    iconClass: 'text-error-500 dark:text-error-400',
    titleClass: 'text-error-800 dark:text-error-200',
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  hideIcon = false,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={clsx(
        'relative rounded-lg border p-4',
        config.containerClass,
        className
      )}
    >
      <div className="flex">
        {/* Icon */}
        {!hideIcon && (
          <div
            className={clsx(
              'flex-shrink-0 [&>svg]:h-5 [&>svg]:w-5',
              config.iconClass
            )}
          >
            {icon || config.icon}
          </div>
        )}

        {/* Content */}
        <div className={clsx('flex-1', !hideIcon && 'ml-3')}>
          {title && (
            <h3 className={clsx('text-sm font-semibold', config.titleClass)}>
              {title}
            </h3>
          )}
          <div
            className={clsx(
              'text-sm text-neutral-700 dark:text-neutral-300',
              title && 'mt-1'
            )}
          >
            {children}
          </div>

          {/* Action */}
          {action && <div className="mt-3">{action}</div>}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className={clsx(
                'inline-flex rounded-lg p-1.5 transition-colors',
                'text-neutral-500 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-700/50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
              )}
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
