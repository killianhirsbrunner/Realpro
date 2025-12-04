import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { useI18n } from '../lib/i18n';

export function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de l\'envoi de l\'email'
      );
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
            Mot de passe oublié
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
          {success ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Email envoyé !
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Vérifiez votre boîte de réception. Un email avec les instructions pour réinitialiser votre mot de passe vient d'être envoyé à <strong className="text-neutral-900 dark:text-white">{email}</strong>.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Adresse email
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-8">
          © {new Date().getFullYear()} Realpro SA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
