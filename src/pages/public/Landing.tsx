import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { ThemeToggle } from '../../components/ThemeToggle';
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
  Sparkles,
  Menu,
  X,
  Layers,
  Calculator,
  Hammer,
  FileCheck,
  Calendar,
  Package,
  Globe,
  Lock,
  Headphones,
  ChevronRight,
  Workflow,
  Zap,
  Target,
  PieChart
} from 'lucide-react';

export function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <RealProLogo size="xl" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-realpro-turquoise hover:bg-realpro-turquoise/90 text-white border-0">
                  Essai gratuit
                </Button>
              </Link>
              <button
                className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 px-6">
            <nav className="flex flex-col gap-3">
              <Link to="/features" className="py-2 text-neutral-600 dark:text-neutral-400">Fonctionnalités</Link>
              <Link to="/pricing" className="py-2 text-neutral-600 dark:text-neutral-400">Tarifs</Link>
              <Link to="/contact" className="py-2 text-neutral-600 dark:text-neutral-400">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-neutral-950 dark:to-neutral-950">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-realpro-turquoise/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Plateforme leader pour les promoteurs immobiliers suisses
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-6">
                La solution complète pour piloter vos{' '}
                <span className="text-realpro-turquoise">promotions immobilières</span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                RealPro centralise la gestion de vos projets, ventes, finances et communications
                sur une plateforme unique. Connectez architectes, courtiers, acquéreurs et
                fournisseurs pour une collaboration fluide et une visibilité totale.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to="/register">
                  <Button size="lg" className="h-12 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise/90 text-white border-0 shadow-lg shadow-realpro-turquoise/25">
                    Démarrer l'essai gratuit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Demander une démonstration
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400 mb-16">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  14 jours d'essai gratuit
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Sans engagement
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Hébergement 100% Suisse
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Support en français
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

      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Une plateforme, tous vos besoins métiers
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Chaque module a été conçu en collaboration avec des promoteurs immobiliers suisses
                pour répondre aux exigences spécifiques du marché romand et alémanique.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {coreModules.map((module, index) => (
              <ScrollReveal key={module.title}>
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-realpro-turquoise/10 flex items-center justify-center flex-shrink-0">
                      <module.icon className="w-6 h-6 text-realpro-turquoise" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                        {module.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                      <ul className="space-y-2">
                        {module.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <ChevronRight className="w-4 h-4 text-realpro-turquoise flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalModules.map((module, index) => (
              <ScrollReveal key={module.title}>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-10 h-10 rounded-lg bg-realpro-turquoise/10 flex items-center justify-center mb-4">
                    <module.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/20 dark:from-blue-950/10 dark:via-neutral-950 dark:to-blue-950/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Des résultats mesurables pour votre activité
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Les promoteurs utilisant RealPro constatent des améliorations significatives
                de leur productivité et de leurs performances commerciales.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-realpro-turquoise/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-realpro-turquoise" />
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                      {benefit.value}
                    </span>
                    <span className="text-lg text-neutral-500 dark:text-neutral-400">
                      {benefit.unit}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Conçu pour le marché suisse
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                RealPro est développé en Suisse, pour les professionnels suisses,
                avec une parfaite compréhension des spécificités locales.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, index) => (
              <ScrollReveal key={point.title}>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 h-full">
                  <div className="w-10 h-10 rounded-lg bg-realpro-turquoise/10 flex items-center justify-center mb-4">
                    <point.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
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

      <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpro-turquoise/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-realpro-turquoise/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-realpro-turquoise/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-realpro-turquoise/20 text-realpro-turquoise text-sm font-medium mb-8 border border-realpro-turquoise/30">
              <Sparkles className="w-4 h-4" />
              Démarrez dès aujourd'hui
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Prêt à optimiser la gestion de vos{' '}
              <span className="text-realpro-turquoise">promotions</span> ?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les promoteurs immobiliers qui ont choisi RealPro pour centraliser
              leurs opérations et améliorer leur productivité.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-10 text-base bg-realpro-turquoise hover:bg-realpro-turquoise/90 text-white border-0 shadow-xl shadow-realpro-turquoise/30 font-semibold">
                  Commencer l'essai gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base bg-transparent border-2 border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500 font-semibold transition-all">
                  Planifier une démo
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-400">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                14 jours gratuits
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Aucune carte requise
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Configuration en 48h
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <RealProLogo size="lg" />
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                La plateforme de gestion complète pour les promoteurs immobiliers en Suisse.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Produit</h4>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-realpro-turquoise transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-realpro-turquoise transition-colors">Tarifs</Link></li>
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Ressources</h4>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Support</Link></li>
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Légal</h4>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-realpro-turquoise transition-colors">Conditions d'utilisation</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-realpro-turquoise transition-colors">Conditions de vente</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-realpro-turquoise transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              2024-2025 Realpro SA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>Développé en Suisse</span>
              <span className="text-red-500">CH</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
