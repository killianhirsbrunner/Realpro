import { QrCode, Download, Printer, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRInvoiceCardProps {
  qrCodeUrl?: string;
  iban?: string;
  reference?: string;
  amount?: number;
  beneficiary?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export function QRInvoiceCard({
  qrCodeUrl,
  iban = 'CH44 3000 0000 0000 0000 0',
  reference,
  amount,
  beneficiary
}: QRInvoiceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              QR-Facture suisse
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Paiement compatible avec tous les systèmes bancaires suisses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64 object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-white flex items-center justify-center rounded-lg">
              <QrCode className="w-32 h-32 text-neutral-400 dark:text-neutral-600" />
            </div>
          )}

          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-4 max-w-xs">
            Scannez ce QR-code avec votre application bancaire pour effectuer le paiement
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-300 mb-1">
                  QR-facture suisse
                </h4>
                <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
                  Compatible avec toutes les banques suisses. Le paiement est automatiquement enregistré avec la bonne référence.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {amount && (
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Montant
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatCurrency(amount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                IBAN
              </span>
              <span className="text-sm font-mono font-medium text-neutral-900 dark:text-white">
                {iban}
              </span>
            </div>

            {reference && (
              <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Référence
                </span>
                <span className="text-sm font-mono font-medium text-neutral-900 dark:text-white">
                  {reference}
                </span>
              </div>
            )}

            {beneficiary && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Bénéficiaire
                </p>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {beneficiary.name}
                  </p>
                  <p>{beneficiary.address}</p>
                  <p>{beneficiary.postalCode} {beneficiary.city}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Télécharger la QR-facture (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
