import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface ReservationDetail {
  id: string;
  project_id: string;
  lot_id: string;
  prospect_id: string | null;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  buyer_address: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CONVERTED' | 'CANCELLED' | 'EXPIRED';
  reserved_at: string;
  expires_at: string;
  deposit_amount: number | null;
  deposit_paid_at: string | null;
  broker_id: string | null;
  broker_commission_rate: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  lot?: {
    id: string;
    code: string;
    lot_number: string;
    title: string | null;
    rooms: number | null;
    surface_living: number | null;
    price_sale: number | null;
    floor: number | null;
    status: string;
  };
  prospect?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    status: string;
  };
  broker?: {
    id: string;
    name: string;
    contact_email: string | null;
    contact_phone: string | null;
  };
  project?: {
    id: string;
    name: string;
  };
}

export interface ReservationActivity {
  id: string;
  type: 'status_change' | 'note' | 'deposit' | 'document' | 'email';
  description: string;
  performed_by: string;
  performed_at: string;
  metadata?: Record<string, unknown>;
  performer?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export function useReservationDetail(projectId: string, reservationId: string) {
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [activities, setActivities] = useState<ReservationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          *,
          lot:lots(id, code, lot_number, title, rooms, surface_living, price_sale, floor, status),
          prospect:prospects(id, first_name, last_name, email, phone, status),
          broker:companies(id, name, contact_email, contact_phone),
          project:projects(id, name)
        `)
        .eq('id', reservationId)
        .eq('project_id', projectId)
        .single();

      if (fetchError) throw fetchError;
      setReservation(data as ReservationDetail);
    } catch (err) {
      console.error('Error loading reservation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la reservation');
    } finally {
      setLoading(false);
    }
  }, [projectId, reservationId]);

  const loadActivities = useCallback(async () => {
    try {
      // Pour l'instant, on simule les activites car la table n'existe peut-etre pas
      // TODO: Implementer la table reservation_activities
      const mockActivities: ReservationActivity[] = [];
      setActivities(mockActivities);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  }, [reservationId]);

  useEffect(() => {
    if (projectId && reservationId) {
      loadReservation();
      loadActivities();
    }
  }, [projectId, reservationId, loadReservation, loadActivities]);

  const updateStatus = useCallback(async (newStatus: ReservationDetail['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (updateError) throw updateError;
      await loadReservation();
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  }, [reservationId, loadReservation]);

  const markDepositPaid = useCallback(async () => {
    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          deposit_paid_at: new Date().toISOString(),
          status: 'CONFIRMED',
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (updateError) throw updateError;
      await loadReservation();
    } catch (err) {
      console.error('Error marking deposit paid:', err);
      throw err;
    }
  }, [reservationId, loadReservation]);

  const extendExpiration = useCallback(async (days: number) => {
    if (!reservation) return;

    try {
      const currentExpiry = new Date(reservation.expires_at);
      currentExpiry.setDate(currentExpiry.getDate() + days);

      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          expires_at: currentExpiry.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (updateError) throw updateError;
      await loadReservation();
    } catch (err) {
      console.error('Error extending expiration:', err);
      throw err;
    }
  }, [reservation, reservationId, loadReservation]);

  const convertToSale = useCallback(async () => {
    try {
      // 1. Mettre a jour le statut de la reservation
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'CONVERTED',
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (reservationError) throw reservationError;

      // 2. Mettre a jour le statut du lot
      if (reservation?.lot_id) {
        const { error: lotError } = await supabase
          .from('lots')
          .update({
            status: 'SOLD',
            updated_at: new Date().toISOString()
          })
          .eq('id', reservation.lot_id);

        if (lotError) throw lotError;
      }

      // 3. Convertir le prospect en acheteur si existant
      if (reservation?.prospect_id) {
        const { error: prospectError } = await supabase
          .from('prospects')
          .update({
            status: 'CONVERTED',
            updated_at: new Date().toISOString()
          })
          .eq('id', reservation.prospect_id);

        if (prospectError) throw prospectError;
      }

      await loadReservation();
    } catch (err) {
      console.error('Error converting to sale:', err);
      throw err;
    }
  }, [reservation, reservationId, loadReservation]);

  const cancelReservation = useCallback(async (reason?: string) => {
    try {
      // 1. Mettre a jour la reservation
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'CANCELLED',
          notes: reason ? `${reservation?.notes || ''}\n\nAnnulation: ${reason}`.trim() : reservation?.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (reservationError) throw reservationError;

      // 2. Remettre le lot en disponible
      if (reservation?.lot_id) {
        const { error: lotError } = await supabase
          .from('lots')
          .update({
            status: 'AVAILABLE',
            updated_at: new Date().toISOString()
          })
          .eq('id', reservation.lot_id);

        if (lotError) throw lotError;
      }

      await loadReservation();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      throw err;
    }
  }, [reservation, reservationId, loadReservation]);

  return {
    reservation,
    activities,
    loading,
    error,
    refetch: loadReservation,
    updateStatus,
    markDepositPaid,
    extendExpiration,
    convertToSale,
    cancelReservation,
  };
}
