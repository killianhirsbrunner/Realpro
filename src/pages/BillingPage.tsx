import { Check, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useI18n } from '../lib/i18n';
import { usePlans, useSubscription } from '../hooks/useBilling';

export function BillingPage() {
  const { t, language } = useI18n();
  const { plans, loading: plansLoading } = usePlans();
  const { subscription, loading: subLoading } = useSubscription('');

  const getFeatures = (planFeatures: any): string[] => {
    if (!planFeatures || !Array.isArray(planFeatures)) return [];
    return planFeatures.map((f: any) => f[language.toLowerCase()] || f.en || '');
  };

  const getDescription = (planDesc: any): string => {
    if (!planDesc) return '';
    return planDesc[language.toLowerCase()] || planDesc.en || '';
  };

  const getStatusVariant = (
    status: string | undefined
  ): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      TRIAL: 'info',
      ACTIVE: 'success',
      PAST_DUE: 'danger',
      CANCELLED: 'default',
      EXPIRED: 'default',
    };
    return status ? map[status] || 'default' : 'default';
  };

  if (plansLoading || subLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('billing.title')}</h1>
        <p className="mt-1 text-gray-500">{t('billing.subscription')}</p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('billing.currentPlan')}</CardTitle>
              <Badge variant={getStatusVariant(subscription.status)}>
                {t(`billing.status.${subscription.status}`)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Cycle de facturation</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {t(`billing.${subscription.billing_cycle.toLowerCase()}`)}
                </p>
              </div>
              {subscription.status === 'TRIAL' && subscription.trial_end && (
                <div>
                  <p className="text-sm text-gray-500">{t('billing.trialEndsOn')}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(subscription.trial_end).toLocaleDateString('fr-CH')}
                  </p>
                </div>
              )}
              {subscription.status === 'ACTIVE' && (
                <div>
                  <p className="text-sm text-gray-500">{t('billing.nextBilling')}</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(subscription.current_period_end).toLocaleDateString(
                      'fr-CH'
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Plans disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              hover
              className="relative flex flex-col"
            >
              {plan.slug === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Recommandé</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-2">
                  {getDescription(plan.description)}
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price_monthly.toFixed(0)}
                    </span>
                    <span className="ml-2 text-gray-500">{t('billing.chfPerMonth')}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('billing.billedMonthly')}
                  </p>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {getFeatures(plan.features).map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.slug === 'pro' ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {subscription?.plan_id === plan.id
                    ? 'Plan actuel'
                    : t('billing.changePlan')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('billing.paymentMethods')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t('billing.noPaymentMethod')}</p>
              <Button variant="outline">{t('billing.addPaymentMethod')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('billing.invoices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune facture disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
