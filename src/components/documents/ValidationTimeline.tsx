import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, XCircle, Send, Eye, UserPlus, MessageSquare } from 'lucide-react';
import type { DocumentValidation, ValidationAction } from '../../hooks/useDocumentValidation';
import { cn } from '../../lib/utils';

interface ValidationTimelineProps {
  validations: DocumentValidation[];
  className?: string;
}

const actionConfig: Record<
  ValidationAction,
  {
    icon: typeof CheckCircle;
    colorClass: string;
    bgClass: string;
    label: string;
  }
> = {
  submitted: {
    icon: Send,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Soumis pour validation',
  },
  approved: {
    icon: CheckCircle,
    colorClass: 'text-green-500',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    label: 'Valide',
  },
  rejected: {
    icon: XCircle,
    colorClass: 'text-red-500',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    label: 'Refuse',
  },
  revision_requested: {
    icon: Eye,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Revision demandee',
  },
  reassigned: {
    icon: UserPlus,
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Reassigne',
  },
};

/**
 * Timeline des actions de validation d'un document
 *
 * Affiche l'historique chronologique des validations avec qui a fait quoi et quand.
 */
export function ValidationTimeline({ validations, className }: ValidationTimelineProps) {
  if (validations.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <MessageSquare className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Aucune action de validation enregistree</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          L'historique apparaitra ici apres la premiere soumission
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flow-root', className)}>
      <ul className="-mb-8">
        {validations.map((validation, idx) => {
          const config = actionConfig[validation.action] || actionConfig.submitted;
          const Icon = config.icon;
          const isLast = idx === validations.length - 1;

          return (
            <li key={validation.id}>
              <div className="relative pb-8">
                {/* Ligne de connexion */}
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start space-x-3">
                  {/* Icone */}
                  <div>
                    <span
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-neutral-900',
                        config.bgClass
                      )}
                    >
                      <Icon className={cn('h-4 w-4', config.colorClass)} />
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{config.label}</p>
                      <time className="text-xs text-neutral-400 dark:text-neutral-500">
                        {format(new Date(validation.performed_at), "d MMM yyyy 'a' HH:mm", { locale: fr })}
                      </time>
                    </div>

                    <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                      par{' '}
                      <span className="font-medium">
                        {validation.performer?.first_name} {validation.performer?.last_name}
                      </span>
                    </p>

                    {validation.comment && (
                      <div className="mt-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">"{validation.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Version compacte de la timeline (pour les panels lateraux)
 */
export function ValidationTimelineCompact({ validations, className }: ValidationTimelineProps) {
  if (validations.length === 0) {
    return (
      <p className={cn('text-sm text-neutral-500 dark:text-neutral-400 italic', className)}>
        Aucun historique de validation
      </p>
    );
  }

  // Afficher seulement les 3 dernieres actions
  const recentValidations = validations.slice(0, 3);

  return (
    <div className={cn('space-y-2', className)}>
      {recentValidations.map((validation) => {
        const config = actionConfig[validation.action] || actionConfig.submitted;
        const Icon = config.icon;

        return (
          <div key={validation.id} className="flex items-center gap-2 text-sm">
            <Icon className={cn('w-4 h-4 flex-shrink-0', config.colorClass)} />
            <span className="text-neutral-600 dark:text-neutral-400 truncate">
              {config.label} par {validation.performer?.first_name}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500 text-xs whitespace-nowrap">
              {format(new Date(validation.performed_at), 'd MMM', { locale: fr })}
            </span>
          </div>
        );
      })}

      {validations.length > 3 && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          + {validations.length - 3} autre(s) action(s)
        </p>
      )}
    </div>
  );
}
