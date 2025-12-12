import { type ReactNode } from 'react';
import clsx from 'clsx';
import { AlertCircle, RefreshCw, WifiOff, FileWarning, ShieldX, ServerOff } from 'lucide-react';
import { Button } from './Button';

export type ErrorType = 'generic' | 'network' | 'not-found' | 'permission' | 'server';

export interface ErrorStateProps {
  /** Error type to determine icon and default message */
  type?: ErrorType;
  /** Custom title (overrides default) */
  title?: string;
  /** Custom description (overrides default) */
  description?: string;
  /** Custom icon (overrides default) */
  icon?: ReactNode;
  /** Retry action */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

const errorConfigs: Record<ErrorType, { icon: ReactNode; title: string; description: string }> = {
  generic: {
    icon: <AlertCircle />,
    title: 'Une erreur est survenue',
    description: 'Nous n\'avons pas pu charger les données. Veuillez réessayer.',
  },
  network: {
    icon: <WifiOff />,
    title: 'Problème de connexion',
    description: 'Vérifiez votre connexion internet et réessayez.',
  },
  'not-found': {
    icon: <FileWarning />,
    title: 'Page introuvable',
    description: 'La ressource demandée n\'existe pas ou a été déplacée.',
  },
  permission: {
    icon: <ShieldX />,
    title: 'Accès refusé',
    description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
  },
  server: {
    icon: <ServerOff />,
    title: 'Erreur serveur',
    description: 'Nos serveurs rencontrent un problème. Veuillez réessayer plus tard.',
  },
};

export function ErrorState({
  type = 'generic',
  title,
  description,
  icon,
  onRetry,
  retryLabel = 'Réessayer',
  secondaryAction,
  size = 'md',
  className,
}: ErrorStateProps) {
  const config = errorConfigs[type];

  const sizeStyles = {
    sm: {
      container: 'py-6 px-4',
      iconWrapper: 'h-10 w-10 mb-3',
      icon: 'h-5 w-5',
      title: 'text-sm',
      description: 'text-xs',
      button: 'sm' as const,
    },
    md: {
      container: 'py-10 px-6',
      iconWrapper: 'h-14 w-14 mb-4',
      icon: 'h-7 w-7',
      title: 'text-base',
      description: 'text-sm',
      button: 'md' as const,
    },
    lg: {
      container: 'py-16 px-8',
      iconWrapper: 'h-20 w-20 mb-6',
      icon: 'h-10 w-10',
      title: 'text-lg',
      description: 'text-base',
      button: 'lg' as const,
    },
  };

  const styles = sizeStyles[size];

  const displayIcon = icon || config.icon;

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className
      )}
      role="alert"
    >
      {/* Icon */}
      <div
        className={clsx(
          styles.iconWrapper,
          'flex items-center justify-center rounded-full',
          'bg-error-50 dark:bg-error-950'
        )}
      >
        <div
          className={clsx(
            styles.icon,
            'text-error-500 dark:text-error-400',
            '[&>svg]:h-full [&>svg]:w-full'
          )}
        >
          {displayIcon}
        </div>
      </div>

      {/* Title */}
      <h3
        className={clsx(
          styles.title,
          'font-semibold text-neutral-900 dark:text-neutral-100'
        )}
      >
        {title || config.title}
      </h3>

      {/* Description */}
      <p
        className={clsx(
          styles.description,
          'text-neutral-500 dark:text-neutral-400 max-w-sm mt-1.5'
        )}
      >
        {description || config.description}
      </p>

      {/* Actions */}
      {(onRetry || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {onRetry && (
            <Button
              variant="primary"
              size={styles.button}
              onClick={onRetry}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              {retryLabel}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size={styles.button}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
