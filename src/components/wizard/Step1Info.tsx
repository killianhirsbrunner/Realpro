import { Building2, MapPin, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface Step1InfoProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function Step1Info({ data, onUpdate, onNext }: Step1InfoProps) {
  const canProceed = data.name && data.address && data.city && data.canton;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Informations générales
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Définissez les informations de base de votre projet
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Nom du projet *
            </label>
            <Input
              placeholder="ex: Résidence des Alpes"
              value={data.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Adresse *
            </label>
            <Input
              placeholder="ex: Rue de la Gare 15"
              value={data.address || ''}
              onChange={(e) => onUpdate({ address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Commune *
              </label>
              <Input
                placeholder="ex: Lausanne"
                value={data.city || ''}
                onChange={(e) => onUpdate({ city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Canton *
              </label>
              <Select
                value={data.canton || 'VD'}
                onChange={(e) => onUpdate({ canton: e.target.value })}
              >
                <option value="VD">Vaud (VD)</option>
                <option value="GE">Genève (GE)</option>
                <option value="VS">Valais (VS)</option>
                <option value="FR">Fribourg (FR)</option>
                <option value="NE">Neuchâtel (NE)</option>
                <option value="JU">Jura (JU)</option>
                <option value="BE">Berne (BE)</option>
                <option value="ZH">Zurich (ZH)</option>
                <option value="LU">Lucerne (LU)</option>
                <option value="TI">Tessin (TI)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Type de projet *
              </label>
              <Select
                value={data.type || 'PPE'}
                onChange={(e) => onUpdate({ type: e.target.value })}
              >
                <option value="PPE">PPE (Propriété par étages)</option>
                <option value="LOCATIF">Locatif</option>
                <option value="MIXTE">Mixte</option>
                <option value="COMMERCIAL">Commercial</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Langue par défaut
              </label>
              <Select
                value={data.defaultLanguage || 'fr'}
                onChange={(e) => onUpdate({ defaultLanguage: e.target.value })}
              >
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              TVA applicable
            </label>
            <Select
              value={data.vatRate || '8.1'}
              onChange={(e) => onUpdate({ vatRate: e.target.value })}
            >
              <option value="8.1">8.1% (Taux normal)</option>
              <option value="2.6">2.6% (Taux réduit)</option>
              <option value="3.8">3.8% (Taux spécial hébergement)</option>
              <option value="0">0% (Exonéré)</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description (optionnelle)
            </label>
            <Textarea
              placeholder="Description détaillée du projet..."
              value={data.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          variant="primary"
          size="lg"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
