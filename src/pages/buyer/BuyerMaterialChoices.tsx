import { useEffect, useState } from 'react';
import { Package, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

type OptionDto = {
  id: string;
  name: string;
  description?: string | null;
  extraPrice: number;
  isStandard: boolean;
  isSelected: boolean;
};

type CategoryDto = {
  id: string;
  name: string;
  options: OptionDto[];
};

type ChangeRequestDto = {
  id: string;
  description: string;
  status: string;
  extraPrice?: number | null;
  createdAt: string;
};

type ChoicesResponse = {
  lot: {
    id: string;
    lotNumber: string;
    roomsLabel?: string | null;
  };
  categories: CategoryDto[];
  changeRequests: ChangeRequestDto[];
};

export function BuyerMaterialChoices() {
  const [data, setData] = useState<ChoicesResponse | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newChangeRequest, setNewChangeRequest] = useState('');
  const [showChangeRequestForm, setShowChangeRequestForm] = useState(false);

  const buyerId = '40000000-0000-0000-0000-000000000001';
  const lotId = '30000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadData();
  }, [buyerId, lotId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/materials`;

      const response = await fetch(`${apiUrl}/buyers/${buyerId}/lots/${lotId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des choix matériaux');
      }

      const json: ChoicesResponse = await response.json();
      setData(json);

      const currentSelected = new Set<string>();
      json.categories.forEach((c) =>
        c.options.forEach((o) => {
          if (o.isSelected) currentSelected.add(o.id);
        })
      );
      setSelected(currentSelected);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les choix matériaux');
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    const category = data?.categories.find(c => c.id === categoryId);
    if (!category) return;

    setSelected((prev) => {
      const next = new Set(prev);

      category.options.forEach(opt => {
        if (opt.id === optionId) {
          if (next.has(optionId)) {
            next.delete(optionId);
          } else {
            next.add(optionId);
          }
        }
      });

      return next;
    });
  };

  const handleSaveChoices = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/materials`;

      const response = await fetch(`${apiUrl}/buyers/${buyerId}/choices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotId,
          selections: Array.from(selected).map((id) => ({ optionId: id })),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des choix');
      }

      await loadData();
      setMessage('Vos choix ont été enregistrés avec succès');
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Impossible de sauvegarder vos choix');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitChangeRequest = async () => {
    if (!newChangeRequest.trim()) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/materials`;

      const response = await fetch(`${apiUrl}/buyers/${buyerId}/change-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotId,
          description: newChangeRequest,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la demande');
      }

      setNewChangeRequest('');
      setShowChangeRequestForm(false);
      await loadData();
      setMessage('Votre demande a été envoyée avec succès');
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Impossible d\'envoyer votre demande');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    if (!data) return 0;
    let total = 0;
    data.categories.forEach((cat) => {
      cat.options.forEach((opt) => {
        if (selected.has(opt.id) && !opt.isStandard) {
          total += opt.extraPrice;
        }
      });
    });
    return total;
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-sm text-neutral-500">Données introuvables</p>
      </div>
    );
  }

  const { lot, categories, changeRequests } = data;
  const totalExtra = calculateTotal();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          Espace acquéreur · Choix matériaux
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
          Sélectionnez vos finitions et matériaux pour personnaliser votre logement
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

      {message && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm">{message}</p>
          </div>
        </Card>
      )}

      {categories.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Catalogue en préparation
            </h3>
            <p className="text-sm text-neutral-500">
              Les choix de matériaux ne sont pas encore disponibles pour ce projet.
              Vous serez notifié dès leur ouverture.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <section className="space-y-4">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-brand-600" />
                  <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                    {cat.name}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.options.map((opt) => {
                    const isChecked = selected.has(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 transition-all ${
                          isChecked
                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900 text-sm">
                              {opt.name}
                            </p>
                            {opt.description && (
                              <p className="text-xs text-neutral-500 mt-1">
                                {opt.description}
                              </p>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                            checked={isChecked}
                            onChange={() => toggleOption(cat.id, opt.id)}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {opt.isStandard ? (
                            <Badge variant="default">Standard inclus</Badge>
                          ) : (
                            <>
                              <Badge variant="warning">Option avec supplément</Badge>
                              <span className="font-medium text-neutral-900">
                                + {formatCurrency(opt.extraPrice)}
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </Card>
            ))}
          </section>

          <Card className="bg-neutral-50 border-neutral-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Total des options
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Supplément au prix de base
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-neutral-900 tabular-nums">
                  {formatCurrency(totalExtra)}
                </p>
                <p className="text-xs text-neutral-500">
                  {Array.from(selected).length} option(s) sélectionnée(s)
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Button
                onClick={handleSaveChoices}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer mes choix'}
              </Button>
            </div>
          </Card>
        </>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neutral-600" />
            <h2 className="text-base font-semibold text-neutral-900">
              Modifications spéciales
            </h2>
          </div>
          {!showChangeRequestForm && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChangeRequestForm(true)}
            >
              Nouvelle demande
            </Button>
          )}
        </div>

        {showChangeRequestForm && (
          <Card className="bg-brand-50 border-brand-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">
              Demander une modification spéciale
            </h3>
            <textarea
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              rows={4}
              placeholder="Décrivez la modification souhaitée (par ex. déplacer une cloison, modifier un emplacement de prise, changer un type de matériau…)"
              value={newChangeRequest}
              onChange={(e) => setNewChangeRequest(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleSubmitChangeRequest}
                disabled={saving || !newChangeRequest.trim()}
                size="sm"
              >
                Envoyer la demande
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowChangeRequestForm(false);
                  setNewChangeRequest('');
                }}
              >
                Annuler
              </Button>
            </div>
          </Card>
        )}

        {changeRequests.length === 0 ? (
          <Card>
            <p className="text-sm text-neutral-500">
              Aucune demande de modification spéciale pour le moment
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {changeRequests.map((cr) => (
              <Card key={cr.id}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-neutral-900 flex-1">
                    {cr.description}
                  </p>
                  <ChangeRequestStatusBadge status={cr.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Demandé le {formatDate(cr.createdAt)}</span>
                  {cr.extraPrice != null && (
                    <span className="font-medium text-neutral-900">
                      Impact: {formatCurrency(cr.extraPrice)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ChangeRequestStatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let variant: 'default' | 'success' | 'warning' | 'danger' = 'default';

  if (s === 'REQUESTED' || s === 'PENDING') {
    label = 'En attente';
    variant = 'warning';
  } else if (s === 'UNDER_REVIEW') {
    label = 'En examen';
    variant = 'warning';
  } else if (s === 'APPROVED') {
    label = 'Acceptée';
    variant = 'success';
  } else if (s === 'REJECTED') {
    label = 'Refusée';
    variant = 'danger';
  } else if (s === 'COMPLETED') {
    label = 'Complétée';
    variant = 'success';
  }

  return <Badge variant={variant}>{label}</Badge>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
