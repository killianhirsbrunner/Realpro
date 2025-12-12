import { useState, type FormEvent } from 'react';
import { Button, Input, Checkbox, Alert } from '@realpro/ui';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export interface LoginFormProps {
  /** Submit handler */
  onSubmit: (credentials: { email: string; password: string; remember: boolean }) => Promise<void>;
  /** Forgot password link handler */
  onForgotPassword?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password, remember });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Password */}
      <div>
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Se souvenir de moi"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          size="sm"
          disabled={isLoading}
        />
        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            disabled={isLoading}
          >
            Mot de passe oublié ?
          </button>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Se connecter
      </Button>
    </form>
  );
}
