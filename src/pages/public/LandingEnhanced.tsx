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
  Zap,
  ArrowRight,
  Check,
  BarChart3,
  Shield,
  Sparkles,
  Menu,
  X,
  Home,
  ChartBar,
  Calendar,
  Package,
  FileCheck,
  DollarSign,
  Star,
  Quote
} from 'lucide-react';

export function LandingEnhanced() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const modules = [
    {
      icon: Building2,
      title: 'Gestion de Projets',
      description: 'Créez et pilotez vos promotions immobilières avec une vision 360° complète. Dashboard intégré avec KPIs en temps réel.',
      image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
      color: 'from-brand-600 to-brand-700'
    },
    {
      icon: Users,
      title: 'CRM & Ventes',
      description: 'Pipeline commercial complet pour gérer prospects, réservations et contrats. Suivi des courtiers et acheteurs centralisé.',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      color: 'from-brand-600 to-brand-700'
    },
    {
      icon: Home,
      title: 'Lots & Inventaire',
      description: 'Gestion détaillée de tous vos lots avec plans, surfaces, prix et disponibilités. Modification en temps réel.',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: DollarSign,
      title: 'Finances & CFC',
      description: 'Budgets CFC, factures acheteurs, QR-factures suisses et suivi des paiements. Compatibilité bancaire complète.',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg',
      color: 'from-brand-600 to-brand-700'
    },
    {
      icon: FileCheck,
      title: 'Soumissions & Appels d\'offres',
      description: 'Centralisez vos appels d\'offres et comparez les soumissions. Analyse automatique des écarts budgétaires.',
      image: 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg',
      color: 'from-brand-600 to-brand-700'
    },
    {
      icon: Calendar,
      title: 'Planning & Suivi Chantier',
      description: 'Planification Gantt, journal de chantier, photos de progression et coordination des équipes terrain.',
      image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg',
      color: 'from-cyan-600 to-cyan-700'
    },
    {
      icon: Package,
      title: 'Choix Matériaux',
      description: 'Catalogues fournisseurs, rendez-vous showroom et validation des choix acheteurs. Gestion des modifications.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      color: 'from-pink-600 to-pink-700'
    },
    {
      icon: FileText,
      title: 'Documents & Plans',
      description: 'GED complète avec annotations de plans, versioning et partage sécurisé. Export PDF professionnel.',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Hub central pour tous les échanges: acheteurs, courtiers, architectes et entreprises. Traçabilité complète.',
      image: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg',
      color: 'from-teal-600 to-teal-700'
    }
  ];

  const testimonials = [
    {
      name: 'Marc Dubois',
      role: 'Directeur',
      company: 'Promotion Lémanique SA',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      quote: 'RealPro a transformé notre façon de gérer nos promotions. La vision 360° nous permet de prendre des décisions plus rapidement et avec plus de confiance.'
    },
    {
      name: 'Sophie Martin',
      role: 'Responsable Ventes',
      company: 'Immopac Genève',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      quote: 'Le module CRM est incroyable. Nous avons augmenté notre taux de conversion de 35% depuis que nous utilisons RealPro.'
    },
    {
      name: 'Jean-Luc Perrin',
      role: 'Promoteur',
      company: 'Construction Plus',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
      quote: 'Enfin une solution qui comprend vraiment les besoins des promoteurs suisses. La gestion financière CFC est parfaite.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-70">
              <RealProLogo size="xl" />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="rounded-full">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm" className="rounded-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 border-0 text-white shadow-lg shadow-brand-600/30">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with People */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 border border-brand-600/20">
                <Sparkles className="w-3.5 h-3.5" />
                Solution #1 pour les promoteurs suisses
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Pilotez vos promotions avec une <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 bg-clip-text text-transparent">précision absolue</span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                La seule plateforme qui centralise 100% de vos opérations immobilières.
                <span className="text-neutral-900 dark:text-white font-medium"> Architectes, courtiers, acheteurs, fournisseurs et notaires</span> : tous connectés en temps réel.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link to="/auth/register">
                  <Button
                    size="lg"
                    className="group rounded-full px-8 h-12 text-base font-medium shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:scale-105 border-0 text-white"
                  >
                    Commencer gratuitement
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-12 text-base font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-300"
                  >
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex items-center gap-6 text-xs text-neutral-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  14 jours gratuits
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  Sans engagement
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  Données en Suisse
                </span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={600}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-brand-700/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                alt="Équipe professionnelle"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Modules Section with Images */}
      <section className="bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 py-24 border-y border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                9 modules professionnels.<br />
                <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">Une seule plateforme.</span>
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Chaque module a été conçu avec des promoteurs immobiliers pour répondre aux défis réels du terrain. De la première visite à la remise des clés.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <ScrollReveal key={module.title}>
                <div className="group bg-white dark:bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={module.image}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${module.color} opacity-60`} />
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                      {module.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Ils nous font <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">confiance</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Plus de 50 promoteurs suisses pilotent leurs projets avec RealPro
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name}>
              <div className="bg-white dark:bg-neutral-800/50 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-brand-600/20 mb-4" />

                <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/10 dark:to-brand-800/10 py-16 border-y border-brand-200/50 dark:border-brand-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">50+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Promoteurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">200+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Projets gérés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">99.9%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Disponibilité</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">Swiss</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Hébergement Suisse</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            Prêt à transformer votre façon de travailler ?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Rejoignez les promoteurs qui ont choisi RealPro pour piloter leurs projets avec confiance
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="group rounded-full px-10 h-14 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:scale-105 border-0 text-white"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 h-14 text-lg font-medium"
              >
                Demander une démo
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <RealProLogo size="lg" className="mb-4" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                La plateforme de gestion immobilière pour les promoteurs suisses
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-brand-600">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-600">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-brand-600">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-brand-600">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-brand-600">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-600 dark:text-neutral-400">
            © 2024-2025 Realpro SA. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
