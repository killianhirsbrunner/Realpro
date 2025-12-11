import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Edit,
  Trash2,
  Eye,
  FileText,
  MessageSquare,
  Home,
  User,
  Calendar,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { RealProTabs } from '../components/realpro/RealProTabs';
import { RealProCard } from '../components/realpro/RealProCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useReservationDetail } from '../hooks/useReservationDetail';

const statusConfig = {
  PENDING: {
    label: 'En attente',
    variant: 'warning' as const,
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  CONFIRMED: {
    label: 'Confirmee',
    variant: 'success' as const,
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  CONVERTED: {
    label: 'Convertie',
    variant: 'success' as const,
    icon: CheckCircle,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  CANCELLED: {
    label: 'Annulee',
    variant: 'danger' as const,
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  EXPIRED: {
    label: 'Expiree',
    variant: 'default' as const,
    icon: AlertTriangle,
    color: 'text-neutral-600',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
  },
};

export default function ProjectCRMReservationDetail() {
  const { projectId, reservationId } = useParams<{ projectId: string; reservationId: string }>();
  const navigate = useNavigate();
  const {
    reservation,
    loading,
    error,
    refetch,
    markDepositPaid,
    extendExpiration,
    convertToSale,
    cancelReservation,
  } = useReservationDetail(projectId!, reservationId!);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (loading) return <LoadingState message="Chargement de la reservation..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!reservation) return <ErrorState message="Reservation introuvable" retry={refetch} />;

  const status = statusConfig[reservation.status];
  const StatusIcon = status.icon;

  const isExpiringSoon = () => {
    const expiry = new Date(reservation.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    return new Date(reservation.expires_at) < new Date();
  };

  const handleMarkDepositPaid = async () => {
    setActionLoading('deposit');
    try {
      await markDepositPaid();
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtendExpiration = async () => {
    const days = window.prompt('Nombre de jours a ajouter:', '7');
    if (!days) return;

    setActionLoading('extend');
    try {
      await extendExpiration(parseInt(days, 10));
    } finally {
      setActionLoading(null);
    }
  };

  const handleConvertToSale = async () => {
    if (!window.confirm('Convertir cette reservation en vente ? Cette action mettra a jour le lot et le prospect.')) {
      return;
    }

    setActionLoading('convert');
    try {
      await convertToSale();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt('Motif d\'annulation (optionnel):');

    setActionLoading('cancel');
    try {
      await cancelReservation(reason || undefined);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cette reservation ?')) {
      // TODO: Implement delete logic
      navigate(`/projects/${projectId}/crm/pipeline`);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return `CHF ${amount.toLocaleString('fr-CH')}`;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Informations acheteur */}
      <RealProCard>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Informations acheteur
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Nom complet</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {reservation.buyer_first_name} {reservation.buyer_last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Email</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {reservation.buyer_email}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Telephone</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {reservation.buyer_phone || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Adresse</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {reservation.buyer_address || '-'}
            </p>
          </div>
        </div>

        {reservation.prospect && (
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  Prospect lie
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {reservation.prospect.first_name} {reservation.prospect.last_name}
                </p>
              </div>
              <Link
                to={`/projects/${projectId}/crm/prospects/${reservation.prospect.id}`}
                className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                Voir le prospect
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </RealProCard>

      {/* Informations lot */}
      <RealProCard>
        <div className="flex items-center gap-2 mb-6">
          <Home className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Lot reserve
          </h3>
        </div>

        {reservation.lot ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Code</p>
              <p className="font-medium text-neutral-900 dark:text-white">
                {reservation.lot.code || reservation.lot.lot_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Pieces</p>
              <p className="font-medium text-neutral-900 dark:text-white">
                {reservation.lot.rooms || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Surface</p>
              <p className="font-medium text-neutral-900 dark:text-white">
                {reservation.lot.surface_living ? `${reservation.lot.surface_living} m²` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Etage</p>
              <p className="font-medium text-neutral-900 dark:text-white">
                {reservation.lot.floor !== null ? reservation.lot.floor : '-'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Prix de vente</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {formatCurrency(reservation.lot.price_sale)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">Lot non trouve</p>
        )}
      </RealProCard>

      {/* Informations financieres */}
      <RealProCard>
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Informations financieres
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Acompte</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {formatCurrency(reservation.deposit_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Acompte verse</p>
            {reservation.deposit_paid_at ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-emerald-600">
                  {new Date(reservation.deposit_paid_at).toLocaleDateString('fr-CH')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-600">En attente</span>
                {reservation.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkDepositPaid}
                    disabled={actionLoading === 'deposit'}
                  >
                    Marquer comme verse
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {reservation.broker && (
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-neutral-400" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Courtier
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Nom</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {reservation.broker.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Commission</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {reservation.broker_commission_rate
                    ? `${reservation.broker_commission_rate}%`
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </RealProCard>

      {/* Notes */}
      {reservation.notes && (
        <RealProCard>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Notes
            </h3>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
            {reservation.notes}
          </p>
        </RealProCard>
      )}
    </div>
  );

  const ActivityTab = () => (
    <RealProCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Historique d'activite
        </h3>
      </div>
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Aucune activite enregistree
        </p>
      </div>
    </RealProCard>
  );

  const DocumentsTab = () => (
    <RealProCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Documents
        </h3>
        <Button variant="outline" size="sm">
          Ajouter
        </Button>
      </div>
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Aucun document
        </p>
        <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">
          Ajoutez des pieces justificatives, contrats ou autres documents
        </p>
      </div>
    </RealProCard>
  );

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: <OverviewTab />,
    },
    {
      id: 'activity',
      label: 'Activite',
      icon: <MessageSquare className="w-4 h-4" />,
      content: <ActivityTab />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      content: <DocumentsTab />,
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="px-10 py-8">
        {/* Navigation */}
        <Link
          to={`/projects/${projectId}/crm/pipeline`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au pipeline
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Reservation {reservation.lot?.code || reservation.lot?.lot_number || ''}
              </h1>
              <Badge variant={status.variant}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {reservation.buyer_first_name} {reservation.buyer_last_name}
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
              Creee le {new Date(reservation.created_at).toLocaleDateString('fr-CH')}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {reservation.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExtendExpiration}
                  disabled={actionLoading === 'extend'}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Prolonger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={handleCancel}
                  disabled={actionLoading === 'cancel'}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </>
            )}
            {reservation.status === 'CONFIRMED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleConvertToSale}
                disabled={actionLoading === 'convert'}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Convertir en vente
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alertes */}
        {isExpiringSoon() && reservation.status === 'PENDING' && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Reservation bientot expirante
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Cette reservation expire le{' '}
                {new Date(reservation.expires_at).toLocaleDateString('fr-CH')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handleExtendExpiration}
            >
              Prolonger
            </Button>
          </div>
        )}

        {isExpired() && reservation.status === 'PENDING' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                Reservation expiree
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Cette reservation a expire le{' '}
                {new Date(reservation.expires_at).toLocaleDateString('fr-CH')}
              </p>
            </div>
          </div>
        )}

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Reserve le
              </p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {new Date(reservation.reserved_at).toLocaleDateString('fr-CH')}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Expire le
              </p>
              <p className={`text-xl font-bold ${isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-amber-600' : 'text-neutral-900 dark:text-white'}`}>
                {new Date(reservation.expires_at).toLocaleDateString('fr-CH')}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                <Wallet className="w-4 h-4 inline mr-1" />
                Acompte
              </p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {formatCurrency(reservation.deposit_amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                <Home className="w-4 h-4 inline mr-1" />
                Prix total
              </p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {formatCurrency(reservation.lot?.price_sale || null)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <RealProTabs tabs={tabs} defaultTab="overview" />
      </div>
    </motion.div>
  );
}
