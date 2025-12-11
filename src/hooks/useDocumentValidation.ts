import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from './useCurrentUser';

/**
 * Types pour le systeme de validation de documents
 */
export type ValidationStatus = 'draft' | 'pending_review' | 'in_review' | 'approved' | 'rejected';

export type ValidationAction = 'submitted' | 'approved' | 'rejected' | 'revision_requested' | 'reassigned';

export interface DocumentValidation {
  id: string;
  document_id: string;
  action: ValidationAction;
  performed_by: string;
  performed_at: string;
  comment?: string;
  previous_status: ValidationStatus;
  new_status: ValidationStatus;
  metadata?: Record<string, unknown>;
  performer?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface PendingValidation {
  id: string;
  name: string;
  category: string;
  validation_status: ValidationStatus;
  validation_deadline?: string;
  uploaded_by: string;
  uploaded_by_name: string;
  created_at: string;
  days_pending: number;
}

export interface ValidationStats {
  draft_count: number;
  pending_count: number;
  reviewing_count: number;
  approved_count: number;
  rejected_count: number;
  total_count: number;
  overdue_count: number;
}

export interface ShareLinkOptions {
  expiresInDays?: number;
  maxDownloads?: number;
  password?: string;
}

export interface ShareLinkResult {
  token: string;
  url: string;
  expiresAt: Date;
}

export interface UseDocumentValidationReturn {
  // Actions de validation
  submitForValidation: (
    documentId: string,
    options?: {
      validatorRole?: string;
      validatorUserId?: string;
      deadline?: Date;
      comment?: string;
    }
  ) => Promise<void>;
  approveDocument: (documentId: string, comment?: string) => Promise<void>;
  rejectDocument: (documentId: string, reason: string) => Promise<void>;
  startReview: (documentId: string) => Promise<void>;

  // Historique et stats
  getValidationHistory: (documentId: string) => Promise<DocumentValidation[]>;
  getPendingValidations: (projectId: string) => Promise<PendingValidation[]>;
  getValidationStats: (projectId: string) => Promise<ValidationStats | null>;

  // Partage
  createShareLink: (documentId: string, options?: ShareLinkOptions) => Promise<ShareLinkResult>;
  revokeShareLink: (documentId: string) => Promise<void>;

  // Etat
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour gerer la validation des documents
 *
 * Permet de soumettre des documents pour validation, approuver/rejeter,
 * et suivre l'historique des validations.
 */
export function useDocumentValidation(): UseDocumentValidationReturn {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Soumet un document pour validation
   */
  const submitForValidation = useCallback(
    async (
      documentId: string,
      options?: {
        validatorRole?: string;
        validatorUserId?: string;
        deadline?: Date;
        comment?: string;
      }
    ) => {
      if (!user) throw new Error('Non authentifie');

      setLoading(true);
      setError(null);

      try {
        const { error: rpcError } = await supabase.rpc('submit_document_for_validation', {
          p_document_id: documentId,
          p_user_id: user.id,
          p_validator_role: options?.validatorRole || null,
          p_validator_user_id: options?.validatorUserId || null,
          p_deadline: options?.deadline?.toISOString() || null,
          p_comment: options?.comment || null,
        });

        if (rpcError) throw rpcError;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Approuve un document
   */
  const approveDocument = useCallback(
    async (documentId: string, comment?: string) => {
      if (!user) throw new Error('Non authentifie');

      setLoading(true);
      setError(null);

      try {
        const { error: rpcError } = await supabase.rpc('validate_document', {
          p_document_id: documentId,
          p_user_id: user.id,
          p_approved: true,
          p_comment: comment || null,
        });

        if (rpcError) throw rpcError;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Rejette un document (motif obligatoire)
   */
  const rejectDocument = useCallback(
    async (documentId: string, reason: string) => {
      if (!user) throw new Error('Non authentifie');

      if (!reason || reason.trim() === '') {
        throw new Error('Un motif de refus est obligatoire');
      }

      setLoading(true);
      setError(null);

      try {
        const { error: rpcError } = await supabase.rpc('validate_document', {
          p_document_id: documentId,
          p_user_id: user.id,
          p_approved: false,
          p_comment: reason,
        });

        if (rpcError) throw rpcError;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Marque un document comme en cours de revision
   */
  const startReview = useCallback(
    async (documentId: string) => {
      if (!user) throw new Error('Non authentifie');

      setLoading(true);
      setError(null);

      try {
        // Mettre a jour le statut directement
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            validation_status: 'in_review',
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentId)
          .eq('validation_status', 'pending_review');

        if (updateError) throw updateError;

        // Logger l'action
        const { error: logError } = await supabase.from('document_validations').insert({
          document_id: documentId,
          action: 'revision_requested',
          performed_by: user.id,
          previous_status: 'pending_review',
          new_status: 'in_review',
        });

        if (logError) throw logError;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Recupere l'historique des validations d'un document
   */
  const getValidationHistory = useCallback(async (documentId: string): Promise<DocumentValidation[]> => {
    const { data, error: fetchError } = await supabase
      .from('document_validations')
      .select(
        `
        *,
        performer:performed_by(first_name, last_name, avatar_url)
      `
      )
      .eq('document_id', documentId)
      .order('performed_at', { ascending: false });

    if (fetchError) throw fetchError;
    return (data || []) as DocumentValidation[];
  }, []);

  /**
   * Recupere les documents en attente de validation pour un projet
   */
  const getPendingValidations = useCallback(async (projectId: string): Promise<PendingValidation[]> => {
    const { data, error: fetchError } = await supabase.rpc('get_pending_validations', {
      p_project_id: projectId,
    });

    if (fetchError) throw fetchError;
    return (data || []) as PendingValidation[];
  }, []);

  /**
   * Recupere les statistiques de validation pour un projet
   */
  const getValidationStats = useCallback(async (projectId: string): Promise<ValidationStats | null> => {
    const { data, error: fetchError } = await supabase
      .from('document_validation_stats')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (fetchError) {
      // Si pas de stats (aucun document), retourner des valeurs par defaut
      if (fetchError.code === 'PGRST116') {
        return {
          draft_count: 0,
          pending_count: 0,
          reviewing_count: 0,
          approved_count: 0,
          rejected_count: 0,
          total_count: 0,
          overdue_count: 0,
        };
      }
      throw fetchError;
    }

    return data as ValidationStats;
  }, []);

  /**
   * Cree un lien de partage pour un document
   */
  const createShareLink = useCallback(
    async (documentId: string, options?: ShareLinkOptions): Promise<ShareLinkResult> => {
      if (!user) throw new Error('Non authentifie');

      setLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('create_document_share_link', {
          p_document_id: documentId,
          p_user_id: user.id,
          p_expires_in_days: options?.expiresInDays || 7,
          p_max_downloads: options?.maxDownloads || null,
          p_password: options?.password || null,
        });

        if (rpcError) throw rpcError;

        const token = data as string;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (options?.expiresInDays || 7));

        return {
          token,
          url: `${window.location.origin}/share/${token}`,
          expiresAt,
        };
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Revoque un lien de partage
   */
  const revokeShareLink = useCallback(
    async (documentId: string) => {
      if (!user) throw new Error('Non authentifie');

      setLoading(true);
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            share_token: null,
            share_expires_at: null,
            share_password_hash: null,
            share_max_downloads: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', documentId);

        if (updateError) throw updateError;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    submitForValidation,
    approveDocument,
    rejectDocument,
    startReview,
    getValidationHistory,
    getPendingValidations,
    getValidationStats,
    createShareLink,
    revokeShareLink,
    loading,
    error,
  };
}
