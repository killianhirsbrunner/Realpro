import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { handlePostAuthSetup } from '../lib/authHelpers';
import { RealProLogo } from './branding/RealProLogo';
import { useCanAccessApp } from '../hooks/useTrialStatus';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Skip trial check for certain pages like billing */
  skipTrialCheck?: boolean;
}

export function AuthGuard({ children, skipTrialCheck = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { canAccess, loading: trialLoading } = useCanAccessApp();

  // Pages that should bypass trial check
  const bypassTrialCheckPaths = [
    '/billing',
    '/auth/checkout',
    '/auth/choose-plan',
    '/auth/trial-expired',
    '/settings',
  ];

  const shouldBypassTrialCheck = skipTrialCheck ||
    bypassTrialCheckPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthenticated(!!session);
      if (session) {
        // Ensure user setup is complete when auth state changes
        await handlePostAuthSetup();
      } else {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Check trial expiration and redirect if needed
  useEffect(() => {
    if (!trialLoading && authenticated && !shouldBypassTrialCheck && !canAccess) {
      navigate('/auth/trial-expired');
    }
  }, [canAccess, trialLoading, authenticated, shouldBypassTrialCheck, navigate]);

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Ensure user setup is complete
      await handlePostAuthSetup();
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/login');
    }

    setLoading(false);
  }

  if (loading || trialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <RealProLogo variant="full" size="lg" />
            </Link>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DAABD] mx-auto" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // Block access if trial expired (unless on bypass pages)
  if (!shouldBypassTrialCheck && !canAccess) {
    return null;
  }

  return <>{children}</>;
}
