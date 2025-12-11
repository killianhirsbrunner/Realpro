/**
 * RealPro | © 2024-2025 Realpro SA. Tous droits réservés.
 * Trial expired page - shown when 14-day trial has ended
 */

import { Link, useNavigate } from 'react-router-dom';
import { Clock, Check, ArrowRight, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { supabase } from '../../lib/supabase';
import { PLANS } from '../../lib/subscription';

export function TrialExpired() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUpgrade = (planId: string) => {
    navigate(`/auth/checkout?plan=${planId}&cycle=MONTHLY`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-brand-100/20 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-900 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Link to="/">
          <RealProLogo variant="full" size="md" />
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Expired message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
              <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Votre période d'essai est terminée
            </h1>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Merci d'avoir testé RealPro pendant 14 jours. Pour continuer à utiliser toutes les
              fonctionnalités et accéder à vos projets, choisissez un forfait adapté à vos besoins.
            </p>
          </div>

          {/* What you'll keep */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mb-10">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              En souscrivant, vous conservez :
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Tous vos projets et données existants
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Vos documents et configurations
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Votre équipe et les accès configurés
                </span>
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-2 border-brand-500 shadow-xl md:scale-105'
                    : 'border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-600 text-white px-3 py-0.5">
                      Recommandé
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                        CHF {plan.price}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full gap-2"
                  >
                    Choisir {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help text */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-500">
            Des questions ? {' '}
            <Link to="/contact" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
              Contactez notre équipe
            </Link>
            {' '} — nous sommes là pour vous aider.
          </p>
        </div>
      </main>
    </div>
  );
}
