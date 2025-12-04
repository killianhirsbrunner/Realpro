import { AlertTriangle, Info, XCircle, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlanningAlert } from '../../hooks/usePlanning';

interface PlanningAlertsProps {
  alerts: PlanningAlert[];
  onResolve?: (alertId: string) => void;
}

export function PlanningAlerts({ alerts, onResolve }: PlanningAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          Aucune alerte
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Tous les jalons et tâches sont dans les temps.
        </p>
      </div>
    );
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'warning':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'delay':
        return 'Retard';
      case 'dependency_blocked':
        return 'Dépendance bloquée';
      case 'milestone_missed':
        return 'Jalon manqué';
      case 'resource_conflict':
        return 'Conflit de ressources';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Alertes ({alerts.length})
        </h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              rounded-xl border-2 p-4 transition-all
              ${getAlertColor(alert.severity)}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`${getIconColor(alert.severity)} mt-0.5`}>
                {getAlertIcon(alert.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <span className={`
                      inline-block px-2 py-0.5 rounded-md text-xs font-medium mb-2
                      ${alert.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : ''}
                      ${alert.severity === 'warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' : ''}
                      ${alert.severity === 'info' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : ''}
                    `}>
                      {getAlertTypeLabel(alert.alert_type)}
                    </span>
                  </div>

                  {onResolve && (
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                      title="Marquer comme résolu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-neutral-900 dark:text-white mb-2">
                  {alert.message}
                </p>

                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {format(new Date(alert.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
