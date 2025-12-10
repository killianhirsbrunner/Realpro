import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ScrollReveal } from '../../components/ui/PageTransition';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Hammer,
  Calendar,
  Package,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Wrench,
  Shield,
  ArrowRight,
  Menu,
  X,
  Check
} from 'lucide-react';

export function Features() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const modules = [
    {
      icon: Building2,
      title: 'Gestion de projets',
      description: 'Structurez et orchestrez vos opérations immobilières PPE/QPT avec une architecture modulaire complète. Organisez bâtiments, étages et lots avec une vue d\'ensemble en temps réel sur l\'avancement de chaque programme.'
    },
    {
      icon: Users,
      title: 'CRM Acquéreurs',
      description: 'Pipeline commercial intégré de bout en bout, de la première prise de contact à la remise des clés. Pilotez efficacement votre cycle de vente avec gestion avancée des prospects, réservations, signatures et suivi relationnel.'
    },
    {
      icon: FileText,
      title: 'Documents & GED',
      description: 'Système de Gestion Électronique des Documents professionnel avec versioning automatique, arborescence contextualisée par projet et constitution intelligente des dossiers notariés. Traçabilité et sécurité maximales garanties.'
    },
    {
      icon: TrendingUp,
      title: 'Finance & CFC',
      description: 'Plateforme financière complète pour la gestion des Comptes de Frais de Construction. Suivi budgétaire en temps réel, gestion des factures et acomptes, comptabilité analytique intégrée pour un contrôle financier rigoureux.'
    },
    {
      icon: ClipboardCheck,
      title: 'Soumissions',
      description: 'Module d\'appels d\'offres professionnel pour centraliser et comparer vos consultations. Analysez objectivement les propositions, négociez en toute transparence et adjudiquez aux entreprises en quelques clics avec traçabilité complète.'
    },
    {
      icon: Package,
      title: 'Choix matériaux',
      description: 'Catalogue de finitions et équipements entièrement personnalisable par projet. Gérez les choix de vos acquéreurs, planifiez automatiquement les rendez-vous showroom et maîtrisez l\'impact financier de chaque option.'
    },
    {
      icon: Hammer,
      title: 'Planning & Chantier',
      description: 'Outil de planification et suivi de chantier avec gestion des phases de construction. Diagramme de Gantt interactif, reportage photographique géolocalisé et journal de chantier numérique pour un pilotage opérationnel optimal.'
    },
    {
      icon: Calendar,
      title: 'Rendez-vous fournisseurs',
      description: 'Système de prise de rendez-vous synchronisé pour coordonner les visites showroom de vos acquéreurs. Agenda partagé temps réel, notifications automatiques et gestion des disponibilités pour une expérience client premium.'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Hub de communication centralisé avec messagerie contextuelle par projet et lot. Notifications intelligentes, historique complet des échanges et traçabilité des décisions pour une collaboration fluide entre tous les intervenants.'
    },
    {
      icon: Wrench,
      title: 'SAV Post-livraison',
      description: 'Module de gestion du Service Après-Vente avec suivi des garanties légales et constructeurs. Centralisation des réclamations, planification des interventions et gestion du cycle complet des levées de réserves jusqu\'à l\'achèvement.'
    },
    {
      icon: BarChart3,
      title: 'Reporting & Analytics',
      description: 'Suite d\'analyse décisionnelle avec tableaux de bord personnalisables et KPI temps réel. Rapports automatisés multi-projets, indicateurs de performance commerciale et financière pour un pilotage stratégique basé sur la data.'
    },
    {
      icon: Shield,
      title: 'Sécurité & Conformité',
      description: 'Architecture multi-tenant sécurisée avec contrôle d\'accès granulaire (RBAC) et audit trail complet. Conformité RGPD native, hébergement en Suisse et chiffrement de bout en bout pour protéger vos données stratégiques.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-70">
              <span className="text-xl font-bold text-neutral-900 dark:text-white">RealPro</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-brand-600 dark:text-brand-400 transition-colors">
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
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 px-6 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3">
              <Link to="/features" className="text-brand-600 dark:text-brand-400 transition-colors py-2">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-20 md:pb-28 text-center">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Une suite <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 bg-clip-text text-transparent">complète et puissante</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            12 modules professionnels conçus pour gérer l'intégralité de vos projets immobiliers
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 py-16 md:py-24 border-y border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ScrollReveal key={module.title}>
                <div className="group p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer backdrop-blur-sm h-full flex flex-col min-h-[280px]">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <module.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex-shrink-0">
                    {module.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                    {module.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
              Pourquoi choisir RealPro ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Hébergement souverain de vos données en Suisse',
              'Conformité RGPD native et sécurité de niveau bancaire',
              'Support client réactif en français et expertise métier',
              'Mises à jour continues incluses sans surcoût',
              'Formation complète et accompagnement de vos équipes',
              'API REST documentée pour vos intégrations tierces'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-brand-600/50 dark:hover:border-brand-600/50 transition-all duration-300 min-h-[72px]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1">{benefit}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 border-y border-neutral-800 dark:border-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-brand-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Essayez RealPro gratuitement pendant 14 jours, sans engagement
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="group bg-brand-600 text-white hover:bg-brand-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl hover:shadow-brand-600/50 transition-all duration-300 hover:scale-105"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-gray-900 bg-white/90 hover:bg-white rounded-full px-8 h-12 text-base font-medium backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-12 md:py-16 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <span className="text-xl font-bold text-neutral-900 dark:text-white">RealPro</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 max-w-xs leading-relaxed">
                La solution complète pour les promoteurs immobiliers suisses
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Produit</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Entreprise</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Légal</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
              © 2024-2025 Realpro SA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <span>Made in</span>
              <span className="text-red-500">🇨🇭</span>
              <span>Switzerland</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
