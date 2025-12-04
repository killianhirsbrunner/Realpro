import { useState } from 'react';
import { Building, Layers, Plus, Trash2, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Step2StructureProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Structure({ data, onUpdate, onNext, onPrev }: Step2StructureProps) {
  const [lots, setLots] = useState(data.lots || []);

  const addLot = () => {
    const newLot = {
      id: Date.now(),
      number: `${lots.length + 1}`,
      type: 'APPARTEMENT',
      floor: '1',
      surface: '',
      price: '',
    };
    const updated = [...lots, newLot];
    setLots(updated);
    onUpdate({ lots: updated });
  };

  const removeLot = (id: number) => {
    const updated = lots.filter((l: any) => l.id !== id);
    setLots(updated);
    onUpdate({ lots: updated });
  };

  const updateLot = (id: number, field: string, value: any) => {
    const updated = lots.map((l: any) =>
      l.id === id ? { ...l, [field]: value } : l
    );
    setLots(updated);
    onUpdate({ lots: updated });
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert('Import Excel : fonctionnalité en développement. Utilisez la saisie manuelle pour le moment.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <Layers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Structure immobilière
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Définissez les bâtiments et les lots du projet
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre de bâtiments
              </label>
              <Input
                type="number"
                min="1"
                value={data.buildingsCount || '1'}
                onChange={(e) => onUpdate({ buildingsCount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre d'entrées
              </label>
              <Input
                type="number"
                min="1"
                value={data.entrancesCount || '1'}
                onChange={(e) => onUpdate({ entrancesCount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre d'étages
              </label>
              <Input
                type="number"
                min="1"
                value={data.floorsCount || '3'}
                onChange={(e) => onUpdate({ floorsCount: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Lots
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {lots.length} lot(s) configuré(s)
              </p>
            </div>
            <div className="flex gap-3">
              <label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <Button variant="secondary" size="sm" as="span">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer Excel
                </Button>
              </label>
              <Button onClick={addLot} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lot
              </Button>
            </div>
          </div>

          {lots.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
              <Building className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Aucun lot ajouté
              </p>
              <Button onClick={addLot} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Créer le premier lot
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {lots.map((lot: any) => (
                <div
                  key={lot.id}
                  className="grid grid-cols-12 gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg items-center"
                >
                  <div className="col-span-2">
                    <Input
                      placeholder="N°"
                      value={lot.number}
                      onChange={(e) => updateLot(lot.id, 'number', e.target.value)}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={lot.type}
                      onChange={(e) => updateLot(lot.id, 'type', e.target.value)}
                      size="sm"
                    >
                      <option value="APPARTEMENT">Appartement</option>
                      <option value="ATTIQUE">Attique</option>
                      <option value="DUPLEX">Duplex</option>
                      <option value="STUDIO">Studio</option>
                      <option value="COMMERCE">Commerce</option>
                      <option value="PARKING">Parking</option>
                      <option value="CAVE">Cave</option>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Étage"
                      value={lot.floor}
                      onChange={(e) => updateLot(lot.id, 'floor', e.target.value)}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="m²"
                      type="number"
                      value={lot.surface}
                      onChange={(e) => updateLot(lot.id, 'surface', e.target.value)}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="CHF"
                      type="number"
                      value={lot.price}
                      onChange={(e) => updateLot(lot.id, 'price', e.target.value)}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeLot(lot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {lots.length > 0 && (
        <Card className="bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-3">
            <Badge variant="primary">Récapitulatif</Badge>
            <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">Total lots :</span>
                <span className="ml-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  {lots.length}
                </span>
              </div>
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">Surface totale :</span>
                <span className="ml-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  {lots.reduce((acc: number, l: any) => acc + (parseFloat(l.surface) || 0), 0).toFixed(0)} m²
                </span>
              </div>
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">Volume total :</span>
                <span className="ml-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  CHF {lots.reduce((acc: number, l: any) => acc + (parseFloat(l.price) || 0), 0).toLocaleString('fr-CH')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between gap-3">
        <Button onClick={onPrev} variant="secondary" size="lg">
          Retour
        </Button>
        <Button onClick={onNext} variant="primary" size="lg">
          Continuer
        </Button>
      </div>
    </div>
  );
}
