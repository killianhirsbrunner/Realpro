import { useEffect, useState } from 'react';
import { Home, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type BrokerLot = {
  id: string;
  lotNumber: string;
  roomsLabel?: string | null;
  surfaceHabitable?: number | null;
  status: string;
  priceVat?: number | null;
  priceQpt?: number | null;
  building?: { id: string; name: string } | null;
  floor?: { id: string; label: string } | null;
  buyer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export function BrokerLots() {
  const [lots, setLots] = useState<BrokerLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const projectId = '10000000-0000-0000-0000-000000000001';
  const userId = '20000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadLots();
  }, [projectId]);

  const loadLots = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/broker`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/lots`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des lots');
      }

      const data = await response.json();
      setLots(data);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les lots');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (lotId: string, newStatus: string) => {
    try {
      setSaving(lotId);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/broker`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/lots/${lotId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, userId }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Erreur lors de la mise à jour du statut');
      }

      await loadLots();
    } catch (err: any) {
      setError(err.message || 'Impossible de changer le statut du lot');
    } finally {
      setSaving(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      FREE: 'success',
      RESERVED: 'warning',
      SOLD: 'danger',
      BLOCKED: 'default',
    };

    const labels: Record<string, string> = {
      FREE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      BLOCKED: 'Bloqué',
    };

    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  const filteredLots = filterStatus
    ? lots.filter(lot => lot.status === filterStatus)
    : lots;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          Espace courtiers
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Programme de vente – Gestion des lots
        </h1>
        <p className="text-sm text-neutral-500">
          Mettez à jour les statuts des lots, visualisez les acheteurs et préparez les signatures
        </p>
      </header>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Filtrer par statut
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Tous les statuts</option>
            <option value="FREE">Disponible</option>
            <option value="RESERVED">Réservé</option>
            <option value="SOLD">Vendu</option>
            <option value="BLOCKED">Bloqué</option>
          </select>
        </div>

        <Button onClick={loadLots} variant="secondary">
          Actualiser
        </Button>
      </div>

      {filteredLots.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Home className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucun lot à afficher
            </h3>
            <p className="text-sm text-neutral-500">
              {filterStatus
                ? 'Aucun lot ne correspond à ce filtre'
                : 'Aucun lot trouvé pour ce projet'}
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Lot
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Bâtiment / Étage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Surface
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Prix
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Acheteur
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-neutral-900">{lot.lotNumber}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      <div>{lot.building?.name || '—'}</div>
                      {lot.floor && <div className="text-xs text-neutral-500">{lot.floor.label}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                      {lot.roomsLabel || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-neutral-600">
                      {lot.surfaceHabitable ? `${lot.surfaceHabitable.toFixed(1)} m²` : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-neutral-900">
                      {formatCurrency(lot.priceVat || lot.priceQpt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={lot.status}
                        onChange={(e) => handleStatusChange(lot.id, e.target.value)}
                        disabled={saving === lot.id}
                        className="text-xs rounded-lg border border-neutral-300 px-2 py-1 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                      >
                        <option value="FREE">Disponible</option>
                        <option value="RESERVED">Réservé</option>
                        <option value="SOLD">Vendu</option>
                        <option value="BLOCKED">Bloqué</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lot.buyer ? (
                        <div className="text-sm">
                          <div className="font-medium text-neutral-900">
                            {lot.buyer.firstName} {lot.buyer.lastName}
                          </div>
                          <div className="text-xs text-neutral-500">{lot.buyer.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">Aucun acheteur</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50">
            <div className="text-sm text-neutral-600">
              Total: <span className="font-medium">{filteredLots.length}</span> lots
              {filterStatus && lots.length !== filteredLots.length && (
                <span className="text-neutral-500"> (sur {lots.length})</span>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return 'CHF —';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
