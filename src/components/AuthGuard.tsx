import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { handlePostAuthSetup } from '../lib/authHelpers';
import { RealProLogo } from './branding/RealProLogo';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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

  if (loading) {
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

  return <>{children}</>;
}
