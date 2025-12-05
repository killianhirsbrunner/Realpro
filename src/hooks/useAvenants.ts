import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Avenant {
  id: string;
  project_id: string;
  lot_id?: string;
  supplier_offer_id: string;
  reference: string;
  title: string;
  description?: string;
  amount: number;
  vat_rate: number;
  vat_amount: number;
  total_with_vat: number;
  type: 'simple' | 'detailed' | 'legal';
  status: 'draft' | 'pending_signature' | 'signed' | 'rejected' | 'cancelled';
  pdf_url?: string;
  pdf_signed_url?: string;
  generated_at?: string;
  requires_qualified_signature: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvenantSignature {
  id: string;
  avenant_id: string;
  signer_user_id: string;
  signer_name: string;
  signer_email: string;
  signer_role: 'client' | 'promoter' | 'architect' | 'contractor';
  signature_data: string;
  signature_method: 'electronic' | 'qualified' | 'simple';
  ip_address?: string;
  user_agent?: string;
  location?: string;
  signed_at: string;
  is_valid: boolean;
}

export function useAvenants(projectId: string | undefined) {
  const [avenants, setAvenants] = useState<Avenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchAvenants() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('avenants')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setAvenants(data || []);
      } catch (err: any) {
        console.error('Error fetching avenants:', err);
        setError('Erreur lors du chargement des avenants');
      } finally {
        setLoading(false);
      }
    }

    fetchAvenants();
  }, [projectId]);

  return { avenants, loading, error };
}

export function useAvenantDetail(avenantId: string | undefined) {
  const [avenant, setAvenant] = useState<Avenant | null>(null);
  const [signatures, setSignatures] = useState<AvenantSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    if (!avenantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [avenantResult, signaturesResult] = await Promise.all([
        supabase
          .from('avenants')
          .select('*')
          .eq('id', avenantId)
          .maybeSingle(),
        supabase
          .from('avenant_signatures')
          .select('*')
          .eq('avenant_id', avenantId)
          .order('signed_at', { ascending: true }),
      ]);

      if (avenantResult.error) throw avenantResult.error;
      if (signaturesResult.error) throw signaturesResult.error;

      setAvenant(avenantResult.data);
      setSignatures(signaturesResult.data || []);
    } catch (err: any) {
      console.error('Error fetching avenant:', err);
      setError('Erreur lors du chargement de l\'avenant');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [avenantId]);

  return { avenant, signatures, loading, error, refetch: fetchData };
}

export function useSignAvenant() {
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signAvenant(
    avenantId: string,
    signatureData: string,
    signerName: string,
    signerEmail: string,
    signerRole: string = 'client'
  ) {
    try {
      setSigning(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      const { data, error: signError } = await supabase
        .from('avenant_signatures')
        .insert({
          avenant_id: avenantId,
          signer_user_id: user.id,
          signer_name: signerName,
          signer_email: signerEmail,
          signer_role: signerRole,
          signature_data: signatureData,
          signature_method: 'electronic',
          ip_address: ip,
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (signError) throw signError;

      await supabase
        .from('avenants')
        .update({ status: 'signed' })
        .eq('id', avenantId);

      return data;
    } catch (err: any) {
      console.error('Error signing avenant:', err);
      setError(err.message || 'Erreur lors de la signature');
      throw err;
    } finally {
      setSigning(false);
    }
  }

  return { signAvenant, signing, error };
}

export function useGenerateAvenant() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateAvenant(
    projectId: string,
    supplierOfferId: string,
    data: {
      title: string;
      description?: string;
      amount: number;
      lotId?: string;
      type?: 'simple' | 'detailed' | 'legal';
    }
  ) {
    try {
      setGenerating(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const vatRate = 8.1;
      const vatAmount = (data.amount * vatRate) / 100;
      const totalWithVat = data.amount + vatAmount;

      let avenantType = data.type || 'simple';
      if (!data.type) {
        if (data.amount > 10000) {
          avenantType = 'legal';
        } else if (data.amount > 1000) {
          avenantType = 'detailed';
        }
      }

      const { data: avenant, error: createError } = await supabase
        .from('avenants')
        .insert({
          project_id: projectId,
          lot_id: data.lotId || null,
          supplier_offer_id: supplierOfferId,
          title: data.title,
          description: data.description,
          amount: data.amount,
          vat_rate: vatRate,
          vat_amount: vatAmount,
          total_with_vat: totalWithVat,
          type: avenantType,
          status: 'pending_signature',
          generated_at: new Date().toISOString(),
          generated_by_user_id: user.id,
          requires_qualified_signature: data.amount > 5000,
        })
        .select()
        .single();

      if (createError) throw createError;

      return avenant;
    } catch (err: any) {
      console.error('Error generating avenant:', err);
      setError(err.message || 'Erreur lors de la génération de l\'avenant');
      throw err;
    } finally {
      setGenerating(false);
    }
  }

  return { generateAvenant, generating, error };
}
