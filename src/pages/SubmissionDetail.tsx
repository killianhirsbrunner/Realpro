import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, FileText, Building2, Package, MessageSquare,
  Calendar, DollarSign, Clock, CheckCircle, AlertCircle,
  Play, Pause, Award, X, Send, Download, MoreVertical,
  Users, TrendingUp, BarChart3, Edit, Trash2
} from 'lucide-react';
import { useSubmissionDetail } from '../hooks/useSubmissions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { formatDate } from '../lib/utils/format';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; next?: string[] }> = {
  draft: {
    label: 'Brouillon',
    color: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    icon: FileText,
    next: ['active']
  },
  active: {
    label: 'Active',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: Play,
    next: ['closed', 'cancelled']
  },
  closed: {
    label: 'Clôturée',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    icon: Pause,
    next: ['evaluation', 'cancelled']
  },
  evaluation: {
    label: 'En évaluation',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: BarChart3,
    next: ['awarded', 'cancelled']
  },
  awarded: {
    label: 'Adjugée',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: Award,
    next: []
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: X,
    next: []
  },
};

export function SubmissionDetail() {
  const navigate = useNavigate();
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const { submission, loading, error } = useSubmissionDetail(submissionId);
  const [updating, setUpdating] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!submissionId) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', submissionId);

      if (error) throw error;
      toast.success(`Statut mis à jour: ${STATUS_CONFIG[newStatus]?.label}`);
      window.location.reload();
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!submissionId || !confirm('Supprimer cette soumission ?')) return;

    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;
      toast.success('Soumission supprimée');
      navigate(`/projects/${projectId}/submissions`);
    } catch (err: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

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

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error || 'Soumission non trouvee'}</p>
          <Link to={`/projects/${projectId}/submissions`} className="text-sm text-realpro-turquoise mt-4 inline-block">
            Retour aux soumissions
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[submission.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;
  const nextStatuses = statusConfig.next || [];
  const offersCount = submission.offers?.length || 0;
  const companiesCount = submission.companies?.length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/projects/${projectId}/submissions`}
            className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux soumissions
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-realpro-turquoise/10">
              <FileText className="h-6 w-6 text-realpro-turquoise" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {submission.label}
                </h1>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              {submission.cfc_code && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Code CFC: {submission.cfc_code}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nextStatuses.length > 0 && (
            <div className="relative">
              <Button
                variant="primary"
                onClick={() => setShowActions(!showActions)}
                disabled={updating}
              >
                {updating ? 'Mise a jour...' : 'Changer statut'}
                <ChevronLeft className="h-4 w-4 ml-2 rotate-[270deg]" />
              </Button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                  {nextStatuses.map(status => {
                    const config = STATUS_CONFIG[status];
                    const Icon = config?.icon || FileText;
                    return (
                      <button
                        key={status}
                        onClick={() => { handleStatusChange(status); setShowActions(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {config?.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Echeance</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {submission.deadline ? formatDate(submission.deadline) : 'Non definie'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Budget estime</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {submission.budget_estimate
                  ? `CHF ${submission.budget_estimate.toLocaleString()}`
                  : 'Non defini'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Entreprises</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {companiesCount} invitee{companiesCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Offres reçues</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {offersCount} offre{offersCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {submission.description && (
        <Card className="p-6">
          <h2 className="font-semibold text-neutral-900 dark:text-white mb-3">Description</h2>
          <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
            {submission.description}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900 dark:text-white">Entreprises invitées</h2>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Inviter
            </Button>
          </div>

          {companiesCount === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Aucune entreprise invitée
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(submission.companies || []).map((company: any) => (
                <div
                  key={company.id}
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{company.name}</p>
                    <p className="text-xs text-neutral-500">{company.contact_email}</p>
                  </div>
                  <Badge variant={company.has_submitted ? 'success' : 'default'}>
                    {company.has_submitted ? 'Soumis' : 'En attente'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900 dark:text-white">Offres reçues</h2>
            {offersCount > 1 && (
              <Link to={`/projects/${projectId}/submissions/${submissionId}/compare`}>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Comparer
                </Button>
              </Link>
            )}
          </div>

          {offersCount === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Aucune offre reçue pour le moment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-500 uppercase">Entreprise</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-neutral-500 uppercase">Montant</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-neutral-500 uppercase">Délai</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-neutral-500 uppercase">Statut</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(submission.offers || []).map((offer: any) => (
                    <tr key={offer.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-2">
                        <p className="font-medium text-neutral-900 dark:text-white">{offer.company_name}</p>
                        <p className="text-xs text-neutral-500">{offer.submitted_at ? formatDate(offer.submitted_at) : '-'}</p>
                      </td>
                      <td className="text-right py-3 px-2 font-semibold text-neutral-900 dark:text-white">
                        {offer.total_price ? `CHF ${offer.total_price.toLocaleString()}` : '-'}
                      </td>
                      <td className="text-right py-3 px-2 text-neutral-600 dark:text-neutral-400">
                        {offer.delivery_delay ? `${offer.delivery_delay} jours` : '-'}
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge variant={offer.status === 'selected' ? 'success' : 'default'}>
                          {offer.status === 'selected' ? 'Retenue' : 'En revue'}
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/projects/${projectId}/submissions/${submissionId}/compare`}
          className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-realpro-turquoise dark:hover:border-realpro-turquoise transition-all hover:shadow-lg group bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-realpro-turquoise/10 group-hover:bg-realpro-turquoise/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-realpro-turquoise" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Comparatif des offres
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Analyser et comparer les offres reçues côte à côte
          </p>
        </Link>

        <Link
          to={`/projects/${projectId}/submissions/${submissionId}/clarifications`}
          className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg group bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Questions & Clarifications
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Gérer les échanges avec les entreprises soumissionnaires
          </p>
        </Link>

        <Link
          to={`/projects/${projectId}/submissions/${submissionId}/companies`}
          className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg group bg-white dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Gestion des entreprises
            </h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Inviter et gérer les entreprises participantes
          </p>
        </Link>
      </div>
    </div>
  );
}
