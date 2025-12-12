import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import {
  Building2,
  Home,
  Briefcase,
  Users,
  Calendar,
  Calculator,
  FileText,
  Wrench,
  Vote,
  Key,
  Receipt,
  LogIn,
  Wallet,
  TrendingUp,
  HardHat,
  DollarSign,
  FileCheck,
  Package,
  Shield,
  Cloud,
  Zap,
  Globe,
  Lock,
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

type AppId = 'ppe-admin' | 'regie' | 'promoteur';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const apps = [
  {
    id: 'ppe-admin' as AppId,
    name: 'PPE Admin',
    tagline: 'Administration de copropriétés',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500',
  },
  {
    id: 'regie' as AppId,
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500',
  },
  {
    id: 'promoteur' as AppId,
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500',
  },
];

const featuresData: Record<AppId, Feature[]> = {
  'ppe-admin': [
    {
      icon: Users,
      title: 'Registre des copropriétaires',
      description: 'Gestion complète des propriétaires avec quotes-parts, coordonnées, historique des mutations et documents personnels.',
    },
    {
      icon: Calendar,
      title: 'Assemblées générales',
      description: 'Convocations automatisées, ordre du jour, procès-verbaux et suivi des décisions. Votes électroniques sécurisés en option.',
    },
    {
      icon: Vote,
      title: 'Votes électroniques',
      description: 'Système de vote en ligne sécurisé pour les décisions entre assemblées. Traçabilité complète et conformité légale suisse.',
    },
    {
      icon: Calculator,
      title: 'Budget & charges CFC',
      description: 'Budgets prévisionnels selon le Code des Frais de Construction. Répartition automatique des charges par millièmes.',
    },
    {
      icon: Wallet,
      title: 'Fonds de rénovation',
      description: 'Gestion du fonds de rénovation obligatoire : alimentation, suivi des travaux, projections à long terme.',
    },
    {
      icon: FileText,
      title: 'GED documentaire',
      description: 'Stockage sécurisé des règlements, contrats, plans et PV. Partage contrôlé via le portail copropriétaire.',
    },
    {
      icon: Wrench,
      title: 'Tickets & interventions',
      description: 'Gestion des demandes de maintenance, suivi des interventions et historique par lot et parties communes.',
    },
    {
      icon: BarChart3,
      title: 'Portail copropriétaire',
      description: 'Espace personnel pour chaque copropriétaire : documents, comptabilité, tickets et communication directe.',
    },
  ],
  'regie': [
    {
      icon: Key,
      title: 'Gestion des baux',
      description: 'Création, modification et résiliation des contrats de bail. Gestion des avenants, renouvellements et indexations.',
    },
    {
      icon: Receipt,
      title: 'Encaissements automatiques',
      description: 'Prélèvements LSV/DD, suivi des paiements, génération automatique des rappels et mise en demeure.',
    },
    {
      icon: LogIn,
      title: 'États des lieux digitaux',
      description: 'Formulaires interactifs avec photos annotées, comparatif entrée/sortie et génération automatique du décompte.',
    },
    {
      icon: Users,
      title: 'Dossiers locataires',
      description: 'Centralisation des informations locataires : documents, garanties, historique des paiements et communications.',
    },
    {
      icon: Wrench,
      title: 'Maintenance technique',
      description: 'Gestion des demandes d\'intervention, réseau de prestataires et suivi des travaux par bien.',
    },
    {
      icon: Wallet,
      title: 'Mandats propriétaires',
      description: 'Comptabilité par mandat, décomptes de charges, versements automatiques et reporting personnalisé.',
    },
    {
      icon: Calculator,
      title: 'Décomptes de charges',
      description: 'Calcul et répartition des charges locatives, frais accessoires et provisions pour charges.',
    },
    {
      icon: BarChart3,
      title: 'Portail locataire',
      description: 'Espace en ligne pour les locataires : documents, paiements, demandes d\'intervention et communication.',
    },
  ],
  'promoteur': [
    {
      icon: TrendingUp,
      title: 'Pipeline de ventes',
      description: 'Suivi commercial complet : prospects, visites, réservations, compromis et actes notariés. Tableau de bord en temps réel.',
    },
    {
      icon: Users,
      title: 'CRM acquéreurs',
      description: 'Gestion de la relation client de A à Z : historique des échanges, préférences, documents et suivi personnalisé.',
    },
    {
      icon: HardHat,
      title: 'Suivi de chantier',
      description: 'Planning Gantt, jalons, avancement par lot, journal de chantier photo et coordination des intervenants.',
    },
    {
      icon: DollarSign,
      title: 'Finance & CFC',
      description: 'Budget de promotion, suivi des dépenses par code CFC, facturation, trésorerie et reporting financier.',
    },
    {
      icon: FileCheck,
      title: 'Soumissions & appels d\'offres',
      description: 'Création de soumissions, réception des offres, comparatif automatique et adjudication traçable.',
    },
    {
      icon: Package,
      title: 'Choix matériaux acquéreurs',
      description: 'Catalogue de finitions personnalisable, sélection en ligne par les acquéreurs et impact financier temps réel.',
    },
    {
      icon: FileText,
      title: 'GED projet & lots',
      description: 'Documents organisés par projet et par lot : plans, contrats, PV de réception, photos de suivi.',
    },
    {
      icon: BarChart3,
      title: 'Portail acquéreur',
      description: 'Espace dédié pour chaque acquéreur : avancement du projet, documents, choix matériaux et paiements.',
    },
  ],
};

const commonFeatures = [
  {
    icon: Shield,
    title: 'Sécurité de niveau bancaire',
    description: 'Chiffrement AES-256, authentification 2FA, audit trail complet et sauvegardes automatiques quotidiennes.',
  },
  {
    icon: Cloud,
    title: 'Hébergement 100% Suisse',
    description: 'Datacenters certifiés ISO 27001 en Suisse. Vos données ne quittent jamais le territoire helvétique.',
  },
  {
    icon: Lock,
    title: 'Conformité RGPD & LPD',
    description: 'Respect total de la réglementation européenne et de la Loi suisse sur la Protection des Données.',
  },
  {
    icon: Zap,
    title: 'API REST complète',
    description: 'Intégration avec vos outils existants : comptabilité, CRM, ERP. Documentation complète et support technique.',
  },
  {
    icon: Globe,
    title: 'Multi-langues',
    description: 'Interface disponible en français, allemand, italien et anglais pour couvrir toute la Suisse.',
  },
  {
    icon: BarChart3,
    title: 'Reporting avancé',
    description: 'Tableaux de bord personnalisables, exports PDF et Excel, rapports automatisés par email.',
  },
];

export function Features() {
  const [selectedApp, setSelectedApp] = useState<AppId>('ppe-admin');
  const currentApp = apps.find(a => a.id === selectedApp)!;
  const currentFeatures = featuresData[selectedApp];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      {/* Hero */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/8 dark:bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/8 dark:bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-500/8 dark:bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
              Fonctionnalités <span className="text-realpro-turquoise">par application</span>
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-12">
              Découvrez les fonctionnalités métier de chaque application de la suite Realpro.
            </p>

            {/* App Selector */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                    selectedApp === app.id
                      ? `bg-white dark:bg-neutral-900 shadow-md ${app.textColor}`
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <app.icon className="w-5 h-5" />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* App Description */}
      <section className="py-12 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className={`flex items-center justify-center gap-4 p-6 rounded-2xl ${currentApp.lightBg} border ${currentApp.borderColor}/30`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentApp.color} flex items-center justify-center shadow-lg`}>
                <currentApp.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className={`text-2xl font-bold ${currentApp.textColor}`}>{currentApp.name}</h2>
                <p className="text-neutral-600 dark:text-neutral-400">{currentApp.tagline}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentFeatures.map((feature, index) => (
              <ScrollReveal key={`${selectedApp}-${index}`}>
                <div className="group p-6 rounded-2xl bg-white dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className={`w-11 h-11 rounded-xl ${currentApp.lightBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <feature.icon className={`w-5 h-5 ${currentApp.textColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for this app */}
      <section className={`py-16 bg-gradient-to-r ${currentApp.color}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à essayer {currentApp.name} ?
          </h2>
          <p className="text-white/80 mb-8">
            14 jours d'essai gratuit, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={`/register?app=${selectedApp}`}>
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                Commencer l'essai gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={`/app/${selectedApp}`}>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Common Features */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 text-realpro-turquoise text-sm font-semibold mb-4 border border-realpro-turquoise/25">
                <Sparkles className="w-4 h-4" />
                Inclus dans toutes les applications
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Fonctionnalités communes
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                Quelle que soit l'application choisie, vous bénéficiez de notre socle technologique commun.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonFeatures.map((feature, index) => (
              <ScrollReveal key={index}>
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 hover:border-realpro-turquoise/50 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-realpro-turquoise/10 dark:bg-realpro-turquoise/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Realpro */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Pourquoi choisir Realpro ?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Hébergement souverain de vos données en Suisse',
                'Conformité RGPD et LPD native',
                'Support client réactif en français',
                'Mises à jour continues sans surcoût',
                'Formation et accompagnement inclus',
                'API REST pour vos intégrations',
                'Interface intuitive et moderne',
                'Expertise métier immobilier suisse',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80">
                  <div className="w-6 h-6 rounded-full bg-realpro-turquoise flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">{benefit}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre gestion immobilière ?
          </h2>
          <p className="text-lg text-neutral-300 mb-10">
            Essayez gratuitement pendant 14 jours, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white font-medium">
                Commencer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/apps">
              <Button size="lg" variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800">
                Comparer les applications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
