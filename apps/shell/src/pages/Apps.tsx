import { Building2, Users, Home, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const apps = [
  {
    id: 'ppe',
    name: 'PPE Admin',
    subtitle: 'Administrateur de coproprietes',
    description:
      'Solution complete pour les syndics et administrateurs de PPE. Gerez vos assemblees generales, charges, fonds de renovation et communications avec les coproprietaires.',
    icon: Building2,
    href: '/ppe',
    color: 'blue',
    modules: [
      'Immeubles & lots',
      'Coproprietaires',
      'Assemblees generales',
      'Budget previsionnel',
      'Comptabilite PPE',
      'Charges & decomptes',
      'Fonds de renovation',
      'Travaux & entretien',
      'Portail coproprietaires',
    ],
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    subtitle: 'Promotion immobiliere',
    description:
      'Pilotez vos projets immobiliers de A a Z. CRM, ventes, suivi chantier, finance CFC, soumissions et gestion des acquereurs dans une seule plateforme.',
    icon: Home,
    href: '/promoteur',
    color: 'emerald',
    modules: [
      'Gestion de projets',
      'Lots & inventaire',
      'CRM & prospects',
      'Acquereurs',
      'Finance & CFC',
      'Suivi chantier',
      'Materiaux & choix',
      'Soumissions',
      'Notaire & legal',
      'SAV',
    ],
  },
  {
    id: 'regie',
    name: 'Regie',
    subtitle: 'Gerance immobiliere',
    description:
      'Gerez votre portefeuille locatif avec efficacite. Baux, loyers, etats des lieux, maintenance et comptabilite mandants pour une gerance professionnelle.',
    icon: Users,
    href: '/regie',
    color: 'purple',
    modules: [
      'Immeubles & objets',
      'Proprietaires',
      'Locataires',
      'Baux & contrats',
      'Loyers & encaissements',
      'Charges & decomptes',
      'Etats des lieux',
      'Maintenance',
      'Comptabilite gerance',
      'Portails locataires/proprietaires',
    ],
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
};

export function AppsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Nos applications</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl">
            3 applications independantes, chacune specialisee pour son metier.
            Choisissez celle qui correspond a votre activite.
          </p>
        </div>
      </section>

      {/* Apps Detail */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {apps.map((app, index) => {
              const colors = colorClasses[app.color as keyof typeof colorClasses];
              const isReversed = index % 2 === 1;

              return (
                <div
                  key={app.id}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 ${colors.bgLight} ${colors.text} px-3 py-1 rounded-full text-sm font-medium mb-4`}>
                      <app.icon className="h-4 w-4" />
                      {app.subtitle}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{app.name}</h2>
                    <p className="mt-4 text-lg text-gray-600">{app.description}</p>

                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                        Modules inclus
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {app.modules.map((module) => (
                          <span
                            key={module}
                            className={`px-3 py-1 rounded-lg ${colors.bgLight} ${colors.text} text-sm`}
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={app.href}
                      className={`mt-8 inline-flex items-center gap-2 ${colors.bg} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                    >
                      Acceder a {app.name}
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </div>

                  {/* Visual */}
                  <div className={`flex-1 ${colors.bgLight} rounded-2xl p-8 aspect-video flex items-center justify-center`}>
                    <app.icon className={`h-32 w-32 ${colors.text} opacity-50`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Points communs a toutes les applications
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Securite suisse</h3>
              <p className="mt-2 text-gray-600">
                Donnees hebergees en Suisse, conforme LPD/RGPD.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Zap className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <p className="mt-2 text-gray-600">
                Interface rapide et reactive pour une productivite maximale.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Globe className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Multilingue</h3>
              <p className="mt-2 text-gray-600">
                Disponible en FR, DE, EN et IT pour toute la Suisse.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
