import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatCHF, formatDateCH } from '../../lib/utils/format';

interface BuyerPaymentsData {
  summary: {
    total_price: number;
    paid: number;
    remaining: number;
  };
  installments: Array<{
    id: string;
    label: string;
    due_date: string | null;
    amount: number;
    status: string;
    invoice_id: string | null;
    invoice_url: string | null;
  }>;
}

export function BuyerPayments() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerPaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerId) {
      fetchPayments(buyerId);
    }
  }, [buyerId]);

  async function fetchPayments(id: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch buyer installments
      const { data: installments, error: installmentsError } = await supabase
        .from('buyer_installments')
        .select(`
          id,
          label,
          due_date,
          amount,
          status,
          invoice_id,
          invoices (file_url)
        `)
        .eq('buyer_id', id)
        .order('installment_number');

      if (installmentsError) throw installmentsError;

      const mappedInstallments = (installments || []).map(inst => ({
        id: inst.id,
        label: inst.label,
        due_date: inst.due_date,
        amount: inst.amount,
        status: inst.status,
        invoice_id: inst.invoice_id,
        invoice_url: inst.invoices?.file_url || null,
      }));

      const totalPrice = mappedInstallments.reduce((sum, i) => sum + i.amount, 0);
      const paid = mappedInstallments
        .filter(i => i.status === 'PAID')
        .reduce((sum, i) => sum + i.amount, 0);

      setData({
        summary: {
          total_price: totalPrice,
          paid,
          remaining: totalPrice - paid,
        },
        installments: mappedInstallments,
      });
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={() => fetchPayments(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { summary, installments } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">Mes paiements</h1>
        <p className="text-sm text-gray-500">
          Récapitulatif de vos échéances, montants payés et solde restant.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Prix total" value={summary.total_price} />
        <SummaryCard label="Déjà payé" value={summary.paid} />
        <SummaryCard label="Reste à payer" value={summary.remaining} />
      </section>

      {/* Installments Table */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Détail des échéances
        </h2>

        {installments.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun échéancier n'a encore été défini pour votre dossier.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Échéance
                  </th>
                  <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Due le
                  </th>
                  <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide text-gray-500">
                    Montant
                  </th>
                  <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Statut
                  </th>
                  <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide text-gray-500">
                    Facture
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {installments.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 align-middle">{i.label}</td>
                    <td className="px-3 py-3 align-middle">
                      {i.due_date ? formatDateCH(i.due_date) : 'À définir'}
                    </td>
                    <td className="px-3 py-3 align-middle text-right font-mono">
                      {formatCHF(i.amount)}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <InstallmentStatusPill status={i.status} />
                    </td>
                    <td className="px-3 py-3 align-middle text-right">
                      {i.invoice_url ? (
                        <a
                          href={i.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                        >
                          <Download className="h-3 w-3" />
                          Télécharger
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-gray-900 tabular-nums">
        {formatCHF(value)}
      </p>
    </div>
  );
}

function InstallmentStatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let styles = 'bg-gray-100 text-gray-700';

  if (s === 'PLANNED' || s === 'PENDING') {
    label = 'À venir';
    styles = 'bg-slate-50 text-slate-700';
  } else if (s === 'INVOICED' || s === 'DUE') {
    label = 'Facturée';
    styles = 'bg-amber-50 text-amber-700';
  } else if (s === 'PAID') {
    label = 'Payée';
    styles = 'bg-emerald-50 text-emerald-700';
  } else if (s === 'OVERDUE') {
    label = 'En retard';
    styles = 'bg-red-50 text-red-700';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
