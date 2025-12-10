import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles, Check, Shield, Zap } from 'lucide-react';

export function LoginEnhanced() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <Link to="/" className="inline-block mb-8">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">RealPro</span>
            </Link>

            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">
              Bienvenue sur RealPro
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 dark:text-white">
                    Mot de passe
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Se connecter
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Vous n'avez pas de compte ?{' '}
                <Link to="/auth/register" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                  Créer un compte gratuitement
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-600" />
              Sécurisé SSL
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-600" />
              Données en Suisse
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Visual with Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
            alt="Professional team"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-brand-700/90 to-brand-800/90" />
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-8 border border-white/30">
            <Sparkles className="w-3.5 h-3.5" />
            Plateforme #1 en Suisse
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Gérez vos promotions immobilières comme jamais auparavant
          </h2>

          <p className="text-lg text-brand-50 mb-8 leading-relaxed">
            Plus de 50 promoteurs suisses nous font confiance pour piloter leurs projets du début à la remise des clés.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Sécurité maximale</h4>
                <p className="text-sm text-brand-50">Hébergement en Suisse avec chiffrement de bout en bout</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Performance optimale</h4>
                <p className="text-sm text-brand-50">Interface rapide et intuitive, même sur mobile</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Support expert</h4>
                <p className="text-sm text-brand-50">Équipe dédiée disponible pour vous accompagner</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20 flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Plus de 200 utilisateurs actifs</p>
              <p className="text-brand-50">rejoignent RealPro chaque mois</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
