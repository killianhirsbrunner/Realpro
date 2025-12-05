import { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Calendar, FileText, Plus, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProspectActivityCardProps {
  prospectId: string;
  projectId: string;
}

const activityIcons: Record<string, any> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  NOTE: FileText,
  MESSAGE: MessageSquare,
};

const activityColors: Record<string, string> = {
  CALL: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  EMAIL: 'text-brand-600 bg-brand-100 dark:bg-brand-900/30',
  MEETING: 'text-brand-600 bg-brand-100 dark:bg-brand-900/30',
  NOTE: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  MESSAGE: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
};

export function ProspectActivityCard({ prospectId, projectId }: ProspectActivityCardProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [prospectId]);

  const fetchActivities = async () => {
    try {
      const { data } = await supabase
        .from('prospect_activities')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false })
        .limit(20);

      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Activité & Historique
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {activities.length} interaction{activities.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {activities.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Aucune activité enregistrée
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Commencez à enregistrer vos interactions avec ce prospect
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedActivities.map((activity) => {
                const Icon = activityIcons[activity.type] || User;
                const colorClass = activityColors[activity.type] || 'text-neutral-600 bg-neutral-100 dark:bg-neutral-900/30';

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {activity.title || getActivityTypeLabel(activity.type)}
                        </p>
                        <span className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      {activity.created_by_name && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          Par {activity.created_by_name}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-2"
              >
                {showAll ? 'Voir moins' : `Voir les ${activities.length - 5} activités restantes`}
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function getActivityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CALL: 'Appel téléphonique',
    EMAIL: 'Email envoyé',
    MEETING: 'Rendez-vous',
    NOTE: 'Note ajoutée',
    MESSAGE: 'Message',
  };
  return labels[type] || type;
}
