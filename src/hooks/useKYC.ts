import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  KYCVerification,
  KYCDocument,
  KYCVerificationWithDocuments,
  KYCStatus,
  KYCDocumentType,
  VerificationType,
  KYCSubmissionData,
  KYCStatusResponse,
} from '../types/stakeholder';

/**
 * Hook pour gérer le processus KYC (Know Your Customer) des intervenants
 */
export function useKYC(userId?: string) {
  const [verification, setVerification] = useState<KYCVerificationWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVerification = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('kyc_verifications')
        .select(`
          *,
          documents:kyc_documents(*),
          user:users!user_id(id, first_name, last_name, email),
          company:companies!company_id(id, name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setVerification(data || null);
    } catch (err) {
      console.error('Error fetching KYC verification:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  const startVerification = async (
    organizationId: string,
    projectId?: string,
    verificationType: VerificationType = 'IDENTITY'
  ): Promise<KYCVerification> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      const { data, error: insertError } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: currentUser.user.id,
          organization_id: organizationId,
          project_id: projectId || null,
          verification_type: verificationType,
          status: 'PENDING',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchVerification();
      return data;
    } catch (err) {
      console.error('Error starting KYC verification:', err);
      throw err;
    }
  };

  const uploadDocument = async (
    verificationId: string,
    documentType: KYCDocumentType,
    file: File,
    metadata?: {
      document_number?: string;
      issue_date?: string;
      expiry_date?: string;
      issuing_country?: string;
      issuing_authority?: string;
    }
  ): Promise<KYCDocument> => {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `kyc/${verificationId}/${documentType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data, error: insertError } = await supabase
        .from('kyc_documents')
        .insert({
          kyc_verification_id: verificationId,
          document_type: documentType,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type,
          document_number: metadata?.document_number,
          issue_date: metadata?.issue_date,
          expiry_date: metadata?.expiry_date,
          issuing_country: metadata?.issuing_country || 'CH',
          issuing_authority: metadata?.issuing_authority,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchVerification();
      return data;
    } catch (err) {
      console.error('Error uploading KYC document:', err);
      throw err;
    }
  };

  const submitForReview = async (verificationId: string): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'SUBMITTED',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', verificationId);

      if (updateError) throw updateError;

      await fetchVerification();
    } catch (err) {
      console.error('Error submitting KYC for review:', err);
      throw err;
    }
  };

  const deleteDocument = async (documentId: string): Promise<void> => {
    try {
      // Get document to delete file from storage
      const { data: doc } = await supabase
        .from('kyc_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (doc?.file_url) {
        const filePath = doc.file_url.split('/').slice(-3).join('/');
        await supabase.storage.from('documents').remove([filePath]);
      }

      const { error: deleteError } = await supabase
        .from('kyc_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      await fetchVerification();
    } catch (err) {
      console.error('Error deleting KYC document:', err);
      throw err;
    }
  };

  const getStatus = (): KYCStatusResponse => {
    if (!verification) {
      return {
        hasActiveKYC: false,
        verification: null,
        requiredDocuments: ['ID_CARD', 'PROOF_OF_FUNDS'],
        canProceed: false,
        blockedReason: 'Vérification KYC requise',
      };
    }

    const isApproved = verification.status === 'APPROVED';
    const isPending = ['PENDING', 'SUBMITTED', 'IN_REVIEW'].includes(verification.status);
    const isRejected = verification.status === 'REJECTED';

    return {
      hasActiveKYC: true,
      verification,
      requiredDocuments: getRequiredDocuments(verification.verification_type),
      canProceed: isApproved,
      blockedReason: isRejected
        ? verification.rejection_reason || 'Vérification rejetée'
        : isPending
        ? 'Vérification en cours'
        : undefined,
    };
  };

  return {
    verification,
    loading,
    error,
    refresh: fetchVerification,
    startVerification,
    uploadDocument,
    submitForReview,
    deleteDocument,
    getStatus,
  };
}

/**
 * Hook pour les administrateurs - Gestion des vérifications KYC
 */
