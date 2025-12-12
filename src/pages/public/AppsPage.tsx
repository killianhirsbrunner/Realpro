import { Link } from 'react-router-dom';
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
  Calendar,
  Calculator,
  FileText,
  Wrench,
  Key,
  Receipt,
  LogIn,
  Wallet,
  TrendingUp,
  HardHat,
  DollarSign,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

const apps = [
  {
    id: 'ppe-admin',
    name: 'PPE Admin',
    tagline: 'Administration de copropriétés',
    description: 'La solution complète pour les administrateurs de biens en PPE. Gérez efficacement vos immeubles en copropriété : assemblées générales, budgets CFC, charges, fonds de rénovation, documents et communication avec les copropriétaires.',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    href: '/app/ppe-admin',
    features: [
      { icon: Users, label: 'Gestion des copropriétaires', description: 'Registre complet avec quotes-parts et coordonnées' },
      { icon: Calendar, label: 'Assemblées générales', description: 'Convocations, PV et votes en ligne' },
      { icon: Calculator, label: 'Budget & charges CFC', description: 'Budgets prévisionnels et décomptes annuels' },
      { icon: FileText, label: 'GED documentaire', description: 'Stockage et partage de documents sécurisé' },
      { icon: Wrench, label: 'Tickets & interventions', description: 'Suivi des demandes et travaux' },
    ],
    benefits: ['Conformité légale suisse', 'Votes électroniques sécurisés', 'Portail copropriétaire'],
    stats: { value: '500+', label: 'immeubles gérés' },
  },
  {
    id: 'regie',
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    description: 'Pilotez votre parc locatif de A à Z. Une application conçue pour les régies et gérants immobiliers : baux, encaissements automatiques, états des lieux numériques, maintenance technique et relation avec les propriétaires mandants.',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    href: '/app/regie',
    features: [
      { icon: Key, label: 'Gestion des baux', description: 'Création, renouvellement et résiliation' },
      { icon: Receipt, label: 'Encaissements & rappels', description: 'Automatisation des loyers et relances' },
      { icon: LogIn, label: 'États des lieux', description: 'Formulaires numériques avec photos' },
      { icon: Wrench, label: 'Maintenance technique', description: 'Gestion des interventions et prestataires' },
      { icon: Wallet, label: 'Mandats propriétaires', description: 'Reporting et versements automatiques' },
    ],
    benefits: ['Réduction des impayés', 'États des lieux digitaux', 'Portail locataire'],
    stats: { value: '2,000+', label: 'baux actifs' },
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    description: 'Centralisez tous vos projets de promotion immobilière. De la commercialisation à la livraison : pipeline de ventes, suivi des acquéreurs, coordination chantier, finances CFC et documentation projet.',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800',
    href: '/app/promoteur',
    features: [
      { icon: TrendingUp, label: 'Pipeline de ventes', description: 'Suivi des prospects et conversions' },
      { icon: HardHat, label: 'Suivi de chantier', description: 'Planning, jalons et avancement' },
      { icon: DollarSign, label: 'Finances & CFC', description: 'Budget, facturation et trésorerie' },
      { icon: FileCheck, label: 'Documents projets', description: 'GED par projet et par lot' },
      { icon: Users, label: 'CRM acquéreurs', description: 'Relation client et réservations' },
    ],
    benefits: ['Vision multi-projets', 'Intégration notaire', 'Portail acquéreur'],
    stats: { value: '200+', label: 'projets livrés' },
  },
];

export function AppsPage() {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
              Nos applications
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Trois solutions métier indépendantes, conçues pour les professionnels suisses de l'immobilier.
              Choisissez celle qui correspond à votre activité.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-16 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
          {apps.map((app, index) => (
            <ScrollReveal key={app.id}>
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${app.lightBg} ${app.textColor} text-sm font-medium mb-4`}>
                    <app.icon className="w-4 h-4" />
                    {app.name}
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                    {app.tagline}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg">
                    {app.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {app.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg ${app.lightBg} flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className={`w-5 h-5 ${app.textColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {feature.label}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {app.benefits.map((benefit, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm">
                        <Check className={`w-3.5 h-3.5 ${app.textColor}`} />
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <Link to={app.href}>
                      <Button size="lg" className={`${app.bgColor} hover:opacity-90 text-white border-0`}>
                        Accéder à {app.name}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="lg" variant="outline">
                        Demander une démo
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-10 rounded-3xl blur-2xl`} />
                  <div className={`relative bg-gradient-to-br ${app.color} rounded-2xl p-8 lg:p-12`}>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden">
                      {/* Browser Header */}
                      <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="px-4 py-1 bg-white dark:bg-neutral-700 rounded-md text-xs text-neutral-500">
                            app.realpro.ch/{app.id}
                          </div>
                        </div>
                      </div>

                      {/* App Preview */}
                      <div className="p-6 bg-neutral-50 dark:bg-neutral-950">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-12 h-12 rounded-xl ${app.lightBg} flex items-center justify-center`}>
                            <app.icon className={`w-6 h-6 ${app.textColor}`} />
                          </div>
                          <div className={`px-3 py-1 rounded-full ${app.lightBg} ${app.textColor} text-sm font-bold`}>
                            {app.stats.value}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {app.features.slice(0, 4).map((feature, i) => (
                            <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                              <feature.icon className={`w-5 h-5 ${app.textColor} mb-2`} />
                              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                                {feature.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Essayez gratuitement pendant 14 jours, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white">
                Démarrer l'essai gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
