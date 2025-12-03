import { useState } from 'react';
import { FileText, Plus, Calendar, Download, X } from 'lucide-react';
import { useBrokerSalesContracts, createSalesContract, updateSalesContract, type SalesContractDto } from '../hooks/useBrokers';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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

function CreateSalesContractModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  lotId,
  buyerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: string;
  lotId?: string;
  buyerId?: string;
}) {
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    lotId: lotId || '',
    buyerId: buyerId || '',
    signedAt: '',
    effectiveAt: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createSalesContract(
      formData.projectId,
      formData.lotId,
      formData.buyerId,
      formData.signedAt || null,
      formData.effectiveAt || null,
      null,
      formData.notes || null
    );

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
      <Card className="w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">Créer un contrat de vente</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Projet *
            </label>
            <Input
              type="text"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
              disabled={!!projectId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Lot *
            </label>
            <Input
              type="text"
              value={formData.lotId}
              onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
              required
              disabled={!!lotId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Acheteur *
            </label>
            <Input
              type="text"
              value={formData.buyerId}
              onChange={(e) => setFormData({ ...formData, buyerId: e.target.value })}
              required
              disabled={!!buyerId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de signature
            </label>
            <Input
              type="datetime-local"
              value={formData.signedAt}
              onChange={(e) => setFormData({ ...formData, signedAt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'effet
            </label>
            <Input
              type="datetime-local"
              value={formData.effectiveAt}
              onChange={(e) => setFormData({ ...formData, effectiveAt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le contrat'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function EditSignatureDateModal({
  contract,
  isOpen,
  onClose,
  onSuccess,
}: {
  contract: SalesContractDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [signedAt, setSignedAt] = useState(
    contract.signed_at ? new Date(contract.signed_at).toISOString().slice(0, 16) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateSalesContract(contract.id, {
      signed_at: signedAt || null,
    });

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
          <h2 className="text-xl font-bold text-gray-900">Modifier la date de signature</h2>
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
              Lot: <span className="font-medium">{contract.lot.code}</span>
              <br />
              Acheteur: <span className="font-medium">
                {contract.buyer.first_name} {contract.buyer.last_name}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de signature
            </label>
            <Input
              type="datetime-local"
              value={signedAt}
              onChange={(e) => setSignedAt(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function BrokerSalesContracts() {
  const { data: contracts, loading, refetch } = useBrokerSalesContracts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<SalesContractDto | null>(null);

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contrats de vente</h1>
            <p className="mt-2 text-gray-600">
              Gérez les contrats de vente (actes notariés) pour vos projets
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Nouveau contrat
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">Chargement des contrats...</div>
          </Card>
        ) : !contracts || contracts.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun contrat de vente</h3>
            <p className="mt-2 text-gray-600">
              Commencez par créer votre premier contrat de vente.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
              <Plus className="h-5 w-5 mr-2" />
              Créer un contrat
            </Button>
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
                      Projet
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date signature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date effet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Document
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">{contract.lot.code}</div>
                        <div className="text-sm text-gray-500">{contract.lot.type}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {contract.buyer.first_name} {contract.buyer.last_name}
                        </div>
                        {contract.buyer.email && (
                          <div className="text-sm text-gray-500">{contract.buyer.email}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{contract.project.name}</div>
                        <div className="text-sm text-gray-500">{contract.project.code}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(contract.lot.price_total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {contract.signed_at ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-900">
                              {formatDate(contract.signed_at)}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="warning">Non signé</Badge>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(contract.effective_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {contract.document ? (
                          <a
                            href={contract.document.file_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4" />
                            {contract.document.name}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">Aucun document</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingContract(contract)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Dates
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <CreateSalesContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {editingContract && (
        <EditSignatureDateModal
          contract={editingContract}
          isOpen={true}
          onClose={() => setEditingContract(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
