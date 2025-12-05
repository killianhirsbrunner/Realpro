import { toast as sonnerToast, Toaster } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { designTokens } from '../../lib/design-system/tokens';

// Toast wrapper with RealPro styling
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5" style={{ color: designTokens.colors.light.success }} />,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: <XCircle className="w-5 h-5" style={{ color: designTokens.colors.light.danger }} />,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5" style={{ color: designTokens.colors.light.warning }} />,
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: <Info className="w-5 h-5" style={{ color: designTokens.colors.light.info }} />,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};

// Toaster component with RealPro theme
export function RealProToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      toastOptions={{
        style: {
          background: designTokens.colors.light.background,
          color: designTokens.colors.light.foreground,
          border: `1px solid ${designTokens.colors.light.border}`,
          borderRadius: designTokens.radius.lg,
          boxShadow: designTokens.shadows.card,
          fontFamily: designTokens.typography.fontFamily,
        },
      }}
    />
  );
}
