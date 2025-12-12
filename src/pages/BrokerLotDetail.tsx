import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Calendar, User, Home, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type DealDetails = {
  lot: {
    id: string;
    lotNumber: string;
    roomsLabel?: string | null;
    surfaceHabitable?: number | null;
    status: string;
    building?: string | null;
    floor?: string | null;
    priceVat?: number | null;
    priceQpt?: number | null;
  };
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
  } | null;
  reservation: {
    id: string;
    startDate: string;
    endDate: string;
    signedAt?: string | null;
    status: string;
  } | null;
  salesContract: {
    id: string;
    signedAt?: string | null;
    effectiveAt?: string | null;
    document?: {
      id: string;
      name: string;
      downloadUrl: string;
    } | null;
    notary?: {
      status: string;
      notaryName?: string | null;
      notaryContact?: string | null;
      lastAct?: {
        id: string;
        name: string;
        downloadUrl: string;
      } | null;
      lastAppointment?: {
        id: string;
        date: string;
        location?: string | null;
        notes?: string | null;
      } | null;
    } | null;
  } | null;
  buyerFile: {
    id: string;
    status: string;
    notaryName?: string | null;
    notaryContact?: string | null;
  } | null;
};

export function BrokerLotDetail() {
  const [data, setData] = useState<DealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusValue, setStatusValue] = useState<string>('');
  const [reservationDate, setReservationDate] = useState('');
  const [actDate, setActDate] = useState('');

  const projectId = '10000000-0000-0000-0000-000000000001';
  const lotId = '30000000-0000-0000-0000-000000000001';
  const userId = '20000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadData();
  }, [projectId, lotId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/broker`;

      const response = await fetch(
        `${apiUrl}/projects/${projectId}/lots/${lotId}/deal`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du dossier lot');
      }

      const json = await response.json();
      setData(json);
      setStatusValue(json.lot.status);

      if (json.reservation?.signedAt) {
        setReservationDate(json.reservation.signedAt.slice(0, 10));
      }
      if (json.salesContract?.signedAt) {
        setActDate(json.salesContract.signedAt.slice(0, 10));
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les informations du lot');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setStatusValue(newStatus);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/broker`;

      const response = await fetch(
        `${apiUrl}/projects/${projectId}/lots/${lotId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus, userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      await loadData();
    } catch (err: any) {
      setError(err.message || 'Impossible de mettre à jour le statut');
    }
  };

  const handleSaveSignatures = async () => {
    try {
      setSaving(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/broker`;

      const response = await fetch(
        `${apiUrl}/projects/${projectId}/lots/${lotId}/signatures`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reservationSignedAt: reservationDate || null,
            actSignedAt: actDate || null,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des dates');
      }

      await loadData();
    } catch (err: any) {
      setError(err.message || 'Impossible de mettre à jour les dates');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-neutral-500">Dossier lot introuvable</p>
      </div>
    );
  }

  const { lot, buyer, reservation, salesContract, buyerFile } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          Espace courtiers · Dossier lot
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Lot {lot.lotNumber}
          {lot.roomsLabel && (
            <span className="text-sm font-normal text-neutral-500 ml-2">
              ({lot.roomsLabel})
            </span>
          )}
        </h1>
        <p className="text-sm text-neutral-500">
          Suivi complet du dossier : acheteur, réservation, acte, notaire
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <Home className="w-5 h-5 text-brand-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Informations lot
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bâtiment</span>
                  <span className="font-medium text-neutral-900">
                    {lot.building || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Étage</span>
                  <span className="font-medium text-neutral-900">
                    {lot.floor || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Surface habitable</span>
                  <span className="font-medium text-neutral-900">
                    {lot.surfaceHabitable
                      ? `${lot.surfaceHabitable.toFixed(1)} m²`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Prix</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(lot.priceVat || lot.priceQpt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Statut
            </label>
            <select
              value={statusValue}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="FREE">Disponible</option>
              <option value="RESERVED">Réservé</option>
              <option value="SOLD">Vendu</option>
              <option value="BLOCKED">Bloqué</option>
            </select>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-brand-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Acheteur
              </h2>
              {buyer ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {buyer.firstName} {buyer.lastName}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Email</span>
                    <span className="text-neutral-900">
                      {buyer.email || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Téléphone</span>
                    <span className="text-neutral-900">
                      {buyer.phone || 'Non renseigné'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Aucun acheteur encore associé à ce lot
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-brand-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Réservation
              </h2>
              {reservation ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Période</span>
                    <span className="text-neutral-900">
                      {formatDate(reservation.startDate)} – {formatDate(reservation.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Signature</span>
                    <span className="text-neutral-900">
                      {reservation.signedAt
                        ? formatDate(reservation.signedAt)
                        : 'Non signée'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Statut</span>
                    <Badge variant={reservation.status === 'SIGNED' ? 'success' : 'warning'}>
                      {reservation.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Aucune réservation enregistrée
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-brand-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">
                Acte de vente
              </h2>
              {salesContract ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Signature acte</span>
                    <span className="text-neutral-900">
                      {salesContract.signedAt
                        ? formatDate(salesContract.signedAt)
                        : 'Non signé'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Entrée en vigueur</span>
                    <span className="text-neutral-900">
                      {salesContract.effectiveAt
                        ? formatDate(salesContract.effectiveAt)
                        : 'Non renseignée'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Aucun contrat de vente encore attaché
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {salesContract && (
        <Card className="bg-neutral-50">
          <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
            Mettre à jour les dates de signature
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">
                Date signature réservation
              </label>
              <input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">
                Date signature acte
              </label>
              <input
                type="date"
                value={actDate}
                onChange={(e) => setActDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleSaveSignatures}
              disabled={saving}
              size="sm"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les dates'}
            </Button>
          </div>
        </Card>
      )}

      {salesContract && (
        <Card>
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
            Notaire & Documents
          </h2>
          <div className="space-y-3 text-sm">
            {salesContract.document && (
              <div>
                <span className="text-neutral-600">Contrat signé:</span>{' '}
                <a
                  href={salesContract.document.downloadUrl}
                  className="text-brand-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {salesContract.document.name}
                </a>
              </div>
            )}

            {salesContract.notary ? (
              <>
                <div>
                  <span className="text-neutral-600">Statut notaire:</span>{' '}
                  <Badge variant="default">{salesContract.notary.status}</Badge>
                </div>

                {salesContract.notary.notaryName && (
                  <div>
                    <span className="text-neutral-600">Notaire:</span>{' '}
                    <span className="text-neutral-900">
                      {salesContract.notary.notaryName}
                    </span>
                    {salesContract.notary.notaryContact && (
                      <span className="text-neutral-500 ml-2">
                        ({salesContract.notary.notaryContact})
                      </span>
                    )}
                  </div>
                )}

                {salesContract.notary.lastAct && (
                  <div>
                    <span className="text-neutral-600">Dernière version acte:</span>{' '}
                    <a
                      href={salesContract.notary.lastAct.downloadUrl}
                      className="text-brand-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {salesContract.notary.lastAct.name}
                    </a>
                  </div>
                )}

                {salesContract.notary.lastAppointment && (
                  <div>
                    <span className="text-neutral-600">Dernier RDV signature:</span>{' '}
                    <span className="text-neutral-900">
                      {formatDate(salesContract.notary.lastAppointment.date)}
                    </span>
                    {salesContract.notary.lastAppointment.location && (
                      <span className="text-neutral-500 ml-2">
                        · {salesContract.notary.lastAppointment.location}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-neutral-500">
                Aucun dossier notaire encore créé pour ce lot
              </p>
            )}

            {buyerFile && (
              <div className="pt-3 border-t">
                <span className="text-neutral-600">Dossier acheteur:</span>{' '}
                <Badge variant="default">{buyerFile.status}</Badge>
                {buyerFile.notaryName && (
                  <span className="text-neutral-500 ml-2">
                    · {buyerFile.notaryName}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
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
