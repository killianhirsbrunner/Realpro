import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Calendar, Building2, User, Briefcase } from 'lucide-react';
import { getSalesContract, updateSalesContract, type SalesContractDto } from '../hooks/useBrokers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

function getNotaryFileStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
    OPEN: 'warning',
    IN_PROGRESS: 'info',
    READY: 'info',
    SIGNED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'error',
  };

  const labels: Record<string, string> = {
    OPEN: 'Ouvert',
    IN_PROGRESS: 'En cours',
    READY: 'Prêt',
    SIGNED: 'Signé',
    COMPLETED: 'Complété',
    CANCELLED: 'Annulé',
  };

  return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
}

export function BrokerSalesContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contract, setContract] = useState<SalesContractDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signedAt, setSignedAt] = useState<string>('');
  const [effectiveAt, setEffectiveAt] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setError('ID du contrat manquant');
      setLoading(false);
      return;
    }

    setLoading(true);
    getSalesContract(id)
      .then((result) => {
        if (result.success && result.data) {
          setContract(result.data);
          setSignedAt(result.data.signed_at ? result.data.signed_at.slice(0, 10) : '');
          setEffectiveAt(result.data.effective_at ? result.data.effective_at.slice(0, 10) : '');
          setDocumentId(result.data.document_id || '');
          setNotes(result.data.notes || '');
          setError(null);
        } else {
          setError(result.error || 'Contrat de vente introuvable');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSaving(true);

    const result = await updateSalesContract(id, {
      signed_at: signedAt || null,
      effective_at: effectiveAt || null,
      document_id: documentId || null,
      notes: notes || null,
    });

    setSaving(false);

    if (result.success) {
      getSalesContract(id).then((refreshResult) => {
        if (refreshResult.success && refreshResult.data) {
          setContract(refreshResult.data);
        }
      });
    } else {
      setError(result.error || 'Erreur lors de la mise à jour du contrat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement du contrat...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Contrat introuvable</h3>
              <p className="mt-1 text-sm text-red-700">
                {error || 'Ce contrat de vente n\'existe pas ou vous n\'avez pas accès à celui-ci.'}
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => navigate('/broker/sales-contracts')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux contrats
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/broker/sales-contracts')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux contrats
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contrat de vente – Lot {contract.lot.code}
              </h1>
              <p className="mt-2 text-gray-600">{contract.project.name}</p>
            </div>
            {contract.signed_at && (
              <Badge variant="success" className="text-base px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Signé le {formatDate(contract.signed_at)}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50 p-4">
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
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  Informations du contrat
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  {contract.document && (
                    <a
                      href={contract.document.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800"
                    >
                      <FileText className="h-4 w-4" />
                      {contract.document.name}
                    </a>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    placeholder="Notes internes..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                Détails du lot
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Code</dt>
                  <dd className="font-medium text-gray-900">{contract.lot.code}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium text-gray-900">{contract.lot.type}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Prix total</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(contract.lot.price_total)}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Acheteur
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Nom</dt>
                  <dd className="font-medium text-gray-900">
                    {contract.buyer.first_name} {contract.buyer.last_name}
                  </dd>
                </div>
                {contract.buyer.email && (
                  <div>
                    <dt className="text-gray-600">Email</dt>
                    <dd className="font-medium text-gray-900">{contract.buyer.email}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {contract.notary_file && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  Dossier notaire
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-600">Statut</dt>
                    <dd className="mt-1">
                      {getNotaryFileStatusBadge(contract.notary_file.status)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">ID</dt>
                    <dd className="font-mono text-xs text-gray-900 break-all">
                      {contract.notary_file.id}
                    </dd>
                  </div>
                </dl>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => navigate(`/notary/files/${contract.notary_file?.id}`)}
                >
                  Voir le dossier notaire
                </Button>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Métadonnées</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Créé le</dt>
                  <dd className="font-medium text-gray-900">
                    {formatDateTime(contract.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-600">Modifié le</dt>
                  <dd className="font-medium text-gray-900">
                    {formatDateTime(contract.updated_at)}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
