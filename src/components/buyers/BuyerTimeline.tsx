import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Clock, FileText, CheckCircle, UserPlus, Home, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: string;
  label: string;
  date: string;
  description?: string;
}

interface BuyerTimelineProps {
  buyerId: string;
}

export function BuyerTimeline({ buyerId }: BuyerTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const { data, error } = await supabase
          .from('buyer_history')
          .select('*')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const timelineEvents: TimelineEvent[] = (data || []).map((event: any) => ({
          id: event.id,
          type: event.event_type || 'info',
          label: event.description || 'Événement',
          date: event.created_at,
          description: event.notes
        }));

        setEvents(timelineEvents);
      } catch (err) {
        console.error('Error fetching timeline:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, [buyerId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <UserPlus className="h-4 w-4" />;
      case 'reserved':
        return <Home className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'signed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
        Aucun événement pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 items-start relative">
          {index < events.length - 1 && (
            <div className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700" />
          )}

          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 relative z-10">
            {getIcon(event.type)}
          </div>

          <div className="flex-1 pt-1">
            <p className="font-medium text-sm text-neutral-900 dark:text-white">
              {event.label}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {format(new Date(event.date), 'dd/MM/yyyy à HH:mm')}
            </p>
            {event.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
