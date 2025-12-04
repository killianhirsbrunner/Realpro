import { useParams, Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { useReservations } from '../hooks/useReservations';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProjectReservations() {
  const { projectId } = useParams<{ projectId: string }>();
  const { reservations, loading, error } = useReservations(projectId!);

  if (loading) return <LoadingState message="Chargement des réservations..." />;
  if (error) return <ErrorState message={error} />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Réservations
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          to={`/projects/${projectId}/crm/reservations/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40"
        >
          <Plus className="w-4 h-4" />
          Nouvelle réservation
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">En attente</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300 mt-1">
            {reservations.filter(r => r.status === 'PENDING').length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl border border-brand-200 dark:border-brand-800">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Confirmées</p>
          <p className="text-2xl font-bold text-brand-900 dark:text-brand-300 mt-1">
            {reservations.filter(r => r.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Converties</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">
            {reservations.filter(r => r.status === 'CONVERTED').length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">Annulées/Expirées</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-1">
            {reservations.filter(r => ['CANCELLED', 'EXPIRED'].includes(r.status)).length}
          </p>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Acheteur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Lot
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Réservé
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Expire
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Arrhes
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {reservation.buyer_first_name} {reservation.buyer_last_name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {reservation.buyer_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
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
                    <div className="text-sm text-neutral-900 dark:text-white">
                      {new Date(reservation.expires_at).toLocaleDateString('fr-CH')}
                    </div>
                    {isExpiringSoon(reservation.expires_at) && reservation.status !== 'EXPIRED' && (
                      <div className="text-xs text-secondary-600 dark:text-secondary-400 font-medium mt-1">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Expire bientôt
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.deposit_amount ? (
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
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
                      <span className="text-sm text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={`/projects/${projectId}/crm/reservations/${reservation.id}`}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}

              {reservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-neutral-500 dark:text-neutral-400">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Aucune réservation</p>
                      <p className="text-sm mt-1">Créez votre première réservation pour commencer</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
