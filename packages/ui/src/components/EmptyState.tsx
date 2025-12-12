import { type ReactNode, isValidElement } from 'react';
import { type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;

    // If it's a valid React element (JSX), render it directly
    if (isValidElement(icon)) {
      return (
        <div className="mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 p-4">
          {icon}
        </div>
      );
    }

    // Otherwise treat it as a LucideIcon component
    const Icon = icon as LucideIcon;
    return (
      <div className="mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 p-4">
        <Icon className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
      </div>
    );
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4', className)}>
      {renderIcon()}
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
