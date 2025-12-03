import { useState } from 'react';
import { Home, AlertCircle, Check, X } from 'lucide-react';
import { useBrokerLots, updateLotStatus, type LotDto } from '../hooks/useBrokers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

function formatCurrency(amount: number | null): string {
  if (amount === null) return 'CHF -';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getLotStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
    AVAILABLE: 'success',
    RESERVED: 'warning',
    SOLD: 'info',
    DELIVERED: 'default',
  };

  const labels: Record<string, string> = {
    AVAILABLE: 'Disponible',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
    DELIVERED: 'Livré',
  };

  return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
}

function getLotTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: 'Appartement',
    COMMERCIAL: 'Commercial',
    PARKING: 'Place de parc',
    STORAGE: 'Cave',
    VILLA: 'Villa',
    HOUSE: 'Maison',
  };
  return labels[type] || type;
}

function ChangeStatusModal({
  lot,
  isOpen,
  onClose,
  onSuccess,
}: {
  lot: LotDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<'AVAILABLE' | 'RESERVED' | 'SOLD'>(
    lot.status as 'AVAILABLE' | 'RESERVED' | 'SOLD'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedTransitions: Record<string, Array<'AVAILABLE' | 'RESERVED' | 'SOLD'>> = {
    AVAILABLE: ['RESERVED'],
    RESERVED: ['AVAILABLE', 'SOLD'],
    SOLD: [],
    DELIVERED: [],
  };

  const availableStatuses = allowedTransitions[lot.status] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateLotStatus(lot.id, selectedStatus);

    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Une erreur est survenue');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Changer le statut du lot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-4">
              Lot: <span className="font-medium">{lot.code}</span>
              <br />
              Statut actuel: {getLotStatusBadge(lot.status)}
            </p>
          </div>

          {availableStatuses.length === 0 ? (
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  Aucune transition de statut n'est autorisée pour ce lot.
                  {lot.status === 'SOLD' && ' Le lot est déjà vendu.'}
                  {lot.status === 'DELIVERED' && ' Le lot est déjà livré.'}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut
                </label>
                <div className="space-y-2">
                  {availableStatuses.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={selectedStatus === status}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        {getLotStatusBadge(status)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Transitions autorisées
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• DISPONIBLE → RÉSERVÉ (avec création réservation)</li>
                  <li>• RÉSERVÉ → DISPONIBLE (annulation)</li>
                  <li>• RÉSERVÉ → VENDU (avec contrat de vente)</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Changer le statut'}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Annuler
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}

export function BrokerLots() {
  const { data: lots, loading, refetch } = useBrokerLots();
  const [selectedLot, setSelectedLot] = useState<LotDto | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const handleSuccess = () => {
    refetch();
  };

  const filteredLots = lots?.filter((lot) => {
    if (filterStatus && lot.status !== filterStatus) return false;
    if (filterType && lot.type !== filterType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des lots</h1>
          <p className="mt-2 text-gray-600">
            Visualisez et gérez le statut des lots commercialisables
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="RESERVED">Réservé</option>
              <option value="SOLD">Vendu</option>
              <option value="DELIVERED">Livré</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              <option value="APARTMENT">Appartement</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="PARKING">Place de parc</option>
              <option value="STORAGE">Cave</option>
              <option value="VILLA">Villa</option>
              <option value="HOUSE">Maison</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">Chargement des lots...</div>
          </Card>
        ) : !filteredLots || filteredLots.length === 0 ? (
          <Card className="p-8 text-center">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun lot trouvé</h3>
            <p className="mt-2 text-gray-600">
              {lots && lots.length > 0
                ? 'Aucun lot ne correspond aux filtres sélectionnés.'
                : 'Aucun lot commercialisable pour le moment.'}
            </p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Lot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Projet / Bâtiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Caractéristiques
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Acheteur/Prospect
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Dates clés
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredLots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">{lot.code}</div>
                        {lot.floor_level !== null && (
                          <div className="text-sm text-gray-500">Étage {lot.floor_level}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{lot.project.name}</div>
                        <div className="text-sm text-gray-500">{lot.building.name}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {getLotTypeLabel(lot.type)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {lot.rooms_count && (
                          <div>{lot.rooms_count} pièces</div>
                        )}
                        {lot.surface_living && (
                          <div>{lot.surface_living} m² habitable</div>
                        )}
                        {lot.surface_total && lot.surface_total !== lot.surface_living && (
                          <div className="text-xs text-gray-400">
                            {lot.surface_total} m² total
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(lot.price_total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getLotStatusBadge(lot.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {lot.buyer ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {lot.buyer.first_name} {lot.buyer.last_name}
                            </div>
                            <div className="text-gray-500">Acheteur</div>
                          </div>
                        ) : lot.reservation ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {lot.reservation.buyer_first_name} {lot.reservation.buyer_last_name}
                            </div>
                            <div className="text-gray-500">Réservation</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {lot.reservation?.signed_at ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Réservation signée</div>
                              <div className="text-xs">{formatDate(lot.reservation.signed_at)}</div>
                            </div>
                          </div>
                        ) : lot.sales_contract?.signed_at ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Check className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Acte signé</div>
                              <div className="text-xs">{formatDate(lot.sales_contract.signed_at)}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedLot(lot)}
                          disabled={lot.status === 'DELIVERED'}
                        >
                          Changer statut
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="text-sm text-gray-600">
                Total: <span className="font-medium">{filteredLots.length}</span> lots
                {lots && lots.length !== filteredLots.length && (
                  <span> (filtré de {lots.length})</span>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {selectedLot && (
        <ChangeStatusModal
          lot={selectedLot}
          isOpen={true}
          onClose={() => setSelectedLot(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
