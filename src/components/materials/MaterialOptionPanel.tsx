import { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { RealProPanel } from '../realpro/RealProPanel';
import { RealProInput } from '../realpro/RealProInput';
import { RealProTextarea } from '../realpro/RealProTextarea';
import { RealProButton } from '../realpro/RealProButton';

interface MaterialOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  is_standard: boolean;
  images?: string[];
}

interface MaterialCategory {
  id: string;
  name: string;
}

interface MaterialOptionPanelProps {
  category: MaterialCategory;
  options: MaterialOption[];
  onClose: () => void;
  onSave: (options: MaterialOption[]) => Promise<void>;
}

export function MaterialOptionPanel({ category, options, onClose, onSave }: MaterialOptionPanelProps) {
  const [localOptions, setLocalOptions] = useState<MaterialOption[]>(options);
  const [saving, setSaving] = useState(false);

  function addOption() {
    const newOption: MaterialOption = {
      id: `temp-${Date.now()}`,
      label: '',
      description: '',
      price: 0,
      is_standard: false,
      images: []
    };
    setLocalOptions([...localOptions, newOption]);
  }

  function updateOption(index: number, field: keyof MaterialOption, value: any) {
    const updated = [...localOptions];
    updated[index] = { ...updated[index], [field]: value };
    setLocalOptions(updated);
  }

  function removeOption(index: number) {
    setLocalOptions(localOptions.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(localOptions);
      onClose();
    } catch (error) {
      console.error('Error saving options:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <RealProPanel title={`Options — ${category.name}`} onClose={onClose}>
      <div className="space-y-6">
        {localOptions.map((option, index) => (
          <div
            key={option.id}
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4"
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Option {index + 1}
              </h4>
              <button
                onClick={() => removeOption(index)}
                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <RealProInput
              label="Nom de l'option"
              placeholder="Ex: Carrelage premium"
              value={option.label}
              onChange={(e) => updateOption(index, 'label', e.target.value)}
            />

            <RealProTextarea
              label="Description"
              placeholder="Détails sur cette option..."
              value={option.description || ''}
              onChange={(e) => updateOption(index, 'description', e.target.value)}
              rows={3}
            />

            <RealProInput
              label="Prix (CHF)"
              type="number"
              placeholder="0 = standard"
              value={option.price}
              onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={option.is_standard}
                onChange={(e) => updateOption(index, 'is_standard', e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Option standard incluse
              </span>
            </label>
          </div>
        ))}

        <RealProButton
          variant="outline"
          onClick={addOption}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une option
        </RealProButton>

        <div className="flex gap-4 pt-6">
          <RealProButton
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </RealProButton>
          <RealProButton
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </RealProButton>
        </div>
      </div>
    </RealProPanel>
  );
}
