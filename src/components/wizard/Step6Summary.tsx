import { useState } from 'react';
import { CheckCircle, Building2, Users, DollarSign, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Step6SummaryProps {
  data: any;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
}

export default function Step6Summary({ data, onPrev, onSubmit }: Step6SummaryProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      await onSubmit();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
      setIsCreating(false);
    }
  };

  const totalLots = data.lots?.length || 0;
  const totalActors = data.actors?.length || 0;
  const totalBudget = parseFloat(data.totalBudget || '0');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Récapitulatif du projet
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Vérifiez les informations avant de créer le projet
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {data.name || 'Projet sans nom'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Adresse :</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">{data.address}</span>
                </div>
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Commune :</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">{data.city}, {data.canton}</span>
                </div>
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Type :</span>
                  <Badge variant="primary" className="ml-2">{data.type}</Badge>
                </div>
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">TVA :</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">{data.vatRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Lots</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalLots}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Intervenants</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalActors}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Budget</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalBudget > 0 ? `CHF ${totalBudget.toLocaleString('fr-CH')}` : 'Non défini'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {data.startDate && data.endDate && (
        <Card>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Planning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Début :</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                    {new Date(data.startDate).toLocaleDateString('fr-CH')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Fin prévue :</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                    {new Date(data.endDate).toLocaleDateString('fr-CH')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Le projet sera créé avec les éléments suivants :
            </h4>
            <ul className="space-y-1 text-green-700 dark:text-green-300">
              <li>✓ Arborescence documentaire complète (8 dossiers)</li>
              <li>✓ {totalLots} lot(s) avec leurs caractéristiques</li>
              <li>✓ {totalActors} intervenant(s) invités</li>
              <li>✓ Budgets CFC initialisés</li>
              <li>✓ Planning avec phases automatiques</li>
              <li>✓ Tableau de bord projet personnalisé</li>
              <li>✓ Modules activés : Lots, Documents, Finance, Planning, Soumissions</li>
            </ul>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Erreur
              </h4>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between gap-3">
        <Button onClick={onPrev} variant="secondary" size="lg" disabled={isCreating}>
          Retour
        </Button>
        <Button
          onClick={handleCreate}
          variant="primary"
          size="lg"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Créer le projet
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
