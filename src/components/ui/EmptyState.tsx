import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="mb-4 rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
          <Icon className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
