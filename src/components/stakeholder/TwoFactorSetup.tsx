import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Lock,
  RefreshCw,
  LogOut,
  Monitor,
  Tablet,
  Phone,
  Globe,
} from 'lucide-react';
import { useTwoFactorAuth } from '../../hooks/useTwoFactorAuth';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  required?: boolean;
}

export function TwoFactorSetup({ onComplete, required = false }: TwoFactorSetupProps) {
  const { t } = useTranslation();
  const {
    phoneVerification,
    sessions,
    loading,
    codeSent,
    countdown,
    registerPhone,
    sendVerificationCode,
    verifyCode,
    enable2FA,
    disable2FA,
    revokeSession,
    revokeAllSessions,
    getStatus,
  } = useTwoFactorAuth();

  const [step, setStep] = useState<'phone' | 'verify' | 'complete'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('CH');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const status = getStatus();

  useEffect(() => {
    if (phoneVerification?.status === 'VERIFIED') {
      setStep('complete');
    }
  }, [phoneVerification]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerPhone(phoneNumber, countryCode);
      await sendVerificationCode('PHONE_VERIFY');
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = paste.split('').concat(Array(6).fill('')).slice(0, 6);
    setVerificationCode(newCode);
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const verified = await verifyCode(code, 'PHONE_VERIFY');
      if (verified) {
        await enable2FA();
        setStep('complete');
        onComplete?.();
      } else {
        setError('Code invalide ou expiré');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de vérification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    try {
      await sendVerificationCode('PHONE_VERIFY');
      setVerificationCode(['', '', '', '', '', '']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Authentification à deux facteurs
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sécurisez votre compte avec la vérification SMS
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8">
          {['phone', 'verify', 'complete'].map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : ['verify', 'complete'].indexOf(step) > ['phone', 'verify', 'complete'].indexOf(s)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {['verify', 'complete'].indexOf(step) > ['phone', 'verify', 'complete'].indexOf(s) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    ['verify', 'complete'].indexOf(step) > index
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step: Phone number */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <Smartphone className="mx-auto h-12 w-12 text-indigo-600" />
              <h4 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Entrez votre numéro de téléphone
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Nous vous enverrons un code de vérification par SMS
              </p>
            </div>

            <div className="flex space-x-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="block w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CH">🇨🇭 +41</option>
                <option value="FR">🇫🇷 +33</option>
                <option value="DE">🇩🇪 +49</option>
                <option value="IT">🇮🇹 +39</option>
                <option value="AT">🇦🇹 +43</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="79 123 45 67"
                className="flex-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !phoneNumber}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le code
                </>
              )}
            </button>
          </form>
        )}

        {/* Step: Verify code */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="mx-auto h-12 w-12 text-indigo-600" />
              <h4 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Entrez le code de vérification
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Un code à 6 chiffres a été envoyé au {phoneVerification?.phone_number}
              </p>
            </div>

            <div className="flex justify-center space-x-2" onPaste={handlePaste}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleVerifyCode}
                disabled={isSubmitting || verificationCode.join('').length !== 6}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Vérifier le code
                  </>
                )}
              </button>

              <button
                onClick={handleResendCode}
                disabled={countdown > 0}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? (
                  `Renvoyer le code dans ${countdown}s`
                ) : (
                  <span className="flex items-center">
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Renvoyer le code
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                2FA activé avec succès
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Votre compte est maintenant protégé par l'authentification à deux facteurs
              </p>
            </div>

            {/* Active sessions */}
            {sessions.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    Sessions actives
                  </h5>
                  <button
                    onClick={() => revokeAllSessions()}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Déconnecter tout
                  </button>
                </div>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      onRevoke={() => revokeSession(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Disable 2FA */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={async () => {
                  await disable2FA();
                  setStep('phone');
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-lg text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Désactiver l'authentification à deux facteurs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SessionRowProps {
  session: {
    id: string;
    device_type?: string | null;
    device_name?: string | null;
    browser?: string | null;
    os?: string | null;
    ip_address?: string | null;
    last_activity_at: string;
    is_2fa_verified: boolean;
  };
  onRevoke: () => void;
}

function SessionRow({ session, onRevoke }: SessionRowProps) {
  const getDeviceIcon = (type?: string | null) => {
    switch (type?.toLowerCase()) {
      case 'mobile':
        return Phone;
      case 'tablet':
        return Tablet;
      case 'desktop':
        return Monitor;
      default:
        return Globe;
    }
  };

  const Icon = getDeviceIcon(session.device_type);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {session.device_name || session.browser || 'Appareil inconnu'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {session.os} • {session.ip_address} • {formatRelativeTime(session.last_activity_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {session.is_2fa_verified && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Shield className="mr-1 h-3 w-3" />
            2FA
          </span>
        )}
        <button
          onClick={onRevoke}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Déconnecter"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// 2FA Verification Modal
interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function TwoFactorModal({ isOpen, onClose, onVerify, isLoading }: TwoFactorModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const codeStr = code.join('');
    if (codeStr.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }
    setError(null);
    const success = await onVerify(codeStr);
    if (!success) {
      setError('Code invalide');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Vérification requise
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Entrez le code envoyé par SMS pour continuer
            </p>
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-xl font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || code.join('').length !== 6}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Vérifier'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return `Il y a ${diffDays}j`;
}
