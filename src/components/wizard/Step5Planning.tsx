import { Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Step5PlanningProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5Planning({ data, onUpdate, onNext, onPrev }: Step5PlanningProps) {
  const calculateDuration = () => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      return diffMonths;
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Planning & Échéances
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Définissez les dates clés du projet
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date de début du chantier
              </label>
              <Input
                type="date"
                value={data.startDate || ''}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date de fin prévue
              </label>
              <Input
                type="date"
                value={data.endDate || ''}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
              />
            </div>
          </div>

          {duration && (
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Durée estimée : <strong>{duration} mois</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Phases principales
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Les phases suivantes seront créées automatiquement. Vous pourrez les ajuster dans le module Planning.
          </p>

          <div className="space-y-3">
            {[
              { name: 'Travaux préparatoires', duration: '1 mois', description: 'Terrassement, fondations' },
              { name: 'Gros œuvre', duration: '6 mois', description: 'Structure, murs, dalles' },
              { name: 'Second œuvre', duration: '4 mois', description: 'Façades, toiture, menuiseries' },
              { name: 'Finitions', duration: '3 mois', description: 'Peinture, sols, sanitaires' },
              { name: 'Aménagements extérieurs', duration: '2 mois', description: 'Espaces verts, parkings' },
              { name: 'Réception', duration: '1 mois', description: 'Tests, livraison' },
            ].map((phase, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {phase.name}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {phase.description}
                  </p>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {phase.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Dates de soumissions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date limite soumissions gros œuvre
              </label>
              <Input
                type="date"
                value={data.submissionDeadlineGO || ''}
                onChange={(e) => onUpdate({ submissionDeadlineGO: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date limite soumissions second œuvre
              </label>
              <Input
                type="date"
                value={data.submissionDeadlineSO || ''}
                onChange={(e) => onUpdate({ submissionDeadlineSO: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-1">
              Planning Gantt interactif
            </h4>
            <p className="text-brand-700 dark:text-brand-300">
              Un planning Gantt détaillé sera généré automatiquement avec toutes les phases et tâches.
              Vous pourrez le modifier, ajouter des dépendances et suivre l'avancement en temps réel.
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
