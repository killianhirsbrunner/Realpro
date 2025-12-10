import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  PhoneVerification,
  StakeholderSession,
  PhoneVerificationStatus,
  TwoFactorStatusResponse,
} from '../types/stakeholder';

/**
 * Hook pour gérer l'authentification à deux facteurs (2FA) par SMS
 */
export function useTwoFactorAuth() {
  const [phoneVerification, setPhoneVerification] = useState<PhoneVerification | null>(null);
  const [sessions, setSessions] = useState<StakeholderSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const fetchPhoneVerification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_phone_verifications')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .eq('status', 'VERIFIED')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setPhoneVerification(data || null);
    } catch (err) {
      console.error('Error fetching phone verification:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const { data, error: fetchError } = await supabase
        .from('stakeholder_sessions')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .eq('is_revoked', false)
        .gt('expires_at', new Date().toISOString())
        .order('last_activity_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, []);

  useEffect(() => {
    fetchPhoneVerification();
    fetchSessions();
  }, [fetchPhoneVerification, fetchSessions]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const registerPhone = async (
    phoneNumber: string,
    countryCode: string = 'CH'
  ): Promise<PhoneVerification> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);

      // Check if phone already exists for this user
      const { data: existing } = await supabase
        .from('user_phone_verifications')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .eq('phone_number', formattedPhone)
        .single();

      if (existing) {
        setPhoneVerification(existing);
        return existing;
      }

      // Create new phone verification record
      const { data, error: insertError } = await supabase
        .from('user_phone_verifications')
        .insert({
          user_id: currentUser.user.id,
          phone_number: formattedPhone,
          country_code: countryCode,
          status: 'UNVERIFIED',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setPhoneVerification(data);
      return data;
    } catch (err) {
      console.error('Error registering phone:', err);
      throw err;
    }
  };

  const sendVerificationCode = async (
    purpose: 'PHONE_VERIFY' | 'LOGIN' | 'TRANSACTION' = 'PHONE_VERIFY'
  ): Promise<boolean> => {
    try {
      if (!phoneVerification) {
        throw new Error('No phone registered');
      }

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Check rate limiting
      if (phoneVerification.codes_sent_today >= 5) {
        throw new Error('Trop de codes envoyés aujourd\'hui. Réessayez demain.');
      }

      // Generate and store code via RPC
      const { data, error: rpcError } = await supabase.rpc('create_sms_verification_code', {
        p_user_id: currentUser.user.id,
        p_phone_verification_id: phoneVerification.id,
        p_purpose: purpose,
      });

      if (rpcError) throw rpcError;

      // In production, send SMS via Twilio/other provider
      // For now, we log it (would be handled by edge function)
      console.log('SMS Code generated:', data);

      // Call edge function to send SMS
      const { error: smsError } = await supabase.functions.invoke('send-sms', {
        body: {
          phone_number: phoneVerification.phone_number,
          code: data[0].code,
          purpose,
        },
      });

      // Don't throw error if SMS function fails in dev
      if (smsError) {
        console.warn('SMS sending failed (may be expected in dev):', smsError);
      }

      setCodeSent(true);
      setCountdown(60); // 60 seconds before resend

      await fetchPhoneVerification();
      return true;
    } catch (err) {
      console.error('Error sending verification code:', err);
      throw err;
    }
  };

  const verifyCode = async (
    code: string,
    purpose: 'PHONE_VERIFY' | 'LOGIN' | 'TRANSACTION' = 'PHONE_VERIFY'
  ): Promise<boolean> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      const { data, error: rpcError } = await supabase.rpc('verify_sms_code', {
        p_user_id: currentUser.user.id,
        p_code: code,
        p_purpose: purpose,
      });

      if (rpcError) throw rpcError;

      if (!data) {
        throw new Error('Code invalide ou expiré');
      }

      setCodeSent(false);
      await fetchPhoneVerification();
      return true;
    } catch (err) {
      console.error('Error verifying code:', err);
      throw err;
    }
  };

  const enable2FA = async (): Promise<void> => {
    try {
      if (!phoneVerification) {
        throw new Error('Veuillez d\'abord vérifier votre numéro de téléphone');
      }

      if (phoneVerification.status !== 'VERIFIED') {
        throw new Error('Votre numéro de téléphone n\'est pas vérifié');
      }

      const { error: updateError } = await supabase
        .from('user_phone_verifications')
        .update({ is_2fa_enabled: true })
        .eq('id', phoneVerification.id);

      if (updateError) throw updateError;

      await fetchPhoneVerification();
    } catch (err) {
      console.error('Error enabling 2FA:', err);
      throw err;
    }
  };

  const disable2FA = async (): Promise<void> => {
    try {
      if (!phoneVerification) return;

      const { error: updateError } = await supabase
        .from('user_phone_verifications')
        .update({ is_2fa_enabled: false })
        .eq('id', phoneVerification.id);

      if (updateError) throw updateError;

      await fetchPhoneVerification();
    } catch (err) {
      console.error('Error disabling 2FA:', err);
      throw err;
    }
  };

  const createSession = async (
    deviceInfo?: {
      device_name?: string;
      device_type?: string;
      browser?: string;
      os?: string;
    }
  ): Promise<StakeholderSession> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Generate session token
      const sessionToken = crypto.randomUUID();
      const tokenHash = await hashString(sessionToken);

      const { data, error: insertError } = await supabase
        .from('stakeholder_sessions')
        .insert({
          user_id: currentUser.user.id,
          session_token_hash: tokenHash,
          is_2fa_verified: false,
          device_name: deviceInfo?.device_name,
          device_type: deviceInfo?.device_type,
          browser: deviceInfo?.browser,
          os: deviceInfo?.os,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Store session token in localStorage
      localStorage.setItem('stakeholder_session', sessionToken);

      await fetchSessions();
      return data;
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const verify2FAForSession = async (sessionId: string): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('stakeholder_sessions')
        .update({
          is_2fa_verified: true,
          verified_2fa_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      await fetchSessions();
    } catch (err) {
      console.error('Error verifying 2FA for session:', err);
      throw err;
    }
  };

  const revokeSession = async (sessionId: string, reason?: string): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('stakeholder_sessions')
        .update({
          is_revoked: true,
          revoked_at: new Date().toISOString(),
          revoked_reason: reason,
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      await fetchSessions();
    } catch (err) {
      console.error('Error revoking session:', err);
      throw err;
    }
  };

  const revokeAllSessions = async (exceptCurrentSession?: string): Promise<void> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      let query = supabase
        .from('stakeholder_sessions')
        .update({
          is_revoked: true,
          revoked_at: new Date().toISOString(),
          revoked_reason: 'User requested logout from all devices',
        })
        .eq('user_id', currentUser.user.id)
        .eq('is_revoked', false);

      if (exceptCurrentSession) {
        query = query.neq('id', exceptCurrentSession);
      }

      const { error: updateError } = await query;

      if (updateError) throw updateError;

      await fetchSessions();
    } catch (err) {
      console.error('Error revoking all sessions:', err);
      throw err;
    }
  };

  const getStatus = (): TwoFactorStatusResponse => {
    return {
      isEnabled: phoneVerification?.is_2fa_enabled || false,
      isVerified: phoneVerification?.status === 'VERIFIED',
      phoneNumber: phoneVerification
        ? maskPhoneNumber(phoneVerification.phone_number)
        : undefined,
      lastVerified: phoneVerification?.verified_at || undefined,
    };
  };

  return {
    phoneVerification,
    sessions,
    loading,
    error,
    codeSent,
    countdown,
    refresh: fetchPhoneVerification,
    refreshSessions: fetchSessions,
    registerPhone,
    sendVerificationCode,
    verifyCode,
    enable2FA,
    disable2FA,
    createSession,
    verify2FAForSession,
    revokeSession,
    revokeAllSessions,
    getStatus,
  };
}

