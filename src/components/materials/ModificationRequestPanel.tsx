import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { RealProButton } from '../realpro/RealProButton';
import { RealProTextarea } from '../realpro/RealProTextarea';
import { RealProInput } from '../realpro/RealProInput';

interface ModificationRequestPanelProps {
  lotId: string;
  onSubmit: (description: string, estimatedPrice?: number) => Promise<void>;
}

export function ModificationRequestPanel({ lotId, onSubmit }: ModificationRequestPanelProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(description, estimatedPrice);
      setDescription('');
      setEstimatedPrice(undefined);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting modification request:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-10">
        <RealProButton
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Demander une modification spéciale
        </RealProButton>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-panel border border-neutral-200 dark:border-neutral-800 p-8 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Modification spéciale
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Décrivez en détail la modification que vous souhaitez apporter. Notre équipe vous
              contactera dans les plus brefs délais pour étudier votre demande.
            </p>
          </div>

          <RealProTextarea
            label="Description de la modification"
            placeholder="Ex: Je souhaiterais modifier l'emplacement de la cuisine et ajouter une verrière entre le salon et la cuisine..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />

          <RealProInput
            label="Budget estimé (optionnel)"
            type="number"
            placeholder="0"
            value={estimatedPrice || ''}
            onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || undefined)}
            helpText="Indiquez votre budget si vous en avez un en tête"
          />

          <div className="flex gap-4 pt-4">
            <RealProButton
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annuler
            </RealProButton>
            <RealProButton
              variant="primary"
              onClick={handleSubmit}
              disabled={!description.trim() || submitting}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Envoi...' : 'Envoyer la demande'}
            </RealProButton>
          </div>
        </div>
      </div>
    </div>
  );
}
