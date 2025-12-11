import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Building2,
  Package,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Lock,
  Award,
  XCircle,
  Users,
  BarChart3,
  Plus,
  Trash2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Star,
  Send,
  RefreshCw,
} from 'lucide-react';
import {
  useSubmissionDetailEnhanced,
  useOfferComparison,
  SUBMISSION_STATUS_CONFIG,
  INVITE_STATUS_CONFIG,
  OFFER_STATUS_CONFIG,
  DEFAULT_EVALUATION_CRITERIA,
  formatPrice,
  getDeadlineStatus,
  calculateDeviation,
  SubmissionStatus,
} from '../hooks/useSubmissionManagement';
import { RealProCard } from '@/components/realpro/RealProCard';
import { RealProButton } from '@/components/realpro/RealProButton';
import { RealProTabs } from '@/components/realpro/RealProTabs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const STATUS_ICONS: Record<string, any> = {
  draft: FileText,
  active: Play,
  closed: Lock,
  evaluation: BarChart3,
  awarded: Award,
  cancelled: XCircle,
};

export default function SubmissionDetailEnhanced() {
  const navigate = useNavigate();
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const { submission, loading, error, refresh } = useSubmissionDetailEnhanced(submissionId);
  const { offers, comparison } = useOfferComparison(submissionId);

  const [activeTab, setActiveTab] = useState('overview');
  const [updating, setUpdating] = useState(false);
  const [evaluationScores, setEvaluationScores] = useState<Record<string, Record<string, number>>>({});

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!submissionId) return;

    try {
      setUpdating(true);

      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'active') {
        updateData.published_at = new Date().toISOString();
      } else if (newStatus === 'closed') {
        updateData.closed_at = new Date().toISOString();
      } else if (newStatus === 'awarded') {
        updateData.awarded_at = new Date().toISOString();
      }

      const { error } = await supabase.from('submissions').update(updateData).eq('id', submissionId);

      if (error) throw error;
      toast.success(`Statut mis a jour: ${SUBMISSION_STATUS_CONFIG[newStatus]?.label}`);
      await refresh();
    } catch (err: any) {
      toast.error('Erreur lors de la mise a jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!submissionId || !confirm('Adjuger cette offre? Les autres offres seront automatiquement rejetees.'))
      return;

    try {
      setUpdating(true);

      // Accept this offer
      await supabase
        .from('submission_offers')
        .update({ status: 'accepted', is_winner: true })
        .eq('id', offerId);

      // Reject others
      await supabase
        .from('submission_offers')
        .update({ status: 'rejected' })
        .eq('submission_id', submissionId)
        .neq('id', offerId)
        .eq('status', 'submitted');

      // Update submission status
      await handleStatusChange('awarded');

      toast.success('Offre adjugee avec succes');
    } catch (err) {
      toast.error("Erreur lors de l'adjudication");
    } finally {
      setUpdating(false);
    }
  };

  const handleScoreChange = (offerId: string, criteriaId: string, score: number) => {
    setEvaluationScores((prev) => ({
      ...prev,
      [offerId]: {
        ...(prev[offerId] || {}),
        [criteriaId]: score,
      },
    }));
  };

  const handleDelete = async () => {
    if (!submissionId || !confirm('Supprimer cette soumission?')) return;

    try {
      const { error } = await supabase.from('submissions').delete().eq('id', submissionId);

      if (error) throw error;
      toast.success('Soumission supprimee');
      navigate(`/projects/${projectId}/submissions`);
    } catch (err: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Soumission non trouvee'}</p>
          <Link to={`/projects/${projectId}/submissions`}>
            <RealProButton variant="secondary">Retour aux soumissions</RealProButton>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = SUBMISSION_STATUS_CONFIG[submission.status] || SUBMISSION_STATUS_CONFIG.draft;
  const StatusIcon = STATUS_ICONS[submission.status] || FileText;
  const deadlineStatus = getDeadlineStatus(submission.offer_deadline);

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'companies', label: `Entreprises (${submission.invites_count})` },
    { id: 'offers', label: `Offres (${submission.offers_count})` },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'comparison', label: 'Comparatif' },
  ];

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/projects/${projectId}/submissions`}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              {submission.title}
            </h1>
            <Badge className={statusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Ref: {submission.reference}</span>
            {submission.cfc_code && <span>CFC: {submission.cfc_code}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusConfig.nextStatuses.length > 0 && (
            <div className="flex items-center gap-2">
              {statusConfig.nextStatuses.map((nextStatus) => {
                const nextConfig = SUBMISSION_STATUS_CONFIG[nextStatus];
                return (
                  <RealProButton
                    key={nextStatus}
                    variant={nextStatus === 'cancelled' ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleStatusChange(nextStatus)}
                    disabled={updating}
                  >
                    <ChevronRight className="w-4 h-4" />
                    {nextConfig.label}
                  </RealProButton>
                );
              })}
            </div>
          )}
          <RealProButton variant="secondary" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </RealProButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <RealProCard className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Echeance</p>
              <p className={`font-semibold ${deadlineStatus.color}`}>{deadlineStatus.label}</p>
            </div>
          </div>
        </RealProCard>

        <RealProCard className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Budget estime</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {formatPrice(submission.budget_estimate)}
              </p>
            </div>
          </div>
        </RealProCard>

        <RealProCard className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Entreprises</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {submission.invites_count} invitees
              </p>
            </div>
          </div>
        </RealProCard>

        <RealProCard className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Offres recues</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {submission.offers_count} offres
              </p>
            </div>
          </div>
        </RealProCard>

        <RealProCard className="!p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30">
              <TrendingDown className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Meilleure offre</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {formatPrice(submission.min_offer)}
              </p>
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Tabs */}
      <RealProTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealProCard title="Description">
              <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                {submission.description || 'Aucune description'}
              </p>
            </RealProCard>

            <RealProCard title="Calendrier">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Date limite questions</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {submission.question_deadline
                      ? new Date(submission.question_deadline).toLocaleDateString('fr-CH')
                      : 'Non definie'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Date limite offres</span>
                  <span className={`font-medium ${deadlineStatus.color}`}>
                    {new Date(submission.offer_deadline).toLocaleDateString('fr-CH')}
                  </span>
                </div>
                {submission.published_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Publiee le</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {new Date(submission.published_at).toLocaleDateString('fr-CH')}
                    </span>
                  </div>
                )}
                {submission.awarded_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Adjugee le</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {new Date(submission.awarded_at).toLocaleDateString('fr-CH')}
                    </span>
                  </div>
                )}
              </div>
            </RealProCard>

            {submission.offers_count > 0 && (
              <RealProCard title="Analyse des offres" className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                    <TrendingDown className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Plus basse</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPrice(comparison.lowestPrice)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Plus haute</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatPrice(comparison.highestPrice)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Moyenne</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(comparison.averagePrice)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                    <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Delai min.</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {comparison.shortestDelay ? `${comparison.shortestDelay}j` : '-'}
                    </p>
                  </div>
                </div>
              </RealProCard>
            )}
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Entreprises invitees
              </h2>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                Inviter une entreprise
              </RealProButton>
            </div>

            {submission.invites.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Aucune entreprise invitee
                  </p>
                  <RealProButton variant="secondary">
                    <Plus className="w-4 h-4" />
                    Inviter la premiere entreprise
                  </RealProButton>
                </div>
              </RealProCard>
            ) : (
              <div className="grid gap-4">
                {submission.invites.map((invite) => {
                  const inviteConfig = INVITE_STATUS_CONFIG[invite.status];
                  return (
                    <RealProCard key={invite.id} className="!p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {invite.company?.name || 'Entreprise'}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                              <span>{invite.company?.email}</span>
                              {invite.company?.contact_person && (
                                <span>Contact: {invite.company.contact_person}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={inviteConfig.color}>{inviteConfig.label}</Badge>
                          {invite.status === 'pending' && (
                            <RealProButton variant="secondary" size="sm">
                              <Send className="w-4 h-4" />
                              Relancer
                            </RealProButton>
                          )}
                        </div>
                      </div>
                    </RealProCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Offres recues
              </h2>
              <RealProButton variant="secondary" onClick={refresh}>
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </RealProButton>
            </div>

            {offers.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucune offre recue pour le moment
                  </p>
                </div>
              </RealProCard>
            ) : (
              <div className="space-y-4">
                {offers.map((offer, index) => {
                  const offerConfig = OFFER_STATUS_CONFIG[offer.status];
                  const deviation = comparison.averagePrice
                    ? calculateDeviation(offer.total_excl_vat, comparison.averagePrice)
                    : 0;
                  const isLowest = offer.total_excl_vat === comparison.lowestPrice;

                  return (
                    <RealProCard
                      key={offer.id}
                      className={`!p-4 ${isLowest ? 'ring-2 ring-green-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                              isLowest
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                {offer.company?.name || 'Entreprise'}
                              </h4>
                              {offer.is_winner && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <Award className="w-3 h-3 mr-1" />
                                  Retenue
                                </Badge>
                              )}
                              {isLowest && !offer.is_winner && (
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Moins-disante
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              {offer.submitted_at && (
                                <span>
                                  Soumis le {new Date(offer.submitted_at).toLocaleDateString('fr-CH')}
                                </span>
                              )}
                              {offer.delay_days && <span>Delai: {offer.delay_days} jours</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                              {formatPrice(offer.total_excl_vat)}
                            </p>
                            <div className="flex items-center justify-end gap-2 text-sm">
                              <span className="text-neutral-500 dark:text-neutral-400">HT</span>
                              {deviation !== 0 && (
                                <span
                                  className={`flex items-center ${
                                    deviation < 0 ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {deviation < 0 ? (
                                    <TrendingDown className="w-3 h-3" />
                                  ) : (
                                    <TrendingUp className="w-3 h-3" />
                                  )}
                                  {Math.abs(deviation).toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={offerConfig.color}>{offerConfig.label}</Badge>
                            {submission.status === 'evaluation' && offer.status === 'submitted' && (
                              <RealProButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleAcceptOffer(offer.id)}
                                disabled={updating}
                              >
                                <Award className="w-4 h-4" />
                                Adjuger
                              </RealProButton>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Offer Items */}
                      {offer.items && offer.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-neutral-500 dark:text-neutral-400">
                                <th className="text-left py-2">Description</th>
                                <th className="text-right py-2">Qte</th>
                                <th className="text-right py-2">P.U.</th>
                                <th className="text-right py-2">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {offer.items.slice(0, 5).map((item) => (
                                <tr key={item.id} className="border-t border-neutral-100 dark:border-neutral-800">
                                  <td className="py-2 text-neutral-700 dark:text-neutral-300">
                                    {item.description}
                                  </td>
                                  <td className="py-2 text-right text-neutral-600 dark:text-neutral-400">
                                    {item.quantity} {item.unit}
                                  </td>
                                  <td className="py-2 text-right text-neutral-600 dark:text-neutral-400">
                                    {formatPrice(item.unit_price)}
                                  </td>
                                  <td className="py-2 text-right font-medium text-neutral-900 dark:text-neutral-100">
                                    {formatPrice(item.total_price)}
                                  </td>
                                </tr>
                              ))}
                              {offer.items.length > 5 && (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="py-2 text-center text-neutral-500 dark:text-neutral-400"
                                  >
                                    +{offer.items.length - 5} autres postes
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </RealProCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Evaluation Tab */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Matrice d'evaluation
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Evaluez chaque offre selon les criteres ponderes
                </p>
              </div>
            </div>

            {offers.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucune offre a evaluer
                  </p>
                </div>
              </RealProCard>
            ) : (
              <RealProCard>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Critere (Poids)
                        </th>
                        {offers.map((offer) => (
                          <th
                            key={offer.id}
                            className="text-center py-3 px-4 text-sm font-medium text-neutral-900 dark:text-neutral-100"
                          >
                            {offer.company?.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DEFAULT_EVALUATION_CRITERIA.map((criteria) => (
                        <tr
                          key={criteria.id}
                          className="border-b border-neutral-100 dark:border-neutral-800"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                {criteria.name}
                              </span>
                              <Badge variant="default" className="text-xs">
                                {criteria.weight}%
                              </Badge>
                            </div>
                          </td>
                          {offers.map((offer) => (
                            <td key={offer.id} className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(criteria.maxScore)].map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleScoreChange(offer.id, criteria.id, i + 1)}
                                    className={`w-6 h-6 rounded-full transition-colors ${
                                      (evaluationScores[offer.id]?.[criteria.id] || 0) > i
                                        ? 'bg-amber-400 text-white'
                                        : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                    }`}
                                  >
                                    <Star
                                      className={`w-4 h-4 mx-auto ${
                                        (evaluationScores[offer.id]?.[criteria.id] || 0) > i
                                          ? 'fill-current'
                                          : ''
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                        <td className="py-4 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                          Score Total
                        </td>
                        {offers.map((offer) => {
                          const scores = evaluationScores[offer.id] || {};
                          const total = DEFAULT_EVALUATION_CRITERIA.reduce((sum, c) => {
                            const score = scores[c.id] || 0;
                            return sum + (score / c.maxScore) * c.weight;
                          }, 0);
                          return (
                            <td
                              key={offer.id}
                              className="py-4 px-4 text-center text-xl font-bold text-brand-600 dark:text-brand-400"
                            >
                              {total.toFixed(1)}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </RealProCard>
            )}
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <RealProCard title="Comparatif des prix">
              {offers.length < 2 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Au moins 2 offres sont necessaires pour comparer
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Visual bar chart */}
                  <div className="space-y-4">
                    {offers.map((offer) => {
                      const maxPrice = comparison.highestPrice || 1;
                      const percentage = (offer.total_excl_vat / maxPrice) * 100;
                      const isLowest = offer.total_excl_vat === comparison.lowestPrice;

                      return (
                        <div key={offer.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {offer.company?.name}
                            </span>
                            <span
                              className={`font-semibold ${
                                isLowest
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-neutral-700 dark:text-neutral-300'
                              }`}
                            >
                              {formatPrice(offer.total_excl_vat)}
                            </span>
                          </div>
                          <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                            <div
                              className={`h-full rounded-lg transition-all duration-500 ${
                                isLowest
                                  ? 'bg-green-500'
                                  : 'bg-brand-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price spread info */}
                  <div className="p-4 bg-brand-50 dark:bg-brand-950/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      <div>
                        <p className="font-medium text-brand-900 dark:text-brand-100">
                          Ecart de prix: {formatPrice(comparison.priceSpread)}
                        </p>
                        <p className="text-sm text-brand-700 dark:text-brand-300">
                          {comparison.highestPrice && comparison.lowestPrice
                            ? `Soit ${(((comparison.highestPrice - comparison.lowestPrice) / comparison.lowestPrice) * 100).toFixed(1)}% de difference entre l'offre la plus haute et la plus basse`
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </RealProCard>
          </div>
        )}
      </div>
    </div>
  );
}
