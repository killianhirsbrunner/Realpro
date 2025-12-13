import { Link } from 'react-router-dom';
import { Building2, Users, Home, ArrowRight, CheckCircle } from 'lucide-react';

const apps = [
  {
    name: 'PPE Admin',
    description: 'Gestion de coproprietes (syndic)',
    icon: Building2,
    href: '/ppe',
    color: 'bg-blue-500',
    features: ['Assemblees generales', 'Charges & decomptes', 'Fonds de renovation'],
  },
  {
    name: 'Promoteur',
    description: 'Promotion immobiliere',
    icon: Home,
    href: '/promoteur',
    color: 'bg-emerald-500',
    features: ['Gestion de projets', 'CRM & ventes', 'Suivi chantier'],
  },
  {
    name: 'Regie',
    description: 'Gerance immobiliere',
    icon: Users,
    href: '/regie',
    color: 'bg-purple-500',
    features: ['Baux & locataires', 'Loyers & encaissements', 'Etats des lieux'],
  },
];

const stats = [
  { value: '500+', label: 'Immeubles geres' },
  { value: '10k+', label: 'Utilisateurs actifs' },
  { value: '99.9%', label: 'Disponibilite' },
  { value: 'CH', label: 'Heberge en Suisse' },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              La suite logicielle
              <br />
              <span className="text-primary-200">pour l'immobilier suisse</span>
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
              3 applications independantes pour gerer vos coproprietes,
              projets de promotion et portefeuilles de gerance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apps"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Decouvrir les apps
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Essai gratuit 30 jours
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">3 applications, 1 suite</h2>
            <p className="mt-4 text-lg text-gray-600">
              Chaque application est independante et specialisee pour son metier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app) => (
              <div
                key={app.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`${app.color} p-6 text-white`}>
                  <app.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold">{app.name}</h3>
                  <p className="text-white/80 mt-1">{app.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {app.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={app.href}
                    className="mt-6 block text-center py-3 px-4 rounded-lg border-2 border-gray-200 font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Acceder a {app.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Pret a moderniser votre gestion immobiliere ?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Essayez Realpro Suite gratuitement pendant 30 jours.
          </p>
          <a
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
          >
            Commencer maintenant
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
