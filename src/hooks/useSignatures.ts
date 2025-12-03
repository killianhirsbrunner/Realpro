import { useState, useEffect } from 'react';

export interface SignatureRequest {
  id: string;
  organization_id: string;
  document_id: string;
  type: string;
  status: 'PENDING' | 'SENT' | 'SIGNED' | 'FAILED' | 'CANCELLED';
  provider: string;
  provider_request_id: string | null;
  signer_name: string | null;
  signer_email: string;
  signer_locale: string | null;
  redirect_url_success: string | null;
  redirect_url_cancel: string | null;
  created_at: string;
  updated_at: string;
}

export function useSignatures(documentId: string) {
  const [signatures, setSignatures] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSignatures = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signatures/document/${documentId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) throw new Error('Failed to load signatures');

      const data = await response.json();
      setSignatures(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initSignature = async (
    type: string,
    signerEmail: string,
    signerName?: string,
    signerLocale?: string
  ) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signatures/init`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentId,
          type,
          signerEmail,
          signerName,
          signerLocale,
        }),
      });

      if (!response.ok) throw new Error('Failed to init signature');

      const data = await response.json();
      await loadSignatures();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (documentId) {
      loadSignatures();
    }
  }, [documentId]);

  return {
    signatures,
    loading,
    error,
    initSignature,
    refresh: loadSignatures,
  };
}
