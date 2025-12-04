import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SAVTicket {
  id: string;
  title: string;
  description?: string;
  lot_number: string;
  buyer_name: string;
  status: string;
  priority: string;
  created_at: string;
  resolved_at?: string;
}

export function useSAV(projectId: string | undefined) {
  const [tickets, setTickets] = useState<SAVTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchSAV() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('sav_tickets')
          .select(`
            id,
            title,
            description,
            status,
            priority,
            created_at,
            resolved_at,
            lots (number),
            buyers:buyer_id (first_name, last_name)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const ticketsData: SAVTicket[] = (data || []).map(ticket => ({
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          lot_number: ticket.lots?.number || 'N/A',
          buyer_name: ticket.buyers
            ? `${ticket.buyers.first_name} ${ticket.buyers.last_name}`
            : 'N/A',
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
          resolved_at: ticket.resolved_at,
        }));

        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching SAV tickets:', err);
        setError('Erreur lors du chargement des tickets SAV');
        setLoading(false);
      }
    }

    fetchSAV();
  }, [projectId]);

  return { tickets, loading, error };
}
