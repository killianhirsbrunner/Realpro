import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  TrendingUp,
  FileText,
  Award,
  MoreVertical,
  Edit2,
  Trash2,
  Settings,
  DollarSign
} from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProModal } from '../components/realpro/RealProModal';
import { RealProInput } from '../components/realpro/RealProInput';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { useProjectBrokers } from '../hooks/useProjectBrokers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';

export function ProjectBrokers() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignLotsModal, setShowAssignLotsModal] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);

  const {
    brokers,
    stats,
    loading,
    error,
    inviteBroker,
    removeBroker,
    updateBroker
  } = useProjectBrokers(projectId || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Courtiers
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Gérez vos courtiers, assignez des lots et suivez leurs performances
            </p>
          </div>
          <RealProButton onClick={() => setShowInviteModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Inviter un courtier
          </RealProButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RealProCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Courtiers actifs</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {stats?.totalBrokers || 0}
              </p>
            </div>
          </RealProCard>

          <RealProCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/10 dark:bg-green-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Ventes totales</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {stats?.totalSales || 0}
              </p>
            </div>
          </RealProCard>

          <RealProCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Lots attribués</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {stats?.lotsAssigned || 0}
              </p>
            </div>
          </RealProCard>

          <RealProCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Commissions</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
                {formatCurrency(stats?.totalCommissions || 0)}
              </p>
            </div>
          </RealProCard>
        </div>

        {/* Brokers List */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Liste des courtiers
          </h2>

          {!brokers || brokers.length === 0 ? (
            <RealProCard className="p-12 text-center">
              <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                Aucun courtier
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Invitez votre premier courtier pour commencer à gérer vos ventes
              </p>
              <RealProButton onClick={() => setShowInviteModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Inviter un courtier
              </RealProButton>
            </RealProCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map((broker: any) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  onEdit={(b) => {
                    setSelectedBroker(b);
                    setShowInviteModal(true);
                  }}
                  onAssignLots={(b) => {
                    setSelectedBroker(b);
                    setShowAssignLotsModal(true);
                  }}
                  onRemove={removeBroker}
                />
              ))}
            </div>
          )}
        </div>

        {/* Invite Broker Modal */}
        {showInviteModal && (
          <InviteBrokerModal
            broker={selectedBroker}
            projectId={projectId || ''}
            onClose={() => {
              setShowInviteModal(false);
              setSelectedBroker(null);
            }}
            onSave={inviteBroker}
          />
        )}

        {/* Assign Lots Modal */}
        {showAssignLotsModal && selectedBroker && (
          <AssignLotsModal
            broker={selectedBroker}
            projectId={projectId || ''}
            onClose={() => {
              setShowAssignLotsModal(false);
              setSelectedBroker(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function BrokerCard({
  broker,
  onEdit,
  onAssignLots,
  onRemove
}: {
  broker: any;
  onEdit: (broker: any) => void;
  onAssignLots: (broker: any) => void;
  onRemove: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <RealProCard className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-semibold">
            {broker.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              {broker.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {broker.email}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-neutral-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(broker);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => {
                  onAssignLots(broker);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Gérer les lots
              </button>
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir retirer ce courtier ?')) {
                    onRemove(broker.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Retirer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Commission</span>
          <span className="font-semibold text-neutral-900 dark:text-white">
            {broker.commissionRate}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Lots attribués</span>
          <span className="font-semibold text-neutral-900 dark:text-white">
            {broker.lotsCount || 0}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Ventes</span>
          <span className="font-semibold text-green-600">
            {broker.salesCount || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <RealProBadge variant={broker.status === 'active' ? 'success' : 'default'}>
          {broker.status === 'active' ? 'Actif' : 'Inactif'}
        </RealProBadge>
        {broker.salesCount > 0 && (
          <RealProBadge variant="warning">
            <Award className="w-3 h-3 mr-1" />
            Top vendeur
          </RealProBadge>
        )}
      </div>
    </RealProCard>
  );
}

function InviteBrokerModal({
  broker,
  projectId,
  onClose,
  onSave
}: {
  broker?: any;
  projectId: string;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    name: broker?.name || '',
    email: broker?.email || '',
    phone: broker?.phone || '',
    commissionRate: broker?.commissionRate || 3,
    company: broker?.company || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...formData, projectId, id: broker?.id });
      onClose();
    } catch (error) {
      console.error('Error saving broker:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RealProModal
      title={broker ? 'Modifier le courtier' : 'Inviter un courtier'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <RealProInput
          label="Nom complet"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Jean Dupont"
        />

        <RealProInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="jean.dupont@example.com"
        />

        <RealProInput
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+41 79 123 45 67"
        />

        <RealProInput
          label="Société"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Immobilière XYZ SA"
        />

        <RealProInput
          label="Taux de commission (%)"
          type="number"
          value={formData.commissionRate}
          onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
          required
          min={0}
          max={100}
          step={0.1}
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <RealProButton variant="outline" onClick={onClose} disabled={saving}>
            Annuler
          </RealProButton>
          <RealProButton type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : broker ? 'Enregistrer' : 'Inviter'}
          </RealProButton>
        </div>
      </form>
    </RealProModal>
  );
}

function AssignLotsModal({
  broker,
  projectId,
  onClose
}: {
  broker: any;
  projectId: string;
  onClose: () => void;
}) {
  const [selectedLots, setSelectedLots] = useState<string[]>(broker.assignedLots || []);
  const [saving, setSaving] = useState(false);

  // TODO: Fetch lots from the project
  const lots = [];

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Call API to update assigned lots
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Error assigning lots:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RealProModal
      title={`Lots attribués à ${broker.name}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Sélectionnez les lots que ce courtier pourra commercialiser
        </p>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {lots.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Aucun lot disponible dans ce projet
            </div>
          ) : (
            lots.map((lot: any) => (
              <label
                key={lot.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedLots.includes(lot.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLots([...selectedLots, lot.id]);
                    } else {
                      setSelectedLots(selectedLots.filter(id => id !== lot.id));
                    }
                  }}
                  className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Lot {lot.code}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {lot.type} • {lot.surface}m² • {formatCurrency(lot.price)}
                  </p>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <RealProButton variant="outline" onClick={onClose} disabled={saving}>
            Annuler
          </RealProButton>
          <RealProButton onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : `Attribuer ${selectedLots.length} lot(s)`}
          </RealProButton>
        </div>
      </div>
    </RealProModal>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
