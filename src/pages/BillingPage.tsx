import { useEffect, useState } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';

type BillingOverviewResponse = {
  organization: {
    id: string;
    name: string;
  };
  currentSubscription: {
    planSlug: string;
    planName: string;
    status: string;
    billingCycle: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    trialStart: string | null;
    trialEnd: string | null;
    features: any[];
    limits: Record<string, any>;
  } | null;
  availablePlans: {
    slug: string;
    name: string;
    description: Record<string, string>;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    features: any[];
    limits: Record<string, any>;
    trialDays: number;
  }[];
  usage: {
    projectsCount: number;
    usersCount: number;
  };
};

export function BillingPage() {
  const { organization } = useCurrentUser();
  const [data, setData] = useState<BillingOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    if (organization?.id) {
      fetchBillingOverview();
    }
  }, [organization?.id]);

  const fetchBillingOverview = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('id', organization.id)
        .maybeSingle();

      if (orgError) throw orgError;

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          status,
          billing_cycle,
          current_period_start,
          current_period_end,
          trial_start,
          trial_end,
          plan:plans(
            id,
            slug,
            name,
            price_monthly,
            price_yearly,
            currency,
            features,
            limits
          )
        `)
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (subError) throw subError;

      const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('id, slug, name, description, price_monthly, price_yearly, currency, features, limits, trial_days')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (plansError) throw plansError;

      const { count: projectsCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organization.id);

      const { count: usersCount } = await supabase
        .from('user_organizations')
        .select('user_id', { count: 'exact', head: true })
        .eq('organization_id', organization.id);

      const plan = subscription?.plan as any;

      const result: BillingOverviewResponse = {
        organization: {
          id: orgData?.id || organization.id,
          name: orgData?.name || organization.name,
        },
        currentSubscription: subscription && plan
          ? {
              planSlug: plan.slug,
              planName: plan.name,
              status: subscription.status,
              billingCycle: subscription.billing_cycle,
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
              trialStart: subscription.trial_start,
              trialEnd: subscription.trial_end,
              features: plan.features || [],
              limits: plan.limits || {},
            }
          : null,
        availablePlans: (plans || []).map((p: any) => ({
          slug: p.slug,
          name: p.name,
          description: p.description,
          priceMonthly: p.price_monthly,
          priceYearly: p.price_yearly,
          currency: p.currency,
          features: p.features || [],
          limits: p.limits || {},
          trialDays: p.trial_days || 0,
        })),
        usage: {
          projectsCount: projectsCount || 0,
          usersCount: usersCount || 0,
        },
      };

      setData(result);

      if (result.currentSubscription?.billingCycle) {
        setBillingCycle(result.currentSubscription.billingCycle as 'MONTHLY' | 'YEARLY');
      }
    } catch (err: any) {
      console.error('Billing fetch error:', err);
      setError(err.message || 'Impossible de charger les informations de facturation');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (planSlug: string) => {
    if (!organization?.id) return;

    setError(null);
    setMessage(null);
    setLoadingPlan(planSlug);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/billing/change-plan`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: organization.id,
          planSlug,
          billingCycle,
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Erreur lors du changement de plan');
      }

      await fetchBillingOverview();
      setMessage('Votre plan a été mis à jour avec succès');
    } catch (err: any) {
      setError(err.message || 'Impossible de changer de plan');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleInitPaymentMethod = async () => {
    if (!organization?.id) return;

    setError(null);
    setMessage(null);
    setLoadingPayment(true);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/billing/payment-methods/init`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: organization.id,
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(
          json?.error || 'Erreur lors de l\'initialisation du moyen de paiement'
        );
      }

      const result = await response.json();
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setMessage('La configuration du moyen de paiement a été initiée');
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de configurer le moyen de paiement');
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Facturation & abonnement
        </h1>
        <Card className="mt-4">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const current = data.currentSubscription;
  const plans = data.availablePlans;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Administration - Facturation
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Facturation & abonnement
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerez votre abonnement, vos plans et les moyens de paiement pour votre
          organisation
        </p>
      </header>

      {(message || error) && (
        <div className="space-y-2">
          {message && (
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-center gap-3 text-green-800">
                <Check className="w-5 h-5" />
                <p className="text-sm">{message}</p>
              </div>
            </Card>
          )}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Organisation</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{data.organization.name}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Abonnement actuel
                </p>
                {current ? (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {current.planName}
                      </p>
                      <Badge variant={getStatusVariant(current.status)}>
                        {renderSubStatus(current.status)}
                      </Badge>
                      <Badge variant="default">
                        {current.billingCycle === 'YEARLY' ? 'Annuel' : 'Mensuel'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Periode du {formatDate(current.currentPeriodStart)} au{' '}
                      {formatDate(current.currentPeriodEnd)}
                    </p>
                    {current.trialEnd && new Date(current.trialEnd) > new Date() && (
                      <p className="text-xs text-realpro-turquoise font-medium">
                        Periode d'essai jusqu'au {formatDate(current.trialEnd)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Aucun abonnement actif. Choisissez un plan ci-dessous pour demarrer
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.usage.projectsCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Projets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.usage.usersCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Utilisateurs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Moyen de paiement</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configurez un moyen de paiement via Datatrans pour le prelevement
            automatique de vos abonnements
          </p>
          <Button
            onClick={handleInitPaymentMethod}
            disabled={loadingPayment}
            variant="primary"
          >
            {loadingPayment ? 'Initialisation...' : 'Configurer un moyen de paiement'}
          </Button>
        </div>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plans disponibles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selectionnez le plan qui correspond le mieux a vos besoins
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 py-4">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billingCycle === 'MONTHLY'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billingCycle === 'YEARLY'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Annuel <span className="text-green-600 font-bold ml-1">(-17%)</span>
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = current?.planSlug === plan.slug && current?.billingCycle === billingCycle;
            const price = billingCycle === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;
            const periodLabel = billingCycle === 'YEARLY' ? 'par an' : 'par mois';

            return (
              <Card
                key={plan.slug}
                className={`flex flex-col ${
                  isCurrent ? 'ring-2 ring-brand-500 border-brand-500' : ''
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {plan.name}
                      </p>
                      {plan.slug === 'professional' && (
                        <Badge variant="success">Recommandé</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.description?.fr || ''}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
                    {plan.trialDays > 0 && (
                      <p className="text-xs text-brand-600 font-medium mt-1">
                        {plan.trialDays} jours d'essai gratuit
                      </p>
                    )}
                  </div>

                  {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {plan.limits && (
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 border-t pt-3">
                      {plan.limits.projects_max === -1 ? (
                        <div>Projets illimités</div>
                      ) : (
                        <div>Jusqu'à {plan.limits.projects_max} projets</div>
                      )}
                      {plan.limits.users_max === -1 ? (
                        <div>Utilisateurs illimités</div>
                      ) : (
                        <div>Jusqu'à {plan.limits.users_max} utilisateurs</div>
                      )}
                      {plan.limits.storage_gb && (
                        <div>{plan.limits.storage_gb} GB stockage</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  {isCurrent ? (
                    <div className="text-center">
                      <Badge variant="success" className="w-full justify-center py-2">
                        Plan actuel
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleChangePlan(plan.slug)}
                      disabled={loadingPlan === plan.slug}
                      variant={plan.slug === 'professional' ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {loadingPlan === plan.slug
                        ? 'Mise à jour…'
                        : 'Choisir ce plan'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function getStatusVariant(
  status: string
): 'default' | 'success' | 'yellow' | 'red' | 'gray' {
  const map: Record<string, 'default' | 'success' | 'yellow' | 'red' | 'gray'> = {
    ACTIVE: 'success',
    TRIAL: 'yellow',
    PAST_DUE: 'red',
    CANCELLED: 'gray',
    EXPIRED: 'gray',
  };
  return map[status] || 'default';
}

function renderSubStatus(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Actif',
    TRIAL: 'Période d\'essai',
    PAST_DUE: 'Paiement en retard',
    CANCELLED: 'Résilié',
    EXPIRED: 'Expiré',
  };
  return labels[status] || status;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
