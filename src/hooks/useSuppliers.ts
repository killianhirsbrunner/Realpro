import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories: string[];
  availability?: any;
  address?: string;
}

export function useSuppliers(projectId?: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [projectId]);

  async function fetchSuppliers() {
    try {
      setLoading(true);

      let query = supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: suppliersError } = await query;

      if (suppliersError) throw suppliersError;

      setSuppliers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  async function createSupplier(supplier: Omit<Supplier, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();

      if (error) throw error;

      await fetchSuppliers();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  async function updateSupplier(id: string, updates: Partial<Supplier>) {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  return { suppliers, loading, error, createSupplier, updateSupplier, refetch: fetchSuppliers };
}

interface Appointment {
  id: string;
  lot_id: string;
  supplier_id: string;
  scheduled_date: string;
  status: string;
  notes?: string;
  supplier?: Supplier;
}

export function useAppointments(lotId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lotId) {
      fetchAppointments();
    }
  }, [lotId]);

  async function fetchAppointments() {
    try {
      setLoading(true);

      const { data, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*, supplier:suppliers(*)')
        .eq('lot_id', lotId)
        .order('scheduled_date');

      if (appointmentsError) throw appointmentsError;

      setAppointments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  async function createAppointment(lotId: string, supplierId: string, scheduledDate: string, notes?: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          lot_id: lotId,
          supplier_id: supplierId,
          scheduled_date: scheduledDate,
          status: 'scheduled',
          notes
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAppointments();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  async function updateAppointment(id: string, updates: Partial<Appointment>) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  async function cancelAppointment(id: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    refetch: fetchAppointments
  };
}
