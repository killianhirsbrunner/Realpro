import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Wallet, User } from 'lucide-react';
import { useBuyerFinance } from '../hooks/useFinance';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { InvoiceCard } from '../components/finance/InvoiceCard';

export function BuyerFinance() {
  const { projectId, buyerId } = useParams<{ projectId: string; buyerId: string }>();
  const { buyerFinance, loading, error } = useBuyerFinance(buyerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !buyerFinance) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Acheteur non trouvé'}</p>
        </div>
      </div>
    );
  }

  const percentPaid = buyerFinance.totalInvoiced > 0
    ? (buyerFinance.totalPaid / buyerFinance.totalInvoiced) * 100
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/finance`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux finances
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900">
            <Wallet className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Finances - {buyerFinance.name}
              </h1>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Lot {buyerFinance.lotNumber}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Résumé financier
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Prix du lot</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                CHF {buyerFinance.lotPrice.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total facturé</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                CHF {buyerFinance.totalInvoiced.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total payé</p>
              <p className="text-lg font-semibold text-green-600">
                CHF {buyerFinance.totalPaid.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Restant dû</p>
              <p className="text-lg font-semibold text-brand-600">
                CHF {buyerFinance.totalRemaining.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">Progression des paiements</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {percentPaid.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${Math.min(percentPaid, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Factures et acomptes
        </h2>
        {buyerFinance.invoices.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              Aucune facture pour cet acheteur
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {buyerFinance.invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
        <p className="text-sm text-brand-800 dark:text-brand-200">
          <strong>Note:</strong> Les QR-factures suisses permettent un paiement rapide via e-banking.
          Le paiement en ligne via Datatrans est également disponible pour un règlement immédiat par carte.
        </p>
      </div>
    </div>
  );
}
