import { CheckCircle, Building2, Home, Users } from 'lucide-react';

const plans = [
  {
    app: 'PPE Admin',
    icon: Building2,
    color: 'blue',
    tiers: [
      {
        name: 'Starter',
        price: '49',
        unit: '/mois',
        description: 'Ideal pour les petites coproprietes',
        features: [
          'Jusqu\'a 3 immeubles',
          '50 lots maximum',
          'Assemblees generales',
          'Comptabilite de base',
          'Support email',
        ],
      },
      {
        name: 'Pro',
        price: '149',
        unit: '/mois',
        popular: true,
        description: 'Pour les syndics professionnels',
        features: [
          'Jusqu\'a 20 immeubles',
          '500 lots maximum',
          'Toutes les fonctionnalites',
          'Portail coproprietaires',
          'Support prioritaire',
          'API access',
        ],
      },
      {
        name: 'Enterprise',
        price: 'Sur mesure',
        unit: '',
        description: 'Grandes structures',
        features: [
          'Immeubles illimites',
          'Lots illimites',
          'Multi-entites',
          'SSO / SAML',
          'Support dedie',
          'Formation sur site',
        ],
      },
    ],
  },
  {
    app: 'Promoteur',
    icon: Home,
    color: 'emerald',
    tiers: [
      {
        name: 'Starter',
        price: '99',
        unit: '/mois',
        description: 'Pour les petits promoteurs',
        features: [
          '1 projet actif',
          '20 lots maximum',
          'CRM basique',
          'Suivi ventes',
          'Support email',
        ],
      },
      {
        name: 'Pro',
        price: '299',
        unit: '/mois',
        popular: true,
        description: 'Pour les promoteurs etablis',
        features: [
          '5 projets actifs',
          '200 lots maximum',
          'CRM complet',
          'Finance & CFC',
          'Portail acquereurs',
          'Support prioritaire',
        ],
      },
      {
        name: 'Enterprise',
        price: 'Sur mesure',
        unit: '',
        description: 'Grands promoteurs',
        features: [
          'Projets illimites',
          'Lots illimites',
          'Multi-entites',
          'Integrations custom',
          'Support dedie',
          'SLA garanti',
        ],
      },
    ],
  },
  {
    app: 'Regie',
    icon: Users,
    color: 'purple',
    tiers: [
      {
        name: 'Starter',
        price: '79',
        unit: '/mois',
        description: 'Petites regies',
        features: [
          'Jusqu\'a 5 immeubles',
          '50 objets locatifs',
          'Gestion baux',
          'Encaissements',
          'Support email',
        ],
      },
      {
        name: 'Pro',
        price: '199',
        unit: '/mois',
        popular: true,
        description: 'Regies etablies',
        features: [
          'Jusqu\'a 30 immeubles',
          '500 objets locatifs',
          'Toutes fonctionnalites',
          'Portails web',
          'Comptabilite mandants',
          'Support prioritaire',
        ],
      },
      {
        name: 'Enterprise',
        price: 'Sur mesure',
        unit: '',
        description: 'Grandes regies',
        features: [
          'Objets illimites',
          'Multi-entites',
          'Integrations comptables',
          'SSO / SAML',
          'Support dedie',
          'Formation',
        ],
      },
    ],
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600' },
};

export function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold">Tarifs transparents</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Choisissez le plan adapte a votre activite. Tous les prix sont en CHF HT.
          </p>
        </div>
      </section>

      {/* Pricing by App */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {plans.map((plan) => {
            const colors = colorClasses[plan.color as keyof typeof colorClasses];
            return (
              <div key={plan.app} className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${colors.light}`}>
                    <plan.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{plan.app}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {plan.tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`rounded-2xl border-2 ${
                        tier.popular ? 'border-primary-500 shadow-lg' : 'border-gray-200'
                      } bg-white overflow-hidden`}
                    >
                      {tier.popular && (
                        <div className="bg-primary-500 text-white text-center py-2 text-sm font-medium">
                          Le plus populaire
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{tier.description}</p>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-gray-900">
                            {tier.price}
                          </span>
                          <span className="text-gray-600">{tier.unit}</span>
                        </div>
                        <ul className="mt-6 space-y-3">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`mt-6 w-full py-3 rounded-lg font-medium ${
                            tier.popular
                              ? `${colors.bg} text-white hover:opacity-90`
                              : 'border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                          } transition-all`}
                        >
                          {tier.price === 'Sur mesure' ? 'Nous contacter' : 'Commencer'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Questions frequentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900">Puis-je utiliser plusieurs applications ?</h3>
              <p className="mt-2 text-gray-600">
                Oui, chaque application est independante. Vous pouvez souscrire aux applications
                dont vous avez besoin avec un compte unique.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900">Y a-t-il un engagement ?</h3>
              <p className="mt-2 text-gray-600">
                Non, tous nos plans sont sans engagement. Vous pouvez annuler a tout moment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900">Ou sont hebergees mes donnees ?</h3>
              <p className="mt-2 text-gray-600">
                Toutes les donnees sont hebergees en Suisse, dans des datacenters certifies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
