import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  ClientDocument,
  ClientDocumentWithRelations,
  ClientDocumentType,
  ClientDocumentUploadData,
} from '../types/stakeholder';

/**
 * Hook pour gérer les documents clients (utilisé principalement par les courtiers)
 */
export function useClientDocuments(projectId: string, filters?: {
  prospectId?: string;
  buyerId?: string;
  lotId?: string;
  documentType?: ClientDocumentType;
  status?: string;
}) {
  const [documents, setDocuments] = useState<ClientDocumentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    uploaded: 0,
    validated: 0,
    rejected: 0,
    expired: 0,
    pendingSignature: 0,
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('client_documents')
        .select(`
          *,
          lot:lots!lot_id(id, lot_number, lot_type),
          prospect:prospects!prospect_id(id, first_name, last_name, email),
          buyer:buyers!buyer_id(
            id,
            user:users!user_id(first_name, last_name, email)
          ),
          uploader:users!uploaded_by(id, first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (filters?.prospectId) {
        query = query.eq('prospect_id', filters.prospectId);
      }
      if (filters?.buyerId) {
        query = query.eq('buyer_id', filters.buyerId);
      }
      if (filters?.lotId) {
        query = query.eq('lot_id', filters.lotId);
      }
      if (filters?.documentType) {
        query = query.eq('document_type', filters.documentType);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDocuments(data || []);

      // Calculate stats
      const docs = data || [];
      setStats({
        total: docs.length,
        uploaded: docs.filter((d) => d.status === 'UPLOADED').length,
        validated: docs.filter((d) => d.status === 'VALIDATED').length,
        rejected: docs.filter((d) => d.status === 'REJECTED').length,
        expired: docs.filter((d) => d.status === 'EXPIRED').length,
        pendingSignature: docs.filter(
          (d) => d.requires_signature && d.signature_status === 'PENDING'
        ).length,
      });
    } catch (err) {
      console.error('Error fetching client documents:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (data: ClientDocumentUploadData): Promise<ClientDocument> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Get organization_id from project
      const { data: project } = await supabase
        .from('projects')
        .select('organization_id')
        .eq('id', projectId)
        .single();

      if (!project) throw new Error('Project not found');

      // Upload file to storage
      const fileExt = data.file.name.split('.').pop();
      const fileName = `client-documents/${projectId}/${data.document_type}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, data.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data: doc, error: insertError } = await supabase
        .from('client_documents')
        .insert({
          organization_id: project.organization_id,
          project_id: projectId,
          lot_id: data.lot_id || null,
          prospect_id: data.prospect_id || null,
          buyer_id: data.buyer_id || null,
          reservation_id: data.reservation_id || null,
          document_type: data.document_type,
          title: data.title,
          description: data.description || null,
          file_name: data.file.name,
          file_url: urlData.publicUrl,
          file_size: data.file.size,
          file_type: data.file.type,
          uploaded_by: currentUser.user.id,
          valid_from: data.valid_from || null,
          valid_until: data.valid_until || null,
          requires_signature: data.requires_signature || false,
          signature_status: data.requires_signature ? 'PENDING' : null,
          tags: data.tags || [],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Log activity
      await supabase.rpc('log_stakeholder_activity', {
        p_user_id: currentUser.user.id,
        p_organization_id: project.organization_id,
        p_project_id: projectId,
        p_action_type: 'DOCUMENT_UPLOAD',
        p_action_details: {
          document_id: doc.id,
          document_type: data.document_type,
          prospect_id: data.prospect_id,
          buyer_id: data.buyer_id,
        },
        p_resource_type: 'client_document',
        p_resource_id: doc.id,
      });

      await fetchDocuments();
      return doc;
    } catch (err) {
      console.error('Error uploading document:', err);
      throw err;
    }
  };

  const validateDocument = async (
    documentId: string,
    notes?: string
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('client_documents')
        .update({
          status: 'VALIDATED',
          validated_by: currentUser.user?.id,
          validated_at: new Date().toISOString(),
          validation_notes: notes,
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error validating document:', err);
      throw err;
    }
  };

  const rejectDocument = async (
    documentId: string,
    reason: string,
    notes?: string
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('client_documents')
        .update({
          status: 'REJECTED',
          validated_by: currentUser.user?.id,
          validated_at: new Date().toISOString(),
          rejection_reason: reason,
          validation_notes: notes,
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error rejecting document:', err);
      throw err;
    }
  };

  const deleteDocument = async (documentId: string): Promise<void> => {
    try {
      // Get document to delete file from storage
      const { data: doc } = await supabase
        .from('client_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (doc?.file_url) {
        const filePath = doc.file_url.split('/').slice(-3).join('/');
        await supabase.storage.from('documents').remove([filePath]);
      }

      const { error: deleteError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  const requestSignature = async (documentId: string): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('client_documents')
        .update({
          requires_signature: true,
          signature_status: 'PENDING',
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      // In production, send signature request notification
      console.log('Signature request sent for document:', documentId);

      await fetchDocuments();
    } catch (err) {
      console.error('Error requesting signature:', err);
      throw err;
    }
  };

  const markAsSigned = async (
    documentId: string,
    signatureData?: Record<string, any>
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('client_documents')
        .update({
          signature_status: 'SIGNED',
          signed_at: new Date().toISOString(),
          signed_by: currentUser.user?.id,
          signature_data: signatureData || {},
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error marking as signed:', err);
      throw err;
    }
  };

  const updateDocument = async (
    documentId: string,
    updates: Partial<ClientDocument>
  ): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('client_documents')
        .update(updates)
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchDocuments();
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  return {
    documents,
    stats,
    loading,
    error,
    refresh: fetchDocuments,
    uploadDocument,
    validateDocument,
    rejectDocument,
    deleteDocument,
    requestSignature,
    markAsSigned,
    updateDocument,
  };
}

/**
 * Hook pour obtenir les documents d'un client spécifique (prospect ou buyer)
 */
export function useClientDocumentsByClient(
  clientType: 'prospect' | 'buyer',
  clientId: string
) {
  const [documents, setDocuments] = useState<ClientDocumentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterColumn = clientType === 'prospect' ? 'prospect_id' : 'buyer_id';

      const { data, error: fetchError } = await supabase
        .from('client_documents')
        .select(`
          *,
          lot:lots!lot_id(id, lot_number, lot_type),
          uploader:users!uploaded_by(id, first_name, last_name)
        `)
        .eq(filterColumn, clientId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching client documents:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [clientType, clientId]);

  useEffect(() => {
    if (clientId) {
      fetchDocuments();
    }
  }, [fetchDocuments, clientId]);

  const getRequiredDocuments = (): ClientDocumentType[] => {
    // Documents généralement requis pour un acheteur
    return [
      'ID_COPY',
      'RESERVATION_AGREEMENT',
      'EG_CONTRACT_SIGNED',
      'PROOF_OF_FUNDS',
    ];
  };

  const getMissingDocuments = (): ClientDocumentType[] => {
    const required = getRequiredDocuments();
    const uploaded = documents.map((d) => d.document_type);
    return required.filter((r) => !uploaded.includes(r));
  };

  const hasAllRequiredDocuments = (): boolean => {
    return getMissingDocuments().length === 0;
  };

  return {
    documents,
    loading,
    error,
    refresh: fetchDocuments,
    getRequiredDocuments,
    getMissingDocuments,
    hasAllRequiredDocuments,
  };
}

/**
 * Labels pour les types de documents clients
 */
export const CLIENT_DOCUMENT_TYPE_LABELS: Record<ClientDocumentType, string> = {
  RESERVATION_AGREEMENT: 'Convention de réservation',
  EG_CONTRACT_SIGNED: 'Contrat EG signé',
  ID_COPY: "Copie pièce d'identité",
  PROOF_OF_FUNDS: 'Preuve de fonds',
  BANK_GUARANTEE: 'Garantie bancaire',
  MORTGAGE_APPROVAL: 'Accord hypothécaire',
  POWER_OF_ATTORNEY: 'Procuration',
  MARRIAGE_CONTRACT: 'Contrat de mariage',
  TAX_RETURN: 'Déclaration fiscale',
  EMPLOYMENT_CONTRACT: 'Contrat de travail',
  AMENDMENT_SIGNED: 'Avenant signé',
  DEPOSIT_RECEIPT: "Reçu d'acompte",
  OTHER: 'Autre document',
};

/**
 * Catégories de documents clients
 */
export const CLIENT_DOCUMENT_CATEGORIES = {
  identity: ['ID_COPY'],
  contract: ['RESERVATION_AGREEMENT', 'EG_CONTRACT_SIGNED', 'AMENDMENT_SIGNED'],
  financial: ['PROOF_OF_FUNDS', 'BANK_GUARANTEE', 'MORTGAGE_APPROVAL', 'TAX_RETURN', 'DEPOSIT_RECEIPT'],
  legal: ['POWER_OF_ATTORNEY', 'MARRIAGE_CONTRACT', 'EMPLOYMENT_CONTRACT'],
  other: ['OTHER'],
};

/**
 * Icônes pour les types de documents clients
 */
export const CLIENT_DOCUMENT_ICONS: Record<ClientDocumentType, string> = {
  RESERVATION_AGREEMENT: 'FileSignature',
  EG_CONTRACT_SIGNED: 'FileCheck',
  ID_COPY: 'CreditCard',
  PROOF_OF_FUNDS: 'Wallet',
  BANK_GUARANTEE: 'Shield',
  MORTGAGE_APPROVAL: 'Home',
  POWER_OF_ATTORNEY: 'UserCheck',
  MARRIAGE_CONTRACT: 'Heart',
  TAX_RETURN: 'Receipt',
  EMPLOYMENT_CONTRACT: 'Briefcase',
  AMENDMENT_SIGNED: 'FilePlus',
  DEPOSIT_RECEIPT: 'Receipt',
  OTHER: 'File',
};
