import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface BuyerDossier {
  id: string;
  buyer_id: string;
  project_id: string;
  lot_id?: string;
  notary_id?: string;
  dossier_number: string;
  status: 'PREPARATION' | 'DOCUMENTS_PENDING' | 'READY_FOR_SIGNATURE' | 'SIGNED' | 'REGISTERED' | 'COMPLETED' | 'CANCELLED';
  act_type: 'RESERVATION' | 'PROMISE_TO_SELL' | 'DEED_OF_SALE' | 'AMENDMENT';
  signing_date?: string;
  registration_date?: string;
  registration_number?: string;
  land_registry_office?: string;
  notes?: string;
  missing_documents?: string[];
  required_documents?: string[];
  completion_percentage: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  buyer?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  notary?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  lot?: {
    id: string;
    reference: string;
    type: string;
  };
}

export interface ActVersion {
  id: string;
  dossier_id: string;
  version_number: number;
  content?: string;
  file_url?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'FINAL';
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  created_at: string;
  reviewed_at?: string;
  approved_at?: string;
  changes_summary?: string;
  comments?: string;
}

export interface NotaryDocument {
  id: string;
  dossier_id: string;
  document_type: string;
  name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
}

export interface SignatureAppointment {
  id: string;
  dossier_id: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  notary_id: string;
  attendees: string[];
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  notes?: string;
  confirmation_sent: boolean;
  created_at: string;
  updated_at: string;
}

