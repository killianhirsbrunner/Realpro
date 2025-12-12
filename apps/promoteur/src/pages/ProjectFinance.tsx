import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Skeleton,
  EmptyState,
  Progress,
  Input,
} from '@realpro/ui';
import {
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  INVOICE_STATUS_LABELS,
  type InvoiceStatus,
  formatCurrency,
} from '@realpro/entities';
import { useProject } from '@/features/projects/hooks/useProjects';
import { useProjectFinance, useInvoices } from '@/features/finance/hooks/useFinance';

const STATUS_VARIANT: Record<InvoiceStatus, 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
  DRAFT: 'neutral',
  PENDING: 'warning',
  PARTIAL: 'info',
  PAID: 'success',
  LATE: 'error',
  CANCELLED: 'neutral',
};

export function ProjectFinancePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | null>(null);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: financeData, isLoading: financeLoading, error: financeError } = useProjectFinance(projectId);
  const { data: invoices, isLoading: invoicesLoading } = useInvoices(projectId, {
    status: statusFilter || undefined,
    search: searchQuery || undefined,
  });

  const isLoading = projectLoading || financeLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // Error state
  if (financeError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Erreur de chargement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
          Impossible de charger les données financières.
        </p>
      </div>
    );
  }

  const summary = financeData?.summary;
  const buyers = financeData?.buyers || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {project?.name || 'Retour au projet'}
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Finances
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Suivi des paiements et factures
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle facture
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Total facturé</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                    {formatCurrency(summary.totalInvoiced)}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Total encaissé</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(summary.totalPaid)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {summary.percentPaid.toFixed(1)}% du total
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Reste à encaisser</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {formatCurrency(summary.totalDue)}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">En retard</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {formatCurrency(summary.totalLate)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {summary.percentLate.toFixed(1)}% du total
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {summary && summary.totalInvoiced > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Progression des encaissements
              </span>
              <span className="text-sm font-bold text-primary-600">
                {summary.percentPaid.toFixed(1)}%
              </span>
            </div>
            <Progress value={summary.percentPaid} size="lg" />
          </CardContent>
        </Card>
      )}

      {/* Buyers Finance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            Situation par acheteur
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          {buyers.length === 0 ? (
            <EmptyState
              icon={<DollarSign className="w-12 h-12" />}
              title="Aucune donnée financière"
              description="Les données financières apparaîtront lorsque des factures seront créées."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">
                      Acheteur
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">
                      Lot
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-neutral-500">
                      Facturé
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-neutral-500">
                      Payé
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-neutral-500">
                      Reste
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-neutral-500">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {buyers
                    .filter(
                      (buyer) =>
                        !searchQuery ||
                        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        buyer.lot_code?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((buyer) => (
                      <tr
                        key={buyer.id}
                        className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      >
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {buyer.name}
                            </p>
                            {buyer.email && (
                              <p className="text-xs text-neutral-500">{buyer.email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-neutral-600 dark:text-neutral-300">
                          {buyer.lot_code || '-'}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(buyer.invoiced)}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-green-600">
                          {formatCurrency(buyer.paid)}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-amber-600">
                          {formatCurrency(buyer.remaining)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge
                            variant={
                              buyer.status === 'paid'
                                ? 'success'
                                : buyer.status === 'late'
                                ? 'error'
                                : buyer.status === 'partial'
                                ? 'info'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {buyer.status === 'paid' && 'Soldé'}
                            {buyer.status === 'partial' && 'Partiel'}
                            {buyer.status === 'pending' && 'En attente'}
                            {buyer.status === 'late' && 'En retard'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            Dernières factures
          </h3>
          <div className="flex gap-2">
            {(['PENDING', 'PARTIAL', 'LATE', 'PAID'] as InvoiceStatus[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              >
                {INVOICE_STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <EmptyState
              icon={<DollarSign className="w-12 h-12" />}
              title="Aucune facture"
              description="Créez votre première facture pour commencer le suivi financier."
              action={
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Nouvelle facture
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">
                      N° / Libellé
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500">
                      Acheteur
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-neutral-500">
                      Montant
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-neutral-500">
                      Payé
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-neutral-500">
                      Échéance
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-neutral-500">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 10).map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                    >
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {invoice.invoice_number || invoice.label}
                          </p>
                          {invoice.invoice_number && (
                            <p className="text-xs text-neutral-500">{invoice.label}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-neutral-700 dark:text-neutral-300">
                            {invoice.buyer_name}
                          </p>
                          {invoice.lot_code && (
                            <p className="text-xs text-neutral-500">{invoice.lot_code}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-neutral-900 dark:text-white">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-green-600">
                        {formatCurrency(invoice.amount_paid)}
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString('fr-CH')
                          : '-'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={STATUS_VARIANT[invoice.status]} size="sm">
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
