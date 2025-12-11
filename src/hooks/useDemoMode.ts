import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { handlePostAuthSetup } from '../lib/authHelpers';

// Identifiants du compte démo avec accès complet
export const DEMO_CREDENTIALS = {
  email: 'demo@realpro.ch',
  password: 'demo123456',
};

// Clé localStorage pour le mode démo
const DEMO_MODE_KEY = 'realpro_demo_mode';

interface DemoModeState {
  isDemoMode: boolean;
  isLoggingIn: boolean;
  error: string | null;
}

export function useDemoMode() {
  const navigate = useNavigate();
  const [state, setState] = useState<DemoModeState>({
    isDemoMode: false,
    isLoggingIn: false,
    error: null,
  });

  // Vérifier le mode démo au démarrage
  useEffect(() => {
    const checkDemoMode = async () => {
      const demoMode = localStorage.getItem(DEMO_MODE_KEY);
      const { data: { user } } = await supabase.auth.getUser();

      if (demoMode === 'true' && user?.email === DEMO_CREDENTIALS.email) {
        setState(prev => ({ ...prev, isDemoMode: true }));
      } else {
        localStorage.removeItem(DEMO_MODE_KEY);
      }
    };

    checkDemoMode();
  }, []);

  // Helper pour détecter les erreurs de rate limit
  const isRateLimitError = (error: Error): boolean => {
    const message = error.message.toLowerCase();
    return (
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('over_email_send_rate_limit') ||
      message.includes('email rate limit')
    );
  };

  // Message d'erreur utilisateur pour le rate limit
  const getRateLimitMessage = (): string => {
    return 'Trop de tentatives de connexion. Le compte démo nécessite une confirmation par email. Veuillez réessayer dans quelques minutes ou contacter le support.';
  };

  // Connexion automatique en mode démo
  const loginAsDemo = useCallback(async () => {
    setState(prev => ({ ...prev, isLoggingIn: true, error: null }));

    try {
      // Déconnexion de tout compte existant
      await supabase.auth.signOut();

      // Connexion avec le compte démo
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
      });

      if (signInError) {
        // Vérifier si c'est une erreur de rate limit
        if (isRateLimitError(signInError)) {
          throw new Error(getRateLimitMessage());
        }

        // Si le compte démo n'existe pas, on essaie de le créer
        if (signInError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
            options: {
              data: {
                first_name: 'Utilisateur',
                last_name: 'Démo',
                role: 'promoteur',
              },
            },
          });

          if (signUpError) {
            // Vérifier si c'est une erreur de rate limit
            if (isRateLimitError(signUpError)) {
              throw new Error(getRateLimitMessage());
            }
            throw signUpError;
          }

          // Tentative de connexion après création
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
          });

          if (retryError) {
            // Vérifier si c'est une erreur de rate limit
            if (isRateLimitError(retryError)) {
              throw new Error(getRateLimitMessage());
            }
            // Si email non confirmé après création
            if (retryError.message.includes('Email not confirmed')) {
              throw new Error('Le compte démo a été créé. Veuillez confirmer votre email ou réessayer dans quelques minutes.');
            }
            throw retryError;
          }
        } else if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email pour accéder à la démo. Vérifiez votre boîte de réception.');
        } else {
          throw signInError;
        }
      }

      // Marquer le mode démo
      localStorage.setItem(DEMO_MODE_KEY, 'true');

      // Ensure user setup is complete
      await handlePostAuthSetup();

      setState(prev => ({ ...prev, isDemoMode: true, isLoggingIn: false }));

      // Redirection vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      setState(prev => ({
        ...prev,
        isLoggingIn: false,
        error: err instanceof Error ? err.message : 'Erreur de connexion démo',
      }));
    }
  }, [navigate]);

  // Quitter le mode démo
  const exitDemoMode = useCallback(async () => {
    localStorage.removeItem(DEMO_MODE_KEY);
    await supabase.auth.signOut();
    setState({ isDemoMode: false, isLoggingIn: false, error: null });
    navigate('/login');
  }, [navigate]);

  // Vérifier si l'utilisateur actuel est en mode démo
  const checkIsDemoUser = useCallback(async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === DEMO_CREDENTIALS.email;
  }, []);

  return {
    ...state,
    loginAsDemo,
    exitDemoMode,
    checkIsDemoUser,
    demoCredentials: DEMO_CREDENTIALS,
  };
}

// Hook pour vérifier simplement si on est en mode démo
export function useIsDemoMode(): boolean {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkDemo = async () => {
      const demoMode = localStorage.getItem(DEMO_MODE_KEY);
      const { data: { user } } = await supabase.auth.getUser();
      setIsDemoMode(demoMode === 'true' && user?.email === DEMO_CREDENTIALS.email);
    };

    checkDemo();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkDemo();
    });

    return () => subscription.unsubscribe();
  }, []);

  return isDemoMode;
}
