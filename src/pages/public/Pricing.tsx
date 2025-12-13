import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import { Check, ArrowRight, Sparkles, Building2, Home, Briefcase } from 'lucide-react';

type AppId = 'ppe-admin' | 'regie' | 'promoteur' | 'suite';

const apps = [
  {
    id: 'suite' as AppId,
    name: 'Suite Complète',
    icon: Sparkles,
    color: 'from-realpro-turquoise to-teal-600',
    bgColor: 'bg-realpro-turquoise',
    lightBg: 'bg-realpro-turquoise/10',
    textColor: 'text-realpro-turquoise',
  },
  {
    id: 'ppe-admin' as AppId,
    name: 'PPE Admin',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'regie' as AppId,
    name: 'Régie',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'promoteur' as AppId,
    name: 'Promoteur',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
];

const pricingData: Record<AppId, {
  description: string;
  plans: {
    name: string;
    slug: string;
    price: number;
    unit: string;
    description: string;
    features: string[];
    highlighted: boolean;
    badge: string | null;
  }[];
}> = {
  'suite': {
    description: 'Accédez aux 3 applications avec un tarif préférentiel',
    plans: [
      {
        name: 'Suite Starter',
        slug: 'suite-starter',
        price: 449,
        unit: '/mois',
        description: 'Pour les petites structures multi-activités',
        features: [
          'Accès aux 3 applications',
          'Jusqu\'à 50 unités/lots/projets',
          '10 utilisateurs inclus',
          'Stockage 50 Go',
          'Support email 48h',
          'Mises à jour incluses',
        ],
        highlighted: false,
        badge: null,
      },
      {
        name: 'Suite Professional',
        slug: 'suite-professional',
        price: 899,
        unit: '/mois',
        description: 'Pour les entreprises en croissance',
        features: [
          'Accès aux 3 applications',
          'Unités/lots/projets illimités',
          'Utilisateurs illimités',
          'Stockage illimité',
          'API REST complète',
          'Branding personnalisé',
          'Support prioritaire 24h',
          'Formation incluse',
        ],
        highlighted: true,
        badge: 'Meilleur rapport qualité-prix',
      },
      {
        name: 'Suite Enterprise',
        slug: 'suite-enterprise',
        price: 1499,
        unit: '/mois',
        description: 'Pour les groupes immobiliers',
        features: [
          'Tout Suite Professional',
          'Multi-organisations',
          'SSO & SAML',
          'API GraphQL',
          'White-label complet',
          'Success manager dédié',
          'Support 24/7 téléphone',
          'SLA 99.9% garanti',
          'Formation sur site',
        ],
        highlighted: false,
        badge: null,
      },
    ],
  },
  'ppe-admin': {
    description: 'Gestion complète de copropriétés PPE',
    plans: [
      {
        name: 'Starter',
        slug: 'ppe-starter',
        price: 149,
        unit: '/mois',
        description: 'Jusqu\'à 10 immeubles',
        features: [
          'Jusqu\'à 10 immeubles',
          'Gestion des copropriétaires',
          'Assemblées générales',
          'Budgets & charges CFC',
          'Documents & PV',
          '5 utilisateurs',
          'Support email',
        ],
        highlighted: false,
        badge: null,
      },
      {
        name: 'Professional',
        slug: 'ppe-professional',
        price: 299,
        unit: '/mois',
        description: 'Jusqu\'à 50 immeubles',
        features: [
          'Jusqu\'à 50 immeubles',
          'Tout Starter inclus',
          'Votes électroniques',
          'Portail copropriétaire',
          'Fonds de rénovation',
          'Tickets & interventions',
          'Utilisateurs illimités',
          'Support prioritaire',
        ],
        highlighted: true,
        badge: 'Le plus populaire',
      },
      {
        name: 'Enterprise',
        slug: 'ppe-enterprise',
        price: 499,
        unit: '/mois',
        description: 'Immeubles illimités',
        features: [
          'Immeubles illimités',
          'Tout Professional inclus',
          'Multi-cabinets',
          'API & intégrations',
          'Comptabilité avancée',
          'Rapports personnalisés',
          'Success manager',
          'SLA garanti',
        ],
        highlighted: false,
        badge: null,
      },
    ],
  },
  'regie': {
    description: 'Gestion locative pour régies immobilières',
    plans: [
      {
        name: 'Starter',
        slug: 'regie-starter',
        price: 179,
        unit: '/mois',
        description: 'Jusqu\'à 100 baux',
        features: [
          'Jusqu\'à 100 baux actifs',
          'Gestion des locataires',
          'Encaissements & rappels',
          'États des lieux basiques',
          'Documents & baux',
          '5 utilisateurs',
          'Support email',
        ],
        highlighted: false,
        badge: null,
      },
      {
        name: 'Professional',
        slug: 'regie-professional',
        price: 349,
        unit: '/mois',
        description: 'Jusqu\'à 500 baux',
        features: [
          'Jusqu\'à 500 baux actifs',
          'Tout Starter inclus',
          'États des lieux digitaux',
          'Portail locataire',
          'Maintenance technique',
          'Mandats propriétaires',
          'Utilisateurs illimités',
          'Support prioritaire',
        ],
        highlighted: true,
        badge: 'Le plus populaire',
      },
      {
        name: 'Enterprise',
        slug: 'regie-enterprise',
        price: 599,
        unit: '/mois',
        description: 'Baux illimités',
        features: [
          'Baux illimités',
          'Tout Professional inclus',
          'Multi-agences',
          'API & intégrations',
          'Comptabilité mandants',
          'BI & analytics',
          'Success manager',
          'SLA garanti',
        ],
        highlighted: false,
        badge: null,
      },
    ],
  },
  'promoteur': {
    description: 'Pilotage de projets de promotion immobilière',
    plans: [
      {
        name: 'Starter',
        slug: 'promoteur-starter',
        price: 199,
        unit: '/mois',
        description: 'Jusqu\'à 2 projets',
        features: [
          'Jusqu\'à 2 projets actifs',
          'Pipeline de ventes',
          'CRM acquéreurs',
          'Documents projets',
          'Planning basique',
          '10 utilisateurs',
          'Support email',
        ],
        highlighted: false,
        badge: null,
      },
      {
        name: 'Professional',
        slug: 'promoteur-professional',
        price: 449,
        unit: '/mois',
        description: 'Jusqu\'à 5 projets',
        features: [
          'Jusqu\'à 5 projets actifs',
          'Tout Starter inclus',
          'Suivi de chantier',
          'Finance & CFC',
          'Portail acquéreur',
          'Choix matériaux',
          'Utilisateurs illimités',
          'Support prioritaire',
        ],
        highlighted: true,
        badge: 'Le plus populaire',
      },
      {
        name: 'Enterprise',
        slug: 'promoteur-enterprise',
        price: 799,
        unit: '/mois',
        description: 'Projets illimités',
        features: [
          'Projets illimités',
          'Tout Professional inclus',
          'Multi-promotions',
          'Intégration notaire',
          'Soumissions avancées',
          'BI & rapports',
          'Success manager',
          'SLA garanti',
        ],
        highlighted: false,
        badge: null,
      },
    ],
  },
};

export function Pricing() {
  const [selectedApp, setSelectedApp] = useState<AppId>('suite');
  const currentApp = apps.find(a => a.id === selectedApp)!;
  const currentPricing = pricingData[selectedApp];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      {/* Hero */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpro-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-xs font-semibold mb-6 border border-realpro-turquoise/20">
              <Sparkles className="w-3.5 h-3.5" />
              14 jours d'essai gratuit
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
              Tarifs <span className="text-realpro-turquoise">simples et transparents</span>
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12">
              Choisissez l'application qui correspond à votre activité ou optez pour la suite complète.
            </p>

            {/* App Selector */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedApp === app.id
                      ? `bg-white dark:bg-neutral-900 shadow-md ${app.textColor}`
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <app.icon className="w-4 h-4" />
                  {app.name}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
              {currentPricing.description}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {currentPricing.plans.map((plan) => (
              <ScrollReveal key={plan.slug}>
                <div className={`relative p-8 rounded-2xl border transition-all duration-500 hover:shadow-2xl h-full flex flex-col ${
                  plan.highlighted
                    ? `border-2 ${currentApp.id === 'suite' ? 'border-realpro-turquoise' : currentApp.id === 'ppe-admin' ? 'border-blue-500' : currentApp.id === 'regie' ? 'border-emerald-500' : 'border-purple-500'} bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 shadow-xl scale-105`
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:-translate-y-2'
                }`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className={`px-3 py-1 rounded-full ${currentApp.bgColor} text-white text-xs font-semibold shadow-lg whitespace-nowrap`}>
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-5xl font-bold ${currentApp.textColor}`}>
                        CHF {plan.price}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400 text-lg">
                        {plan.unit}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Facturation mensuelle ou annuelle (-17%)
                    </p>
                  </div>

                  <Link to={`/register?plan=${plan.slug}`} className="block mb-6">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? `${currentApp.bgColor} hover:opacity-90 text-white border-0 shadow-lg`
                          : ''
                      }`}
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      size="lg"
                    >
                      Commencer l'essai
                    </Button>
                  </Link>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full ${currentApp.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison hint */}
      {selectedApp !== 'suite' && (
        <section className="py-12 bg-gradient-to-r from-realpro-turquoise/5 via-realpro-turquoise/10 to-realpro-turquoise/5 dark:from-realpro-turquoise/10 dark:via-realpro-turquoise/5 dark:to-realpro-turquoise/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              Vous utilisez plusieurs de nos applications ?
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedApp('suite')}
              className="border-realpro-turquoise text-realpro-turquoise hover:bg-realpro-turquoise hover:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Découvrir la Suite Complète et économiser
            </Button>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
              Questions fréquentes
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur nos plans et notre facturation
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Puis-je changer d\'application ou de plan ?',
                  a: 'Oui, à tout moment. Les upgrades sont immédiats avec prorata. Les downgrades prennent effet à la fin du cycle de facturation.',
                },
                {
                  q: 'Comment fonctionne l\'essai gratuit ?',
                  a: '14 jours d\'essai gratuit sur tous les plans, sans carte bancaire. Accès à toutes les fonctionnalités du plan choisi.',
                },
                {
                  q: 'Puis-je combiner plusieurs applications ?',
                  a: 'Oui ! La Suite Complète vous donne accès aux 3 applications avec un tarif préférentiel par rapport aux achats séparés.',
                },
                {
                  q: 'Où sont hébergées mes données ?',
                  a: '100% en Suisse, dans des datacenters certifiés ISO 27001. Conformité RGPD et LPD garantie.',
                },
                {
                  q: 'Quels moyens de paiement acceptez-vous ?',
                  a: 'Cartes de crédit, TWINT, Postfinance. Virement bancaire disponible pour les paiements annuels.',
                },
                {
                  q: 'Les prix sont-ils HT ou TTC ?',
                  a: 'Tous les prix sont HT. La TVA suisse (8.1%) est ajoutée automatiquement pour les entreprises suisses.',
                },
              ].map((faq, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                    <span className="text-realpro-turquoise mt-1">●</span>
                    {faq.q}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Besoin d'un plan personnalisé ?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Pour les grandes organisations, contactez-nous pour un devis sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white">
                Contacter l'équipe commerciale
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/apps">
              <Button size="lg" variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800">
                Voir les applications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
