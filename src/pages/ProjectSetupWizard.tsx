import { useState } from 'react';
import { ChevronLeft, Home, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
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

export default function ProjectSetupWizard() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    canton: 'VD',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createProject, isCreating, error } = useProjectCreation();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La commune est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createProject(formData);
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4">
            <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Créer un nouveau projet
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Renseignez les informations de base. Vous pourrez configurer le reste plus tard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Nom du projet <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ex: Résidence du Lac"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isCreating}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
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
                className={errors.address ? 'border-red-500' : ''}
                disabled={isCreating}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
              )}
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
                  className={errors.city ? 'border-red-500' : ''}
                  disabled={isCreating}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Canton <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.canton}
                  onChange={(e) => handleChange('canton', e.target.value)}
                  disabled={isCreating}
                >
                  {SWISS_CANTONS.map(canton => (
                    <option key={canton.value} value={canton.value}>
                      {canton.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={isCreating}
              >
                {isCreating ? 'Création en cours...' : 'Créer le projet'}
              </Button>
              <Link to="/projects">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  disabled={isCreating}
                >
                  Annuler
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            <p>
              Vous pourrez configurer le type de projet, les lots, le budget et le planning
              après la création.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
