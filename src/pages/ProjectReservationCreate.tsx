import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Home, Calendar, DollarSign, Users, FileText, Mail, Phone } from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../hooks/useToast';
import { useReservations } from '../hooks/useReservations';
import { useLots } from '../hooks/useLots';
import { useProspects } from '../hooks/useProspects';

interface ReservationFormData {
  lot_id: string;
  prospect_id: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string;
  reserved_at: string;
  expires_at: string;
  deposit_amount: string;
  broker_id: string;
  broker_commission_rate: string;
  notes: string;
}

export function ProjectReservationCreate() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createReservation } = useReservations(projectId!);
  const { lots, loading: lotsLoading } = useLots(projectId, { status: 'AVAILABLE' });
  const { prospects, loading: prospectsLoading } = useProspects(projectId!);

  // Default expiry date: 14 days from now
  const defaultExpiryDate = new Date();
  defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 14);

  const [formData, setFormData] = useState<ReservationFormData>({
    lot_id: '',
    prospect_id: '',
    buyer_first_name: '',
    buyer_last_name: '',
    buyer_email: '',
    buyer_phone: '',
    reserved_at: new Date().toISOString().split('T')[0],
    expires_at: defaultExpiryDate.toISOString().split('T')[0],
    deposit_amount: '',
    broker_id: '',
    broker_commission_rate: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});
  const [useProspect, setUseProspect] = useState(false);

  // Get available lots only
  const availableLots = useMemo(() => {
    return lots?.filter(lot => lot.status === 'AVAILABLE') || [];
  }, [lots]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};

    if (!formData.lot_id) {
      newErrors.lot_id = 'Veuillez sélectionner un lot';
    }

    if (!formData.buyer_first_name.trim()) {
      newErrors.buyer_first_name = 'Le prénom est requis';
    }

    if (!formData.buyer_last_name.trim()) {
      newErrors.buyer_last_name = 'Le nom est requis';
    }

    if (!formData.buyer_email.trim()) {
      newErrors.buyer_email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyer_email)) {
      newErrors.buyer_email = 'Email invalide';
    }

    if (!formData.expires_at) {
      newErrors.expires_at = 'La date d\'expiration est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ReservationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProspectChange = (prospectId: string) => {
    handleChange('prospect_id', prospectId);

    if (prospectId) {
      const prospect = prospects?.find(p => p.id === prospectId);
      if (prospect) {
        const nameParts = prospect.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData(prev => ({
          ...prev,
          prospect_id: prospectId,
          buyer_first_name: firstName,
          buyer_last_name: lastName,
          buyer_email: prospect.email,
          buyer_phone: prospect.phone || '',
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    setSaving(true);

    try {
      await createReservation({
        lot_id: formData.lot_id,
        prospect_id: formData.prospect_id || null,
        buyer_first_name: formData.buyer_first_name,
        buyer_last_name: formData.buyer_last_name,
        buyer_email: formData.buyer_email,
        buyer_phone: formData.buyer_phone || null,
        reserved_at: formData.reserved_at,
        expires_at: formData.expires_at,
        deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
        broker_id: formData.broker_id || null,
        broker_commission_rate: formData.broker_commission_rate ? parseFloat(formData.broker_commission_rate) : null,
        notes: formData.notes || null,
        status: 'PENDING',
      });

      showToast('success', 'Réservation créée avec succès');
      navigate(`/projects/${projectId}/crm/reservations`);
    } catch (err) {
      console.error('Error creating reservation:', err);
      showToast('error', 'Erreur lors de la création de la réservation');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const selectedLot = availableLots.find(lot => lot.id === formData.lot_id);

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: 'CRM', href: `/projects/${projectId}/crm/pipeline` },
          { label: 'Réservations', href: `/projects/${projectId}/crm/reservations` },
          { label: 'Nouvelle réservation' },
        ]}
      />

      <RealProTopbar
        title="Nouvelle Réservation"
        subtitle="Réserver un lot pour un acheteur potentiel"
        actions={
          <div className="flex items-center gap-3">
            <Link to={`/projects/${projectId}/crm/reservations`}>
              <RealProButton variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </RealProButton>
            </Link>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Sélection du lot */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Home className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Lot à réserver
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Sélectionnez un lot disponible
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Lot *
            </label>
            {lotsLoading ? (
              <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                Chargement des lots...
              </div>
            ) : availableLots.length === 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                Aucun lot disponible pour la réservation
              </div>
            ) : (
              <Select
                value={formData.lot_id}
                onChange={(e) => handleChange('lot_id', e.target.value)}
                className={errors.lot_id ? 'border-red-500' : ''}
              >
                <option value="">Sélectionner un lot</option>
                {availableLots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.code} - {lot.type} - {lot.surface_total}m² - CHF {Number(lot.price_total).toLocaleString('fr-CH')}
                  </option>
                ))}
              </Select>
            )}
            {errors.lot_id && (
              <p className="text-sm text-red-500 mt-1">{errors.lot_id}</p>
            )}

            {selectedLot && (
              <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Lot sélectionné: {selectedLot.code}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400">Type:</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100 font-medium">
                      {selectedLot.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400">Surface:</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100 font-medium">
                      {selectedLot.surface_total} m²
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400">Prix:</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100 font-medium">
                      CHF {Number(selectedLot.price_total).toLocaleString('fr-CH')}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400">Pièces:</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100 font-medium">
                      {selectedLot.rooms || '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </RealProCard>

        {/* Informations acheteur */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Acheteur potentiel
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Informations de l'acheteur
              </p>
            </div>
          </div>

          {/* Option to use existing prospect */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useProspect}
                onChange={(e) => setUseProspect(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Utiliser un prospect existant
              </span>
            </label>
          </div>

          {useProspect && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Prospect
              </label>
              {prospectsLoading ? (
                <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Chargement des prospects...
                </div>
              ) : (
                <Select
                  value={formData.prospect_id}
                  onChange={(e) => handleProspectChange(e.target.value)}
                >
                  <option value="">Sélectionner un prospect</option>
                  {prospects?.map((prospect) => (
                    <option key={prospect.id} value={prospect.id}>
                      {prospect.name} - {prospect.email}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Prénom *
              </label>
              <Input
                type="text"
                value={formData.buyer_first_name}
                onChange={(e) => handleChange('buyer_first_name', e.target.value)}
                placeholder="Jean"
                className={errors.buyer_first_name ? 'border-red-500' : ''}
              />
              {errors.buyer_first_name && (
                <p className="text-sm text-red-500 mt-1">{errors.buyer_first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nom *
              </label>
              <Input
                type="text"
                value={formData.buyer_last_name}
                onChange={(e) => handleChange('buyer_last_name', e.target.value)}
                placeholder="Dupont"
                className={errors.buyer_last_name ? 'border-red-500' : ''}
              />
              {errors.buyer_last_name && (
                <p className="text-sm text-red-500 mt-1">{errors.buyer_last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <Input
                type="email"
                value={formData.buyer_email}
                onChange={(e) => handleChange('buyer_email', e.target.value)}
                placeholder="jean.dupont@example.com"
                className={errors.buyer_email ? 'border-red-500' : ''}
              />
              {errors.buyer_email && (
                <p className="text-sm text-red-500 mt-1">{errors.buyer_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Téléphone
              </label>
              <Input
                type="tel"
                value={formData.buyer_phone}
                onChange={(e) => handleChange('buyer_phone', e.target.value)}
                placeholder="+41 79 123 45 67"
              />
            </div>
          </div>
        </RealProCard>

        {/* Dates de réservation */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Dates de réservation
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Période de validité de la réservation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date de réservation
              </label>
              <Input
                type="date"
                value={formData.reserved_at}
                onChange={(e) => handleChange('reserved_at', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date d'expiration *
              </label>
              <Input
                type="date"
                value={formData.expires_at}
                onChange={(e) => handleChange('expires_at', e.target.value)}
                className={errors.expires_at ? 'border-red-500' : ''}
              />
              {errors.expires_at && (
                <p className="text-sm text-red-500 mt-1">{errors.expires_at}</p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                La réservation expire automatiquement après cette date
              </p>
            </div>
          </div>
        </RealProCard>

        {/* Arrhes */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Arrhes
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Montant des arrhes demandés (optionnel)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Montant des arrhes (CHF)
              </label>
              <Input
                type="number"
                value={formData.deposit_amount}
                onChange={(e) => handleChange('deposit_amount', e.target.value)}
                placeholder="10000"
                min="0"
                step="1000"
              />
            </div>

            <div className="flex items-end">
              {formData.deposit_amount && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-6 py-4 w-full">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Montant formaté</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(formData.deposit_amount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </RealProCard>

        {/* Courtier (optionnel) */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Courtier
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Si la réservation vient d'un courtier (optionnel)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Taux de commission (%)
              </label>
              <Input
                type="number"
                value={formData.broker_commission_rate}
                onChange={(e) => handleChange('broker_commission_rate', e.target.value)}
                placeholder="3"
                min="0"
                max="10"
                step="0.5"
              />
            </div>
          </div>
        </RealProCard>

        {/* Notes */}
        <RealProCard padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Notes
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Notes internes sur la réservation
              </p>
            </div>
          </div>

          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Notes sur la réservation..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
          />
        </RealProCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link to={`/projects/${projectId}/crm/reservations`}>
            <RealProButton variant="outline" type="button">
              Annuler
            </RealProButton>
          </Link>
          <RealProButton
            variant="primary"
            type="submit"
            disabled={saving || availableLots.length === 0}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Création...' : 'Créer la réservation'}
          </RealProButton>
        </div>
      </form>
    </div>
  );
}

export default ProjectReservationCreate;
