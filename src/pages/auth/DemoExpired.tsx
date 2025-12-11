import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Zap, Building2, Users, HardDrive, Check } from 'lucide-react';

const UPGRADE_PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    price: '199',
    period: 'mois',
    description: 'Parfait pour débuter',
    features: [
      { icon: Building2, text: '3 projets' },
      { icon: Users, text: '5 utilisateurs' },
      { icon: HardDrive, text: '10 GB stockage' },
    ],
    popular: false,
  },
  {
    name: 'Professional',
    slug: 'professional',
    price: '499',
    period: 'mois',
    description: 'Pour les promoteurs actifs',
    features: [
      { icon: Building2, text: '15 projets' },
      { icon: Users, text: '25 utilisateurs' },
      { icon: HardDrive, text: '50 GB stockage' },
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    price: '999',
    period: 'mois',
    description: 'Solution complète',
    features: [
      { icon: Building2, text: 'Projets illimités' },
      { icon: Users, text: 'Utilisateurs illimités' },
      { icon: HardDrive, text: '200 GB stockage' },
    ],
    popular: false,
  },
];

export function DemoExpired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Clock className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Votre période d'essai est terminée
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Merci d'avoir testé RealPro ! Pour continuer à utiliser toutes les fonctionnalités
            et accéder à vos données, choisissez un plan adapté à vos besoins.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {UPGRADE_PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border ${
                plan.popular
                  ? 'border-brand-500 shadow-xl shadow-brand-500/20 scale-105'
                  : 'border-neutral-200 dark:border-neutral-800'
              } p-6 transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-brand-600 text-white text-sm font-medium">
                    Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {plan.price}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to={`/auth/checkout?plan=${plan.slug}&cycle=MONTHLY`}
                className={`w-full h-11 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Choisir ce plan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Avantages de la mise à niveau */}
        <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Pourquoi passer à un plan payant ?
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Débloquez tout le potentiel de RealPro
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Accès illimité à vos données',
              'Création de plusieurs projets',
              'Invitation d\'équipe complète',
              'Support prioritaire',
              'Exports PDF avancés',
              'Intégrations API',
              'Stockage étendu',
              'Mises à jour régulières',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="text-center space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Des questions ? Contactez-nous à{' '}
            <a
              href="mailto:support@realpro.ch"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              support@realpro.ch
            </a>
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Retour à la connexion
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <Link
              to="/"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
