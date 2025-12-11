import { Link } from 'react-router-dom';
import { Check, ArrowRight, Building2, Clock, Sparkles } from 'lucide-react';

export function DemoSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md text-center">
        {/* Animation de succès */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-green-400/20 animate-ping" />
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Votre compte démo est prêt !
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Bienvenue sur RealPro. Commencez à explorer dès maintenant.
        </p>

        {/* Rappel des avantages */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Votre accès démo comprend</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">14 jours d'accès</p>
                <p className="text-sm text-neutral-500">Explorez sans limite de temps quotidienne</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">1 projet de démonstration</p>
                <p className="text-sm text-neutral-500">Créez et gérez votre premier projet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Toutes les fonctionnalités</p>
                <p className="text-sm text-neutral-500">CRM, finance, documents, planning...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Note email */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Un email de confirmation a été envoyé à votre adresse.
            Veuillez vérifier votre boîte de réception pour activer votre compte.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/login"
            className="group w-full h-12 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-medium shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            Se connecter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/"
            className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
