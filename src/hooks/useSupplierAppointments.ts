import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type SupplierCategory = 'KITCHEN' | 'BATHROOM' | 'FLOORING' | 'OTHER';

export type AppointmentStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';

export interface SupplierShowroom {
  id: string;
  organization_id: string;
  project_id: string;
  company_id: string;
  name: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  categories: SupplierCategory[];
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierTimeSlot {
  id: string;
  showroom_id: string;
  start_at: string;
  end_at: string;
  category: SupplierCategory;
  max_appointments: number;
  is_active: boolean;
  created_at: string;
  showroom?: SupplierShowroom;
  appointments?: SupplierAppointment[];
}

export interface SupplierAppointment {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string;
  buyer_id: string;
  showroom_id: string;
  time_slot_id: string;
  status: AppointmentStatus;
  category: SupplierCategory;
  buyer_note?: string;
  supplier_note?: string;
  created_at: string;
  updated_at: string;
  showroom?: any;
  time_slot?: any;
  lot?: any;
  project?: any;
}

export function useSupplierAppointments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const listShowrooms = useCallback(async (projectId: string): Promise<SupplierShowroom[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('supplier_showrooms')
        .select(`
          *,
          company:companies(id, name)
        `)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('name');

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const listAvailableSlots = useCallback(async (
    projectId: string,
    category?: SupplierCategory
  ): Promise<SupplierTimeSlot[]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('supplier_time_slots')
        .select(`
          *,
          showroom:supplier_showrooms(
            id,
            name,
            address,
            city,
            zip,
            company:companies(id, name)
          ),
          appointments:supplier_appointments(id, status)
        `)
        .eq('is_active', true)
        .gte('start_at', new Date().toISOString())
        .order('start_at');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      const available = (data || []).filter((slot: any) => {
        const activeAppointments = slot.appointments.filter(
          (a: any) => a.status !== 'CANCELLED' && a.status !== 'DECLINED'
        );
        return activeAppointments.length < slot.max_appointments;
      });

      return available;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const requestAppointment = useCallback(async (params: {
    projectId: string;
    lotId: string;
    buyerId: string;
    showroomId: string;
    timeSlotId: string;
    category: SupplierCategory;
    buyerNote?: string;
  }): Promise<SupplierAppointment | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .single();

      if (!userOrg) throw new Error('Organization not found');

      const { data, error: dbError } = await supabase
        .from('supplier_appointments')
        .insert({
          organization_id: userOrg.organization_id,
          project_id: params.projectId,
          lot_id: params.lotId,
          buyer_id: params.buyerId,
          showroom_id: params.showroomId,
          time_slot_id: params.timeSlotId,
          category: params.category,
          buyer_note: params.buyerNote || null,
          status: 'PENDING',
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const listBuyerAppointments = useCallback(async (buyerId: string): Promise<SupplierAppointment[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('supplier_appointments')
        .select(`
          *,
          showroom:supplier_showrooms(
            id,
            name,
            address,
            city,
            company:companies(name)
          ),
          time_slot:supplier_time_slots(
            start_at,
            end_at,
            category
          ),
          lot:lots(lot_number),
          project:projects(name)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToAppointment = useCallback(async (
    appointmentId: string,
    action: 'ACCEPTED' | 'DECLINED',
    supplierNote?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('supplier_appointments')
        .update({
          status: action,
          supplier_note: supplierNote || null,
        })
        .eq('id', appointmentId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('supplier_appointments')
        .update({
          status: 'CANCELLED',
        })
        .eq('id', appointmentId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const listShowroomAppointments = useCallback(async (showroomId: string): Promise<SupplierAppointment[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('supplier_appointments')
        .select(`
          *,
          time_slot:supplier_time_slots(start_at, end_at, category),
          lot:lots(lot_number),
          project:projects(name)
        `)
        .eq('showroom_id', showroomId)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    listShowrooms,
    listAvailableSlots,
    requestAppointment,
    listBuyerAppointments,
    respondToAppointment,
    cancelAppointment,
    listShowroomAppointments,
  };
}
