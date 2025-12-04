import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, FileText, User, Settings, DollarSign, Building, MessageSquare } from 'lucide-react';

interface AuditLogProps {
  activities: Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    project_id: string | null;
    project_name: string | null;
    description: string | null;
    metadata: any;
    created_at: string;
  }>;
}

const ACTION_LABELS: Record<string, string> = {
  user_invited: 'Invitation envoyée',
  user_created: 'Utilisateur créé',
  user_updated: 'Utilisateur modifié',
  user_deleted: 'Utilisateur supprimé',
  permission_granted: 'Permission accordée',
  permission_revoked: 'Permission révoquée',
  document_uploaded: 'Document téléchargé',
  document_deleted: 'Document supprimé',
  lot_created: 'Lot créé',
  lot_updated: 'Lot modifié',
  buyer_created: 'Acheteur créé',
  buyer_updated: 'Acheteur modifié',
  invoice_created: 'Facture créée',
  payment_received: 'Paiement reçu',
  project_created: 'Projet créé',
  project_updated: 'Projet modifié',
  message_sent: 'Message envoyé',
};

const getIcon = (entityType: string) => {
  switch (entityType) {
    case 'user':
    case 'user_invitation':
      return User;
    case 'document':
      return FileText;
    case 'project':
      return Building;
    case 'invoice':
    case 'payment':
      return DollarSign;
    case 'message':
      return MessageSquare;
    case 'permission':
      return Settings;
    default:
      return Activity;
  }
};

export function AuditLog({ activities }: AuditLogProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
        <p className="text-neutral-600 dark:text-neutral-400">Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getIcon(activity.entity_type);
        const label = ACTION_LABELS[activity.action] || activity.action;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {label}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {activity.description}
                    </p>
                  )}
                  {activity.project_name && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Projet: {activity.project_name}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>

              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300">
                    Voir les détails
                  </summary>
                  <pre className="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded text-xs overflow-x-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
