import { useParams, Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useReservations } from '../hooks/useReservations';
import { useI18n } from '../lib/i18n';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProjectReservations() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { reservations, loading, error } = useReservations(projectId!);

  if (loading) return <LoadingState message="Chargement des réservations..." />;
  if (error) return <ErrorState message={error} />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <CheckCircle className="w-3 h-3" />
            Confirmée
          </span>
        );
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-3 h-3" />
            Convertie
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle className="w-3 h-3" />
            Annulée
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            <AlertTriangle className="w-3 h-3" />
            Expirée
          </span>
        );
      default:
        return null;
    }
  };

  const isExpiringSoon = (expiresAt: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  };

  const statusCounts = {
    pending: reservations.filter(r => r.status === 'PENDING').length,
    confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
    converted: reservations.filter(r => r.status === 'CONVERTED').length,
    cancelled: reservations.filter(r => ['CANCELLED', 'EXPIRED'].includes(r.status)).length,
  };

  const subtitle = `${reservations.length} réservation${reservations.length !== 1 ? 's' : ''}`;

  const stats = [
    {
      label: 'En attente',
      value: statusCounts.pending,
      icon: Clock,
      gradient: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20',
      border: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-900 dark:text-amber-100',
      labelColor: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Confirmées',
      value: statusCounts.confirmed,
      icon: CheckCircle,
      gradient: 'from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20',
      border: 'border-brand-200 dark:border-brand-800',
      textColor: 'text-brand-900 dark:text-brand-100',
      labelColor: 'text-brand-700 dark:text-brand-400',
      iconBg: 'bg-brand-100 dark:bg-brand-900/30',
      iconColor: 'text-brand-600 dark:text-brand-400',
    },
    {
      label: 'Converties',
      value: statusCounts.converted,
      icon: CheckCircle,
      gradient: 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-900 dark:text-green-100',
      labelColor: 'text-green-700 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Annulées / Expirées',
      value: statusCounts.cancelled,
      icon: XCircle,
      gradient: 'from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-100',
      labelColor: 'text-red-700 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <RealProTopbar
        title={t('crm.reservations') || 'Réservations'}
        subtitle={subtitle}
        actions={
          <Link to={`/projects/${projectId}/crm/reservations/new`}>
            <RealProButton variant="primary">
              <Plus className="w-4 h-4" />
              Nouvelle réservation
            </RealProButton>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-5 bg-gradient-to-br ${stat.gradient} rounded-xl border ${stat.border} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.labelColor}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservations Table */}
      {reservations.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Aucune réservation"
          description="Créez votre première réservation pour commencer"
          action={
            <Link to={`/projects/${projectId}/crm/reservations/new`}>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                Nouvelle réservation
              </RealProButton>
            </Link>
          }
        />
      ) : (
        <RealProCard padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Acheteur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Lot
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Réservé
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Expire
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Arrhes
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {reservation.buyer_first_name} {reservation.buyer_last_name}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {reservation.buyer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {reservation.lot?.lot_number || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDistanceToNow(new Date(reservation.reserved_at), { addSuffix: true, locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {new Date(reservation.expires_at).toLocaleDateString('fr-CH')}
                      </div>
                      {isExpiringSoon(reservation.expires_at) && reservation.status !== 'EXPIRED' && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Expire bientôt
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.deposit_amount ? (
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            CHF {reservation.deposit_amount.toLocaleString('fr-CH')}
                          </div>
                          {reservation.deposit_paid_at && (
                            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                              <CheckCircle className="w-3 h-3" />
                              Payé
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400 dark:text-neutral-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/projects/${projectId}/crm/reservations/${reservation.id}`}
                        className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
                      >
                        Voir détail
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RealProCard>
      )}
    </div>
  );
}
