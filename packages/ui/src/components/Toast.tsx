import { toast as sonnerToast, Toaster } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast utility functions
 * Wraps sonner toast with consistent styling
 */
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5 text-success-500" />,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: <XCircle className="w-5 h-5 text-error-500" />,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5 text-warning-500" />,
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: <Info className="w-5 h-5 text-info-500" />,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};

/**
 * Toaster component - place this at the root of your app
 */
export interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  richColors?: boolean;
}

export function RealProToaster({ position = 'top-right', richColors = true }: ToasterProps) {
  return (
    <Toaster
      position={position}
      expand={false}
      richColors={richColors}
      toastOptions={{
        className: 'font-sans',
        style: {
          borderRadius: '0.75rem',
        },
      }}
    />
  );
}
