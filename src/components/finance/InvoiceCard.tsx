import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileText, Download, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Invoice } from '../../hooks/useFinance';

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'partial':
        return 'orange';
      case 'late':
        return 'red';
      case 'pending':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'partial':
        return 'Partiel';
      case 'late':
        return 'En retard';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const getInvoiceTypeLabel = (type: string) => {
    switch (type) {
      case 'reservation':
        return 'Acompte réservation';
      case 'contract':
        return 'Acompte contrat';
      case 'construction':
        return 'Acompte travaux';
      case 'delivery':
        return 'Solde livraison';
      default:
        return type;
    }
  };

  const percentPaid = invoice.amount > 0
    ? (invoice.amount_paid / invoice.amount) * 100
    : 0;

  const handleDownloadQR = () => {
    console.log('Téléchargement QR-facture:', invoice.id);
  };

  const handlePayOnline = () => {
    console.log('Paiement en ligne:', invoice.id);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {invoice.label}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {getInvoiceTypeLabel(invoice.invoice_type)}
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor(invoice.status) as any}>
            {getStatusLabel(invoice.status)}
          </Badge>
        </div>

        {invoice.invoice_number && (
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            N° {invoice.invoice_number}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Montant</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {invoice.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Payé</p>
            <p className="text-lg font-semibold text-green-600">
              CHF {invoice.amount_paid.toLocaleString()}
            </p>
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">Progression</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {percentPaid.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${Math.min(percentPaid, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          {invoice.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-CH')}</span>
            </div>
          )}
          {invoice.payment_date && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Payé le {new Date(invoice.payment_date).toLocaleDateString('fr-CH')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button variant="outline" onClick={handleDownloadQR}>
            <Download className="h-4 w-4 mr-2" />
            QR-facture
          </Button>

          {invoice.status !== 'paid' && (
            <Button variant="primary" onClick={handlePayOnline}>
              <CreditCard className="h-4 w-4 mr-2" />
              Payer en ligne
            </Button>
          )}
        </div>

        {invoice.qr_reference && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Référence QR
            </p>
            <p className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {invoice.qr_reference}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
