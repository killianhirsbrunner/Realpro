import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { useProspects, CreateProspectData } from '../hooks/useProspects';
import { useLots } from '../hooks/useLots';
import {
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  CreditCard,
  Home,
  Layers,
  ChevronLeft,
  Save,
  X,
} from 'lucide-react';

export default function ProjectCRMProspectCreate() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { createProspect, project } = useProspects(projectId!);
  const { lots } = useLots(projectId!);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateProspectData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'website',
    notes: '',
    budget: undefined,
    preferredRooms: undefined,
    preferredFloor: '',
    targetLotId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProspectData, string>>>({});

  const sources = [
    { value: 'website', label: 'Site web' },
    { value: 'referral', label: 'Recommandation' },
    { value: 'phone', label: 'Appel téléphonique' },
    { value: 'walk_in', label: 'Visite spontanée' },
    { value: 'event', label: 'Événement / Salon' },
    { value: 'social_media', label: 'Réseaux sociaux' },
    { value: 'advertising', label: 'Publicité' },
    { value: 'broker', label: 'Courtier' },
    { value: 'other', label: 'Autre' },
  ];

  const availableLots = lots?.filter(l => l.status === 'AVAILABLE') || [];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProspectData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (formData.phone && !/^[+]?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone n'est pas valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProspect(formData);
      toast.success('Prospect créé avec succès');
      navigate(`/projects/${projectId}/crm/prospects`);
    } catch (error) {
      console.error('Error creating prospect:', error);
      toast.error('Erreur lors de la création du prospect');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateProspectData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!project) {
    return <LoadingState message="Chargement..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Prospects', href: `/projects/${projectId}/crm/prospects` },
          { label: 'Nouveau prospect' },
        ]}
      />

      <RealProTopbar
        title="Nouveau prospect"
        subtitle="Ajoutez un nouveau prospect au pipeline commercial"
        actions={
          <Link to={`/projects/${projectId}/crm/prospects`}>
            <RealProButton variant="ghost">
              <ChevronLeft className="w-4 h-4" />
              Retour à la liste
            </RealProButton>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30">
              <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Informations personnelles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:ring-brand-500'
                } bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:ring-brand-500'
                } bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:ring-brand-500'
                } bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="jean.dupont@email.ch"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:ring-brand-500'
                } bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="+41 79 123 45 67"
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
        </RealProCard>

        {/* Source et acquisition */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Source et acquisition
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Source du contact <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                {sources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Budget indicatif (CHF)
                </div>
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) => handleChange('budget', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                placeholder="500000"
                min="0"
                step="10000"
              />
            </div>
          </div>
        </RealProCard>

        {/* Préférences de recherche */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Préférences de recherche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nombre de pièces souhaité
              </label>
              <select
                value={formData.preferredRooms || ''}
                onChange={(e) => handleChange('preferredRooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                <option value="">Non spécifié</option>
                <option value="1">1 pièce</option>
                <option value="2">2 pièces</option>
                <option value="3">3 pièces</option>
                <option value="4">4 pièces</option>
                <option value="5">5 pièces</option>
                <option value="6">6+ pièces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Étage préféré
                </div>
              </label>
              <select
                value={formData.preferredFloor || ''}
                onChange={(e) => handleChange('preferredFloor', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                <option value="">Non spécifié</option>
                <option value="ground">Rez-de-chaussée</option>
                <option value="low">Étages bas (1-3)</option>
                <option value="mid">Étages moyens (4-7)</option>
                <option value="high">Étages élevés (8+)</option>
                <option value="penthouse">Attique / Penthouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Lot ciblé
              </label>
              <select
                value={formData.targetLotId || ''}
                onChange={(e) => handleChange('targetLotId', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                <option value="">Pas de lot spécifique</option>
                {availableLots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.reference} - {lot.type} ({lot.rooms} pièces)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </RealProCard>

        {/* Notes */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Notes
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Notes et commentaires
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors resize-none"
              placeholder="Informations supplémentaires sur le prospect..."
            />
          </div>
        </RealProCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link to={`/projects/${projectId}/crm/prospects`}>
            <RealProButton variant="outline" type="button">
              <X className="w-4 h-4" />
              Annuler
            </RealProButton>
          </Link>
          <RealProButton
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer le prospect
              </>
            )}
          </RealProButton>
        </div>
      </form>
    </div>
  );
}
