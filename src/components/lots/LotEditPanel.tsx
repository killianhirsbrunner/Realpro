import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { RealProPanel } from '../realpro/RealProPanel';
import { RealProInput } from '../realpro/RealProInput';
import { RealProField } from '../realpro/RealProField';

interface LotEditPanelProps {
  lot: any;
  buildings: Array<{ id: string; name: string; code: string }>;
  floors: Array<{ id: string; name: string; level: number; building_id: string }>;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function LotEditPanel({ lot, buildings, floors, onClose, onSave }: LotEditPanelProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: lot?.code || '',
    type: lot?.type || 'APARTMENT',
    status: lot?.status || 'AVAILABLE',
    building_id: lot?.building_id || '',
    floor_id: lot?.floor_id || '',
    rooms_count: lot?.rooms_count || '',
    surface_living: lot?.surface_living || '',
    surface_terrace: lot?.surface_terrace || '',
    surface_balcony: lot?.surface_balcony || '',
    surface_garden: lot?.surface_garden || '',
    surface_total: lot?.surface_total || '',
    price_base: lot?.price_base || '',
    price_extras: lot?.price_extras || '',
    price_total: lot?.price_total || '',
    orientation: lot?.orientation || '',
    has_elevator: lot?.has_elevator || false,
    floor_level: lot?.floor_level || '',
  });

  const [availableFloors, setAvailableFloors] = useState<Array<{ id: string; name: string; level: number }>>([]);

  useEffect(() => {
    if (formData.building_id) {
      setAvailableFloors(floors.filter((f) => f.building_id === formData.building_id));
    } else {
      setAvailableFloors([]);
    }
  }, [formData.building_id, floors]);

  useEffect(() => {
    const living = parseFloat(formData.surface_living) || 0;
    const terrace = parseFloat(formData.surface_terrace) || 0;
    const balcony = parseFloat(formData.surface_balcony) || 0;
    const garden = parseFloat(formData.surface_garden) || 0;
    const total = living + terrace + balcony + garden;
    if (total > 0) {
      setFormData((prev) => ({ ...prev, surface_total: total.toFixed(2) }));
    }
  }, [formData.surface_living, formData.surface_terrace, formData.surface_balcony, formData.surface_garden]);

  useEffect(() => {
    const base = parseFloat(formData.price_base) || 0;
    const extras = parseFloat(formData.price_extras) || 0;
    const total = base + extras;
    if (total > 0) {
      setFormData((prev) => ({ ...prev, price_total: total.toFixed(2) }));
    }
  }, [formData.price_base, formData.price_extras]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave: any = {
        code: formData.code,
        type: formData.type,
        status: formData.status,
        building_id: formData.building_id || null,
        floor_id: formData.floor_id || null,
        rooms_count: formData.rooms_count ? parseFloat(formData.rooms_count) : null,
        surface_living: formData.surface_living ? parseFloat(formData.surface_living) : null,
        surface_terrace: formData.surface_terrace ? parseFloat(formData.surface_terrace) : 0,
        surface_balcony: formData.surface_balcony ? parseFloat(formData.surface_balcony) : 0,
        surface_garden: formData.surface_garden ? parseFloat(formData.surface_garden) : 0,
        surface_total: formData.surface_total ? parseFloat(formData.surface_total) : null,
        price_base: formData.price_base ? parseFloat(formData.price_base) : null,
        price_extras: formData.price_extras ? parseFloat(formData.price_extras) : 0,
        price_total: formData.price_total ? parseFloat(formData.price_total) : null,
        orientation: formData.orientation || null,
        has_elevator: formData.has_elevator,
        floor_level: formData.floor_level ? parseInt(formData.floor_level) : null,
      };

      await onSave(dataToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RealProPanel
      isOpen={true}
      onClose={onClose}
      title={lot ? `Modifier ${lot.code}` : 'Nouveau lot'}
      width="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Informations de base</h3>

          <RealProField label="Code du lot" required>
            <RealProInput
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Ex: A.01.01"
              required
            />
          </RealProField>

          <RealProField label="Type de lot" required>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="APARTMENT">Appartement</option>
              <option value="DUPLEX">Duplex</option>
              <option value="PENTHOUSE">Attique</option>
              <option value="COMMERCIAL">Commerce</option>
              <option value="PARKING">Parking</option>
              <option value="STORAGE">Cave</option>
            </select>
          </RealProField>

          <RealProField label="Statut" required>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="AVAILABLE">Libre</option>
              <option value="RESERVED">Réservé</option>
              <option value="OPTION">Option</option>
              <option value="SOLD">Vendu</option>
              <option value="DELIVERED">Livré</option>
              <option value="BLOCKED">Bloqué</option>
            </select>
          </RealProField>

          <RealProField label="Nombre de pièces">
            <RealProInput
              type="number"
              step="0.5"
              value={formData.rooms_count}
              onChange={(e) => handleChange('rooms_count', e.target.value)}
              placeholder="Ex: 3.5"
            />
          </RealProField>
        </div>

        {/* Location */}
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-foreground">Localisation</h3>

          <RealProField label="Bâtiment" required>
            <select
              value={formData.building_id}
              onChange={(e) => handleChange('building_id', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Sélectionner un bâtiment</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name || building.code}
                </option>
              ))}
            </select>
          </RealProField>

          {availableFloors.length > 0 && (
            <RealProField label="Étage">
              <select
                value={formData.floor_id}
                onChange={(e) => handleChange('floor_id', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Sélectionner un étage</option>
                {availableFloors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name || `Niveau ${floor.level}`}
                  </option>
                ))}
              </select>
            </RealProField>
          )}

          <RealProField label="Niveau">
            <RealProInput
              type="number"
              value={formData.floor_level}
              onChange={(e) => handleChange('floor_level', e.target.value)}
              placeholder="Ex: 2"
            />
          </RealProField>

          <RealProField label="Orientation">
            <RealProInput
              value={formData.orientation}
              onChange={(e) => handleChange('orientation', e.target.value)}
              placeholder="Ex: Sud-Ouest"
            />
          </RealProField>

          <RealProField label="Ascenseur">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_elevator}
                onChange={(e) => handleChange('has_elevator', e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Dispose d'un ascenseur</span>
            </label>
          </RealProField>
        </div>

        {/* Surfaces */}
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-foreground">Surfaces (m²)</h3>

          <div className="grid grid-cols-2 gap-4">
            <RealProField label="Surface habitable">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.surface_living}
                onChange={(e) => handleChange('surface_living', e.target.value)}
                placeholder="Ex: 85.5"
              />
            </RealProField>

            <RealProField label="Terrasse">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.surface_terrace}
                onChange={(e) => handleChange('surface_terrace', e.target.value)}
                placeholder="Ex: 15.0"
              />
            </RealProField>

            <RealProField label="Balcon">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.surface_balcony}
                onChange={(e) => handleChange('surface_balcony', e.target.value)}
                placeholder="Ex: 8.5"
              />
            </RealProField>

            <RealProField label="Jardin">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.surface_garden}
                onChange={(e) => handleChange('surface_garden', e.target.value)}
                placeholder="Ex: 25.0"
              />
            </RealProField>
          </div>

          <RealProField label="Surface totale" hint="Calculée automatiquement">
            <RealProInput
              type="number"
              step="0.01"
              value={formData.surface_total}
              readOnly
              className="bg-neutral-50 dark:bg-neutral-900"
            />
          </RealProField>
        </div>

        {/* Prices */}
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-foreground">Prix (CHF)</h3>

          <div className="grid grid-cols-2 gap-4">
            <RealProField label="Prix de base">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.price_base}
                onChange={(e) => handleChange('price_base', e.target.value)}
                placeholder="Ex: 750000"
              />
            </RealProField>

            <RealProField label="Extras">
              <RealProInput
                type="number"
                step="0.01"
                value={formData.price_extras}
                onChange={(e) => handleChange('price_extras', e.target.value)}
                placeholder="Ex: 25000"
              />
            </RealProField>
          </div>

          <RealProField label="Prix total" hint="Calculé automatiquement">
            <RealProInput
              type="number"
              step="0.01"
              value={formData.price_total}
              readOnly
              className="bg-neutral-50 dark:bg-neutral-900 font-bold text-lg"
            />
          </RealProField>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-background rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </RealProPanel>
  );
}
