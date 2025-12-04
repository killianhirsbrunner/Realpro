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
      title: 'Gestion de projets PPE/QPT',
      description: 'Pilotez vos programmes de A à Z : lots, bâtiments, planification, et avancement. Vision 360° en temps réel sur tous vos chantiers.'
    },
    {
      icon: Users,
      title: 'CRM & Pipeline de vente',
      description: 'Transformez vos prospects en acheteurs : réservations, contrats, courtiers, signatures notariées. Accélérez vos ventes avec un suivi précis.'
    },
    {
      icon: FileText,
      title: 'GED & Dossiers notariés',
      description: 'Centralisez tous vos documents : plans, contrats, actes notariés. Versioning automatique, accès sécurisés, zéro perte de temps.'
    },
    {
      icon: TrendingUp,
      title: 'Finance & Comptabilité CFC',
      description: 'Maîtrisez votre budget : soumissions, devis, factures, acomptes acheteurs. Comptabilité analytique intégrée selon normes CFC suisses.'
    },
    {
      icon: Shield,
      title: 'Sécurité & Conformité Suisse',
      description: 'Vos données hébergées en Suisse, conformité RGPD garantie, isolation multi-tenant absolue. Sécurité maximale pour votre activité.'
    },
    {
      icon: Zap,
      title: 'Interface professionnelle',
      description: 'Plateforme ultra-rapide, design moderne et intuitif. Vos équipes adoptent RealPro en quelques minutes, pas en plusieurs semaines.'
    }
  ];

  const testimonials = [
    {
      quote: "Nous avons divisé par 2 le temps passé sur la gestion administrative. RealPro centralise tout : lots, acheteurs, documents, finances. Notre équipe gagne plus de 15 heures par semaine.",
      author: "Jean Dupont",
      role: "Directeur, Promotions Genevoises SA"
    },
    {
      quote: "Enfin un logiciel pensé pour les promoteurs suisses. L'intégration avec les notaires et courtiers est impeccable. Nos projets avancent plus vite et avec beaucoup moins d'erreurs.",
      author: "Marie Schmidt",
      role: "Gérante, Schmidt Développement Immobilier"
    },
    {
      quote: "Le suivi financier en temps réel et la comptabilité CFC intégrée nous ont permis d'optimiser notre trésorerie et d'anticiper les écarts budgétaires. Un gain de productivité considérable.",
      author: "Pierre Rossi",
      role: "CFO, Immobilière Rossi & Partners"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <RealProLogo width={200} height={60} />
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Solution #1 pour les promoteurs immobiliers suisses
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight mb-6">
          Pilotez vos projets<br />
          immobiliers avec<br />
          <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">précision et efficacité</span>
        </h1>

        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto mb-10 leading-relaxed">
          De la première réservation à la livraison finale : centralisez vos ventes, documents, finances,
          notaires et chantiers dans une plateforme intuitive et sécurisée.
          <strong className="text-neutral-900 dark:text-neutral-100"> Gagnez du temps, réduisez les erreurs, augmentez votre rentabilité.</strong>
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

        <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium">14 jours gratuits</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium">Sans engagement</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium">Support en français</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium">Données en Suisse</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Toutes les fonctionnalités dont vous avez<br />réellement besoin, rien de superflu
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Conçu par des professionnels de l'immobilier suisse, pour des professionnels.
            Chaque module répond à un besoin concret de votre quotidien.
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
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Des promoteurs suisses qui gagnent<br />du temps et de l'argent avec RealPro
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mt-4">
              Rejoignez les sociétés qui ont choisi l'efficacité et la modernité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Arrêtez de perdre du temps avec des outils<br />qui ne sont pas faits pour vous
          </h2>
          <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-3xl mx-auto">
            RealPro est LA solution suisse pour gérer vos projets immobiliers de manière professionnelle.
            Rejoignez-nous dès maintenant et testez gratuitement pendant 14 jours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-neutral-100 border-0 px-10 py-7 text-lg font-semibold shadow-xl">
                Démarrer l'essai gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg">
                Demander une démo
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-80 mt-6">
            Sans engagement • Sans carte bancaire • Configuration en 5 minutes
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <RealProLogo width={180} height={55} />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 max-w-xs">
                La solution de gestion complète pour les promoteurs immobiliers suisses
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
