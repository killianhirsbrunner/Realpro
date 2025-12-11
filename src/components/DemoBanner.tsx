import { useState } from 'react';
import { Sparkles, X, ChevronRight, Rocket, Clock, ArrowRight } from 'lucide-react';
import { useIsDemoMode } from '../hooks/useDemoMode';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus';
import { Link } from 'react-router-dom';

export function DemoBanner() {
  const isDemoMode = useIsDemoMode();
  const { isDemo, daysRemaining, loading } = useSubscriptionStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  // Utiliser soit le mode démo classique, soit le nouveau système de souscription démo
  const showBanner = isDemoMode || isDemo;

  // Ne rien afficher si pas en mode démo ou si le banner est fermé
  if (loading || !showBanner || isDismissed) {
    return null;
  }

  // Couleur en fonction du nombre de jours restants
  const getBannerStyle = () => {
    if (daysRemaining === null) return 'from-emerald-600 via-emerald-500 to-teal-500';
    if (daysRemaining <= 3) return 'from-red-600 via-red-500 to-orange-500';
    if (daysRemaining <= 7) return 'from-amber-600 via-amber-500 to-yellow-500';
    return 'from-emerald-600 via-emerald-500 to-teal-500';
  };

  const getMessage = () => {
    if (daysRemaining === null) return 'Explorez toutes les fonctionnalités de RealPro sans engagement';
    if (daysRemaining === 0) return 'Dernier jour de votre essai gratuit !';
    if (daysRemaining === 1) return 'Plus que 1 jour d\'essai gratuit';
    if (daysRemaining <= 3) return `Plus que ${daysRemaining} jours d'essai - Passez à un plan payant`;
    return `${daysRemaining} jours restants dans votre essai gratuit`;
  };

  return (
    <div className={`bg-gradient-to-r ${getBannerStyle()} text-white px-4 py-2.5 relative overflow-hidden`}>
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            {daysRemaining !== null && daysRemaining <= 7 ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="text-xs font-bold uppercase tracking-wide">
              {daysRemaining !== null ? `${daysRemaining}j restants` : 'Mode Démo'}
            </span>
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {getMessage()}
          </span>
          <span className="text-sm font-medium sm:hidden">
            {daysRemaining !== null ? `${daysRemaining}j restants` : 'Accès démo'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Lien vers les plans payants si proche de l'expiration */}
          {daysRemaining !== null && daysRemaining <= 7 ? (
            <Link
              to="/auth/choose-plan"
              className="group flex items-center gap-1.5 bg-white text-neutral-800 hover:bg-neutral-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            >
              <span className="hidden sm:inline">Passer au plan payant</span>
              <span className="sm:hidden">Upgrade</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              to="/projects/new"
              className="group flex items-center gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Créer un projet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Bouton de fermeture */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fermer le banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant badge démo plus petit pour les endroits où un banner complet serait trop
export function DemoBadge() {
  const isDemoMode = useIsDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold">
      <Sparkles className="w-3 h-3" />
      <span>Démo</span>
    </div>
  );
}
