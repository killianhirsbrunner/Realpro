import { useState } from 'react';
import { Building2, FileText, Home, TrendingUp } from 'lucide-react';
import { useBrokerProjects, useBrokerLots, useBrokerSalesContracts, useBrokerReservations } from '../hooks/useBrokers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

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

function getReservationStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CONVERTED: 'info',
    CANCELLED: 'error',
    EXPIRED: 'error',
  };

  const labels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    CONVERTED: 'Convertie',
    CANCELLED: 'Annulée',
    EXPIRED: 'Expirée',
  };

  return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
}

export function BrokerDashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const { data: projects, loading: projectsLoading } = useBrokerProjects();
  const { data: lots, loading: lotsLoading } = useBrokerLots(selectedProjectId);
  const { data: salesContracts, loading: contractsLoading } = useBrokerSalesContracts(selectedProjectId);
  const { data: reservations, loading: reservationsLoading } = useBrokerReservations(selectedProjectId);

  const stats = {
    totalLots: lots?.length || 0,
    availableLots: lots?.filter(l => l.status === 'AVAILABLE').length || 0,
    reservedLots: lots?.filter(l => l.status === 'RESERVED').length || 0,
    soldLots: lots?.filter(l => l.status === 'SOLD').length || 0,
    activeReservations: reservations?.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length || 0,
    signedContracts: salesContracts?.filter(sc => sc.signed_at).length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Courtier</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos lots, réservations et contrats de vente
          </p>
        </div>

        {projectsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Chargement des projets...</div>
          </div>
        ) : projects && projects.length === 0 ? (
          <Card className="p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun projet</h3>
            <p className="mt-2 text-gray-600">
              Vous n'êtes pas encore assigné à un projet en tant que courtier.
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par projet
              </label>
              <select
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                className="block w-full max-w-md rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              >
                <option value="">Tous les projets</option>
                {projects?.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Home}
                label="Lots disponibles"
                value={stats.availableLots}
                color="bg-green-600"
              />
              <StatCard
                icon={TrendingUp}
                label="Lots réservés"
                value={stats.reservedLots}
                color="bg-yellow-600"
              />
              <StatCard
                icon={FileText}
                label="Lots vendus"
                value={stats.soldLots}
                color="bg-brand-600"
              />
              <StatCard
                icon={FileText}
                label="Contrats signés"
                value={stats.signedContracts}
                color="bg-purple-600"
              />
            </div>

            <div className="space-y-8">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Lots commercialisables</h2>
                  <Button href={`/broker/lots${selectedProjectId ? `?project=${selectedProjectId}` : ''}`}>
                    Voir tous les lots
                  </Button>
                </div>

                {lotsLoading ? (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500">Chargement des lots...</div>
                  </Card>
                ) : !lots || lots.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Home className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun lot</h3>
                    <p className="mt-2 text-gray-600">Aucun lot disponible pour le moment.</p>
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
                              Projet
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                              Prix
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Acheteur/Prospect
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Dates clés
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {lots.slice(0, 10).map((lot) => (
                            <tr key={lot.id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="font-medium text-gray-900">{lot.code}</div>
                                <div className="text-sm text-gray-500">
                                  {lot.rooms_count && `${lot.rooms_count} pièces`}
                                  {lot.surface_living && ` • ${lot.surface_living} m²`}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm text-gray-900">{lot.project.name}</div>
                                <div className="text-sm text-gray-500">{lot.project.code}</div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {lot.type}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {getLotStatusBadge(lot.status)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                {formatCurrency(lot.price_total)}
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
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {lot.reservation?.signed_at ? (
                                  <div className="text-green-600">
                                    ✓ Réservation signée
                                    <div className="text-xs">{formatDate(lot.reservation.signed_at)}</div>
                                  </div>
                                ) : lot.sales_contract?.signed_at ? (
                                  <div className="text-brand-600">
                                    ✓ Acte signé
                                    <div className="text-xs">{formatDate(lot.sales_contract.signed_at)}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Réservations actives</h2>
                  <Button href={`/broker/reservations${selectedProjectId ? `?project=${selectedProjectId}` : ''}`}>
                    Voir toutes
                  </Button>
                </div>

                {reservationsLoading ? (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500">Chargement des réservations...</div>
                  </Card>
                ) : !reservations || reservations.length === 0 ? (
                  <Card className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune réservation</h3>
                    <p className="mt-2 text-gray-600">Aucune réservation active pour le moment.</p>
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
                              Acheteur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Date réservation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Date signature
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                              Acompte
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {reservations.slice(0, 5).map((reservation) => (
                            <tr key={reservation.id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="font-medium text-gray-900">{reservation.lot.code}</div>
                                <div className="text-sm text-gray-500">{reservation.project.name}</div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {reservation.buyer_first_name} {reservation.buyer_last_name}
                                </div>
                                {reservation.buyer_email && (
                                  <div className="text-sm text-gray-500">{reservation.buyer_email}</div>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {getReservationStatusBadge(reservation.status)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {formatDate(reservation.reserved_at)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {reservation.signed_at ? (
                                  <div className="text-green-600">
                                    ✓ {formatDate(reservation.signed_at)}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Non signé</span>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                {formatCurrency(reservation.deposit_amount)}
                                {reservation.deposit_paid_at && (
                                  <div className="text-xs text-green-600">✓ Payé</div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
