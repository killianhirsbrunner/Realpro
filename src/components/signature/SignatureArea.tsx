import { useState } from 'react';
import { FileSignature, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SignatureCanvas } from './SignatureCanvas';
import { useSignAvenant } from '../../hooks/useAvenants';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface SignatureAreaProps {
  avenantId: string;
  avenantAmount: number;
  requiresQualifiedSignature: boolean;
  onSignatureComplete?: () => void;
}

export function SignatureArea({
  avenantId,
  avenantAmount,
  requiresQualifiedSignature,
  onSignatureComplete,
}: SignatureAreaProps) {
  const { user } = useCurrentUser();
  const { signAvenant, signing, error } = useSignAvenant();
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signerName, setSignerName] = useState(user?.full_name || '');
  const [signerEmail, setSignerEmail] = useState(user?.email || '');
  const [accepted, setAccepted] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSign() {
    if (!signatureData || !signerName || !signerEmail) {
      return;
    }

    try {
      await signAvenant(
        avenantId,
        signatureData,
        signerName,
        signerEmail,
        'client'
      );
      setSuccess(true);
      if (onSignatureComplete) {
        setTimeout(() => onSignatureComplete(), 2000);
      }
    } catch (err) {
      console.error('Error signing avenant:', err);
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Avenant signé avec succès
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Votre signature électronique a été enregistrée.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg">
          <FileSignature className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Signature électronique
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Montant: CHF {avenantAmount.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {requiresQualifiedSignature && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                Signature qualifiée recommandée
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Le montant de cet avenant dépasse CHF 5'000. Une signature qualifiée
                (Swisscom AIS ou Skribble) est recommandée pour une valeur juridique maximale.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Nom complet <span className="text-red-600">*</span>
          </label>
          <Input
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Votre nom complet"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <Input
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            placeholder="votre@email.ch"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-3">
          Votre signature <span className="text-red-600">*</span>
        </label>
        <SignatureCanvas
          onSignatureChange={setSignatureData}
          width={600}
          height={200}
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <input
          type="checkbox"
          id="accept-terms"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="accept-terms" className="text-sm text-neutral-700 dark:text-neutral-300">
          Je certifie avoir pris connaissance de l'avenant et accepte les conditions énoncées.
          Ma signature électronique a la même valeur juridique qu'une signature manuscrite
          conformément à la loi suisse sur la signature électronique (SCSE).
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSign}
          disabled={!signatureData || !signerName || !signerEmail || !accepted || signing}
          className="flex-1"
        >
          {signing ? 'Signature en cours...' : 'Signer l\'avenant'}
        </Button>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
        Horodatage automatique • IP: {window.location.hostname} • Conforme SCSE
      </p>
    </Card>
  );
}
