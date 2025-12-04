import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';

export function Landing() {
  const features = [
    {
      icon: Building2,
      title: 'Gestion de projets',
      description: 'Gérez vos projets PPE/QPT de A à Z avec une vision claire et centralisée'
    },
    {
      icon: Users,
      title: 'CRM Acquéreurs',
      description: 'Pipeline complet de la réservation à la signature notariée'
    },
    {
      icon: FileText,
      title: 'Documents & Notaires',
      description: 'GED intégrée avec versioning et dossiers notariés structurés'
    },
    {
      icon: TrendingUp,
      title: 'Finance & CFC',
      description: 'Budgets, factures, acomptes et comptabilité analytique'
    },
    {
      icon: Shield,
      title: 'Sécurité Suisse',
      description: 'Hébergement Suisse, conformité RGPD, isolation multi-tenant'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Interface rapide et intuitive, pensée pour les professionnels'
    }
  ];

  const testimonials = [
    {
      quote: "RealPro a transformé notre façon de gérer les projets. Tout est centralisé et accessible.",
      author: "Jean Dupont",
      role: "Directeur, Promotions Genevoises SA"
    },
    {
      quote: "L'interface est intuitive et les modules sont exactement ce dont nous avions besoin.",
      author: "Marie Schmidt",
      role: "Gérante, Architecture & Développement"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <RealProLogo width={140} height={40} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/pricing" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition">
              Tarifs
            </Link>
            <Link to="/features" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition">
              Fonctionnalités
            </Link>
            <Link to="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition">
              Contact
            </Link>
          </nav>

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

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
          La plateforme complète<br />
          pour gérer vos projets<br />
          immobiliers en Suisse
        </h1>

        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10">
          Ventes, documents, finances, notaires, soumissions, courtiers, acheteurs, planning.
          Tout centralisé dans une interface élégante et sécurisée.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/register">
            <Button size="lg" className="gap-2 px-8 py-6 text-lg">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Voir les tarifs
            </Button>
          </Link>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-6">
          14 jours d'essai gratuit • Sans carte bancaire • Annulation à tout moment
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Une suite complète d'outils professionnels pour l'immobilier
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 dark:bg-neutral-900/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre gestion de projets ?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez les promoteurs suisses qui font confiance à RealPro
          </p>
          <Link to="/auth/register">
            <Button size="lg" variant="outline" className="bg-white text-primary-700 hover:bg-neutral-100 border-0 px-8 py-6 text-lg">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <RealProLogo width={120} height={35} />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                La plateforme SaaS pour l'immobilier suisse
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-neutral-900 dark:hover:text-neutral-100">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/about" className="hover:text-neutral-900 dark:hover:text-neutral-100">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-neutral-900 dark:hover:text-neutral-100">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-neutral-900 dark:hover:text-neutral-100">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-neutral-900 dark:hover:text-neutral-100">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-100">Confidentialité</Link></li>
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
