import { Link } from 'react-router-dom';
import {
  Download,
  FileText,
  ArrowRight,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useOrganizationDashboard } from '../hooks/useOrganizationData';

export default function BillingHistory() {
  const { data, loading } = useOrganizationDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const invoices = data?.invoices || [];
  const organization = data?.organization;

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'OVERDUE':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge variant="success">Payée</Badge>;
      case 'PENDING':
        return <Badge variant="warning">En attente</Badge>;
      case 'OVERDUE':
        return <Badge variant="danger">En retard</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Téléchargement facture:', invoiceId);
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <header className="space-y-3">
          <Link
            to="/company"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour à l'entreprise
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Facturation
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Historique des factures et paiements de votre abonnement RealPro
            </p>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-950/30">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                Total payé
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              CHF {totalPaid.toLocaleString('fr-CH')}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                En attente
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              CHF {totalPending.toLocaleString('fr-CH')}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                Total factures
              </p>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {invoices.length}
            </p>
          </Card>
        </div>

        {organization && (
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Adresse de facturation
            </h3>
            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <p className="font-medium">{organization.name}</p>
              {organization.address && <p>{organization.address}</p>}
              {(organization.postal_code || organization.city) && (
                <p>
                  {organization.postal_code} {organization.city}
                </p>
              )}
              {organization.country && <p>{organization.country}</p>}
              {organization.vat_number && (
                <p className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  N° TVA: {organization.vat_number}
                </p>
              )}
            </div>
            <Link
              to="/settings/organization"
              className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4"
            >
              Modifier l'adresse
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Historique des factures
          </h2>

          {invoices.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Aucune facture disponible pour le moment
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            Facture {invoice.invoice_number}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(invoice.date).toLocaleDateString('fr-CH', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            <span>Datatrans</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          CHF {invoice.amount.toLocaleString('fr-CH')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {invoice.pdf_url && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(invoice.pdf_url, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Card className="bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-1">
                QR-Factures suisses
              </h4>
              <p className="text-sm text-brand-700 dark:text-brand-300 mb-3">
                Toutes nos factures incluent un QR-code conforme à la norme ISO 20022 pour faciliter
                vos paiements. Les factures de projets (acomptes, EG, etc.) sont générées avec QR-facture,
                tandis que les abonnements RealPro sont payés via Datatrans.
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-600 dark:text-brand-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>ISO 20022</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>E-Banking compatible</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Paiement mobile</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
