import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Download, Upload, CheckCircle2, Clock, XCircle, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { SidePanel } from '../components/ui/SidePanel';
import { StatsGrid } from '../components/ui/StatsGrid';
import { Badge } from '../components/ui/Badge';
import { useSubmissions } from '../hooks/useSubmissions';

export default function ProjectSubmissionsNew() {
  const { projectId } = useParams();
  const { submissions, loading } = useSubmissions(projectId);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (submission: any) => {
    setSelectedSubmission(submission);
    setIsPanelOpen(true);
  };

  const pendingCount = submissions.filter((s: any) => s.status === 'PENDING').length;
  const receivedCount = submissions.filter((s: any) => s.status === 'RECEIVED').length;
  const awardedCount = submissions.filter((s: any) => s.status === 'AWARDED').length;
  const rejectedCount = submissions.filter((s: any) => s.status === 'REJECTED').length;

  const stats = [
    {
      label: 'En attente',
      value: pendingCount,
      icon: Clock,
      color: 'warning' as const,
    },
    {
      label: 'Offres reçues',
      value: receivedCount,
      icon: Building2,
      color: 'primary' as const,
    },
    {
      label: 'Adjugées',
      value: awardedCount,
      icon: CheckCircle2,
      color: 'success' as const,
    },
    {
      label: 'Refusées',
      value: rejectedCount,
      icon: XCircle,
      color: 'danger' as const,
    },
  ];

  const columns = [
    {
      key: 'lot_number',
      label: 'Lot',
      render: (value: string) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Catégorie',
      render: (value: string) => <span>{value || '-'}</span>,
    },
    {
      key: 'company_name',
      label: 'Entreprise',
      render: (value: string) => (
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{value || '-'}</span>
      ),
    },
    {
      key: 'deadline',
      label: 'Échéance',
      render: (value: string) => {
        if (!value) return '-';
        const date = new Date(value);
        const isOverdue = date < new Date();
        return (
          <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
            {date.toLocaleDateString('fr-CH')}
          </span>
        );
      },
    },
    {
      key: 'amount',
      label: 'Montant offre',
      render: (value: number, row: any) => {
        if (!value || row.status === 'PENDING') return '-';
        return (
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            CHF {value.toLocaleString('fr-CH')}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => {
        const variants: Record<string, 'success' | 'warning' | 'primary' | 'secondary' | 'danger'> = {
          PENDING: 'warning',
          RECEIVED: 'primary',
          AWARDED: 'success',
          REJECTED: 'danger',
        };
        const labels: Record<string, string> = {
          PENDING: 'En attente',
          RECEIVED: 'Offre reçue',
          AWARDED: 'Adjugée',
          REJECTED: 'Refusée',
        };
        return <Badge variant={variants[value] || 'secondary'}>{labels[value] || value}</Badge>;
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Soumissions & Adjudications
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Gérez les appels d'offres et comparez les soumissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            <Button variant="secondary" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer bordereau
            </Button>

            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle soumission
            </Button>
          </div>
        </div>

        <StatsGrid stats={stats} columns={4} />

        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Tableau comparatif
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Comparez les offres reçues et sélectionnez les meilleures propositions
            </p>
          </div>

          <DataTable
            data={submissions}
            columns={columns}
            onRowClick={handleRowClick}
            selectedRow={selectedSubmission}
            emptyMessage="Aucune soumission trouvée"
          />
        </div>
      </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedSubmission ? `Soumission - ${selectedSubmission.category}` : 'Détail soumission'}
        width="md"
      >
        {selectedSubmission && (
          <div className="p-6 space-y-6">
            <div>
              <Badge
                variant={
                  selectedSubmission.status === 'PENDING'
                    ? 'warning'
                    : selectedSubmission.status === 'RECEIVED'
                    ? 'primary'
                    : selectedSubmission.status === 'AWARDED'
                    ? 'success'
                    : 'danger'
                }
              >
                {selectedSubmission.status === 'PENDING' && 'En attente'}
                {selectedSubmission.status === 'RECEIVED' && 'Offre reçue'}
                {selectedSubmission.status === 'AWARDED' && 'Adjugée'}
                {selectedSubmission.status === 'REJECTED' && 'Refusée'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Catégorie</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedSubmission.category || '-'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Lot</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedSubmission.lot_number || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Entreprise</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedSubmission.company_name || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Date limite</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedSubmission.deadline
                    ? new Date(selectedSubmission.deadline).toLocaleDateString('fr-CH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-'}
                </p>
              </div>

              {selectedSubmission.amount && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Montant de l'offre</label>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {selectedSubmission.amount.toLocaleString('fr-CH')}
                  </p>
                </div>
              )}

              {selectedSubmission.notes && (
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Remarques
                  </label>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {selectedSubmission.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedSubmission.status === 'RECEIVED' && (
              <div className="flex gap-3 pt-6">
                <Button variant="primary" className="flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Adjuger
                </Button>
                <Button variant="danger" className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Refuser
                </Button>
              </div>
            )}

            {selectedSubmission.status === 'PENDING' && (
              <Button variant="primary" className="w-full">
                Marquer comme reçue
              </Button>
            )}
          </div>
        )}
      </SidePanel>
    </div>
  );
}
