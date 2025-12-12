import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowRight,
  Check,
  BarChart3,
  Shield,
  Layers,
  Calculator,
  FileCheck,
  Calendar,
  Package,
  Globe,
  Lock,
  Headphones,
  Zap,
  Target,
  PieChart,
  Play,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  UserCheck,
  Settings,
  Rocket,
  Building,
  Briefcase,
  Home,
  HardHat,
  Banknote,
  Link2
} from 'lucide-react';

export function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const howItWorks = [
    {
      step: 1,
      icon: UserCheck,
      title: 'Créez votre compte',
      description: 'Inscription en 2 minutes. Importez vos projets existants ou démarrez de zéro avec nos modèles prêts à l\'emploi.'
    },
    {
      step: 2,
      icon: Settings,
      title: 'Configurez vos projets',
      description: 'Personnalisez selon vos besoins : lots, budgets CFC, équipes et droits d\'accès. Notre assistant vous guide pas à pas.'
    },
    {
      step: 3,
      icon: Users,
      title: 'Invitez vos collaborateurs',
      description: 'Architectes, courtiers, entrepreneurs, notaires : chacun accède aux informations qui le concernent en temps réel.'
    },
    {
      step: 4,
      icon: Rocket,
      title: 'Pilotez efficacement',
      description: 'Suivez l\'avancement de tous vos projets depuis un tableau de bord centralisé. Automatisez les tâches répétitives.'
    }
  ];

  const testimonials = [
    {
      quote: 'Realpro a transformé notre façon de gérer nos promotions. Le gain de temps est considérable et nos clients apprécient la transparence que nous pouvons leur offrir.',
      author: 'Marc Dubois',
      role: 'Directeur général',
      company: 'Dubois Immobilier SA',
      location: 'Genève',
      projectCount: '8 projets actifs',
      avatar: 'MD'
    },
    {
      quote: 'L\'intégration des normes CFC et la gestion des QR-factures nous font gagner des heures chaque semaine. Le support est réactif et comprend vraiment nos besoins métier.',
      author: 'Sophie Müller',
      role: 'CFO',
      company: 'Helvetia Development',
      location: 'Zurich',
      projectCount: '12 projets actifs',
      avatar: 'SM'
    },
    {
      quote: 'Enfin une solution pensée pour les promoteurs suisses ! Le module de soumissions a rationalisé nos appels d\'offres et amélioré nos marges.',
      author: 'Pierre Fontana',
      role: 'Fondateur',
      company: 'Fontana Promotions',
      location: 'Lausanne',
      projectCount: '5 projets actifs',
      avatar: 'PF'
    }
  ];

  const useCases = [
    {
      icon: Building,
      title: 'Promoteurs immobiliers',
      description: 'Gérez plusieurs projets simultanément avec une vue consolidée sur les ventes, les finances et les chantiers.',
      features: ['Multi-projets', 'Dashboard KPIs', 'Reporting automatisé']
    },
    {
      icon: Briefcase,
      title: 'Régies et courtiers',
      description: 'Accédez en temps réel aux disponibilités, prix et documents pour servir efficacement vos clients acquéreurs.',
      features: ['Accès courtiers', 'Fiches lots détaillées', 'Commission tracking']
    },
    {
      icon: HardHat,
      title: 'Entreprises générales',
      description: 'Coordonnez les intervenants terrain, gérez le planning chantier et centralisez la documentation technique.',
      features: ['Planning Gantt', 'Journal de chantier', 'Gestion documentaire']
    },
    {
      icon: Banknote,
      title: 'Investisseurs',
      description: 'Suivez la performance financière de vos investissements avec des tableaux de bord clairs et des rapports détaillés.',
      features: ['Suivi rendement', 'Rapports financiers', 'Alertes automatiques']
    }
  ];

  const integrations = [
    { name: 'Banques suisses', description: 'QR-factures, relevés' },
    { name: 'Offices notariaux', description: 'Documents légaux' },
    { name: 'Google Workspace', description: 'Drive, Calendar' },
    { name: 'Microsoft 365', description: 'Outlook, SharePoint' },
    { name: 'Comptabilité', description: 'Export comptable' },
    { name: 'Cadastre', description: 'Données parcellaires' }
  ];

  const faqs = [
    {
      question: 'Combien de temps faut-il pour déployer Realpro ?',
      answer: 'Le déploiement initial prend généralement 48 heures. Cela inclut la création de votre compte, l\'import de vos données existantes si nécessaire, et une formation de prise en main pour votre équipe. Pour les configurations plus complexes avec plusieurs projets, nous prévoyons généralement une semaine complète d\'accompagnement.'
    },
    {
      question: 'Mes données sont-elles en sécurité ?',
      answer: 'Absolument. Toutes vos données sont hébergées exclusivement en Suisse, dans des datacenters certifiés ISO 27001. Nous appliquons un chiffrement de bout en bout (AES-256) et sommes pleinement conformes au RGPD et à la LPD suisse. Des sauvegardes automatiques sont effectuées quotidiennement.'
    },
    {
      question: 'Puis-je importer mes projets existants ?',
      answer: 'Oui, Realpro propose des outils d\'import pour les fichiers Excel, CSV et les exports de la plupart des logiciels du marché. Notre équipe vous accompagne gratuitement dans la migration de vos données pour garantir une transition en douceur.'
    },
    {
      question: 'Quels types d\'utilisateurs peuvent accéder à la plateforme ?',
      answer: 'Realpro permet de définir des rôles et permissions granulaires. Vous pouvez inviter des collaborateurs internes (direction, commerciaux, finances), des partenaires externes (architectes, courtiers, entrepreneurs) et même des acquéreurs pour un accès limité à leur espace personnel.'
    },
    {
      question: 'Y a-t-il un engagement minimum ?',
      answer: 'Non, nos abonnements sont sans engagement. Vous pouvez résilier à tout moment. Nous proposons également une période d\'essai gratuite de 14 jours pour tester toutes les fonctionnalités sans engagement ni carte bancaire.'
    },
    {
      question: 'Le support est-il inclus dans l\'abonnement ?',
      answer: 'Oui, tous nos plans incluent un support par e-mail et chat. Les plans Professional et Enterprise bénéficient d\'un support téléphonique prioritaire et d\'un Customer Success Manager dédié pour vous accompagner dans l\'optimisation de votre utilisation.'
    },
    {
      question: 'Realpro est-il compatible avec les normes CFC suisses ?',
      answer: 'Oui, Realpro intègre nativement la structure des codes CFC (Codes des frais de construction) suisses. Vous pouvez créer vos budgets selon cette nomenclature standard et générer des rapports conformes aux attentes des banques et partenaires financiers.'
    }
  ];

  const coreModules = [
    {
      icon: Building2,
      title: 'Gestion de projets',
      description: 'Centralisez l\'ensemble de vos opérations de promotion immobilière. Dashboard temps réel avec KPIs stratégiques, suivi des jalons critiques et alertes prédictives pour anticiper les risques.',
      features: ['Vision 360° de tous les projets', 'Alertes et notifications automatisées', 'Tableau de bord personnalisable']
    },
    {
      icon: Users,
      title: 'CRM commercial',
      description: 'Pipeline de vente complet adapté à la promotion immobilière. Gestion des prospects, réservations et conversions avec suivi détaillé du parcours acheteur et performances courtiers.',
      features: ['Pipeline visuel drag-and-drop', 'Scoring automatique des leads', 'Historique complet des interactions']
    },
    {
      icon: Layers,
      title: 'Gestion des lots',
      description: 'Inventaire détaillé de chaque unité avec spécifications techniques, surfaces, prix et disponibilités. Modifications en temps réel visibles par toutes les parties prenantes.',
      features: ['Fiches lot complètes', 'Plans et documents intégrés', 'Statuts de disponibilité temps réel']
    },
    {
      icon: Calculator,
      title: 'Finances & CFC',
      description: 'Budgétisation CFC suisse, facturation acquéreurs avec QR-factures, échéanciers de paiement et suivi des encaissements. Compatibilité complète avec les normes bancaires suisses.',
      features: ['Budgets CFC détaillés', 'QR-factures automatiques', 'Suivi trésorerie et encaissements']
    },
    {
      icon: FileCheck,
      title: 'Soumissions',
      description: 'Digitalisez votre processus d\'appels d\'offres. Centralisez les soumissions fournisseurs, comparez les offres et détectez automatiquement les écarts par rapport aux budgets prévisionnels.',
      features: ['Comparatif automatique des offres', 'Détection des écarts budgétaires', 'Workflow de validation intégré']
    },
    {
      icon: Calendar,
      title: 'Planning chantier',
      description: 'Planification Gantt interactive, journal de chantier numérique, suivi photographique de l\'avancement et coordination des intervenants terrain en temps réel.',
      features: ['Diagramme Gantt interactif', 'Journal de chantier digital', 'Galerie photos géolocalisées']
    }
  ];

  const additionalModules = [
    {
      icon: Package,
      title: 'Choix matériaux',
      description: 'Catalogues fournisseurs, gestion des rendez-vous showroom et validation des sélections acquéreurs.'
    },
    {
      icon: FileText,
      title: 'GED & Documents',
      description: 'Gestion documentaire complète avec versioning, annotations de plans et partage sécurisé.'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Hub centralisé pour tous les échanges avec traçabilité complète et archivage intelligent.'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Gain de temps',
      value: '15h',
      unit: '/semaine',
      description: 'économisées en moyenne par collaborateur grâce à l\'automatisation des tâches répétitives'
    },
    {
      icon: Target,
      title: 'Taux de conversion',
      value: '+35%',
      unit: '',
      description: 'd\'amélioration du taux de conversion prospect vers acheteur avec le CRM intégré'
    },
    {
      icon: PieChart,
      title: 'Visibilité',
      value: '100%',
      unit: '',
      description: 'de visibilité sur l\'ensemble des opérations, finances et commerciales en temps réel'
    },
    {
      icon: Zap,
      title: 'Mise en place',
      value: '48h',
      unit: '',
      description: 'pour déployer la solution et former vos équipes à son utilisation complète'
    }
  ];

  const trustPoints = [
    {
      icon: Shield,
      title: 'Sécurité suisse',
      description: 'Hébergement exclusif en Suisse, conformité RGPD et LPD, chiffrement de bout en bout.'
    },
    {
      icon: Globe,
      title: 'Multilingue',
      description: 'Interface disponible en français, allemand, italien et anglais pour vos équipes internationales.'
    },
    {
      icon: Headphones,
      title: 'Support dédié',
      description: 'Équipe support basée en Suisse, disponible par téléphone, e-mail et chat en heures ouvrables.'
    },
    {
      icon: Lock,
      title: 'Conformité',
      description: 'Respect des normes CFC, intégration avec les systèmes bancaires suisses et notariaux.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-realpro-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-6 border border-realpro-turquoise/20">
                <Shield className="w-3.5 h-3.5" />
                Solution 100% suisse
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Pilotez vos promotions<br className="hidden sm:block" />
                <span className="text-realpro-turquoise">immobilières</span> en toute simplicité
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Centralisez projets, ventes, finances et documents sur une plateforme unique.
                Collaborez efficacement avec tous vos intervenants.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Link to="/register">
                  <Button size="lg" className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium">
                    Essai gratuit 14 jours
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Demander une démo
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-12">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Sans carte bancaire
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Données hébergées en Suisse
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Support inclus
                </span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={600}>
            <div className="relative max-w-6xl mx-auto mt-8">
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
              <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
                <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="px-4 py-1 bg-white dark:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-600 text-xs text-neutral-500 dark:text-neutral-400">
                      app.realpro.ch/dashboard
                    </div>
                  </div>
                </div>

                <div className="flex bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
                  <div className="hidden md:flex flex-col w-16 bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-2 gap-2">
                    <div className="w-10 h-10 rounded-lg bg-realpro-turquoise flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <Users className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-neutral-500" />
                    </div>
                  </div>

                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Tableau de bord</h3>
                        <p className="text-xs text-neutral-500">Dernière mise à jour : il y a 2 min</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-realpro-turquoise/10 to-realpro-turquoise/5 rounded-xl p-4 border border-realpro-turquoise/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-realpro-turquoise uppercase tracking-wide">Projets actifs</span>
                          <TrendingUp className="w-4 h-4 text-realpro-turquoise" />
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">12</div>
                        <div className="text-xs text-realpro-turquoise mt-1">+2 ce mois</div>
                      </div>

                      <div className="bg-gradient-to-br from-realpro-turquoise/10 to-realpro-turquoise/5 rounded-xl p-4 border border-realpro-turquoise/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-realpro-turquoise uppercase tracking-wide">Taux de vente</span>
                          <Users className="w-4 h-4 text-realpro-turquoise" />
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">87%</div>
                        <div className="text-xs text-realpro-turquoise mt-1">234/268 lots</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-100/50 to-green-50/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">Revenu total</span>
                          <BarChart3 className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">12.4M</div>
                        <div className="text-xs text-green-600 mt-1">+8.2% vs. prévu</div>
                      </div>

                      <div className="bg-gradient-to-br from-realpro-turquoise/10 to-realpro-turquoise/5 rounded-xl p-4 border border-realpro-turquoise/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-realpro-turquoise uppercase tracking-wide">Prospects</span>
                          <MessageSquare className="w-4 h-4 text-realpro-turquoise" />
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white">142</div>
                        <div className="text-xs text-realpro-turquoise mt-1">18 nouveaux</div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Évolution des ventes</h4>
                          <span className="text-xs text-neutral-500">6 derniers mois</span>
                        </div>
                        <div className="flex items-end gap-2 h-24">
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '45%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '60%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '50%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '75%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '85%'}}></div>
                          <div className="flex-1 bg-gradient-to-t from-realpro-turquoise to-realpro-turquoise/60 rounded-t" style={{height: '100%'}}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-neutral-400">
                          <span>Jan</span>
                          <span>Juin</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Projets récents</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">Les Jardins du Lac</div>
                              <div className="text-xs text-neutral-500">42 lots - 89% vendus</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-realpro-turquoise"></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">Résidence Panorama</div>
                              <div className="text-xs text-neutral-500">28 lots - 67% vendus</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">Villa des Pins</div>
                              <div className="text-xs text-neutral-500">15 lots - 45% vendus</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-amber-900 dark:text-amber-300">3 échéances cette semaine</div>
                          <div className="text-xs text-amber-700 dark:text-amber-400">CFC, signatures, RDV</div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-3 flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-green-900 dark:text-green-300">8 contrats signés ce mois</div>
                          <div className="text-xs text-green-700 dark:text-green-400">CHF 2.1M encaissés</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Play className="w-3.5 h-3.5" />
                Démarrage rapide
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                De l'inscription à la gestion de vos premiers projets en quelques étapes simples.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <ScrollReveal key={item.step}>
                <div className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-realpro-turquoise/30 to-transparent -translate-x-4" />
                  )}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-realpro-turquoise/20 to-realpro-turquoise/5 flex items-center justify-center border border-realpro-turquoise/20">
                        <item.icon className="w-10 h-10 text-realpro-turquoise" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-realpro-turquoise text-white text-sm font-bold flex items-center justify-center shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-16 text-center">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white border-0 shadow-lg shadow-realpro-turquoise/20">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Modules principaux */}
      <section className="py-24 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Tous vos outils métier en une plateforme
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Conçue avec des promoteurs suisses pour répondre aux exigences du marché local.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreModules.map((module) => (
              <ScrollReveal key={module.title}>
                <div className="group bg-white dark:bg-neutral-800/50 rounded-xl p-6 border border-neutral-200/80 dark:border-neutral-700/50 hover:border-realpro-turquoise/30 hover:shadow-lg hover:shadow-realpro-turquoise/5 transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mb-4 transition-colors">
                    <module.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {module.description.split('.')[0]}.
                  </p>
                  <ul className="space-y-1.5">
                    {module.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Check className="w-3.5 h-3.5 text-realpro-turquoise flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              {additionalModules.map((module) => (
                <div key={module.title} className="flex items-center gap-4 bg-white dark:bg-neutral-800/30 rounded-lg p-4 border border-neutral-200/60 dark:border-neutral-700/40">
                  <div className="w-9 h-9 rounded-lg bg-realpro-turquoise/10 flex items-center justify-center flex-shrink-0">
                    <module.icon className="w-4 h-4 text-realpro-turquoise" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{module.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{module.description.split('.')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Target className="w-3.5 h-3.5" />
                Pour qui ?
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Une solution adaptée à chaque profil
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Que vous soyez promoteur, régie, entreprise générale ou investisseur, Realpro s'adapte à vos besoins.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <ScrollReveal key={useCase.title}>
                <div className="group bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-2xl p-8 border border-neutral-200/80 dark:border-neutral-700/50 hover:border-realpro-turquoise/30 hover:shadow-xl hover:shadow-realpro-turquoise/5 transition-all duration-300 h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-realpro-turquoise/20 to-realpro-turquoise/5 flex items-center justify-center flex-shrink-0 group-hover:from-realpro-turquoise/30 group-hover:to-realpro-turquoise/10 transition-all">
                      <useCase.icon className="w-7 h-7 text-realpro-turquoise" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                        {useCase.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-xs font-medium">
                            <Check className="w-3 h-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Résultats concrets */}
      <section className="py-20 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Résultats concrets
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                Ce que nos clients constatent après adoption de Realpro.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <ScrollReveal key={benefit.title}>
                <div className="text-center p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-4xl font-bold text-realpro-turquoise">
                      {benefit.value}
                    </span>
                    <span className="text-lg text-neutral-400">
                      {benefit.unit}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Star className="w-3.5 h-3.5" />
                Témoignages
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Ils nous font confiance
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Découvrez comment des promoteurs suisses ont transformé leur activité avec Realpro.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index}>
                <div className="relative bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-2xl p-8 border border-neutral-200/80 dark:border-neutral-700/50 h-full flex flex-col">
                  <Quote className="w-10 h-10 text-realpro-turquoise/20 mb-4" />
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-realpro-turquoise to-realpro-turquoise-dark flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {testimonial.role}, {testimonial.company}
                      </div>
                      <div className="text-xs text-realpro-turquoise mt-0.5">
                        {testimonial.location} · {testimonial.projectCount}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-8 px-8 py-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">50+</div>
                  <div className="text-sm text-neutral-500">Promoteurs actifs</div>
                </div>
                <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">200+</div>
                  <div className="text-sm text-neutral-500">Projets gérés</div>
                </div>
                <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">98%</div>
                  <div className="text-sm text-neutral-500">Taux de satisfaction</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pensé pour la Suisse */}
      <section className="py-20 bg-neutral-50/70 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Pensé pour la Suisse
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                Développé en Suisse, avec une parfaite maîtrise des spécificités locales.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPoints.map((point) => (
              <ScrollReveal key={point.title}>
                <div className="bg-white dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-700/50 h-full">
                  <div className="w-10 h-10 rounded-lg bg-realpro-turquoise/10 flex items-center justify-center mb-3">
                    <point.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Intégrations */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Link2 className="w-3.5 h-3.5" />
                Écosystème
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Connecté à vos outils existants
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Realpro s'intègre naturellement à votre environnement de travail pour une productivité maximale.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, index) => (
              <ScrollReveal key={index}>
                <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 text-center hover:border-realpro-turquoise/30 hover:shadow-lg transition-all h-full">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center mx-auto mb-3 border border-neutral-200 dark:border-neutral-700">
                    <Link2 className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-white text-sm mb-1">
                    {integration.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {integration.description}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">
                Besoin d'une intégration spécifique ?{' '}
                <Link to="/contact" className="text-realpro-turquoise hover:underline font-medium">
                  Contactez-nous
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral-50/70 dark:bg-neutral-900/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <MessageSquare className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Questions fréquentes
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Tout ce que vous devez savoir pour démarrer avec Realpro.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index}>
                <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-realpro-turquoise flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/50">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Vous avez d'autres questions ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Notre équipe est disponible pour répondre à toutes vos interrogations.
              </p>
              <Link to="/contact">
                <Button className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white">
                  Contactez-nous
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-realpro-turquoise/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-realpro-turquoise/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Prêt à simplifier la gestion de vos promotions ?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              Rejoignez les promoteurs qui ont choisi Realpro pour gagner en efficacité.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link to="/register">
                <Button size="lg" className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-light text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium">
                  Démarrer l'essai gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500">
                  Planifier une démo
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                14 jours gratuits
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Support inclus
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
