import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface SignatureAppointment {
  id: string;
  dossier_id: string;
  buyer_id: string;
  notary_id: string | null;
  scheduled_at: string;
  location: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  buyer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
  notary?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateAppointmentData {
  buyerId: string;
  notaryId?: string;
  scheduledAt: Date;
  location: string;
  notes?: string;
}

export function useSignatureAppointments(dossierId: string) {
  const [appointments, setAppointments] = useState<SignatureAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    if (!dossierId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('signature_appointments')
        .select(`
          *,
          buyer:buyer_id(first_name, last_name, email, phone),
          notary:notary_id(first_name, last_name, email)
        `)
        .eq('dossier_id', dossierId)
        .order('scheduled_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [dossierId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /**
   * Obtient le prochain rendez-vous programme
   */
  const getNextAppointment = useCallback((): SignatureAppointment | null => {
    const upcoming = appointments
      .filter((a) => a.status === 'scheduled' || a.status === 'confirmed')
      .filter((a) => new Date(a.scheduled_at) > new Date())
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

    return upcoming[0] || null;
  }, [appointments]);

  /**
   * Verifie si le dossier a un rendez-vous confirme
   */
  const hasConfirmedAppointment = useCallback((): boolean => {
    return appointments.some(
      (a) => a.status === 'confirmed' && new Date(a.scheduled_at) > new Date()
    );
  }, [appointments]);

  /**
   * Cree un nouveau rendez-vous
   */
  const createAppointment = useCallback(
    async (data: CreateAppointmentData) => {
      try {
        const { error: insertError } = await supabase.from('signature_appointments').insert({
          dossier_id: dossierId,
          buyer_id: data.buyerId,
          notary_id: data.notaryId || null,
          scheduled_at: data.scheduledAt.toISOString(),
          location: data.location,
          status: 'scheduled',
          notes: data.notes || null,
        });

        if (insertError) throw insertError;

        await loadAppointments();
      } catch (err) {
        console.error('Error creating appointment:', err);
        throw err;
      }
    },
    [dossierId, loadAppointments]
  );

  /**
   * Met a jour le statut d'un rendez-vous
   */
  const updateAppointmentStatus = useCallback(
    async (appointmentId: string, status: AppointmentStatus, notes?: string) => {
      try {
        const updateData: any = { status };
        if (notes !== undefined) {
          updateData.notes = notes;
        }

        const { error: updateError } = await supabase
          .from('signature_appointments')
          .update(updateData)
          .eq('id', appointmentId);

        if (updateError) throw updateError;

        await loadAppointments();
      } catch (err) {
        console.error('Error updating appointment:', err);
        throw err;
      }
    },
    [loadAppointments]
  );

  /**
   * Confirme un rendez-vous
   */
  const confirmAppointment = useCallback(
    async (appointmentId: string) => {
      await updateAppointmentStatus(appointmentId, 'confirmed');
    },
    [updateAppointmentStatus]
  );

  /**
   * Marque un rendez-vous comme complete (signature effectuee)
   */
  const completeAppointment = useCallback(
    async (appointmentId: string) => {
      await updateAppointmentStatus(appointmentId, 'completed');
    },
    [updateAppointmentStatus]
  );

  /**
   * Annule un rendez-vous
   */
  const cancelAppointment = useCallback(
    async (appointmentId: string, reason?: string) => {
      await updateAppointmentStatus(appointmentId, 'cancelled', reason);
    },
    [updateAppointmentStatus]
  );

  /**
   * Replanifie un rendez-vous
   */
  const rescheduleAppointment = useCallback(
    async (appointmentId: string, newDate: Date, newLocation?: string) => {
      try {
        // Marquer l'ancien comme replanifie
        await updateAppointmentStatus(appointmentId, 'rescheduled');

        // Obtenir les infos de l'ancien
        const oldAppointment = appointments.find((a) => a.id === appointmentId);
        if (!oldAppointment) throw new Error('Rendez-vous non trouve');

        // Creer le nouveau
        await createAppointment({
          buyerId: oldAppointment.buyer_id,
          notaryId: oldAppointment.notary_id || undefined,
          scheduledAt: newDate,
          location: newLocation || oldAppointment.location,
          notes: `Replanifie depuis le ${new Date(oldAppointment.scheduled_at).toLocaleDateString('fr-CH')}`,
        });
      } catch (err) {
        console.error('Error rescheduling appointment:', err);
        throw err;
      }
    },
    [appointments, updateAppointmentStatus, createAppointment]
  );

  /**
   * Supprime un rendez-vous
   */
  const deleteAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('signature_appointments')
          .delete()
          .eq('id', appointmentId);

        if (deleteError) throw deleteError;

        await loadAppointments();
      } catch (err) {
        console.error('Error deleting appointment:', err);
        throw err;
      }
    },
    [loadAppointments]
  );

  return {
    appointments,
    loading,
    error,
    getNextAppointment,
    hasConfirmedAppointment,
    createAppointment,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    rescheduleAppointment,
    deleteAppointment,
    refresh: loadAppointments,
  };
}

/**
 * Helper pour formater le statut d'un rendez-vous
 */
export function getAppointmentStatusConfig(status: AppointmentStatus) {
  const configs: Record<AppointmentStatus, { label: string; color: string; icon: string }> = {
    scheduled: {
      label: 'Planifie',
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      icon: 'Calendar',
    },
    confirmed: {
      label: 'Confirme',
      color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
      icon: 'CheckCircle',
    },
    completed: {
      label: 'Signe',
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      icon: 'Check',
    },
    cancelled: {
      label: 'Annule',
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
      icon: 'XCircle',
    },
    rescheduled: {
      label: 'Replanifie',
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
      icon: 'RefreshCw',
    },
  };

  return configs[status] || configs.scheduled;
}
