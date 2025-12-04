import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Check,
  ArrowRight,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { useOrganizationDashboard } from '../hooks/useOrganizationData';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    billingPeriod: 'mois',
    yearlyPrice: 990,
    features: [
      '5 projets actifs',
      '10 utilisateurs',
      '50 GB de stockage',
      'Support email',
      'Exports PDF',
    ],
    maxProjects: 5,
    maxUsers: 10,
    storageGb: 50,
  },
  {
    id: 'business',
    name: 'Business',
    price: 299,
    billingPeriod: 'mois',
    yearlyPrice: 2990,
    features: [
      '20 projets actifs',
      '50 utilisateurs',
      '500 GB de stockage',
      'Support prioritaire',
      'Exports avancés',
      'API access',
      'Intégrations tierces',
    ],
    maxProjects: 20,
    maxUsers: 50,
    storageGb: 500,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    billingPeriod: 'mois',
    yearlyPrice: 7990,
    features: [
      'Projets illimités',
      'Utilisateurs illimités',
      'Stockage illimité',
      'Support 24/7',
      'Gestionnaire de compte dédié',
      'SLA garanti',
      'Branding personnalisé',
      'Formation sur site',
    ],
    maxProjects: -1,
    maxUsers: -1,
    storageGb: -1,
  },
];

export default function SubscriptionManagement() {
  const { data, loading } = useOrganizationDashboard();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentPlan = data?.subscription?.plan_name?.toLowerCase() || data?.organization?.plan?.toLowerCase() || 'starter';
  const subscription = data?.subscription;

  const handleUpgrade = async (planId: string) => {
    setProcessingPlan(planId);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/billing/create-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_period: billingPeriod,
          organization_id: data?.organization?.id,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création du paiement');

      const { payment_url } = await response.json();

      if (payment_url) {
        window.location.href = payment_url;
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du paiement');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <header className="space-y-3">
          <Link
            to="/company"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour à l'entreprise
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Gestion de l'abonnement
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Choisissez le forfait adapté à vos besoins
            </p>
          </div>
        </header>

        {subscription && (
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Abonnement actif
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {subscription.plan_name} - CHF {subscription.price?.toLocaleString('fr-CH')} /{' '}
                      {subscription.billing_period === 'YEARLY' ? 'an' : 'mois'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">
                      Status
                    </p>
                    <Badge variant="success">{subscription.status}</Badge>
                  </div>
                  {subscription.next_billing_date && (
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">
                        Prochaine facturation
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {new Date(subscription.next_billing_date).toLocaleDateString('fr-CH')}
                        </span>
                      </div>
                    </div>
                  )}
                  {subscription.payment_method && (
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">
                        Moyen de paiement
                      </p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {subscription.payment_method}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-center gap-4 p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit mx-auto">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              billingPeriod === 'yearly'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Annuel
            <Badge variant="success" className="text-xs">
              -17%
            </Badge>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price;
            const period = billingPeriod === 'yearly' ? 'an' : 'mois';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  plan.popular
                    ? 'border-primary-300 dark:border-primary-700 shadow-xl scale-105'
                    : 'border-neutral-200 dark:border-neutral-800'
                } bg-white dark:bg-neutral-900`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="success" className="shadow-lg">
                      Plus populaire
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-xl ${
                      plan.popular
                        ? 'bg-primary-100 dark:bg-primary-900/30'
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      <Package className={`w-6 h-6 ${
                        plan.popular
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                      CHF {price.toLocaleString('fr-CH')}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">/ {period}</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Économisez CHF {(plan.price * 12 - plan.yearlyPrice).toLocaleString('fr-CH')} par an
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Forfait actuel
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={processingPlan === plan.id}
                  >
                    {processingPlan === plan.id ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Traitement...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {currentPlan === 'starter' || plan.id === 'enterprise' ? 'Passer à' : 'Changer pour'} {plan.name}
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Paiement sécurisé par Datatrans
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Les paiements des abonnements RealPro sont traités de manière sécurisée par Datatrans,
                leader suisse du paiement en ligne. Vos données bancaires ne sont jamais stockées sur nos serveurs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
