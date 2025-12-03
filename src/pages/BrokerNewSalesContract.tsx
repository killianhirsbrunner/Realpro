import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getBuyersForLot, createSalesContract, type BuyerOption } from '../hooks/useBrokers';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function BrokerNewSalesContract() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lotId = searchParams.get('lotId');
  const projectId = searchParams.get('projectId');

  const [buyers, setBuyers] = useState<BuyerOption[]>([]);
  const [buyerId, setBuyerId] = useState<string>('');
  const [signedAt, setSignedAt] = useState<string>('');
  const [effectiveAt, setEffectiveAt] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [loadingBuyers, setLoadingBuyers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lotId) {
      setError('ID du lot manquant');
      setLoadingBuyers(false);
      return;
    }

    setLoadingBuyers(true);
    getBuyersForLot(lotId)
      .then((result) => {
        if (result.success && result.data) {
          setBuyers(result.data);
          if (result.data.length === 1) {
            setBuyerId(result.data[0].id);
          }
        } else {
          setError(result.error || 'Erreur lors du chargement des acheteurs');
        }
      })
      .finally(() => setLoadingBuyers(false));
  }, [lotId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lotId || !projectId) {
      setError('Informations manquantes (lot ou projet)');
      return;
    }

    if (!buyerId) {
      setError('Veuillez sélectionner un acheteur');
      return;
    }

    setSubmitting(true);

    const result = await createSalesContract(
      projectId,
      lotId,
      buyerId,
      signedAt || null,
      effectiveAt || null,
      documentId || null,
      notes || null
    );

    setSubmitting(false);

    if (result.success && result.data) {
      navigate(`/broker/sales-contracts/${result.data.id}`);
    } else {
      setError(result.error || 'Erreur lors de la création du contrat de vente');
    }
  };

  if (!lotId || !projectId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Paramètres manquants</h3>
              <p className="mt-1 text-sm text-red-700">
                Les informations du lot ou du projet sont manquantes. Veuillez revenir à la liste des lots.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => navigate('/broker/lots')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux lots
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau contrat de vente</h1>
          <p className="mt-2 text-gray-600">
            Créez un contrat de vente (acte notarié) pour ce lot. Un dossier acheteur et un dossier notaire seront automatiquement créés.
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Erreur</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acheteur <span className="text-red-500">*</span>
                </label>
                {loadingBuyers ? (
                  <div className="text-sm text-gray-500 py-2">
                    Chargement des acheteurs...
                  </div>
                ) : buyers.length === 0 ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      Aucun acheteur trouvé pour ce projet. Veuillez d'abord créer un acheteur.
                    </p>
                  </div>
                ) : (
                  <select
                    value={buyerId}
                    onChange={(e) => setBuyerId(e.target.value)}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un acheteur...</option>
                    {buyers.map((buyer) => (
                      <option key={buyer.id} value={buyer.id}>
                        {buyer.first_name} {buyer.last_name}
                        {buyer.email && ` (${buyer.email})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de signature
                  </label>
                  <Input
                    type="date"
                    value={signedAt}
                    onChange={(e) => setSignedAt(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Date de signature de l'acte notarié
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'effet
                  </label>
                  <Input
                    type="date"
                    value={effectiveAt}
                    onChange={(e) => setEffectiveAt(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Date à laquelle l'acte prend effet
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID du document (acte signé)
                </label>
                <Input
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="UUID du document"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optionnel : ID du document PDF de l'acte signé (après upload)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Notes internes sur ce contrat de vente..."
                />
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Création automatique
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Un dossier acheteur sera créé automatiquement si nécessaire</li>
                <li>✓ Un dossier notaire sera créé et lié à ce contrat</li>
                <li>✓ Le notaire pourra ensuite accéder au dossier pour finaliser l'acte</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={submitting || loadingBuyers || buyers.length === 0}
              >
                {submitting ? 'Création en cours...' : 'Créer le contrat de vente'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
