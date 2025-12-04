import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planSlug = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'MONTHLY';

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (planSlug) {
      fetchPlan();
    } else {
      navigate('/auth/choose-plan');
    }
  }, [planSlug]);

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('slug', planSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPlan(data);
      } else {
        navigate('/auth/choose-plan');
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
      navigate('/auth/choose-plan');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();

      const company = user.user_metadata?.company || 'Mon Entreprise';
      const fullName = userData
        ? `${userData.first_name} ${userData.last_name}`
        : user.email?.split('@')[0];

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: company,
          slug: company.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          default_language: 'FR',
          is_active: true
        })
        .select()
        .single();

      if (orgError) throw orgError;

      await supabase.from('user_organizations').insert({
        user_id: user.id,
        organization_id: orgData.id,
        is_default: true
      });

      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + (plan.trial_days || 14));

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + (cycle === 'YEARLY' ? 12 : 1));

      await supabase.from('subscriptions').insert({
        organization_id: orgData.id,
        plan_id: plan.id,
        status: 'TRIAL',
        billing_cycle: cycle,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_start: new Date().toISOString(),
        trial_end: trialEnd.toISOString(),
        cancel_at_period_end: false
      });

      navigate('/auth/success');
    } catch (err) {
      console.error('Error processing checkout:', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const price = cycle === 'MONTHLY' ? plan.price_monthly : plan.price_yearly;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <RealProLogo width={160} height={50} />
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Confirmez votre abonnement
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Essai gratuit de {plan.trial_days} jours, sans engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Récapitulatif de votre commande
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Plan {plan.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Facturation {cycle === 'MONTHLY' ? 'mensuelle' : 'annuelle'}
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {price}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-neutral-900 dark:text-neutral-100">Total</span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    CHF {price} /{cycle === 'MONTHLY' ? 'mois' : 'an'}
                  </span>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  🎉 Essai gratuit de {plan.trial_days} jours
                </p>
                <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                  Vous ne serez pas facturé avant la fin de la période d'essai. Vous pouvez annuler à tout moment.
                </p>
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Inclus dans votre plan :
              </h3>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div>
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Paiement sécurisé
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      via Datatrans (PSP Suisse)
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-6 text-center">
                  <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Le paiement sera traité via notre partenaire sécurisé Datatrans
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                    <span>Visa</span>
                    <span>•</span>
                    <span>Mastercard</span>
                    <span>•</span>
                    <span>TWINT</span>
                    <span>•</span>
                    <span>Postfinance</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  size="lg"
                  className="w-full mb-4"
                >
                  {processing ? 'Création de votre compte...' : 'Commencer l\'essai gratuit'}
                </Button>

                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé et crypté</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-sm">
                  Garanties
                </h3>
                <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>Annulation à tout moment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>Sans engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>Données hébergées en Suisse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>Conformité RGPD</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/auth/choose-plan" className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
            <ArrowLeft className="w-4 h-4" />
            Changer de plan
          </Link>
        </div>
      </div>
    </div>
  );
}
