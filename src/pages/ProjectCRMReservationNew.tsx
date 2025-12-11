import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Home,
  Calendar,
  Wallet,
  Building2,
  Save,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RealProCard } from '../components/realpro/RealProCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useLots } from '../hooks/useLots';
import { useProspects } from '../hooks/useProspects';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

interface ReservationFormData {
  prospect_id: string | null;
  lot_id: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string;
  expires_at: string;
  deposit_amount: string;
  broker_id: string | null;
  broker_commission_rate: string;
  notes: string;
}

export default function ProjectCRMReservationNew() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedLotId = searchParams.get('lot');
  const preselectedProspectId = searchParams.get('prospect');

  const { lots, loading: lotsLoading } = useLots(projectId!);
  const { prospects, loading: prospectsLoading } = useProspects(projectId!);
  const [brokers, setBrokers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default expiration: 30 days from now
  const defaultExpiration = new Date();
  defaultExpiration.setDate(defaultExpiration.getDate() + 30);

  const [formData, setFormData] = useState<ReservationFormData>({
    prospect_id: preselectedProspectId || null,
    lot_id: preselectedLotId || '',
    buyer_first_name: '',
    buyer_last_name: '',
    buyer_email: '',
    buyer_phone: '',
    expires_at: defaultExpiration.toISOString().split('T')[0],
    deposit_amount: '',
    broker_id: null,
    broker_commission_rate: '2.5',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});

  const availableLots = (lots || []).filter(
    (lot: any) => lot.status === 'AVAILABLE' || lot.id === preselectedLotId
  );
  const selectedLot = availableLots.find((lot: any) => lot.id === formData.lot_id);

  // Load brokers
  useEffect(() => {
    const loadBrokers = async () => {
      const { data } = await supabase
        .from('companies')
        .select('id, name')
        .eq('type', 'BROKER')
        .order('name');
      setBrokers(data || []);
    };
    loadBrokers();
  }, []);

  // Pre-fill from prospect if selected
  useEffect(() => {
    if (formData.prospect_id) {
      const prospect = prospects.find((p: any) => p.id === formData.prospect_id);
      if (prospect) {
        setFormData((prev) => ({
          ...prev,
          buyer_first_name: prospect.first_name || '',
          buyer_last_name: prospect.last_name || '',
          buyer_email: prospect.email || '',
          buyer_phone: prospect.phone || '',
        }));
      }
    }
  }, [formData.prospect_id, prospects]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.lot_id) {
      newErrors.lot_id = 'Veuillez selectionner un lot';
    }
    if (!formData.buyer_first_name.trim()) {
      newErrors.buyer_first_name = 'Le prenom est requis';
    }
    if (!formData.buyer_last_name.trim()) {
      newErrors.buyer_last_name = 'Le nom est requis';
    }
    if (!formData.buyer_email.trim()) {
      newErrors.buyer_email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyer_email)) {
      newErrors.buyer_email = 'Email invalide';
    }
    if (!formData.expires_at) {
      newErrors.expires_at = "La date d'expiration est requise";
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
      // Create reservation
      const { data: reservation, error: insertError } = await supabase
        .from('reservations')
        .insert({
          project_id: projectId,
          lot_id: formData.lot_id,
          prospect_id: formData.prospect_id || null,
          buyer_first_name: formData.buyer_first_name,
          buyer_last_name: formData.buyer_last_name,
          buyer_email: formData.buyer_email,
          buyer_phone: formData.buyer_phone || null,
          expires_at: new Date(formData.expires_at).toISOString(),
          deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
          broker_id: formData.broker_id || null,
          broker_commission_rate: formData.broker_id
            ? parseFloat(formData.broker_commission_rate)
            : null,
          notes: formData.notes || null,
          status: 'PENDING',
          reserved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update lot status to RESERVED
      await supabase.from('lots').update({ status: 'RESERVED' }).eq('id', formData.lot_id);

      // Update prospect status if linked
      if (formData.prospect_id) {
        await supabase
          .from('prospects')
          .update({ status: 'RESERVED' })
          .eq('id', formData.prospect_id);
      }

      navigate(`/projects/${projectId}/crm/reservations`);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Erreur lors de la creation de la reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/projects/${projectId}/crm/reservations`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux reservations
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Nouvelle reservation
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Reservez un lot pour un acheteur potentiel
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selection du lot */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <Home className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Lot a reserver
              </h3>
            </div>

            {lotsLoading ? (
              <p className="text-sm text-neutral-500">Chargement des lots...</p>
            ) : availableLots.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500">Aucun lot disponible pour ce projet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableLots.map((lot: any) => (
                  <label
                    key={lot.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.lot_id === lot.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="lot_id"
                      value={lot.id}
                      checked={formData.lot_id === lot.id}
                      onChange={(e) => setFormData({ ...formData, lot_id: e.target.value })}
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {lot.code}
                        </span>
                        <Badge variant={lot.status === 'AVAILABLE' ? 'success' : 'warning'}>
                          {lot.status === 'AVAILABLE' ? 'Disponible' : 'Reserve'}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {lot.rooms} pieces - {lot.surface_living} m² - Etage {lot.floor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        CHF {lot.price_sale?.toLocaleString('fr-CH')}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.lot_id && <p className="mt-2 text-sm text-red-500">{errors.lot_id}</p>}
          </RealProCard>

          {/* Lien avec prospect existant */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Acheteur
              </h3>
            </div>

            {!prospectsLoading && prospects.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Lier a un prospect existant (optionnel)
                </label>
                <select
                  value={formData.prospect_id || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, prospect_id: e.target.value || null })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="">-- Nouveau client --</option>
                  {prospects.map((prospect: any) => (
                    <option key={prospect.id} value={prospect.id}>
                      {prospect.first_name} {prospect.last_name} - {prospect.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Prenom <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Jean"
                  value={formData.buyer_first_name}
                  onChange={(e) => setFormData({ ...formData, buyer_first_name: e.target.value })}
                  className={errors.buyer_first_name ? 'border-red-500' : ''}
                />
                {errors.buyer_first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.buyer_first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Dupont"
                  value={formData.buyer_last_name}
                  onChange={(e) => setFormData({ ...formData, buyer_last_name: e.target.value })}
                  className={errors.buyer_last_name ? 'border-red-500' : ''}
                />
                {errors.buyer_last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.buyer_last_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="jean.dupont@email.ch"
                  value={formData.buyer_email}
                  onChange={(e) => setFormData({ ...formData, buyer_email: e.target.value })}
                  className={errors.buyer_email ? 'border-red-500' : ''}
                />
                {errors.buyer_email && (
                  <p className="mt-1 text-sm text-red-500">{errors.buyer_email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Telephone
                </label>
                <Input
                  type="tel"
                  placeholder="+41 79 123 45 67"
                  value={formData.buyer_phone}
                  onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                />
              </div>
            </div>
          </RealProCard>

          {/* Details reservation */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Details de la reservation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date d'expiration <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className={errors.expires_at ? 'border-red-500' : ''}
                />
                {errors.expires_at && (
                  <p className="mt-1 text-sm text-red-500">{errors.expires_at}</p>
                )}
                <p className="mt-1 text-xs text-neutral-500">
                  Apres cette date, la reservation sera automatiquement annulee
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Montant du depot (CHF)
                </label>
                <Input
                  type="number"
                  placeholder="20000"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Acompte demande pour confirmer la reservation
                </p>
              </div>
            </div>
          </RealProCard>

          {/* Courtier */}
          <RealProCard>
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Courtier (optionnel)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Courtier
                </label>
                <select
                  value={formData.broker_id || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, broker_id: e.target.value || null })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="">-- Aucun courtier --</option>
                  {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                      {broker.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.broker_id && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Taux de commission (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={formData.broker_commission_rate}
                    onChange={(e) =>
                      setFormData({ ...formData, broker_commission_rate: e.target.value })
                    }
                  />
                  {selectedLot && formData.broker_commission_rate && (
                    <p className="mt-1 text-xs text-neutral-500">
                      Commission estimee: CHF{' '}
                      {(
                        (selectedLot.price_sale * parseFloat(formData.broker_commission_rate)) /
                        100
                      ).toLocaleString('fr-CH')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </RealProCard>

          {/* Notes */}
          <RealProCard>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Notes internes
            </label>
            <textarea
              rows={3}
              placeholder="Notes sur cette reservation..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </RealProCard>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/projects/${projectId}/crm/reservations`)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !formData.lot_id}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creation...' : 'Creer la reservation'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