export function useKYCAdmin(organizationId: string) {
  const [verifications, setVerifications] = useState<KYCVerificationWithDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<{
    status?: KYCStatus;
    verificationType?: VerificationType;
    search?: string;
  }>({});

  const fetchVerifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('kyc_verifications')
        .select(`
          *,
          documents:kyc_documents(*),
          user:users!user_id(id, first_name, last_name, email),
          company:companies!company_id(id, name)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.verificationType) {
        query = query.eq('verification_type', filters.verificationType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let results = data || [];

      // Client-side search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(
          (v) =>
            v.user?.first_name?.toLowerCase().includes(searchLower) ||
            v.user?.last_name?.toLowerCase().includes(searchLower) ||
            v.user?.email?.toLowerCase().includes(searchLower) ||
            v.company?.name?.toLowerCase().includes(searchLower)
        );
      }

      setVerifications(results);
    } catch (err) {
      console.error('Error fetching KYC verifications:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [organizationId, filters]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const approveVerification = async (
    verificationId: string,
    notes?: string
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'APPROVED',
          reviewed_by: currentUser.user?.id,
          reviewed_at: new Date().toISOString(),
          approved_at: new Date().toISOString(),
          review_notes: notes,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        })
        .eq('id', verificationId);

      if (updateError) throw updateError;

      await fetchVerifications();
    } catch (err) {
      console.error('Error approving KYC verification:', err);
      throw err;
    }
  };

  const rejectVerification = async (
    verificationId: string,
    reason: string,
    notes?: string
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'REJECTED',
          reviewed_by: currentUser.user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
          review_notes: notes,
        })
        .eq('id', verificationId);

      if (updateError) throw updateError;

      await fetchVerifications();
    } catch (err) {
      console.error('Error rejecting KYC verification:', err);
      throw err;
    }
  };

  const requestMoreInfo = async (
    verificationId: string,
    notes: string
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'PENDING',
          reviewed_by: currentUser.user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
        })
        .eq('id', verificationId);

      if (updateError) throw updateError;

      await fetchVerifications();
    } catch (err) {
      console.error('Error requesting more info:', err);
      throw err;
    }
  };

  const verifyDocument = async (
    documentId: string,
    isVerified: boolean,
    result?: Record<string, any>
  ): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('kyc_documents')
        .update({
          is_verified: isVerified,
          verified_by: currentUser.user?.id,
          verified_at: new Date().toISOString(),
          verification_method: 'MANUAL',
          verification_result: result || {},
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      await fetchVerifications();
    } catch (err) {
      console.error('Error verifying document:', err);
      throw err;
    }
  };

  return {
    verifications,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchVerifications,
    approveVerification,
    rejectVerification,
    requestMoreInfo,
    verifyDocument,
  };
}

/**
 * Retourne les documents requis selon le type de vérification
 */
function getRequiredDocuments(verificationType: VerificationType): KYCDocumentType[] {
  switch (verificationType) {
    case 'IDENTITY':
      return ['ID_CARD', 'UTILITY_BILL'];
    case 'COMPANY':
      return ['COMPANY_REGISTRATION', 'VAT_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'BENEFICIAL_OWNERS'];
    case 'PROFESSIONAL':
      return ['ID_CARD', 'PROFESSIONAL_LICENSE', 'INSURANCE_CERTIFICATE'];
    case 'ADDRESS':
      return ['UTILITY_BILL', 'BANK_STATEMENT'];
    default:
      return ['ID_CARD'];
  }
}

/**
 * Labels pour les types de documents KYC
 */
export const KYC_DOCUMENT_LABELS: Record<KYCDocumentType, string> = {
  PASSPORT: 'Passeport',
  ID_CARD: "Carte d'identité",
  DRIVING_LICENSE: 'Permis de conduire',
  RESIDENCE_PERMIT: 'Permis de séjour',
  COMPANY_REGISTRATION: 'Extrait du Registre du Commerce',
  VAT_CERTIFICATE: 'Certificat TVA',
  INSURANCE_CERTIFICATE: 'Attestation RC',
  PROFESSIONAL_LICENSE: 'Licence professionnelle',
  BANK_STATEMENT: 'Relevé bancaire',
  UTILITY_BILL: 'Facture (preuve adresse)',
  COMPANY_STATUTES: 'Statuts de la société',
  BENEFICIAL_OWNERS: 'Ayants droit économiques',
  OTHER: 'Autre document',
};

/**
 * Labels pour les statuts KYC
 */
export const KYC_STATUS_LABELS: Record<KYCStatus, string> = {
  PENDING: 'En attente',
  SUBMITTED: 'Soumis',
  IN_REVIEW: 'En cours de vérification',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  EXPIRED: 'Expiré',
};

/**
 * Couleurs pour les statuts KYC
 */
export const KYC_STATUS_COLORS: Record<KYCStatus, string> = {
  PENDING: 'yellow',
  SUBMITTED: 'blue',
  IN_REVIEW: 'purple',
  APPROVED: 'green',
  REJECTED: 'red',
  EXPIRED: 'gray',
};
