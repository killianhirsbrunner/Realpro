import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import {
  Building2,
  Home,
  Briefcase,
  ArrowRight,
  Check,
  Users,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

const apps = [
  {
    id: 'ppe-admin',
    name: 'PPE Admin',
    tagline: 'Administration de copropriétés',
    description: 'La solution complète pour les administrateurs de biens en PPE. Gérez efficacement vos immeubles en copropriété.',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-700',
    lightBg: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-300 dark:border-blue-700',
    ringColor: 'ring-blue-500',
    features: [
      'Gestion des copropriétaires',
      'Assemblées générales & votes',
      'Budget & charges CFC',
      'Fonds de rénovation',
      'Tickets & interventions',
      'Portail copropriétaire',
    ],
    pricing: {
      monthly: 349,
      yearly: 2990,
      perUnit: 'par immeuble/mois',
    },
  },
  {
    id: 'regie',
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    description: 'Pilotez votre parc locatif de A à Z. Une application conçue pour les régies et gérants immobiliers.',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-700',
    lightBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    ringColor: 'ring-emerald-500',
    features: [
      'Gestion des baux',
      'Encaissements automatiques',
      'États des lieux numériques',
      'Maintenance technique',
      'Rappels & relances',
      'Portail locataire',
    ],
    pricing: {
      monthly: 249,
      yearly: 2090,
      perUnit: 'par 50 biens/mois',
    },
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    description: 'Centralisez tous vos projets de promotion immobilière. De la commercialisation à la livraison.',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-600',
    hoverBg: 'hover:bg-purple-700',
    lightBg: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-300 dark:border-purple-700',
    ringColor: 'ring-purple-500',
    features: [
      'Pipeline de ventes',
      'Suivi de chantier',
      'Finances & CFC',
      'CRM acquéreurs',
      'Documents projets',
      'Portail acquéreur',
    ],
    pricing: {
      monthly: 490,
      yearly: 4190,
      perUnit: 'par projet/mois',
    },
  },
];

export function AppsPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const navigate = useNavigate();

  const handleSelectApp = (appId: string) => {
    setSelectedApp(appId);
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (appId: string) => {
    navigate(`/register?app=${appId}&period=${billingPeriod}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 text-realpro-turquoise font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Choisissez votre solution
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
              Une app pour chaque métier
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-10">
              Trois solutions métier indépendantes, conçues pour les professionnels suisses de l'immobilier.
              Sélectionnez celle qui correspond à votre activité.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1.5 shadow-inner">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Annuel
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  -30%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* App Selection Cards */}
      <section className="py-12 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app) => (
              <ScrollReveal key={app.id}>
                <div
                  onClick={() => handleSelectApp(app.id)}
                  className={`relative bg-white dark:bg-neutral-900 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group ${
                    selectedApp === app.id
                      ? `${app.borderColor} ring-2 ${app.ringColor} shadow-xl`
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${app.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <app.icon className="w-7 h-7 text-white" />
                      </div>
                      {selectedApp === app.id && (
                        <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium">
                          Sélectionné
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{app.name}</h3>
                    <p className="text-white/90">{app.tagline}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                      {app.description}
                    </p>

                    <ul className="space-y-3 mb-6">
                      {app.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <div className={`w-5 h-5 rounded-full ${app.lightBg} flex items-center justify-center flex-shrink-0`}>
                            <Check className={`w-3 h-3 ${app.textColor}`} />
                          </div>
                          <span className="text-neutral-700 dark:text-neutral-200">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">dès</span>
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                          CHF {billingPeriod === 'yearly' ? Math.round(app.pricing.yearly / 12) : app.pricing.monthly}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400">/mois</span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{app.pricing.perUnit}</p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(app.id);
                        }}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${app.bgColor} ${app.hoverBg} transition-colors flex items-center justify-center gap-2`}
                      >
                        Commencer avec {app.name}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="pricing-section" className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-realpro-turquoise" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Essai gratuit 14 jours</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Testez toutes les fonctionnalités sans engagement ni carte bancaire.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-realpro-turquoise" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Données sécurisées</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Hébergement en Suisse, conformité RGPD et chiffrement de bout en bout.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-realpro-turquoise" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Support dédié</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Accompagnement personnalisé et formation incluse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre gestion immobilière ?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            Rejoignez les professionnels suisses qui ont déjà adopté RealPro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white font-medium">
                Démarrer l'essai gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-neutral-500 text-white bg-transparent hover:bg-white/10 hover:border-white"
              >
                Demander une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
