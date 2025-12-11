import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, Filter, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useSubmissions } from '../hooks/useSubmissions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SubmissionsTable } from '../components/submissions/SubmissionsTable';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export function ProjectSubmissions() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { submissions, loading, error, project } = useSubmissions(projectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
            Erreur lors du chargement des soumissions
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Veuillez réessayer plus tard
          </p>
        </div>
      </div>
    );
  }

  // Calculer les statistiques
  const statusCounts = {
    all: submissions.length,
    draft: submissions.filter(s => s.status === 'draft').length,
    published: submissions.filter(s => s.status === 'published').length,
    closed: submissions.filter(s => s.status === 'closed').length,
    adjudicated: submissions.filter(s => s.status === 'adjudicated').length,
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = submission.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.cfc_code && submission.cfc_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = submissions.reduce((sum, s) => sum + (s.budget_estimate || 0), 0);
  const totalAdjudicated = submissions
    .filter(s => s.status === 'adjudicated')
    .reduce((sum, s) => sum + (s.adjudicated_amount || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statusConfig = [
    { key: 'all', label: 'Toutes', count: statusCounts.all, activeColor: 'bg-brand-600' },
    { key: 'draft', label: 'Brouillons', count: statusCounts.draft, activeColor: 'bg-neutral-600' },
    { key: 'published', label: 'Publiées', count: statusCounts.published, activeColor: 'bg-blue-600' },
    { key: 'closed', label: 'Clôturées', count: statusCounts.closed, activeColor: 'bg-amber-600' },
    { key: 'adjudicated', label: 'Adjugées', count: statusCounts.adjudicated, activeColor: 'bg-green-600' },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project?.name || 'Projet', href: `/projects/${projectId}` },
          { label: 'Soumissions' },
        ]}
      />

      <RealProTopbar
        title="Soumissions & Adjudications"
        subtitle={`${submissions.length} appel${submissions.length > 1 ? 's' : ''} d'offres`}
        actions={
          <RealProButton
            variant="primary"
            onClick={() => navigate(`/projects/${projectId}/submissions/new`)}
          >
            <Plus className="w-4 h-4" />
            Nouvelle soumission
          </RealProButton>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total soumissions</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {submissions.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">En cours</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.published}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Budget estimé</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Montant adjugé</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {formatCurrency(totalAdjudicated)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Filtres par statut */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusConfig.map((status) => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
              statusFilter === status.key
                ? `${status.activeColor} text-white`
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Recherche et liste */}
      <RealProCard padding="lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Rechercher par titre ou code CFC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 transition-colors"
            />
          </div>
          <RealProButton variant="outline">
            <Filter className="w-4 h-4" />
            Filtres avancés
          </RealProButton>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucune soumission trouvée
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Modifiez vos filtres ou créez une nouvelle soumission
            </p>
            <RealProButton
              variant="primary"
              onClick={() => navigate(`/projects/${projectId}/submissions/new`)}
            >
              <Plus className="w-4 h-4" />
              Créer une soumission
            </RealProButton>
          </div>
        ) : (
          <SubmissionsTable submissions={filteredSubmissions} projectId={projectId || ''} />
        )}
      </RealProCard>
    </div>
  );
}
