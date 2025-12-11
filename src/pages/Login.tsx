import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { RealProLogo } from '../components/branding/RealProLogo';
import { ArrowRight, Sparkles, Play, CheckCircle } from 'lucide-react';
import { useDemoMode, DEMO_CREDENTIALS } from '../hooks/useDemoMode';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { loginAsDemo, isLoggingIn: isDemoLoading, error: demoError } = useDemoMode();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: '',
              last_name: '',
            },
          },
        });
        if (signUpError) throw signUpError;

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation is required
          setSuccessMessage(
            'Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l\'email pour activer votre compte, puis vous pourrez vous connecter.'
          );
          setIsSignUp(false);
        } else if (data.session) {
          // No email confirmation required, user is logged in
          navigate('/dashboard');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          // Provide clearer error messages in French
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Email ou mot de passe incorrect');
          } else if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
          }
          throw signInError;
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-8">
            <RealProLogo size="2xl" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            {isSignUp ? 'Créer un compte' : 'Bienvenue sur RealPro'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {isSignUp ? 'Commencez votre essai gratuit de 14 jours' : 'Gérez vos projets immobiliers en toute simplicité'}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email professionnel
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 active:from-brand-800 active:to-brand-900 text-white font-medium shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignUp ? "Créer mon compte" : 'Se connecter'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
            >
              {isSignUp
                ? 'Vous avez déjà un compte? Se connecter'
                : "Pas encore de compte? S'inscrire"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm text-emerald-900 dark:text-emerald-200 font-semibold">
                  Accès Démonstration
                </p>
              </div>

              {/* Liste des fonctionnalités disponibles */}
              <div className="mb-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Toutes les fonctionnalités débloquées</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Création de projets illimitée</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Projet de démonstration pré-configuré</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Gestion complète: lots, acheteurs, factures</span>
                </div>
              </div>

              {/* Bouton d'accès rapide à la démo */}
              <button
                type="button"
                onClick={loginAsDemo}
                disabled={isDemoLoading || loading}
                className="group w-full h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white font-medium shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isDemoLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Essayer la démo gratuitement
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {demoError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center">
                  {demoError}
                </p>
              )}

              {/* Identifiants alternatifs */}
              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/30">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center mb-1">
                  Ou connectez-vous manuellement:
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center">
                  <span className="font-mono">{DEMO_CREDENTIALS.email}</span> / <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-8 flex items-center justify-center gap-1.5">
          © 2024-2025 Realpro SA. Tous droits réservés.
          <span className="text-red-500">🇨🇭</span>
        </p>
      </div>
    </div>
  );
}
