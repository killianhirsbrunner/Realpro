import { DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface Step4FinancesProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4Finances({ data, onUpdate, onNext, onPrev }: Step4FinancesProps) {
  const totalBudget = parseFloat(data.totalBudget || '0');
  const contingency = totalBudget * 0.05;
  const withContingency = totalBudget + contingency;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Finances & Budgets
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Définissez les budgets et paramètres financiers
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Budget global du projet (CHF)
            </label>
            <Input
              type="number"
              placeholder="ex: 5000000"
              value={data.totalBudget || ''}
              onChange={(e) => onUpdate({ totalBudget: e.target.value })}
            />
            {totalBudget > 0 && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                CHF {totalBudget.toLocaleString('fr-CH')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Marge de contingence
              </label>
              <Select
                value={data.contingencyRate || '5'}
                onChange={(e) => onUpdate({ contingencyRate: e.target.value })}
              >
                <option value="0">0% (Aucune)</option>
                <option value="3">3%</option>
                <option value="5">5% (Recommandé)</option>
                <option value="7">7%</option>
                <option value="10">10%</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mode de paiement
              </label>
              <Select
                value={data.paymentMode || 'SCHEDULE'}
                onChange={(e) => onUpdate({ paymentMode: e.target.value })}
              >
                <option value="SCHEDULE">Échéancier selon avancement</option>
                <option value="QPT">QPT (Garantie bancaire)</option>
                <option value="MILESTONE">Par étapes (milestones)</option>
              </Select>
            </div>
          </div>

          {totalBudget > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Budget de base
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  CHF {totalBudget.toLocaleString('fr-CH')}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Contingence (5%)
                </p>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                  CHF {contingency.toLocaleString('fr-CH')}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Budget total
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  CHF {withContingency.toLocaleString('fr-CH')}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Répartition CFC (Code des Frais de Construction)
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Une répartition par défaut sera créée selon les standards suisses CRB. Vous pourrez l'ajuster plus tard.
          </p>

          <div className="space-y-3">
            {[
              { code: '0', name: 'Terrain', percent: 0 },
              { code: '1', name: 'Travaux préparatoires', percent: 5 },
              { code: '2', name: 'Bâtiment', percent: 60 },
              { code: '3', name: 'Équipements d\'exploitation', percent: 10 },
              { code: '4', name: 'Aménagements extérieurs', percent: 10 },
              { code: '5', name: 'Frais annexes', percent: 15 },
            ].map((cfc) => (
              <div
                key={cfc.code}
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {cfc.code}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    CFC {cfc.code} - {cfc.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {cfc.percent}% • CHF {(totalBudget * cfc.percent / 100).toLocaleString('fr-CH')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-1">
              Suivi financier automatique
            </h4>
            <p className="text-brand-700 dark:text-brand-300">
              RealPro suivra automatiquement les dépenses par code CFC et vous alertera
              en cas de dépassement budgétaire. Tous les rapports financiers seront générés automatiquement.
            </p>
          </div>
        </div>
      </Card>

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
