import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Trash2, AlertTriangle, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

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
  { value: 'TO_DEFINE', label: 'À définir' },
  { value: 'PPE', label: 'PPE (Propriété Par Étages)' },
  { value: 'LOCATIF', label: 'Locatif' },
  { value: 'MIXTE', label: 'Mixte (PPE + Locatif)' },
];

const PROJECT_STATUS = [
  { value: 'PLANNING', label: 'En planification' },
  { value: 'CONSTRUCTION', label: 'En construction' },
  { value: 'SELLING', label: 'En commercialisation' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'ARCHIVED', label: 'Archivé' },
];

const VAT_RATES = [
  { value: '8.1', label: '8.1% (Taux normal)' },
  { value: '2.6', label: '2.6% (Taux réduit - Logement)' },
  { value: '3.8', label: '3.8% (Taux spécial - Hébergement)' },
  { value: '0', label: '0% (Exonéré)' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'en', label: 'Anglais' },
];

interface ProjectData {
  name: string;
  code: string;
  description: string;
  address: string;
  city: string;
  canton: string;
  zip_code: string;
  type: string;
  status: string;
  vat_rate: string;
  default_language: string;
  start_date: string;
  end_date: string;
  total_budget: string;
  contingency_rate: string;
}

export function ProjectSettingsComplete() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    code: '',
    description: '',
    address: '',
    city: '',
    canton: '',
    zip_code: '',
    type: 'TO_DEFINE',
    status: 'PLANNING',
    vat_rate: '2.6',
    default_language: 'fr',
    start_date: '',
    end_date: '',
    total_budget: '',
    contingency_rate: '5',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          code: data.code || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          canton: data.canton || '',
          zip_code: data.zip_code || '',
          type: data.type || 'TO_DEFINE',
          status: data.status || 'PLANNING',
          vat_rate: data.vat_rate?.toString() || '2.6',
          default_language: data.default_language || 'fr',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          total_budget: data.total_budget?.toString() || '',
          contingency_rate: data.contingency_rate?.toString() || '5',
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = 'La date de fin doit être après la date de début';
      }
    }

    const contingency = parseFloat(formData.contingency_rate);
    if (isNaN(contingency) || contingency < 0 || contingency > 100) {
      newErrors.contingency_rate = 'Taux d\'imprévus invalide (0-100%)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          code: formData.code || null,
          description: formData.description || null,
          address: formData.address,
          city: formData.city,
          canton: formData.canton,
          zip_code: formData.zip_code || null,
          type: formData.type,
          status: formData.status,
          vat_rate: parseFloat(formData.vat_rate),
          default_language: formData.default_language,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          total_budget: formData.total_budget ? parseFloat(formData.total_budget) : null,
          contingency_rate: parseFloat(formData.contingency_rate),
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId || deleteConfirmText !== 'SUPPRIMER') return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Projet supprimé avec succès');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur lors de la suppression du projet');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-brand-600" />
            Paramètres du projet
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Configuration et paramètres du projet
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Informations générales
          </h2>
          <div className="space-y-4">
            <div>
              <Input
                label="Nom du projet"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ex: Résidence du Lac"
                error={errors.name}
                required
              />
            </div>

            <div>
              <Input
                label="Code projet"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="ex: RDL-2024"
                helperText="Code interne pour identifier le projet"
              />
            </div>

            <div>
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description du projet..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Type de projet"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  {PROJECT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  label="Statut"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                >
                  {PROJECT_STATUS.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Localisation
          </h2>
          <div className="space-y-4">
            <div>
              <Input
                label="Adresse"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="ex: Rue de la Gare 15"
                error={errors.address}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  label="Commune"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="ex: Lausanne"
                  error={errors.city}
                  required
                />
              </div>

              <div>
                <Input
                  label="NPA"
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  placeholder="ex: 1000"
                />
              </div>
            </div>

            <div>
              <Select
                label="Canton"
                value={formData.canton}
                onChange={(e) => handleChange('canton', e.target.value)}
                required
              >
                {SWISS_CANTONS.map(canton => (
                  <option key={canton.value} value={canton.value}>
                    {canton.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Configuration
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Taux de TVA"
                  value={formData.vat_rate}
                  onChange={(e) => handleChange('vat_rate', e.target.value)}
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
                <Select
                  label="Langue par défaut"
                  value={formData.default_language}
                  onChange={(e) => handleChange('default_language', e.target.value)}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Budget et finances
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Budget total (CHF)"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.total_budget}
                  onChange={(e) => handleChange('total_budget', e.target.value)}
                  placeholder="ex: 5000000"
                />
              </div>

              <div>
                <Input
                  label="Taux d'imprévus (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.contingency_rate}
                  onChange={(e) => handleChange('contingency_rate', e.target.value)}
                  error={errors.contingency_rate}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Généralement 5-10%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
            Planning
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Date de début"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Date de fin prévue"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  error={errors.end_date}
                />
              </div>
            </div>

            {formData.start_date && formData.endDate && (
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  <strong>Durée:</strong>{' '}
                  {Math.ceil(
                    (new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}{' '}
                  mois environ
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Zone dangereuse
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                La suppression du projet est irréversible. Toutes les données (lots, acheteurs, documents, finances, etc.) seront définitivement perdues.
              </p>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer le projet
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${projectId}`)}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg mx-4 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Supprimer définitivement ce projet ?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Cette action est irréversible. Toutes les données associées au projet seront définitivement supprimées.
                </p>
                <p className="text-sm text-neutral-900 dark:text-white font-medium mb-2">
                  Pour confirmer, tapez <span className="font-mono font-bold text-red-600">SUPPRIMER</span> ci-dessous :
                </p>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteConfirmText !== 'SUPPRIMER' || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
