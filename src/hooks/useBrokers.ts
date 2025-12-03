import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LotDto {
  id: string;
  code: string;
  type: 'APARTMENT' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'VILLA' | 'HOUSE';
  status: 'AVAILABLE' | 'RESERVED' | 'OPTION' | 'SOLD' | 'DELIVERED';
  rooms_count: number | null;
  surface_living: number | null;
  surface_total: number | null;
  price_total: number | null;
  floor_level: number | null;
  building: {
    id: string;
    name: string;
    code: string;
  };
  project: {
    id: string;
    name: string;
    code: string;
  };
  reservation?: {
    id: string;
    buyer_first_name: string;
    buyer_last_name: string;
    signed_at: string | null;
    status: string;
  };
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  sales_contract?: {
    id: string;
    signed_at: string | null;
  };
}

export interface SalesContractDto {
  id: string;
  project_id: string;
  lot_id: string;
  buyer_id: string;
  signed_at: string | null;
  effective_at: string | null;
  document_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  lot: {
    code: string;
    type: string;
    price_total: number | null;
  };
  buyer: {
    first_name: string;
    last_name: string;
    email: string | null;
  };
  project: {
    name: string;
    code: string;
  };
  document?: {
    name: string;
    file_url: string | null;
  };
}

export interface ReservationDto {
  id: string;
  project_id: string;
  lot_id: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CONVERTED' | 'CANCELLED' | 'EXPIRED';
  reserved_at: string;
  expires_at: string | null;
  signed_at: string | null;
  deposit_amount: number | null;
  deposit_paid_at: string | null;
  lot: {
    code: string;
    type: string;
    price_total: number | null;
  };
  project: {
    name: string;
    code: string;
  };
}

export function useBrokerProjects() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: projects, error: projectsError } = await supabase
          .from('project_participants')
          .select(`
            project:projects(
              id,
              name,
              code,
              status,
              address,
              city
            )
          `)
          .eq('user_id', user.id)
          .eq('role', 'BROKER')
          .eq('status', 'ACTIVE');

        if (projectsError) throw projectsError;
        setData(projects?.map(p => p.project).filter(Boolean) || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { data, loading, error };
}

export function useBrokerLots(projectId?: string) {
  const [data, setData] = useState<LotDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLots() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
          .from('lots')
          .select(`
            id,
            code,
            type,
            status,
            rooms_count,
            surface_living,
            surface_total,
            price_total,
            floor_level,
            building:buildings(id, name, code),
            project:projects(id, name, code),
            reservations(
              id,
              buyer_first_name,
              buyer_last_name,
              signed_at,
              status
            ),
            buyers(
              id,
              first_name,
              last_name
            ),
            sales_contracts(
              id,
              signed_at
            )
          `)
          .order('code', { ascending: true });

        if (projectId) {
          query = query.eq('project_id', projectId);
        }

        const { data: lots, error: lotsError } = await query;
        if (lotsError) throw lotsError;

        const transformedLots: LotDto[] = lots?.map((lot: any) => ({
          ...lot,
          reservation: lot.reservations?.[0],
          buyer: lot.buyers?.[0],
          sales_contract: lot.sales_contracts?.[0],
        })) || [];

        setData(transformedLots);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLots();
  }, [projectId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export function useBrokerSalesContracts(projectId?: string) {
  const [data, setData] = useState<SalesContractDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalesContracts() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
          .from('sales_contracts')
          .select(`
            *,
            lot:lots(code, type, price_total),
            buyer:buyers(first_name, last_name, email),
            project:projects(name, code),
            document:documents(name, file_url)
          `)
          .order('created_at', { ascending: false });

        if (projectId) {
          query = query.eq('project_id', projectId);
        }

        const { data: contracts, error: contractsError } = await query;
        if (contractsError) throw contractsError;

        setData(contracts || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesContracts();
  }, [projectId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export function useBrokerReservations(projectId?: string) {
  const [data, setData] = useState<ReservationDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
          .from('reservations')
          .select(`
            *,
            lot:lots(code, type, price_total),
            project:projects(name, code)
          `)
          .order('reserved_at', { ascending: false });

        if (projectId) {
          query = query.eq('project_id', projectId);
        }

        const { data: reservations, error: reservationsError } = await query;
        if (reservationsError) throw reservationsError;

        setData(reservations || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, [projectId]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

export async function updateLotStatus(
  lotId: string,
  newStatus: 'AVAILABLE' | 'RESERVED' | 'SOLD'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('lots')
      .update({ status: newStatus })
      .eq('id', lotId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateReservationSignatureDate(
  reservationId: string,
  signedAt: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ signed_at: signedAt })
      .eq('id', reservationId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createSalesContract(
  projectId: string,
  lotId: string,
  buyerId: string,
  signedAt: string | null,
  effectiveAt: string | null,
  documentId: string | null,
  notes: string | null
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sales_contracts')
      .insert({
        project_id: projectId,
        lot_id: lotId,
        buyer_id: buyerId,
        signed_at: signedAt,
        effective_at: effectiveAt,
        document_id: documentId,
        notes: notes,
        created_by_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateSalesContract(
  salesContractId: string,
  updates: {
    signed_at?: string | null;
    effective_at?: string | null;
    document_id?: string | null;
    notes?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('sales_contracts')
      .update(updates)
      .eq('id', salesContractId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function attachSignedDocumentToContract(
  contractId: string,
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contracts')
      .update({ signed_document_id: documentId })
      .eq('id', contractId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
