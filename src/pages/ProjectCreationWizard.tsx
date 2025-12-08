import { useState } from 'react';
import { ChevronLeft, Home, Building2, FileText, Users, Calendar, DollarSign, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useProjectCreation } from '../hooks/useProjectCreation';
import { Link } from 'react-router-dom';

const SWISS_CANTONS = [
  { value: 'AG', label: 'Argovie (AG)' },
  { value: 'AI', label: 'Appenzell Rhodes-Intérieures (AI)' },
  { value: 'AR', label: 'Appenzell Rhodes-Extérieures (AR)' },
  { value: 'BE', label: 'Berne (BE)' },
  { value: 'BL', label: 'Bâle-Campagne (BL)' },
  { value: 'BS', label: 'Bâle-Ville (BS)' },
  { value: 'FR', label: 'Fribourg (FR)' },
  { value: 'GE', label: 'Genève (GE)' },
  { value: 'GL', label: 'Glaris (GL)' },
  { value: 'GR', label: 'Grisons (GR)' },
  { value: 'JU', label: 'Jura (JU)' },
  { value: 'LU', label: 'Lucerne (LU)' },
  { value: 'NE', label: 'Neuchâtel (NE)' },
  { value: 'NW', label: 'Nidwald (NW)' },
  { value: 'OW', label: 'Obwald (OW)' },
  { value: 'SG', label: 'Saint-Gall (SG)' },
  { value: 'SH', label: 'Schaffhouse (SH)' },
  { value: 'SO', label: 'Soleure (SO)' },
  { value: 'SZ', label: 'Schwyz (SZ)' },
  { value: 'TG', label: 'Thurgovie (TG)' },
  { value: 'TI', label: 'Tessin (TI)' },
  { value: 'UR', label: 'Uri (UR)' },
  { value: 'VD', label: 'Vaud (VD)' },
  { value: 'VS', label: 'Valais (VS)' },
  { value: 'ZG', label: 'Zoug (ZG)' },
  { value: 'ZH', label: 'Zurich (ZH)' },
];

const PROJECT_TYPES = [
  { value: 'PPE', label: 'PPE (Propriété Par Étages)', description: 'Copropriété avec vente par appartement' },
  { value: 'LOCATIF', label: 'Locatif', description: 'Promotion locative' },
  { value: 'MIXTE', label: 'Mixte', description: 'Combinaison PPE et locatif' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'en', label: 'Anglais' },
];

const VAT_RATES = [
  { value: '8.1', label: '8.1% (Taux normal)' },
  { value: '2.6', label: '2.6% (Taux réduit - Logement)' },
  { value: '3.8', label: '3.8% (Taux spécial - Hébergement)' },
  { value: '0', label: '0% (Exonéré)' },
];

interface FormData {
  name: string;
  address: string;
  city: string;
  canton: string;
  type: string;
  description: string;
  defaultLanguage: string;
  vatRate: string;
  buildingsCount: string;
  entrancesCount: string;
  floorsCount: string;
  totalBudget: string;
  contingencyRate: string;
  startDate: string;
  endDate: string;
}

const STEPS = [
  { id: 1, title: 'Informations de base', icon: FileText },
  { id: 2, title: 'Structure', icon: Building2 },
  { id: 3, title: 'Budget & TVA', icon: DollarSign },
  { id: 4, title: 'Planning', icon: Calendar },
  { id: 5, title: 'Récapitulatif', icon: Check },
];

