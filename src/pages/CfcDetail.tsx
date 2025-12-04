import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { useCFCDetail } from '../hooks/useCFC';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CfcProgressCard } from '../components/cfc/CfcProgressCard';
import { CfcContractsCard } from '../components/cfc/CfcContractsCard';
import { CfcInvoicesCard } from '../components/cfc/CfcInvoicesCard';

export function CfcDetail() {
  const { projectId, cfcId } = useParams<{ projectId: string; cfcId: string }>();
  const { cfcDetail, loading, error } = useCFCDetail(cfcId);

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

  if (error || !cfcDetail) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Poste CFC non trouvé'}</p>
        </div>
      </div>
    );
  }

  const mockContracts = [
    {
      id: '1',
      company_name: 'Entreprise Générale SA',
      amount: 450000,
      status: 'signed',
      date_signed: '2024-01-15',
    },
    {
      id: '2',
      company_name: 'Sous-traitant Maçonnerie',
      amount: 125000,
      status: 'pending',
    },
  ];

  const mockInvoices = [
    {
      id: '1',
      label: 'Facture #2024-001 - Acompte',
      amount: 135000,
      status: 'paid',
      date_issued: '2024-02-01',
      date_due: '2024-02-28',
    },
    {
      id: '2',
      label: 'Facture #2024-002 - Situation',
      amount: 180000,
      status: 'pending',
      date_issued: '2024-03-01',
      date_due: '2024-03-28',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/cfc`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au budget CFC
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900">
            <DollarSign className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                CFC {cfcDetail.cfc_number}
              </h1>
              <span className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {cfcDetail.cfc_number}
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {cfcDetail.label}
            </p>
          </div>
        </div>
      </div>

      <CfcProgressCard cfc={cfcDetail} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CfcContractsCard contracts={mockContracts} />
        <CfcInvoicesCard invoices={mockInvoices} />
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
        <p className="text-sm text-brand-800 dark:text-brand-200">
          <strong>Note:</strong> Les engagements proviennent des adjudications de soumissions et des contrats
          signés avec les entreprises générales et sous-traitants. Les factures sont liées aux situations de
          travaux et acomptes validés.
        </p>
      </div>
    </div>
  );
}
