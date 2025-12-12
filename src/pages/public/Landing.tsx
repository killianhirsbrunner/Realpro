import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ThemeToggle';
import { RealProLogo } from '../../components/branding/RealProLogo';
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
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <RealProLogo variant="full" size="sm" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/features" className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">
                Tarifs
              </Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="sm" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white border-0 shadow-sm">
                  Essai gratuit
                </Button>
              </Link>
              <button
                className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-3 px-6">
            <nav className="flex flex-col gap-1">
              <Link to="/features" className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">Fonctionnalités</Link>
              <Link to="/pricing" className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">Tarifs</Link>
              <Link to="/contact" className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">Contact</Link>
              <Link to="/login" className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors md:hidden">Connexion</Link>
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

      <section className="py-20 bg-white dark:bg-neutral-950">
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

      <footer className="py-12 bg-white dark:bg-neutral-950 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link to="/">
                <RealProLogo variant="full" size="sm" />
              </Link>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                La plateforme suisse pour piloter vos promotions immobilières.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50">
                <div className="flex items-center justify-center w-5 h-5 bg-red-600 rounded">
                  <span className="text-white text-[10px] font-bold">+</span>
                </div>
                <span className="text-xs font-medium text-red-700 dark:text-red-400">Made in Switzerland</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Produit</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-realpro-turquoise transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-realpro-turquoise transition-colors">Tarifs</Link></li>
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Ressources</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Support</Link></li>
                <li><Link to="/contact" className="hover:text-realpro-turquoise transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Légal</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-realpro-turquoise transition-colors">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-realpro-turquoise transition-colors">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-realpro-turquoise transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              © 2024-2025 Realpro SA. Tous droits réservés. Hébergement des données en Suisse.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
