import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { Check, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      price: 199,
      priceYearly: 1990,
      description: 'Parfait pour débuter avec des projets de petite taille',
      features: [
        '3 projets maximum',
        '5 utilisateurs',
        '10 GB de stockage',
        'Gestion de projets',
        'Lots et ventes',
        'CRM acquéreurs',
        'Documents et templates',
        'Support email'
      ],
      limits: {
        projects: 3,
        users: 5,
        storage: 10
      },
      highlighted: false
    },
    {
      name: 'Professional',
      slug: 'professional',
      price: 499,
      priceYearly: 4990,
      description: 'Pour les promoteurs gérant plusieurs projets simultanément',
      features: [
        '15 projets maximum',
        '25 utilisateurs',
        '50 GB de stockage',
        'Toutes les fonctionnalités Starter',
        'Soumissions et adjudications',
        'Finance et CFC',
        'Choix matériaux',
        'Planning chantier',
        'Rendez-vous fournisseurs',
        'API access',
        'Support prioritaire'
      ],
      limits: {
        projects: 15,
        users: 25,
        storage: 50
      },
      highlighted: true
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 999,
      priceYearly: 9990,
      description: 'Solution complète pour les grands promoteurs',
      features: [
        'Projets illimités',
        'Utilisateurs illimités',
        '200 GB de stockage',
        'Toutes les fonctionnalités Professional',
        'Custom branding',
        'Dedicated success manager',
        'Support 24/7',
        'Formation équipe',
        'SLA garanti',
        'Audit et compliance'
      ],
      limits: {
        projects: -1,
        users: -1,
        storage: 200
      },
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <RealProLogo size="lg" />
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Tous les plans incluent 14 jours d'essai gratuit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.slug}
              className={`relative ${plan.highlighted ? 'border-2 border-primary-500 shadow-xl scale-105' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white px-4 py-1">
                    Recommandé
                  </Badge>
                </div>
              )}

              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                      CHF {plan.price}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      /mois
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    ou CHF {plan.priceYearly}/an (économisez 2 mois)
                  </p>
                </div>

                <Link to={`/auth/register?plan=${plan.slug}`}>
                  <Button
                    className={`w-full mb-6 ${plan.highlighted ? '' : 'variant-outline'}`}
                    size="lg"
                  >
                    Commencer l'essai gratuit
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont appliqués immédiatement et vous êtes facturé au prorata.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Comment fonctionne l'essai gratuit ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Vous bénéficiez de 14 jours d'essai gratuit sans carte bancaire. À la fin de la période d'essai, vous pouvez choisir de souscrire à un plan payant.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Nous acceptons toutes les cartes de crédit majeures (Visa, Mastercard, Amex), TWINT et Postfinance via notre partenaire Datatrans.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Où sont hébergées mes données ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Toutes vos données sont hébergées en Suisse et sont conformes aux réglementations suisses et européennes (RGPD).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Besoin d'un plan personnalisé ?
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Pour les grandes organisations avec des besoins spécifiques, contactez-nous pour un devis sur mesure.
        </p>
        <Link to="/contact">
          <Button size="lg" variant="outline">
            Nous contacter
          </Button>
        </Link>
      </section>
    </div>
  );
}
