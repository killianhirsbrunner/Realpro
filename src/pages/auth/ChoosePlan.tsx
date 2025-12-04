import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: Record<string, string>;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  limits: {
    projects_max: number;
    users_max: number;
    storage_gb: number;
    api_access?: boolean;
  };
  trial_days: number;
  sort_order: number;
}

export function ChoosePlan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('preselected');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(preselected);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data) {
        setPlans(data);
        if (preselected) {
          const preselectedPlan = data.find(p => p.slug === preselected);
          if (preselectedPlan) {
            setSelectedPlan(preselectedPlan.slug);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedPlan) return;
    navigate(`/auth/checkout?plan=${selectedPlan}&cycle=${billingCycle}`);
  };

  const getPrice = (plan: Plan) => {
    return billingCycle === 'MONTHLY' ? plan.price_monthly : plan.price_yearly;
  };

  const getSavings = (plan: Plan) => {
    const monthlyTotal = plan.price_monthly * 12;
    const savings = monthlyTotal - plan.price_yearly;
    return Math.round(savings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8 transition-opacity hover:opacity-80">
            <RealProLogo size="lg" />
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Choisissez votre plan
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Tous les plans incluent {plans[0]?.trial_days || 14} jours d'essai gratuit
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              billingCycle === 'MONTHLY'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-6 py-2 rounded-lg font-medium transition relative ${
              billingCycle === 'YEARLY'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            Annuel
            <Badge className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-0.5">
              -17%
            </Badge>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.slug
                  ? 'border-2 border-primary-500 shadow-xl scale-105'
                  : 'border border-neutral-200 dark:border-neutral-800 hover:shadow-lg'
              } ${plan.slug === 'professional' ? 'md:scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.slug)}
            >
              {plan.slug === 'professional' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white px-4 py-1">
                    Recommandé
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {plan.description.fr || plan.description.en}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                      CHF {getPrice(plan)}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      /{billingCycle === 'MONTHLY' ? 'mois' : 'an'}
                    </span>
                  </div>

                  {billingCycle === 'YEARLY' && (
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Économisez CHF {getSavings(plan)} par an
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <p>
                    {plan.limits.projects_max === -1
                      ? 'Projets illimités'
                      : `Jusqu'à ${plan.limits.projects_max} projets`}
                  </p>
                  <p>
                    {plan.limits.users_max === -1
                      ? 'Utilisateurs illimités'
                      : `Jusqu'à ${plan.limits.users_max} utilisateurs`}
                  </p>
                  <p>{plan.limits.storage_gb} GB de stockage</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="px-12"
          >
            Continuer
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 mt-8">
          Vous pouvez changer de plan à tout moment. Aucune carte bancaire requise pour l'essai.
        </p>
      </div>
    </div>
  );
}
