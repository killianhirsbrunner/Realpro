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
      title: 'Gestion de Projets',
      description: 'Centralisez l\'ensemble de vos operations de promotion immobiliere. Dashboard temps reel avec KPIs strategiques, suivi des jalons critiques et alertes predictives pour anticiper les risques.',
      features: ['Vision 360 de tous les projets', 'Alertes et notifications automatisees', 'Tableau de bord personnalisable']
    },
    {
      icon: Users,
      title: 'CRM Commercial',
      description: 'Pipeline de vente complet adapte a la promotion immobiliere. Gestion des prospects, reservations et conversions avec suivi detaille du parcours acheteur et performances courtiers.',
      features: ['Pipeline visuel drag-and-drop', 'Scoring automatique des leads', 'Historique complet des interactions']
    },
    {
      icon: Layers,
      title: 'Gestion des Lots',
      description: 'Inventaire detaille de chaque unite avec specifications techniques, surfaces, prix et disponibilites. Modifications en temps reel visibles par toutes les parties prenantes.',
      features: ['Fiches lot completes', 'Plans et documents integres', 'Statuts de disponibilite temps reel']
    },
    {
      icon: Calculator,
      title: 'Finances & CFC',
      description: 'Budgetisation CFC suisse, facturation acheteurs avec QR-factures, echeanciers de paiement et suivi des encaissements. Compatibilite complete avec les normes bancaires suisses.',
      features: ['Budgets CFC detailles', 'QR-factures automatiques', 'Suivi tresorerie et encaissements']
    },
    {
      icon: FileCheck,
      title: 'Soumissions',
      description: 'Digitalisez votre processus d\'appels d\'offres. Centralisez les soumissions fournisseurs, comparez les offres et detectez automatiquement les ecarts par rapport aux budgets previsionnels.',
      features: ['Comparatif automatique des offres', 'Detection des ecarts budgetaires', 'Workflow de validation integre']
    },
    {
      icon: Calendar,
      title: 'Planning Chantier',
      description: 'Planification Gantt interactive, journal de chantier numerique, suivi photographique de l\'avancement et coordination des intervenants terrain en temps reel.',
      features: ['Diagramme Gantt interactif', 'Journal de chantier digital', 'Galerie photos geolocalisees']
    }
  ];

  const additionalModules = [
    {
      icon: Package,
      title: 'Choix Materiaux',
      description: 'Catalogues fournisseurs, gestion des rendez-vous showroom et validation des selections acquereurs.'
    },
    {
      icon: FileText,
      title: 'GED & Documents',
      description: 'Gestion documentaire complete avec versioning, annotations de plans et partage securise.'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Hub centralise pour tous les echanges avec tracabilite complete et archivage intelligent.'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Gain de temps',
      value: '15h',
      unit: '/semaine',
      description: 'economisees en moyenne par collaborateur grace a l\'automatisation des taches repetitives'
    },
    {
      icon: Target,
      title: 'Taux de conversion',
      value: '+35%',
      unit: '',
      description: 'd\'amelioration du taux de conversion prospect vers acheteur avec le CRM integre'
    },
    {
      icon: PieChart,
      title: 'Visibilite',
      value: '100%',
      unit: '',
      description: 'de visibilite sur l\'ensemble des operations, finances et commerciales en temps reel'
    },
    {
      icon: Zap,
      title: 'Mise en place',
      value: '48h',
      unit: '',
      description: 'pour deployer la solution et former vos equipes a son utilisation complete'
    }
  ];

  const trustPoints = [
    {
      icon: Shield,
      title: 'Securite Suisse',
      description: 'Hebergement exclusif en Suisse, conformite RGPD et LPD, chiffrement de bout en bout.'
    },
    {
      icon: Globe,
      title: 'Multi-langue',
      description: 'Interface disponible en francais, allemand, italien et anglais pour vos equipes internationales.'
    },
    {
      icon: Headphones,
      title: 'Support Dedié',
      description: 'Equipe support basee en Suisse, disponible par telephone, email et chat en heures ouvrables.'
    },
    {
      icon: Lock,
      title: 'Conformite',
      description: 'Respect des normes CFC, integration avec les systemes bancaires suisses et notariaux.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <RealProLogo size="lg" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Fonctionnalites
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
              <Link to="/features" className="py-2 text-neutral-600 dark:text-neutral-400">Fonctionnalites</Link>
              <Link to="/pricing" className="py-2 text-neutral-600 dark:text-neutral-400">Tarifs</Link>
              <Link to="/contact" className="py-2 text-neutral-600 dark:text-neutral-400">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpro-turquoise/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-realpro-turquoise/5 rounded-full blur-3xl" />
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
                La solution complete pour piloter vos{' '}
                <span className="text-realpro-turquoise">promotions immobilieres</span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                RealPro centralise la gestion de vos projets, ventes, finances et communications
                sur une plateforme unique. Connectez architectes, courtiers, acquereurs et
                fournisseurs pour une collaboration fluide et une visibilite totale.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to="/register">
                  <Button size="lg" className="h-12 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise/90 text-white border-0 shadow-lg shadow-realpro-turquoise/25">
                    Demarrer l'essai gratuit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Demander une demonstration
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400">
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
                  Hebergement 100% Suisse
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-realpro-turquoise" />
                  Support en francais
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Une plateforme, tous vos besoins metiers
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Chaque module a ete concu en collaboration avec des promoteurs immobiliers suisses
                pour repondre aux exigences specifiques du marche romand et alemanique.
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Des resultats mesurables pour votre activite
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Les promoteurs utilisant RealPro constatent des ameliorations significatives
                de leur productivite et de leurs performances commerciales.
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
                Concu pour le marche suisse
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                RealPro est developpe en Suisse, pour les professionnels suisses,
                avec une parfaite comprehension des specificites locales.
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

      <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Pret a optimiser la gestion de vos promotions ?
            </h2>
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
              Rejoignez les promoteurs immobiliers qui ont choisi RealPro pour centraliser
              leurs operations et ameliorer leur productivite.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise/90 text-white border-0">
                  Commencer l'essai gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-neutral-700 text-white hover:bg-neutral-800">
                  Planifier une demo
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-neutral-500">
              14 jours gratuits - Aucune carte de credit requise - Configuration en 48h
            </p>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <RealProLogo size="md" />
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                La plateforme de gestion complete pour les promoteurs immobiliers en Suisse.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Produit</h4>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-realpro-turquoise transition-colors">Fonctionnalites</Link></li>
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
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-realpro-turquoise transition-colors">Conditions d'utilisation</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-realpro-turquoise transition-colors">Conditions de vente</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-realpro-turquoise transition-colors">Politique de confidentialite</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              2024-2025 Realpro SA. Tous droits reserves.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>Developpe en Suisse</span>
              <span className="text-red-500">CH</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
