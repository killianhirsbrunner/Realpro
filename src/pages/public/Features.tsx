import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
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
  Check
} from 'lucide-react';

export function Features() {
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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-20 md:pb-28 text-center">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Une suite <span className="text-realpro-turquoise">complète et puissante</span>
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
                  <div className="w-11 h-11 rounded-xl bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <module.icon className="w-5 h-5 text-realpro-turquoise" />
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
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-realpro-turquoise/50 transition-all duration-300 min-h-[72px]">
                <div className="w-6 h-6 rounded-full bg-realpro-turquoise flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1">{benefit}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 lg:py-28 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-realpro-turquoise/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-realpro-turquoise/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              Essayez realpro gratuitement pendant 14 jours, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-light text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
