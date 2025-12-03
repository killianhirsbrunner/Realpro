import { useEffect, useState } from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';

type BillingOverviewResponse = {
  organization: {
    id: string;
    name: string;
  };
  currentSubscription: {
    planCode: string;
    planName: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  } | null;
  availablePlans: {
    code: string;
    name: string;
    priceCents: number;
    currency: string;
    interval: string;
    features?: Record<string, any>;
  }[];
  usage: {
    projectsCount: number;
    usersCount: number;
  };
};

export function BillingPage() {
  const [data, setData] = useState<BillingOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingOverview();
  }, []);

  const fetchBillingOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/billing`;

      const response = await fetch(`${apiUrl}/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: '10000000-0000-0000-0000-000000000001'
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la facturation');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les informations de facturation');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (planCode: string) => {
    setError(null);
    setMessage(null);
    setLoadingPlan(planCode);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/billing`;

      const response = await fetch(`${apiUrl}/change-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: '10000000-0000-0000-0000-000000000001',
          planCode,
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
    setError(null);
    setMessage(null);
    setLoadingPayment(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/billing`;

      const response = await fetch(`${apiUrl}/payment-methods/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: '10000000-0000-0000-0000-000000000001',
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
        <h1 className="text-2xl font-semibold text-gray-900">
          Facturation & abonnement
        </h1>
        <Card className="mt-4">
          <div className="flex items-center gap-3 text-red-700">
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
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Administration · Facturation
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Facturation & abonnement
        </h1>
        <p className="text-sm text-gray-500">
          Gérez votre abonnement, vos plans et les moyens de paiement pour votre
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
            <p className="text-sm font-semibold text-gray-900">Organisation</p>
            <p className="text-sm text-gray-700 mt-1">{data.organization.name}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Abonnement actuel
                </p>
                {current ? (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {current.planName} ({current.planCode})
                      </p>
                      <Badge variant={getStatusVariant(current.status)}>
                        {renderSubStatus(current.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Période du {formatDate(current.currentPeriodStart)} au{' '}
                      {formatDate(current.currentPeriodEnd)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Aucun abonnement actif. Choisissez un plan ci-dessous pour démarrer
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {data.usage.projectsCount}
                    </p>
                    <p className="text-xs text-gray-500">Projets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {data.usage.usersCount}
                    </p>
                    <p className="text-xs text-gray-500">Utilisateurs</p>
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
            <CreditCard className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-semibold text-gray-900">Moyen de paiement</p>
          </div>
          <p className="text-sm text-gray-500">
            Configurez un moyen de paiement via Datatrans pour le prélèvement
            automatique de vos abonnements
          </p>
          <Button
            onClick={handleInitPaymentMethod}
            disabled={loadingPayment}
            variant="primary"
          >
            {loadingPayment ? 'Initialisation…' : 'Configurer un moyen de paiement'}
          </Button>
        </div>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Plans disponibles</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = current?.planCode === plan.code;
            const price = plan.priceCents / 100;
            const periodLabel = plan.interval === 'year' ? 'par an' : 'par mois';
            const features = getPlanFeatures(plan);

            return (
              <Card
                key={plan.code}
                className={`flex flex-col ${
                  isCurrent ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {plan.name}
                      </p>
                      {plan.code === 'PRO' && (
                        <Badge variant="success">Recommandé</Badge>
                      )}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {plan.code}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
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
                      onClick={() => handleChangePlan(plan.code)}
                      disabled={loadingPlan === plan.code}
                      variant={plan.code === 'PRO' ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {loadingPlan === plan.code
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

function getPlanFeatures(plan: BillingOverviewResponse['availablePlans'][0]): string[] {
  if (!plan.features) return [];

  const features: string[] = [];
  const f = plan.features;

  if (f.maxProjects !== undefined) {
    features.push(
      f.maxProjects === 999
        ? 'Projets illimités'
        : `Jusqu'à ${f.maxProjects} projets`
    );
  }
  if (f.maxUsers !== undefined) {
    features.push(
      f.maxUsers === 999
        ? 'Utilisateurs illimités'
        : `Jusqu'à ${f.maxUsers} utilisateurs`
    );
  }
  if (f.maxStorageGb !== undefined) {
    features.push(`${f.maxStorageGb} Go de stockage`);
  }
  if (f.support) {
    const supportLabels: Record<string, string> = {
      email: 'Support par email',
      priority: 'Support prioritaire',
      dedicated: 'Support dédié',
    };
    features.push(supportLabels[f.support] || f.support);
  }
  if (f.customBranding) {
    features.push('Personnalisation branding');
  }
  if (f.whiteLabel) {
    features.push('Marque blanche');
  }
  if (f.apiAccess) {
    features.push('Accès API complet');
  }

  return features;
}

function getStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
    ACTIVE: 'success',
    TRIALING: 'default',
    PAST_DUE: 'danger',
    CANCELLED: 'default',
    SUSPENDED: 'danger',
  };
  return map[status] || 'default';
}

function renderSubStatus(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Actif',
    TRIALING: 'Période d\'essai',
    PAST_DUE: 'Paiement en retard',
    CANCELLED: 'Résilié',
    SUSPENDED: 'Suspendu',
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
