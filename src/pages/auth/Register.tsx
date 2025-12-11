import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company
          }
        }
      });

      if (authError) throw authError;

      // Le trigger handle_new_user() crée automatiquement l'utilisateur dans public.users,
      // l'organisation et les rôles. Pas besoin d'insertion manuelle.
      if (authData.user) {
        if (preselectedPlan) {
          navigate(`/auth/choose-plan?preselected=${preselectedPlan}`);
        } else {
          navigate('/auth/choose-plan');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Créer votre compte
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Commencez votre essai gratuit de 14 jours
          </p>
        </div>

        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Prénom
                </label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Jean"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nom
                </label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Dupont"
                  disabled={loading}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Entreprise
              </label>
              <Input
                required
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
                placeholder="Promotions SA"
                disabled={loading}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email professionnel
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="jean.dupont@entreprise.ch"
                disabled={loading}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mot de passe
              </label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11 rounded-xl"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1.5">
                Minimum 8 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                required
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11 rounded-xl"
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
                  Créer mon compte
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-start gap-6 text-xs text-neutral-500 dark:text-neutral-500 pt-2">
              <span className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>14 jours d'essai gratuit</span>
              </span>
              <span className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Sans carte bancaire</span>
              </span>
              <span className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Sans engagement</span>
              </span>
            </div>

            <p className="text-xs text-center text-neutral-600 dark:text-neutral-400 pt-2">
              En créant un compte, vous acceptez nos{' '}
              <Link to="/legal/cgu" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                CGU
              </Link>{' '}
              et notre{' '}
              <Link to="/legal/privacy" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                politique de confidentialité
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
