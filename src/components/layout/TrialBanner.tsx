/**
 * RealPro | © 2024-2025 Realpro SA. Tous droits réservés.
 * Trial period banner component
 */

import { Link } from 'react-router-dom';
import { Clock, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTrialStatus } from '../../hooks/useTrialStatus';
import clsx from 'clsx';

interface TrialBannerProps {
  className?: string;
}

export function TrialBanner({ className }: TrialBannerProps) {
  const { isTrialActive, daysRemaining, loading, hasActiveSubscription, subscriptionStatus } = useTrialStatus();
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if:
  // - Loading
  // - User has dismissed it
  // - User has active paid subscription
  // - Trial is not active
  // - No subscription status (new user)
  if (loading || dismissed || hasActiveSubscription || !isTrialActive || !subscriptionStatus) {
    return null;
  }

  // Determine urgency level
  const isUrgent = daysRemaining <= 3;
  const isWarning = daysRemaining <= 7 && daysRemaining > 3;

  const getMessage = () => {
    if (daysRemaining === 0) {
      return "Votre essai gratuit se termine aujourd'hui";
    }
    if (daysRemaining === 1) {
      return "Il vous reste 1 jour d'essai gratuit";
    }
    return `Il vous reste ${daysRemaining} jours d'essai gratuit`;
  };

  return (
    <div
      className={clsx(
        'relative flex items-center justify-between px-4 py-2.5 text-sm',
        {
          'bg-gradient-to-r from-red-600 to-red-700 text-white': isUrgent,
          'bg-gradient-to-r from-amber-500 to-orange-500 text-white': isWarning,
          'bg-realpro-turquoise text-white': !isUrgent && !isWarning,
        },
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={clsx(
          'flex items-center justify-center w-7 h-7 rounded-full',
          {
            'bg-white/20': true,
          }
        )}>
          {isUrgent ? (
            <Clock className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        <span className="font-medium">
          {getMessage()}
        </span>

        <span className="hidden sm:inline text-white/80">
          — Profitez de toutes les fonctionnalités sans limite
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/billing"
          className={clsx(
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-all hover:scale-105',
            {
              'bg-white text-red-600 hover:bg-red-50': isUrgent,
              'bg-white text-amber-600 hover:bg-amber-50': isWarning,
              'bg-white text-realpro-turquoise hover:bg-realpro-turquoise/5': !isUrgent && !isWarning,
            }
          )}
        >
          Passer au forfait payant
        </Link>

        {!isUrgent && (
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
