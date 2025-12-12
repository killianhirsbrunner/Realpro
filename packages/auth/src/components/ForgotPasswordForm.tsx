import { useState, type FormEvent } from 'react';
import { Button, Input, Alert } from '@realpro/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export interface ForgotPasswordFormProps {
  /** Submit handler */
  onSubmit: (email: string) => Promise<void>;
  /** Back to login handler */
  onBackToLogin?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
}

export function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  error,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
    setIsSubmitted(true);
  };

  // Success state
  if (isSubmitted && !error) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Email envoyé
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
            Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez
            un email avec les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>

        {onBackToLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onBackToLogin}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour à la connexion
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Mot de passe oublié ?
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" dismissible>
          {error}
        </Alert>
      )}

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="nom@entreprise.ch"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="h-4 w-4" />}
        required
        autoComplete="email"
        disabled={isLoading}
      />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Envoyer le lien
        </Button>

        {onBackToLogin && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBackToLogin}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full"
            disabled={isLoading}
          >
            Retour à la connexion
          </Button>
        )}
      </div>
    </form>
  );
}