export default function ProjectCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    canton: 'VD',
    type: 'PPE',
    description: '',
    defaultLanguage: 'fr',
    vatRate: '2.6',
    buildingsCount: '1',
    entrancesCount: '1',
    floorsCount: '4',
    totalBudget: '',
    contingencyRate: '5',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createProject, isCreating, error } = useProjectCreation();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Le nom du projet est requis';
      if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
      if (!formData.city.trim()) newErrors.city = 'La commune est requise';
      if (!formData.type) newErrors.type = 'Le type de projet est requis';
    }

    if (step === 2) {
      const buildings = parseInt(formData.buildingsCount);
      const entrances = parseInt(formData.entrancesCount);
      const floors = parseInt(formData.floorsCount);

      if (isNaN(buildings) || buildings < 1) newErrors.buildingsCount = 'Au moins 1 bâtiment requis';
      if (isNaN(entrances) || entrances < 1) newErrors.entrancesCount = 'Au moins 1 entrée requise';
      if (isNaN(floors) || floors < 1) newErrors.floorsCount = 'Au moins 1 étage requis';
    }

    if (step === 3) {
      const budget = parseFloat(formData.totalBudget);
      const contingency = parseFloat(formData.contingencyRate);

      if (formData.totalBudget && (isNaN(budget) || budget < 0)) {
        newErrors.totalBudget = 'Budget invalide';
      }
      if (isNaN(contingency) || contingency < 0 || contingency > 100) {
        newErrors.contingencyRate = 'Taux d\'imprévus invalide (0-100%)';
      }
    }

    if (step === 4) {
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) {
          newErrors.endDate = 'La date de fin doit être après la date de début';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      await createProject(formData);
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Nom du projet <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ex: Résidence du Lac"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Type de projet <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {PROJECT_TYPES.map(type => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {type.label}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {type.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Adresse <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="ex: Rue de la Gare 15"
                error={errors.address}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Commune <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="ex: Lausanne"
                  error={errors.city}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Canton <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.canton}
                  onChange={(e) => handleChange('canton', e.target.value)}
                >
                  {SWISS_CANTONS.map(canton => (
                    <option key={canton.value} value={canton.value}>
                      {canton.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du projet..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Langue par défaut
              </label>
              <Select
                value={formData.defaultLanguage}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Structure de base:</strong> Définissez le nombre de bâtiments, entrées et étages.
                Vous pourrez créer les lots et affiner la structure après la création du projet.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Bâtiments <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.buildingsCount}
                  onChange={(e) => handleChange('buildingsCount', e.target.value)}
                  error={errors.buildingsCount}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Nombre de bâtiments
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Entrées <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.entrancesCount}
                  onChange={(e) => handleChange('entrancesCount', e.target.value)}
                  error={errors.entrancesCount}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Par bâtiment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Étages <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.floorsCount}
                  onChange={(e) => handleChange('floorsCount', e.target.value)}
                  error={errors.floorsCount}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Par entrée
                </p>
              </div>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Aperçu de la structure</h4>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <p>• {formData.buildingsCount} bâtiment(s)</p>
                <p>• {parseInt(formData.buildingsCount) * parseInt(formData.entrancesCount)} entrée(s) au total</p>
                <p>• {parseInt(formData.buildingsCount) * parseInt(formData.entrancesCount) * parseInt(formData.floorsCount)} étage(s) au total</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Taux de TVA
              </label>
              <Select
                value={formData.vatRate}
                onChange={(e) => handleChange('vatRate', e.target.value)}
              >
                {VAT_RATES.map(rate => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Le taux réduit de 2.6% s'applique généralement pour les logements
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Budget total estimé (CHF)
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={formData.totalBudget}
                onChange={(e) => handleChange('totalBudget', e.target.value)}
                placeholder="ex: 5000000"
                error={errors.totalBudget}
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Budget de construction total (optionnel)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Taux d'imprévus (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={formData.contingencyRate}
                onChange={(e) => handleChange('contingencyRate', e.target.value)}
                error={errors.contingencyRate}
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Pourcentage du budget réservé aux imprévus (généralement 5-10%)
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Date de début
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                error={errors.startDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Date de fin prévue
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                error={errors.endDate}
              />
            </div>

            {formData.startDate && formData.endDate && (
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Durée du projet</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} mois environ
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Prêt à créer le projet !</strong> Vérifiez les informations ci-dessous avant de valider.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Informations générales</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Nom:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Type:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                      {PROJECT_TYPES.find(t => t.value === formData.type)?.label}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Adresse:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.address}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Commune:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.city}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Canton:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.canton}</dd>
                  </div>
                </dl>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Structure</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Bâtiments:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.buildingsCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Entrées par bâtiment:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.entrancesCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Étages par entrée:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.floorsCount}</dd>
                  </div>
                </dl>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Budget & TVA</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">TVA:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.vatRate}%</dd>
                  </div>
                  {formData.totalBudget && (
                    <div className="flex justify-between">
                      <dt className="text-neutral-600 dark:text-neutral-400">Budget:</dt>
                      <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                        CHF {parseFloat(formData.totalBudget).toLocaleString('fr-CH')}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-neutral-600 dark:text-neutral-400">Imprévus:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-neutral-100">{formData.contingencyRate}%</dd>
                  </div>
                </dl>
              </div>

              {(formData.startDate || formData.endDate) && (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Planning</h4>
                  <dl className="space-y-2 text-sm">
                    {formData.startDate && (
                      <div className="flex justify-between">
                        <dt className="text-neutral-600 dark:text-neutral-400">Début:</dt>
                        <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                          {new Date(formData.startDate).toLocaleDateString('fr-CH')}
                        </dd>
                      </div>
                    )}
                    {formData.endDate && (
                      <div className="flex justify-between">
                        <dt className="text-neutral-600 dark:text-neutral-400">Fin prévue:</dt>
                        <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                          {new Date(formData.endDate).toLocaleDateString('fr-CH')}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/projects"
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Retour aux projets
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                        isActive
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 text-brand-600'
                          : isCompleted
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400'
                        : isCompleted
                        ? 'text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 mb-6 ${
                        isCompleted
                          ? 'bg-brand-600'
                          : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {STEPS[currentStep - 1].title}
            </h2>
            {currentStep === 1 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                Commencez par définir les informations de base de votre projet
              </p>
            )}
            {currentStep === 2 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                Définissez la structure de base de votre projet
              </p>
            )}
            {currentStep === 3 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                Configurez le budget et les paramètres fiscaux
              </p>
            )}
            {currentStep === 4 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                Définissez les dates clés du projet
              </p>
            )}
            {currentStep === 5 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                Vérifiez toutes les informations avant de créer le projet
              </p>
            )}
          </div>

          {renderStep()}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isCreating}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex items-center gap-3">
              <Link to="/projects">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isCreating}
                >
                  Annuler
                </Button>
              </Link>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={isCreating}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  disabled={isCreating}
                >
                  {isCreating ? 'Création en cours...' : 'Créer le projet'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
