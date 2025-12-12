import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  retry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-sm mb-6">{message}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}
