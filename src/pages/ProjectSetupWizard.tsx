import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

type WizardState = {
  projectId: string;
  currentStep: number;
  completed: boolean;
  data: any;
};

type Step = 1 | 2 | 3 | 4 | 5;

export default function ProjectSetupWizard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<WizardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>(1);

  const loadWizard = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Non authentifié');
      }

      const res = await fetch(`${apiUrl}/functions/v1/project-wizard/projects/${projectId}/wizard`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const wizardState = await res.json();
        setState(wizardState);
        setActiveStep(wizardState.currentStep as Step);
      }
    } catch (error) {
      console.error('Erreur chargement wizard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWizard();
  }, [projectId]);

  const saveStep = async (step: Step, data: any) => {
    if (!projectId) return;

    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(
        `${apiUrl}/functions/v1/project-wizard/projects/${projectId}/wizard/step/${step}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        const updatedState = await res.json();
        setState(updatedState);
        if (step < 5) {
          setActiveStep((step + 1) as Step);
        }
      }
    } catch (error) {
      console.error('Erreur sauvegarde étape:', error);
    } finally {
      setSaving(false);
    }
  };

  const complete = async () => {
    if (!projectId) return;

    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(
        `${apiUrl}/functions/v1/project-wizard/projects/${projectId}/wizard/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      console.error('Erreur finalisation:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !state) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const totalSteps = 5;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Assistant de configuration
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Configurer le projet
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Complétez les étapes pour préparer votre projet immobilier
        </p>
      </header>

      {/* Barre de progression */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <StepIndicator
              step={step}
              label={getStepLabel(step)}
              active={step === activeStep}
              completed={step < state.currentStep}
              onClick={() => {
                if (step <= state.currentStep) {
                  setActiveStep(step as Step);
                }
              }}
            />
            {step < totalSteps && (
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Contenu */}
      <Card className="p-6">
        {activeStep === 1 && (
          <Step1Form
            initial={state.data?.step1}
            onSubmit={(data) => saveStep(1, data)}
            saving={saving}
          />
        )}
        {activeStep === 2 && (
          <Step2Form
            initial={state.data?.step2}
            onSubmit={(data) => saveStep(2, data)}
            onPrevious={() => setActiveStep(1)}
            saving={saving}
          />
        )}
        {activeStep === 3 && (
          <Step3Form
            initial={state.data?.step3}
            onSubmit={(data) => saveStep(3, data)}
            onPrevious={() => setActiveStep(2)}
            saving={saving}
          />
        )}
        {activeStep === 4 && (
          <Step4Form
            initial={state.data?.step4}
            onSubmit={(data) => saveStep(4, data)}
            onPrevious={() => setActiveStep(3)}
            saving={saving}
          />
        )}
        {activeStep === 5 && (
          <Step5Form
            initial={state.data?.step5}
            onSubmit={(data) => {
              saveStep(5, data);
              complete();
            }}
            onPrevious={() => setActiveStep(4)}
            saving={saving}
          />
        )}
      </Card>
    </div>
  );
}

function getStepLabel(step: number): string {
  const labels: Record<number, string> = {
    1: 'Informations',
    2: 'Structure',
    3: 'Finance',
    4: 'Acteurs',
    5: 'Récapitulatif',
  };
  return labels[step] || '';
}

function StepIndicator({
  step,
  label,
  active,
  completed,
  onClick,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 ${
        completed || active ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
      disabled={!completed && !active}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          completed
            ? 'bg-emerald-500 text-white'
            : active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        {completed ? <Check className="h-5 w-5" /> : step}
      </div>
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}

function Step1Form({
  initial,
  onSubmit,
  saving,
}: {
  initial?: any;
  onSubmit: (data: any) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [city, setCity] = useState(initial?.city || '');
  const [canton, setCanton] = useState(initial?.canton || '');
  const [type, setType] = useState(initial?.type || 'PPE');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, city, canton, type });
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Informations générales
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commençons par les informations de base du projet
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom du projet *
          </label>
          <input
            required
            type="text"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Les Terrasses du Lac"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Localité
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Genève"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Canton
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              placeholder="GE"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type de projet
          </label>
          <select
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="PPE">PPE (Propriété par étages)</option>
            <option value="RENTAL">Locatif</option>
            <option value="MIXED">Mixte</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
}

function Step2Form({
  initial,
  onSubmit,
  onPrevious,
  saving,
}: {
  initial?: any;
  onSubmit: (data: any) => void;
  onPrevious: () => void;
  saving: boolean;
}) {
  const [buildings, setBuildings] = useState<Array<{ name: string }>>(
    initial?.buildings || [{ name: '' }]
  );

  const updateBuilding = (index: number, value: string) => {
    const clone = [...buildings];
    clone[index].name = value;
    setBuildings(clone);
  };

  const addBuilding = () => {
    setBuildings([...buildings, { name: '' }]);
  };

  const removeBuilding = (index: number) => {
    setBuildings(buildings.filter((_, i) => i !== index));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ buildings: buildings.filter((b) => b.name.trim()) });
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Structure du projet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Définissez les bâtiments. Les lots et étages pourront être ajoutés ensuite.
        </p>
      </div>

      <div className="space-y-3">
        {buildings.map((building, idx) => (
          <div key={idx} className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bâtiment {idx + 1}
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                value={building.name}
                onChange={(e) => updateBuilding(idx, e.target.value)}
                placeholder={`Bâtiment ${String.fromCharCode(65 + idx)}`}
              />
            </div>
            {buildings.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeBuilding(idx)}
                className="mt-7"
              >
                Retirer
              </Button>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addBuilding} className="w-full">
          + Ajouter un bâtiment
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
}

function Step3Form({
  initial,
  onSubmit,
  onPrevious,
  saving,
}: {
  initial?: any;
  onSubmit: (data: any) => void;
  onPrevious: () => void;
  saving: boolean;
}) {
  const [vatRate, setVatRate] = useState(initial?.vatRate ?? 8.1);
  const [saleMode, setSaleMode] = useState(initial?.saleMode || 'PPE');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ vatRate: Number(vatRate), saleMode });
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Paramètres financiers
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configuration des taux et modes de vente
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Taux de TVA (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Taux habituel en Suisse : 8.1%
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mode de vente
          </label>
          <select
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            value={saleMode}
            onChange={(e) => setSaleMode(e.target.value)}
          >
            <option value="PPE">PPE (Propriété par étages)</option>
            <option value="QPT">QPT (Qua Pars Totalis)</option>
            <option value="MIXED">Mixte</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
}

function Step4Form({
  initial,
  onSubmit,
  onPrevious,
  saving,
}: {
  initial?: any;
  onSubmit: (data: any) => void;
  onPrevious: () => void;
  saving: boolean;
}) {
  const [notes, setNotes] = useState(initial?.notes || '');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ notes });
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Acteurs du projet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Vous pourrez ajouter les entreprises, courtiers et autres acteurs après la configuration
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes (optionnel)
        </label>
        <textarea
          rows={4}
          className="mt-1 w-full rounded-xl border px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Informations complémentaires sur le projet..."
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Suivant'}
        </Button>
      </div>
    </form>
  );
}

function Step5Form({
  initial,
  onSubmit,
  onPrevious,
  saving,
}: {
  initial?: any;
  onSubmit: (data: any) => void;
  onPrevious: () => void;
  saving: boolean;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Récapitulatif
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Votre projet est maintenant configuré et prêt à être utilisé
        </p>
      </div>

      <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
        <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
          Configuration terminée
        </h4>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          Vous pourrez maintenant ajouter des lots, gérer les ventes et suivre l'avancement du projet.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <p className="font-medium text-gray-900 dark:text-gray-50">Prochaines étapes :</p>
        <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
          <li>Importer ou créer les lots</li>
          <li>Ajouter les documents (plans, descriptifs)</li>
          <li>Inviter les courtiers et partenaires</li>
          <li>Configurer les paramètres spécifiques</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Finalisation...' : 'Terminer la configuration'}
        </Button>
      </div>
    </form>
  );
}
