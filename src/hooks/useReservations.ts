import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Reservation {
  id: string;
  project_id: string;
  lot_id: string;
  prospect_id: string | null;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string | null;
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
    lot_number: string;
    title: string | null;
  };
  broker?: {
    name: string;
  };
}

export function useReservations(projectId: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, [projectId]);

  async function loadReservations() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          *,
          lot:lots(lot_number, title),
          broker:companies(name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReservations(data || []);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  }

  async function createReservation(reservation: Partial<Reservation>) {
    try {
      const { data, error: insertError } = await supabase
        .from('reservations')
        .insert({
          ...reservation,
          project_id: projectId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await loadReservations();
      return data;
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  }

  async function updateReservation(id: string, updates: Partial<Reservation>) {
    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      await loadReservations();
    } catch (err) {
      console.error('Error updating reservation:', err);
      throw err;
    }
  }

  async function deleteReservation(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadReservations();
    } catch (err) {
      console.error('Error deleting reservation:', err);
      throw err;
    }
  }

  async function convertToSale(reservationId: string) {
    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'CONVERTED' })
        .eq('id', reservationId);

      if (updateError) throw updateError;

      await loadReservations();
    } catch (err) {
      console.error('Error converting reservation:', err);
      throw err;
    }
  }

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    convertToSale,
    refresh: loadReservations
  };
}