/**
 * Hook pour vérifier si 2FA est requis avant une action sensible
 */
export function useRequire2FA() {
  const { phoneVerification, sendVerificationCode, verifyCode } = useTwoFactorAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const requireVerification = async (action: () => Promise<void>): Promise<void> => {
    if (!phoneVerification?.is_2fa_enabled) {
      // 2FA not enabled, proceed directly
      await action();
      return;
    }

    // Check if recently verified (within 15 minutes)
    const recentSession = await checkRecentVerification();
    if (recentSession) {
      await action();
      return;
    }

    // Need to verify
    setPendingAction(() => action);
    setShowModal(true);
    await sendVerificationCode('TRANSACTION');
  };

  const onVerify = async (code: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const verified = await verifyCode(code, 'TRANSACTION');
      if (verified && pendingAction) {
        await pendingAction();
        setShowModal(false);
        setPendingAction(null);
        return true;
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const onCancel = () => {
    setShowModal(false);
    setPendingAction(null);
  };

  return {
    showModal,
    isVerifying,
    requireVerification,
    onVerify,
    onCancel,
  };
}

// Helper functions

async function checkRecentVerification(): Promise<boolean> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) return false;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from('stakeholder_sessions')
      .select('id')
      .eq('user_id', currentUser.user.id)
      .eq('is_2fa_verified', true)
      .gt('verified_2fa_at', fifteenMinutesAgo)
      .eq('is_revoked', false)
      .limit(1)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

function formatPhoneNumber(phone: string, countryCode: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Add country prefix if not present
  const countryPrefixes: Record<string, string> = {
    CH: '+41',
    FR: '+33',
    DE: '+49',
    IT: '+39',
    AT: '+43',
  };

  const prefix = countryPrefixes[countryCode] || '+41';

  if (digits.startsWith('0')) {
    return prefix + digits.substring(1);
  }

  if (!digits.startsWith(prefix.replace('+', ''))) {
    return prefix + digits;
  }

  return '+' + digits;
}

function maskPhoneNumber(phone: string): string {
  if (phone.length < 8) return phone;
  return phone.substring(0, 4) + '****' + phone.substring(phone.length - 2);
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
