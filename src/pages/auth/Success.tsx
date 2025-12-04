import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function Success() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <Link to="/" className="inline-block mb-8 transition-opacity hover:opacity-80">
          <RealProLogo width={140} height={42} />
        </Link>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Bienvenue sur RealPro ! 🎉
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto">
            Votre compte a été créé avec succès. Vous pouvez maintenant commencer à gérer vos projets immobiliers.
          </p>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-8">
            <p className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
              Votre essai gratuit a commencé
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Vous avez accès à toutes les fonctionnalités pendant 14 jours. Aucune carte bancaire requise.
            </p>
          </div>

          <div className="space-y-3 text-left max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Pour commencer :
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Créez votre premier projet
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Ajoutez les informations de base de votre projet immobilier
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Invitez votre équipe
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Collaborez avec vos collègues et partenaires
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Explorez les modules
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Découvrez tous les outils à votre disposition
                </p>
              </div>
            </div>
          </div>

          <Link to="/dashboard">
            <Button size="lg" className="gap-2 px-8 py-6 text-lg">
              Accéder au Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-6">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href="mailto:support@realpro.ch" className="text-primary-600 dark:text-primary-400 hover:underline">
            support@realpro.ch
          </a>
        </p>
      </div>
    </div>
  );
}
