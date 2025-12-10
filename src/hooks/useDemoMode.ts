import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
            throw signUpError;
          }

          // Tentative de connexion après création
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
          });

          if (retryError) {
            throw retryError;
          }
        } else {
          throw signInError;
        }
      }

      // Marquer le mode démo
      localStorage.setItem(DEMO_MODE_KEY, 'true');
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
