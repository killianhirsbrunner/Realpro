import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert('Compte créé! Vous pouvez maintenant vous connecter.');
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-950 dark:via-primary-950/20 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
            Realpro Suite
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {isSignUp ? 'Créer un compte' : 'Connexion à votre espace'}
          </p>
        </div>

        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full h-11 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-150"
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
                className="w-full h-11 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? 'Chargement...' : isSignUp ? "S'inscrire" : 'Se connecter'}
            </button>
          </form>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              {isSignUp
                ? 'Déjà un compte? Se connecter'
                : "Pas de compte? S'inscrire"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-primary-50/50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 rounded-lg">
              <p className="text-xs text-primary-900 dark:text-primary-200 font-medium mb-2">
                Compte de test:
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300">Email: demo@realpro.ch</p>
              <p className="text-xs text-primary-700 dark:text-primary-300">Mot de passe: demo123456</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-8">
          © 2024 Realpro SA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
