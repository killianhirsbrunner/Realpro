import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatCHF } from '../../lib/utils/format';

interface BuyerChoicesData {
  categories: Array<{
    id: string;
    name: string;
    options: Array<{
      id: string;
      name: string;
      description: string | null;
      extra_price: number;
      is_selected: boolean;
      is_standard: boolean;
    }>;
  }>;
  change_requests: Array<{
    id: string;
    description: string;
    status: string;
    extra_price: number | null;
  }>;
}

export function BuyerChoices() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerChoicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerId) {
      fetchChoices(buyerId);
    }
  }, [buyerId]);

  async function fetchChoices(id: string) {
    try {
      setLoading(true);
      setError(null);

      // TODO: Fetch material categories and buyer choices
      // For now, return empty data
      setData({
        categories: [],
        change_requests: [],
      });
    } catch (err: any) {
      console.error('Error fetching choices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={() => fetchChoices(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { categories, change_requests } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Mes choix & modifications
        </h1>
        <p className="text-sm text-gray-500">
          Visualisez vos choix de finitions et le suivi de vos demandes
          spécifiques.
        </p>
      </header>

      {/* Choices */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Choix</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            Les choix n'ont pas encore été ouverts pour ce projet. Vous serez
            informé dès que la sélection des matériaux sera disponible.
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        opt.is_selected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{opt.name}</p>
                        <span className="text-xs text-gray-600">
                          {opt.is_standard
                            ? 'Inclus'
                            : `+ ${formatCHF(opt.extra_price)}`}
                        </span>
                      </div>
                      {opt.description && (
                        <p className="mt-1 text-xs text-gray-500">
                          {opt.description}
                        </p>
                      )}
                      {opt.is_selected && (
                        <p className="mt-2 text-xs font-medium text-emerald-700">
                          Choix sélectionné
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modification Requests */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Demandes de modifications
          </h2>
          <button className="rounded-full border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Nouvelle demande
          </button>
        </div>

        {change_requests.length === 0 ? (
          <p className="text-sm text-gray-500">
            Vous n'avez encore soumis aucune demande de modification.
          </p>
        ) : (
          <div className="space-y-2">
            {change_requests.map((cr) => (
              <div
                key={cr.id}
                className="rounded-2xl border bg-white px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{cr.description}</p>
                  <ChangeRequestStatusPill status={cr.status} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {cr.extra_price != null
                    ? `Impact estimé : ${formatCHF(cr.extra_price)}`
                    : 'Impact financier en cours d\'estimation.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ChangeRequestStatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let styles = 'bg-gray-100 text-gray-700';

  if (s === 'REQUESTED' || s === 'PENDING') {
    label = 'En cours d\'étude';
    styles = 'bg-slate-50 text-slate-700';
  } else if (s === 'UNDER_REVIEW') {
    label = 'En examen';
    styles = 'bg-amber-50 text-amber-700';
  } else if (s === 'APPROVED') {
    label = 'Acceptée';
    styles = 'bg-emerald-50 text-emerald-700';
  } else if (s === 'REJECTED') {
    label = 'Refusée';
    styles = 'bg-red-50 text-red-700';
  } else if (s === 'COMPLETED') {
    label = 'Complétée';
    styles = 'bg-emerald-50 text-emerald-700';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
