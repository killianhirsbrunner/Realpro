import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
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
  ArrowLeft
} from 'lucide-react';

export function Features() {
  const modules = [
    {
      icon: Building2,
      title: 'Gestion de projets',
      description: 'Créez et gérez vos projets PPE/QPT avec bâtiments, étages et lots. Vue d\'ensemble complète de l\'avancement.',
      features: [
        'Structure hiérarchique bâtiments/étages/lots',
        'Status et avancement en temps réel',
        'Gestion multi-projets',
        'Paramètres projet personnalisables'
      ]
    },
    {
      icon: Users,
      title: 'CRM Acquéreurs',
      description: 'Pipeline complet de la prospection à la livraison. Gérez vos prospects, réservations et acheteurs.',
      features: [
        'Pipeline visuel (prospect → réservation → vendu)',
        'Dossiers acheteurs complets',
        'Suivi des acomptes',
        'Historique des interactions'
      ]
    },
    {
      icon: FileText,
      title: 'Documents & GED',
      description: 'Gestion documentaire complète avec versioning, arborescence projet et dossiers notariés.',
      features: [
        'Arborescence automatique par projet',
        'Versioning des documents',
        'Dossiers notariés structurés',
        'Partage sécurisé avec les intervenants'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Finance & CFC',
      description: 'Budgets CFC, factures, acomptes et comptabilité analytique pour un suivi financier précis.',
      features: [
        'Comptabilité par centres de coûts (CFC)',
        'Facturation et acomptes',
        'Suivi budgétaire en temps réel',
        'Rapports financiers détaillés'
      ]
    },
    {
      icon: ClipboardCheck,
      title: 'Soumissions',
      description: 'Gérez vos appels d\'offres, comparez les offres et adjudiquez aux entreprises.',
      features: [
        'Création de soumissions',
        'Comparaison multi-critères des offres',
        'Adjudication simplifiée',
        'Export vers CFC'
      ]
    },
    {
      icon: Package,
      title: 'Choix matériaux',
      description: 'Catalogue de matériaux personnalisable, choix acheteurs et rendez-vous fournisseurs.',
      features: [
        'Catalogue matériaux par catégorie',
        'Options et suppléments',
        'Rendez-vous showroom',
        'Validation des choix'
      ]
    },
    {
      icon: Hammer,
      title: 'Planning & Chantier',
      description: 'Planification phases, suivi travaux, photos chantier et journal de chantier.',
      features: [
        'Gantt interactif',
        'Photos géolocalisées',
        'Journal de chantier',
        'Suivi avancement par lot'
      ]
    },
    {
      icon: Calendar,
      title: 'Rendez-vous fournisseurs',
      description: 'Agenda partagé pour les rendez-vous showroom avec les acheteurs.',
      features: [
        'Showrooms fournisseurs',
        'Créneaux disponibles',
        'Réservation en ligne',
        'Notifications automatiques'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Messagerie interne, notifications et historique des échanges par projet.',
      features: [
        'Threads de discussion par projet',
        'Notifications en temps réel',
        'Pièces jointes',
        'Historique centralisé'
      ]
    },
    {
      icon: Wrench,
      title: 'SAV Post-livraison',
      description: 'Gestion des garanties, réclamations et interventions après livraison.',
      features: [
        'Tickets de réclamation',
        'Suivi des interventions',
        'Garanties biennales',
        'Satisfaction acheteurs'
      ]
    },
    {
      icon: BarChart3,
      title: 'Reporting & Analytics',
      description: 'Dashboards et rapports personnalisables pour piloter votre activité.',
      features: [
        'KPIs en temps réel',
        'Rapports ventes et finances',
        'Analyse CFC',
        'Export Excel/PDF'
      ]
    },
    {
      icon: Shield,
      title: 'Sécurité & Conformité',
      description: 'Multi-tenant, RBAC, audit log et conformité RGPD.',
      features: [
        'Isolation totale multi-tenant',
        'Contrôle d\'accès par rôle (RBAC)',
        'Audit log complet',
        'Hébergement Suisse'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <RealProLogo width={200} height={60} />
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">
                Essayer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Une suite complète d'outils professionnels
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            RealPro regroupe tous les modules dont vous avez besoin pour gérer vos projets immobiliers de bout en bout.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {modules.map((module) => (
            <div
              key={module.title}
              className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <module.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {module.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 ml-16">
                {module.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 dark:bg-neutral-900/50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Prêt à découvrir RealPro ?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Essayez gratuitement pendant 14 jours, sans carte bancaire
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="px-8 py-6 text-lg">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