export function useBuyerDossiers(projectId?: string, buyerId?: string) {
  const { currentOrganization } = useOrganization();
  const [dossiers, setDossiers] = useState<BuyerDossier[]>([]);
  const [actVersions, setActVersions] = useState<ActVersion[]>([]);
  const [documents, setDocuments] = useState<NotaryDocument[]>([]);
  const [appointments, setAppointments] = useState<SignatureAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if ((projectId || buyerId) && currentOrganization?.id) {
      fetchDossiers();
    }
  }, [projectId, buyerId, currentOrganization?.id]);

  const fetchDossiers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('buyer_dossiers')
        .select(`
          *,
          buyer:buyers(id, first_name, last_name, email),
          notary:companies!buyer_dossiers_notary_id_fkey(id, name, email, phone),
          lot:lots(id, reference, type)
        `);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (buyerId) {
        query = query.eq('buyer_id', buyerId);
      }

      const { data, error: fetchError } = await query.order('created_at', {
        ascending: false,
      });

      if (fetchError) throw fetchError;
      setDossiers(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createDossier = async (dossier: Partial<BuyerDossier>) => {
    if (!projectId) throw new Error('No project ID provided');

    const { data: latestDossier } = await supabase
      .from('buyer_dossiers')
      .select('dossier_number')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let dossierNumber = `DOS-${projectId.slice(0, 8)}-001`;
    if (latestDossier?.dossier_number) {
      const lastNumber = parseInt(
        latestDossier.dossier_number.split('-').pop() || '0'
      );
      dossierNumber = `DOS-${projectId.slice(0, 8)}-${String(
        lastNumber + 1
      ).padStart(3, '0')}`;
    }

    const { data, error: insertError } = await supabase
      .from('buyer_dossiers')
      .insert({
        ...dossier,
        project_id: projectId,
        dossier_number: dossierNumber,
        status: dossier.status || 'PREPARATION',
        completion_percentage: 0,
      })
      .select(`
        *,
        buyer:buyers(id, first_name, last_name, email),
        notary:companies!buyer_dossiers_notary_id_fkey(id, name, email, phone),
        lot:lots(id, reference, type)
      `)
      .single();

    if (insertError) throw insertError;
    setDossiers([data, ...dossiers]);
    return data;
  };

  const updateDossier = async (
    dossierId: string,
    updates: Partial<BuyerDossier>
  ) => {
    const { data, error: updateError } = await supabase
      .from('buyer_dossiers')
      .update(updates)
      .eq('id', dossierId)
      .select(`
        *,
        buyer:buyers(id, first_name, last_name, email),
        notary:companies!buyer_dossiers_notary_id_fkey(id, name, email, phone),
        lot:lots(id, reference, type)
      `)
      .single();

    if (updateError) throw updateError;
    setDossiers(dossiers.map((d) => (d.id === dossierId ? data : d)));
    return data;
  };

  const updateDossierStatus = async (
    dossierId: string,
    status: BuyerDossier['status']
  ) => {
    const updates: Partial<BuyerDossier> = { status };

    if (status === 'COMPLETED') {
      updates.completed_at = new Date().toISOString();
      updates.completion_percentage = 100;
    }

    return updateDossier(dossierId, updates);
  };

  const deleteDossier = async (dossierId: string) => {
    const { error: deleteError } = await supabase
      .from('buyer_dossiers')
      .delete()
      .eq('id', dossierId);

    if (deleteError) throw deleteError;
    setDossiers(dossiers.filter((d) => d.id !== dossierId));
  };

  const createActVersion = async (
    dossierId: string,
    version: Partial<ActVersion>
  ) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const { data: latestVersion } = await supabase
      .from('act_versions')
      .select('version_number')
      .eq('dossier_id', dossierId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const versionNumber = latestVersion
      ? latestVersion.version_number + 1
      : 1;

    const { data, error: insertError } = await supabase
      .from('act_versions')
      .insert({
        ...version,
        dossier_id: dossierId,
        version_number: versionNumber,
        created_by: currentUser.user?.id,
        status: version.status || 'DRAFT',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setActVersions([data, ...actVersions]);
    return data;
  };

  const getActVersions = async (dossierId: string) => {
    const { data, error: fetchError } = await supabase
      .from('act_versions')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('version_number', { ascending: false });

    if (fetchError) throw fetchError;
    setActVersions(data || []);
    return data || [];
  };

  const uploadDocument = async (
    dossierId: string,
    document: Partial<NotaryDocument>
  ) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('notary_documents')
      .insert({
        ...document,
        dossier_id: dossierId,
        uploaded_by: currentUser.user?.id,
        verified: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setDocuments([data, ...documents]);
    return data;
  };

  const verifyDocument = async (documentId: string) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: updateError } = await supabase
      .from('notary_documents')
      .update({
        verified: true,
        verified_by: currentUser.user?.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single();

    if (updateError) throw updateError;
    setDocuments(documents.map((d) => (d.id === documentId ? data : d)));
    return data;
  };

  const getDocuments = async (dossierId: string) => {
    const { data, error: fetchError } = await supabase
      .from('notary_documents')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('uploaded_at', { ascending: false });

    if (fetchError) throw fetchError;
    setDocuments(data || []);
    return data || [];
  };

  const scheduleSignatureAppointment = async (
    dossierId: string,
    appointment: Partial<SignatureAppointment>
  ) => {
    const { data, error: insertError } = await supabase
      .from('signature_appointments')
      .insert({
        ...appointment,
        dossier_id: dossierId,
        status: 'SCHEDULED',
        confirmation_sent: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setAppointments([data, ...appointments]);
    return data;
  };

  const getAppointments = async (dossierId: string) => {
    const { data, error: fetchError } = await supabase
      .from('signature_appointments')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('appointment_date', { ascending: false });

    if (fetchError) throw fetchError;
    setAppointments(data || []);
    return data || [];
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: SignatureAppointment['status']
  ) => {
    const { data, error: updateError } = await supabase
      .from('signature_appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (updateError) throw updateError;
    setAppointments(
      appointments.map((a) => (a.id === appointmentId ? data : a))
    );
    return data;
  };

  const getDossierStats = () => {
    const total = dossiers.length;
    const byStatus = dossiers.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageCompletion =
      total > 0
        ? dossiers.reduce((sum, d) => sum + d.completion_percentage, 0) / total
        : 0;

    return {
      total,
      byStatus,
      averageCompletion,
    };
  };

  const getMissingDocuments = (dossierId: string) => {
    const dossier = dossiers.find((d) => d.id === dossierId);
    return dossier?.missing_documents || [];
  };

  const updateMissingDocuments = async (
    dossierId: string,
    missingDocs: string[]
  ) => {
    return updateDossier(dossierId, { missing_documents: missingDocs });
  };

  return {
    dossiers,
    actVersions,
    documents,
    appointments,
    loading,
    error,
    createDossier,
    updateDossier,
    updateDossierStatus,
    deleteDossier,
    createActVersion,
    getActVersions,
    uploadDocument,
    verifyDocument,
    getDocuments,
    scheduleSignatureAppointment,
    getAppointments,
    updateAppointmentStatus,
    getDossierStats,
    getMissingDocuments,
    updateMissingDocuments,
    refetch: fetchDossiers,
  };
}
