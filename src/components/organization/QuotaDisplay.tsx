import { useQuotas } from '../../hooks/useQuotas';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AlertTriangle, ArrowUp, Building2, Users, HardDrive } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface QuotaDisplayProps {
  variant?: 'compact' | 'detailed';
  showUpgradeButton?: boolean;
}

export function QuotaDisplay({ variant = 'compact', showUpgradeButton = true }: QuotaDisplayProps) {
  const { quotaStatus, loading } = useQuotas();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!quotaStatus) {
    return null;
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-amber-600';
    return 'bg-brand-600';
  };

  const getProgressBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100 dark:bg-red-950/20';
    if (percentage >= 75) return 'bg-amber-100 dark:bg-amber-950/20';
    return 'bg-brand-100 dark:bg-brand-950/20';
  };

  if (variant === 'compact') {
    const nearLimit = Object.values(quotaStatus.percentages).some(p => p >= 75);

    if (!nearLimit) {
      return null;
    }

    return (
      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              Quotas en approche
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Vous approchez des limites de votre plan actuel.
            </p>
            {showUpgradeButton && (
              <Button
                size="sm"
                onClick={() => navigate('/billing')}
                className="gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                Passer au plan supérieur
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Projets
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {quotaStatus.usage.projects} / {quotaStatus.quota.maxProjects}
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${getProgressBg(quotaStatus.percentages.projects)}`}>
          <div
            className={`h-full transition-all ${getProgressColor(quotaStatus.percentages.projects)}`}
            style={{ width: `${Math.min(quotaStatus.percentages.projects, 100)}%` }}
          />
        </div>
        {quotaStatus.percentages.projects >= 90 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Limite atteinte - Impossible de créer de nouveaux projets
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Utilisateurs
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {quotaStatus.usage.users} / {quotaStatus.quota.maxUsers}
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${getProgressBg(quotaStatus.percentages.users)}`}>
          <div
            className={`h-full transition-all ${getProgressColor(quotaStatus.percentages.users)}`}
            style={{ width: `${Math.min(quotaStatus.percentages.users, 100)}%` }}
          />
        </div>
        {quotaStatus.percentages.users >= 90 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Limite atteinte - Impossible d'inviter de nouveaux utilisateurs
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Stockage
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {quotaStatus.usage.storageMB} MB / {quotaStatus.quota.maxStorageMB} MB
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${getProgressBg(quotaStatus.percentages.storage)}`}>
          <div
            className={`h-full transition-all ${getProgressColor(quotaStatus.percentages.storage)}`}
            style={{ width: `${Math.min(quotaStatus.percentages.storage, 100)}%` }}
          />
        </div>
        {quotaStatus.percentages.storage >= 90 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Limite atteinte - Libérez de l'espace ou passez à un plan supérieur
          </p>
        )}
      </div>

      {showUpgradeButton && Object.values(quotaStatus.percentages).some(p => p >= 75) && (
        <Button
          onClick={() => navigate('/billing')}
          className="w-full gap-2 mt-4"
        >
          <ArrowUp className="w-4 h-4" />
          Augmenter vos limites
        </Button>
      )}
    </div>
  );
}
