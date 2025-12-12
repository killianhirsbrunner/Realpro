import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';

export type DocumentType = 'identity' | 'income_proof' | 'financing_proof' | 'signature_power' | 'other';
export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

export function getDocumentStatusConfig(status: DocumentStatus) {
  const configs: Record<DocumentStatus, { label: string; color: string; icon: string }> = {
    pending: {
      label: 'En attente',
      color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/30',
      icon: 'Circle',
    },
    uploaded: {
      label: 'Téléversé',
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      icon: 'Upload',
    },
    verified: {
      label: 'Vérifié',
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      icon: 'CheckCircle',
    },
    rejected: {
      label: 'Rejeté',
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
      icon: 'XCircle',
    },
  };
  return configs[status] || configs.pending;
}

export interface NotaryDocument {
  id: string;
  dossier_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  uploader?: {
    first_name: string;
    last_name: string;
  };
  verifier?: {
    first_name: string;
    last_name: string;
  };
}

export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  isMandatory: boolean;
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: 'identity',
    label: 'Piece d\'identite',
    description: 'Passeport ou carte d\'identite valide',
    isMandatory: true,
  },
  {
    type: 'income_proof',
    label: 'Justificatif de revenus',
    description: 'Attestation employeur ou declaration fiscale',
    isMandatory: true,
  },
  {
    type: 'financing_proof',
    label: 'Accord de financement',
    description: 'Attestation de la banque pour le credit hypothecaire',
    isMandatory: true,
  },
  {
    type: 'signature_power',
    label: 'Procuration',
    description: 'Si l\'acheteur ne peut pas signer en personne',
    isMandatory: false,
  },
];

export interface DocumentChecklist {
  type: DocumentType;
  label: string;
  description: string;
  isMandatory: boolean;
  document: NotaryDocument | null;
  isComplete: boolean;
  isVerified: boolean;
}

export function useNotaryDocuments(dossierId: string) {
  const { user } = useCurrentUser();
  const [documents, setDocuments] = useState<NotaryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!dossierId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notary_documents')
        .select(`
          *,
          uploader:uploaded_by(first_name, last_name),
          verifier:verified_by(first_name, last_name)
        `)
        .eq('dossier_id', dossierId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading notary documents:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [dossierId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  /**
   * Genere la checklist complete avec statut
   */
  const getChecklist = useCallback((): DocumentChecklist[] => {
    return DOCUMENT_REQUIREMENTS.map((req) => {
      const doc = documents.find((d) => d.document_type === req.type);
      return {
        ...req,
        document: doc || null,
        isComplete: !!doc,
        isVerified: !!doc?.verified_at,
      };
    });
  }, [documents]);

  /**
   * Calcule le nombre de documents manquants obligatoires
   */
  const getMissingMandatoryCount = useCallback((): number => {
    const checklist = getChecklist();
    return checklist.filter((item) => item.isMandatory && !item.isComplete).length;
  }, [getChecklist]);

  /**
   * Verifie si le dossier est complet
   */
  const isComplete = useCallback((): boolean => {
    return getMissingMandatoryCount() === 0;
  }, [getMissingMandatoryCount]);

  /**
   * Upload un document
   */
  const uploadDocument = useCallback(
    async (documentType: DocumentType, file: File) => {
      if (!user || !dossierId) return;

      try {
        // 1. Upload le fichier vers le storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${dossierId}/${documentType}_${Date.now()}.${fileExt}`;
        const filePath = `notary-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Obtenir l'URL publique
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);

        // 3. Supprimer l'ancien document du meme type s'il existe
        const existingDoc = documents.find((d) => d.document_type === documentType);
        if (existingDoc) {
          await supabase.from('notary_documents').delete().eq('id', existingDoc.id);
        }

        // 4. Creer l'entree en base
        const { error: insertError } = await supabase.from('notary_documents').insert({
          dossier_id: dossierId,
          document_type: documentType,
          file_url: urlData.publicUrl,
          file_name: file.name,
          uploaded_by: user.id,
        });

        if (insertError) throw insertError;

        await loadDocuments();
      } catch (err) {
        console.error('Error uploading document:', err);
        throw err;
      }
    },
    [user, dossierId, documents, loadDocuments]
  );

  /**
   * Verifie/valide un document
   */
  const verifyDocument = useCallback(
    async (documentId: string) => {
      if (!user) return;

      try {
        const { error: updateError } = await supabase
          .from('notary_documents')
          .update({
            verified_by: user.id,
            verified_at: new Date().toISOString(),
          })
          .eq('id', documentId);

        if (updateError) throw updateError;

        await loadDocuments();
      } catch (err) {
        console.error('Error verifying document:', err);
        throw err;
      }
    },
    [user, loadDocuments]
  );

  /**
   * Invalide la verification d'un document
   */
  const unverifyDocument = useCallback(
    async (documentId: string) => {
      try {
        const { error: updateError } = await supabase
          .from('notary_documents')
          .update({
            verified_by: null,
            verified_at: null,
          })
          .eq('id', documentId);

        if (updateError) throw updateError;

        await loadDocuments();
      } catch (err) {
        console.error('Error unverifying document:', err);
        throw err;
      }
    },
    [loadDocuments]
  );

  /**
   * Supprime un document
   */
  const deleteDocument = useCallback(
    async (documentId: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('notary_documents')
          .delete()
          .eq('id', documentId);

        if (deleteError) throw deleteError;

        await loadDocuments();
      } catch (err) {
        console.error('Error deleting document:', err);
        throw err;
      }
    },
    [loadDocuments]
  );

  return {
    documents,
    loading,
    error,
    getChecklist,
    getMissingMandatoryCount,
    isComplete,
    uploadDocument,
    verifyDocument,
    unverifyDocument,
    deleteDocument,
    refresh: loadDocuments,
  };
}
