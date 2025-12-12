import { useState, type FormEvent } from 'react';
import { Button, Input, Alert } from '@realpro/ui';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export interface ResetPasswordFormProps {
  /** Submit handler */
  onSubmit: (password: string) => Promise<void>;
  /** Success callback */
  onSuccess?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Minimum password length */
  minPasswordLength?: number;
}

export function ResetPasswordForm({
  onSubmit,
  onSuccess,
  isLoading = false,
  error,
  minPasswordLength = 8,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validatePassword = (): boolean => {
    if (password.length < minPasswordLength) {
      setValidationError(`Le mot de passe doit contenir au moins ${minPasswordLength} caractères`);
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    await onSubmit(password);
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
            Mot de passe réinitialisé
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
        </div>

        {onSuccess && (
          <Button type="button" variant="primary" onClick={onSuccess}>
            Continuer
          </Button>
        )}
      </div>
    );
  }

  const passwordIcon = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-neutral-400 hover:text-neutral-600 transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Nouveau mot de passe
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choisissez un nouveau mot de passe sécurisé.
        </p>
      </div>

      {/* Error Alert */}
      {(error || validationError) && (
        <Alert variant="error" dismissible onDismiss={() => setValidationError('')}>
          {error || validationError}
        </Alert>
      )}

      {/* Password */}
      <Input
        label="Nouveau mot de passe"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={passwordIcon(showPassword, () => setShowPassword(!showPassword))}
        hint={`Minimum ${minPasswordLength} caractères`}
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      {/* Confirm Password */}
      <Input
        label="Confirmer le mot de passe"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={passwordIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
