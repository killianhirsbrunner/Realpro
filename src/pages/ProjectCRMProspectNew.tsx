import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, Wallet, Home, FileText, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLots } from '../hooks/useLots';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface ProspectFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  budget_min: string;
  budget_max: string;
  interested_lots: string[];
  source: string;
  notes: string;
}

const sources = [
  { value: 'website', label: 'Site web' },
  { value: 'broker', label: 'Courtier' },
  { value: 'referral', label: 'Recommandation' },
  { value: 'fair', label: 'Salon immobilier' },
  { value: 'advertising', label: 'Publicite' },
  { value: 'other', label: 'Autre' },
];

export default function ProjectCRMProspectNew() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { lots, loading: lotsLoading } = useLots(projectId!);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProspectFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    budget_min: '',
    budget_max: '',
    interested_lots: [],
    source: 'website',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProspectFormData, string>>>({});

  const availableLots = (lots || []).filter((lot: any) => lot.status === 'AVAILABLE');

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prenom est requis';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('prospects').insert({
        project_id: projectId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        interested_lots: formData.interested_lots,
        source: formData.source,
        notes: formData.notes || null,
        status: 'NEW',
        assigned_to: user?.id || null,
      });

      if (insertError) throw insertError;

      navigate(`/projects/${projectId}/crm/prospects`);
    } catch (err) {
      console.error('Error creating prospect:', err);
      setError('Erreur lors de la creation du prospect');
    } finally {
      setLoading(false);
    }
  };

  const toggleLot = (lotId: string) => {
    setFormData((prev) => ({
      ...prev,
      interested_lots: prev.interested_lots.includes(lotId)
        ? prev.interested_lots.filter((id) => id !== lotId)
        : [...prev.interested_lots, lotId],
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/projects/${projectId}/crm/prospects`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux prospects
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Nouveau prospect
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Ajoutez un nouveau contact commercial au projet
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Informations personnelles
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Prenom <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Jean"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Dupont"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    type="email"
                    placeholder="jean.dupont@email.ch"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Telephone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </RealProCard>

          {/* Qualification */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Qualification
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Budget minimum (CHF)
                </label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={formData.budget_min}
                  onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                />
                <p className="mt-1 text-xs text-neutral-500">Laissez vide si non defini</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Budget maximum (CHF)
                </label>
                <Input
                  type="number"
                  placeholder="800000"
                  value={formData.budget_max}
                  onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                <Home className="w-4 h-4" />
                Lots interesses
              </label>
              {lotsLoading ? (
                <p className="text-sm text-neutral-500">Chargement des lots...</p>
              ) : availableLots.length === 0 ? (
                <p className="text-sm text-neutral-500 italic">
                  Aucun lot disponible pour ce projet
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableLots.map((lot: any) => (
                    <label
                      key={lot.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.interested_lots.includes(lot.id)
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interested_lots.includes(lot.id)}
                        onChange={() => toggleLot(lot.id)}
                        className="w-4 h-4 rounded border-neutral-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 dark:text-white">{lot.code}</p>
                        <p className="text-xs text-neutral-500">
                          {lot.rooms} pieces - {lot.surface_living} m² - CHF{' '}
                          {lot.price_sale?.toLocaleString('fr-CH')}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </RealProCard>

          {/* Source et notes */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Source & notes
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Source du prospect <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sources.map((source) => (
                  <label
                    key={source.value}
                    className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                      formData.source === source.value
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="source"
                      value={source.value}
                      checked={formData.source === source.value}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="sr-only"
                    />
                    {source.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Recherche un appartement pour investissement locatif..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Informations complementaires sur ce prospect
              </p>
            </div>
          </RealProCard>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/projects/${projectId}/crm/prospects`)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creation...' : 'Creer le prospect'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
