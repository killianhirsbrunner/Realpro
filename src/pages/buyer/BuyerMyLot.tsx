import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Home } from 'lucide-react';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatCHF, formatDateCH, formatSurface } from '../../lib/utils/format';
import { getStatusLabel } from '../../lib/constants/status-labels';

interface BuyerOverviewData {
  buyer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    city: string;
    canton: string;
    expected_delivery: string;
  };
  lot: {
    id: string;
    lot_number: string;
    type: string;
    floor: number;
    rooms: number;
    surface_habitable: number;
    surface_ppe: number;
    price_vat: number;
    status: string;
  };
  buyer_file: {
    status: string;
  };
  sale: {
    contract_signed_at: string | null;
    reservation_signed_at: string | null;
    sale_type: string;
  };
}

export function BuyerMyLot() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerId) {
      fetchBuyerOverview(buyerId);
    }
  }, [buyerId]);

  async function fetchBuyerOverview(id: string) {
    try {
      setLoading(true);
      setError(null);

      const { data: buyer, error: buyerError } = await supabase
        .from('buyers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          projects (
            id,
            name,
            city,
            canton,
            expected_delivery
          ),
          lots (
            id,
            lot_number,
            type,
            floor,
            rooms,
            surface_habitable,
            surface_ppe,
            price_vat,
            status
          ),
          buyer_files (
            status
          ),
          sales_contracts (
            contract_signed_at,
            reservation_signed_at,
            sale_type
          )
        `)
        .eq('id', id)
        .single();

      if (buyerError) throw buyerError;

      setData({
        buyer: {
          id: buyer.id,
          first_name: buyer.first_name,
          last_name: buyer.last_name,
          email: buyer.email || '',
        },
        project: buyer.projects || {},
        lot: buyer.lots || {},
        buyer_file: buyer.buyer_files?.[0] || { status: 'INCOMPLETE' },
        sale: buyer.sales_contracts?.[0] || {
          contract_signed_at: null,
          reservation_signed_at: null,
          sale_type: 'PPE',
        },
      });
    } catch (err: any) {
      console.error('Error fetching buyer overview:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={() => fetchBuyerOverview(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { buyer, project, lot, sale } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Espace acquéreur
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Bonjour {buyer.first_name} {buyer.last_name}
        </h1>
        <p className="text-sm text-gray-500">
          Projet : {project.name}
          {project.city ? ` · ${project.city}` : ''}
          {project.canton ? ` (${project.canton})` : ''}
        </p>
      </header>

      {/* Lot Card */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Votre lot</h2>
        <div className="rounded-2xl border bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Appartement {lot.lot_number}
              </p>
              <p className="text-sm text-gray-500">
                {lot.rooms} pièces · {formatSurface(lot.surface_habitable)}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                lot.status === 'SOLD'
                  ? 'bg-emerald-50 text-emerald-700'
                  : lot.status === 'RESERVED'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              {getStatusLabel('lot', lot.status)}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Type de vente
              </p>
              <p className="mt-1 text-gray-900">{sale.sale_type || 'PPE'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Prix total
              </p>
              <p className="mt-1 text-gray-900">{formatCHF(lot.price_vat)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Remise des clés prévue
              </p>
              <p className="mt-1 text-gray-900">
                {project.expected_delivery
                  ? formatDateCH(project.expected_delivery)
                  : 'À préciser'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Status */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">
          Situation de votre contrat
        </h2>
        <div className="rounded-2xl border bg-white px-4 py-4 space-y-3">
          {sale.contract_signed_at ? (
            <>
              <p className="text-sm text-gray-900">
                Votre acte de vente a été signé le{' '}
                <span className="font-semibold">
                  {formatDateCH(sale.contract_signed_at)}
                </span>
                .
              </p>
              <p className="text-sm text-gray-500">
                Nous vous informerons des prochaines étapes et des échéances de
                paiement au fur et à mesure.
              </p>
            </>
          ) : sale.reservation_signed_at ? (
            <>
              <p className="text-sm text-gray-900">
                Votre réservation a été signée le{' '}
                <span className="font-semibold">
                  {formatDateCH(sale.reservation_signed_at)}
                </span>
                .
              </p>
              <p className="text-sm text-gray-500">
                Le dossier est en cours de finalisation pour la signature de
                l'acte chez le notaire.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-900">
                Votre dossier est en cours de préparation.
              </p>
              <p className="text-sm text-gray-500">
                Vous serez informé dès que votre réservation ou votre acte sera
                prêt pour signature.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Navigation Links */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">
          Accéder à vos informations
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={`/buyers/${buyer.id}/progress`}
            className="block rounded-2xl border bg-white px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">
              Avancement du projet
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Suivez l'avancement du chantier et les grandes étapes jusqu'à la
              remise des clés.
            </p>
          </a>

          <a
            href={`/buyers/${buyer.id}/documents`}
            className="block rounded-2xl border bg-white px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">Mes documents</p>
            <p className="mt-1 text-xs text-gray-500">
              Consultez et téléchargez votre contrat, vos plans et vos avenants.
            </p>
          </a>

          <a
            href={`/buyers/${buyer.id}/choices`}
            className="block rounded-2xl border bg-white px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">
              Mes choix & modifications
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Choisissez vos finitions et suivez vos demandes de modifications.
            </p>
          </a>

          <a
            href={`/buyers/${buyer.id}/payments`}
            className="block rounded-2xl border bg-white px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">Mes paiements</p>
            <p className="mt-1 text-xs text-gray-500">
              Visualisez les échéances, les montants déjà payés et le solde
              restant.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
