/**
 * BuyerDetailEnhanced - Page de détail acheteur complète
 *
 * 6 onglets:
 * - Vue d'ensemble (métriques, statut, workflow)
 * - Finances (paiements, échéancier)
 * - Documents (validation, upload)
 * - Communications (messages, notes)
 * - Notaire (dossier, rendez-vous)
 * - Progression (milestones)
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  DollarSign,
  FileText,
  MessageSquare,
  Scale,
  CheckCircle,
  Edit,
  Mail,
  Phone,
  Plus,
  Trash2,
  Upload,
  Download,
  Clock,
  User,
  Home,
  Calendar,
  AlertTriangle,
  Check,
  X,
  Send,
  ChevronRight,
  MapPin,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTabs } from '../components/realpro/RealProTabs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useBuyerManagement,
  BUYER_STATUS_CONFIG,
  SALE_TYPE_CONFIG,
  BuyerStatus,
  BuyerDocument,
  BuyerPayment,
  BuyerMessage,
  BuyerMilestone,
} from '../hooks/useBuyerManagement';

export default function BuyerDetailEnhanced() {
  const { projectId, buyerId } = useParams<{ projectId: string; buyerId: string }>();
  const navigate = useNavigate();

  const {
    buyer,
    summary,
    loading,
    error,
    saving,
    refresh,
    updateBuyer,
    changeStatus,
    getAllowedTransitions,
    uploadDocument,
    validateDocument,
    deleteDocument,
    getDocumentCompletion,
    recordPayment,
    getPaymentSummary,
    sendMessage,
    updateMilestone,
    initializeMilestones,
  } = useBuyerManagement(projectId, buyerId);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [isInternalMessage, setIsInternalMessage] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="px-10 py-8">
        <div className="text-center py-20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Acheteur non trouvé
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.message || 'L\'acheteur demandé n\'existe pas'}
          </p>
          <RealProButton onClick={() => navigate(`/projects/${projectId}/crm/buyers`)}>
            Retour aux acheteurs
          </RealProButton>
        </div>
      </div>
    );
  }

  const statusConfig = BUYER_STATUS_CONFIG[buyer.status];
  const allowedTransitions = getAllowedTransitions();
  const paymentSummary = getPaymentSummary();
  const documentCompletion = getDocumentCompletion();

  const handleStatusChange = async (newStatus: BuyerStatus) => {
    await changeStatus(newStatus);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    const { error } = await sendMessage(messageContent, messageSubject || undefined, isInternalMessage);
    if (!error) {
      setMessageContent('');
      setMessageSubject('');
      setIsInternalMessage(false);
      setShowMessageModal(false);
    }
  };

  const handleMilestoneToggle = async (milestone: BuyerMilestone) => {
    const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
    await updateMilestone(milestone.id, newStatus);
  };

  // ============================================================================
  // Tab: Overview
  // ============================================================================
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Documents validés"
          value={`${documentCompletion?.validated || 0}/${documentCompletion?.total || 0}`}
          subValue={`${documentCompletion?.percentage || 0}% complet`}
          icon={<FileText className="w-5 h-5" />}
          color="text-blue-600"
        />
        <MetricCard
          label="Paiements reçus"
          value={`CHF ${(paymentSummary?.paid || 0).toLocaleString('fr-CH')}`}
          subValue={`${paymentSummary?.percentagePaid || 0}% payé`}
          icon={<CreditCard className="w-5 h-5" />}
          color="text-green-600"
        />
        <MetricCard
          label="Messages non lus"
          value={summary?.unread_messages.toString() || '0'}
          subValue="À traiter"
          icon={<MessageSquare className="w-5 h-5" />}
          color="text-amber-600"
        />
        <MetricCard
          label="Progression"
          value={`${summary?.completion_percentage || 0}%`}
          subValue={summary?.next_milestone?.name || 'Toutes étapes complétées'}
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-purple-600"
        />
      </div>

      {/* Status & Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Statut actuel
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-2 rounded-full text-lg font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          {allowedTransitions.length > 0 && (
            <>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Prochaines étapes:
              </p>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={saving}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                      ${BUYER_STATUS_CONFIG[status].bgColor} ${BUYER_STATUS_CONFIG[status].color}
                      hover:opacity-80 disabled:opacity-50`}
                  >
                    {BUYER_STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Personal Info Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Coordonnées
          </h3>
          <div className="space-y-3">
            {buyer.email && (
              <InfoRow icon={<Mail />} label="Email" value={buyer.email} isLink />
            )}
            {buyer.phone && (
              <InfoRow icon={<Phone />} label="Téléphone" value={buyer.phone} />
            )}
            {buyer.mobile && (
              <InfoRow icon={<Phone />} label="Mobile" value={buyer.mobile} />
            )}
            {buyer.address.city && (
              <InfoRow
                icon={<MapPin />}
                label="Adresse"
                value={`${buyer.address.postal_code || ''} ${buyer.address.city || ''}`}
              />
            )}
          </div>
        </div>

        {/* Lot Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Lot associé
          </h3>
          {buyer.lot ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Home className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Lot {buyer.lot.code}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {buyer.lot.type} • {buyer.lot.rooms_count} pièces
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Surface</span>
                  <span className="font-medium">{buyer.lot.surface_total} m²</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-neutral-600 dark:text-neutral-400">Prix</span>
                  <span className="font-medium">CHF {buyer.lot.price_total.toLocaleString('fr-CH')}</span>
                </div>
              </div>
              <RealProButton
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/lots/${buyer.lot?.id}`)}
              >
                Voir le lot
                <ChevronRight className="w-4 h-4 ml-1" />
              </RealProButton>
            </div>
          ) : (
            <div className="text-center py-6">
              <Home className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Aucun lot associé
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Activité récente
          </h3>
          <span className="text-sm text-neutral-500">
            Depuis {summary?.days_since_creation || 0} jours
          </span>
        </div>
        <div className="space-y-3">
          {buyer.activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">{activity.description}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(activity.created_at).toLocaleString('fr-CH')}
                </p>
              </div>
            </div>
          ))}
          {buyer.activities.length === 0 && (
            <p className="text-center text-neutral-500 py-4">
              Aucune activité enregistrée
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Finance
  // ============================================================================
  const FinanceTab = () => (
    <div className="space-y-8">
      {/* Payment Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Résumé financier
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Montant total</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              CHF {(paymentSummary?.total || 0).toLocaleString('fr-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Payé</p>
            <p className="text-2xl font-bold text-green-600">
              CHF {(paymentSummary?.paid || 0).toLocaleString('fr-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">En attente</p>
            <p className="text-2xl font-bold text-amber-600">
              CHF {(paymentSummary?.pending || 0).toLocaleString('fr-CH')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">En retard</p>
            <p className="text-2xl font-bold text-red-600">
              CHF {(paymentSummary?.overdue || 0).toLocaleString('fr-CH')}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progression des paiements</span>
            <span className="font-medium">{paymentSummary?.percentagePaid || 0}%</span>
          </div>
          <div className="w-full h-3 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${paymentSummary?.percentagePaid || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Échéancier de paiements
        </h3>
        {buyer.payments.length > 0 ? (
          <div className="space-y-4">
            {buyer.payments.map(payment => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                onRecordPayment={recordPayment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun paiement planifié
            </p>
          </div>
        )}
      </div>

      {/* Contract Info */}
      {buyer.contract && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Contrat de vente
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Type de vente</p>
              <p className="font-medium">{SALE_TYPE_CONFIG[buyer.contract.sale_type]?.label}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
              <p className="font-medium">{buyer.contract.status}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Acompte</p>
              <p className="font-medium">
                CHF {(buyer.contract.deposit_amount || 0).toLocaleString('fr-CH')}
                {buyer.contract.deposit_paid && (
                  <span className="ml-2 text-green-600">✓ Payé</span>
                )}
              </p>
            </div>
            {buyer.contract.signed_at && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Signé le</p>
                <p className="font-medium">
                  {new Date(buyer.contract.signed_at).toLocaleDateString('fr-CH')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab: Documents
  // ============================================================================
  const DocumentsTab = () => (
    <div className="space-y-8">
      {/* Document Completion */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Documents requis
          </h3>
          <span className="text-2xl font-bold text-blue-600">
            {documentCompletion?.percentage || 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${documentCompletion?.percentage || 0}%` }}
          />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {documentCompletion?.validated || 0} sur {documentCompletion?.total || 0} documents validés
        </p>
        {documentCompletion?.missing && documentCompletion.missing.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-amber-600 mb-2">Documents manquants:</p>
            <div className="flex flex-wrap gap-2">
              {documentCompletion.missing.map(doc => (
                <span
                  key={doc.type}
                  className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm"
                >
                  {doc.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Documents ({buyer.documents.length})
          </h3>
          <RealProButton size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Ajouter
          </RealProButton>
        </div>

        {buyer.documents.length > 0 ? (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {buyer.documents.map(doc => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onValidate={validateDocument}
                onDelete={deleteDocument}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun document
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Messages
  // ============================================================================
  const MessagesTab = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Total messages</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {buyer.messages.length}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Non lus</p>
          <p className="text-2xl font-bold text-amber-600">
            {summary?.unread_messages || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Internes</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {buyer.messages.filter(m => m.is_internal).length}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Communications
          </h3>
          <RealProButton size="sm" onClick={() => setShowMessageModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau message
          </RealProButton>
        </div>

        {buyer.messages.length > 0 ? (
          <div className="space-y-4">
            {buyer.messages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun message
            </p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Nouveau message
            </h3>
            <input
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Sujet (optionnel)"
              className="w-full px-4 py-3 mb-3 border border-neutral-300 dark:border-neutral-700 rounded-xl
                bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Votre message..."
              className="w-full h-32 px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl
                bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 resize-none"
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternalMessage}
                onChange={(e) => setIsInternalMessage(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Note interne (non visible par l'acheteur)
              </span>
            </label>
            <div className="flex justify-end gap-3 mt-6">
              <RealProButton variant="outline" onClick={() => setShowMessageModal(false)}>
                Annuler
              </RealProButton>
              <RealProButton onClick={handleSendMessage} disabled={!messageContent.trim() || saving}>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </RealProButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // Tab: Notary
  // ============================================================================
  const NotaryTab = () => (
    <div className="space-y-8">
      {/* Notary Info */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Dossier notaire
        </h3>
        {buyer.notary_dossier ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Notaire</p>
                <p className="font-medium">{buyer.notary_dossier.notary_name || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
                <NotaryStatusBadge status={buyer.notary_dossier.status} />
              </div>
              {buyer.notary_dossier.appointment_date && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Rendez-vous</p>
                  <p className="font-medium">
                    {new Date(buyer.notary_dossier.appointment_date).toLocaleDateString('fr-CH')}
                  </p>
                </div>
              )}
              {buyer.notary_dossier.acte_date && (
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Date acte</p>
                  <p className="font-medium">
                    {new Date(buyer.notary_dossier.acte_date).toLocaleDateString('fr-CH')}
                  </p>
                </div>
              )}
            </div>

            {/* Notary Documents */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Documents notariaux
              </h4>
              {buyer.notary_dossier.documents.length > 0 ? (
                <div className="space-y-2">
                  {buyer.notary_dossier.documents.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm">{doc.name}</span>
                        {doc.required && (
                          <span className="text-xs text-amber-600">Requis</span>
                        )}
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">Aucun document notarial</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Scale className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Aucun dossier notaire créé
            </p>
            <RealProButton variant="outline">
              Créer le dossier
            </RealProButton>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // Tab: Milestones
  // ============================================================================
  const MilestonesTab = () => (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Progression du dossier
          </h3>
          <span className="text-2xl font-bold text-purple-600">
            {summary?.completion_percentage || 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${summary?.completion_percentage || 0}%` }}
          />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
          {buyer.milestones.filter(m => m.status === 'completed').length} sur {buyer.milestones.length} étapes complétées
        </p>
      </div>

      {/* Milestones List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Étapes du parcours
          </h3>
          {buyer.milestones.length === 0 && (
            <RealProButton size="sm" onClick={initializeMilestones} disabled={saving}>
              Initialiser les étapes
            </RealProButton>
          )}
        </div>

        {buyer.milestones.length > 0 ? (
          <div className="space-y-4">
            {buyer.milestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                onToggle={() => handleMilestoneToggle(milestone)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Aucune étape définie
            </p>
            <RealProButton onClick={initializeMilestones} disabled={saving}>
              Créer les étapes par défaut
            </RealProButton>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // Tabs Configuration
  // ============================================================================
  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: <OverviewTab />,
    },
    {
      id: 'finance',
      label: 'Finances',
      icon: <DollarSign className="w-4 h-4" />,
      badge: paymentSummary?.overdue && paymentSummary.overdue > 0 ? '!' : undefined,
      content: <FinanceTab />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      badge: documentCompletion?.pending && documentCompletion.pending > 0
        ? documentCompletion.pending.toString()
        : undefined,
      content: <DocumentsTab />,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: summary?.unread_messages && summary.unread_messages > 0
        ? summary.unread_messages.toString()
        : undefined,
      content: <MessagesTab />,
    },
    {
      id: 'notary',
      label: 'Notaire',
      icon: <Scale className="w-4 h-4" />,
      content: <NotaryTab />,
    },
    {
      id: 'milestones',
      label: 'Progression',
      icon: <CheckCircle className="w-4 h-4" />,
      badge: `${summary?.completion_percentage || 0}%`,
      content: <MilestonesTab />,
    },
  ];

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/projects/${projectId}/crm/buyers`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux acheteurs
        </Link>

        <RealProTopbar
          title={buyer.full_name}
          subtitle={`${buyer.lot ? `Lot ${buyer.lot.code}` : 'Aucun lot'} • ${statusConfig.label}`}
          actions={
            <div className="flex gap-3">
              {buyer.email && (
                <RealProButton variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </RealProButton>
              )}
              {buyer.phone && (
                <RealProButton variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </RealProButton>
              )}
              <RealProButton>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </RealProButton>
            </div>
          }
        />
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl border border-brand-200 dark:border-brand-800 p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lot</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {buyer.lot?.code || 'Non assigné'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Documents</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {documentCompletion?.validated || 0}/{documentCompletion?.total || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Paiements</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {paymentSummary?.percentagePaid || 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Progression</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {summary?.completion_percentage || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <RealProTabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function MetricCard({
  label,
  value,
  subValue,
  icon,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      {subValue && (
        <p className="text-sm text-neutral-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <span className="w-4 h-4">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      {isLink ? (
        <a href={`mailto:${value}`} className="font-medium text-brand-600 hover:underline">
          {value}
        </a>
      ) : (
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
      )}
    </div>
  );
}

function PaymentRow({
  payment,
  onRecordPayment,
}: {
  payment: BuyerPayment;
  onRecordPayment: (id: string, date: string) => Promise<{ error: Error | null }>;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'text-green-600 bg-green-100',
      pending: 'text-amber-600 bg-amber-100',
      invoiced: 'text-blue-600 bg-blue-100',
      overdue: 'text-red-600 bg-red-100',
      partially_paid: 'text-orange-600 bg-orange-100',
    };
    return colors[status] || 'text-neutral-600 bg-neutral-100';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Payé',
      pending: 'En attente',
      invoiced: 'Facturé',
      overdue: 'En retard',
      partially_paid: 'Partiel',
    };
    return labels[status] || status;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
      <div className="flex-1">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">{payment.label}</p>
        <p className="text-sm text-neutral-500">
          Échéance: {new Date(payment.due_date).toLocaleDateString('fr-CH')}
          {payment.percentage && ` • ${payment.percentage}%`}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
          CHF {payment.amount.toLocaleString('fr-CH')}
        </p>
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
          {getStatusLabel(payment.status)}
        </span>
      </div>
      {payment.status !== 'paid' && (
        <button
          onClick={() => onRecordPayment(payment.id, new Date().toISOString())}
          className="ml-4 p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          title="Marquer comme payé"
        >
          <Check className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function DocumentRow({
  document,
  onValidate,
  onDelete,
}: {
  document: BuyerDocument;
  onValidate: (id: string, approved: boolean, reason?: string) => Promise<{ error: Error | null }>;
  onDelete: (id: string, path?: string) => Promise<{ error: Error | null }>;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-neutral-400" />
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{document.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-500">{document.type}</span>
            {document.is_required && (
              <span className="text-xs text-amber-600">Requis</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <DocumentStatusBadge status={document.status} />
        {document.status === 'received' && (
          <>
            <button
              onClick={() => onValidate(document.id, true)}
              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
              title="Valider"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onValidate(document.id, false, 'Document non conforme')}
              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
              title="Rejeter"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
        <button className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(document.id, document.storage_path)}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DocumentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    requested: { label: 'Demandé', color: 'text-neutral-600 bg-neutral-100' },
    pending: { label: 'En attente', color: 'text-amber-600 bg-amber-100' },
    received: { label: 'Reçu', color: 'text-blue-600 bg-blue-100' },
    validated: { label: 'Validé', color: 'text-green-600 bg-green-100' },
    rejected: { label: 'Refusé', color: 'text-red-600 bg-red-100' },
  };
  const { label, color } = config[status] || { label: status, color: 'text-neutral-600 bg-neutral-100' };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function NotaryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    not_started: { label: 'Non démarré', color: 'text-neutral-600 bg-neutral-100' },
    documents_pending: { label: 'Documents en attente', color: 'text-amber-600 bg-amber-100' },
    review: { label: 'En révision', color: 'text-blue-600 bg-blue-100' },
    appointment_set: { label: 'RDV fixé', color: 'text-purple-600 bg-purple-100' },
    signed: { label: 'Signé', color: 'text-green-600 bg-green-100' },
    completed: { label: 'Terminé', color: 'text-emerald-600 bg-emerald-100' },
  };
  const { label, color } = config[status] || { label: status, color: 'text-neutral-600 bg-neutral-100' };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${color}`}>
      {label}
    </span>
  );
}

function MessageCard({ message }: { message: BuyerMessage }) {
  return (
    <div className={`p-4 rounded-xl ${message.is_internal ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-neutral-50 dark:bg-neutral-800'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {message.sender_name}
          </span>
          {message.is_internal && (
            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded text-xs">
              Interne
            </span>
          )}
          {!message.read_at && !message.is_internal && (
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
        <span className="text-xs text-neutral-500">
          {new Date(message.created_at).toLocaleString('fr-CH')}
        </span>
      </div>
      {message.subject && (
        <p className="font-medium text-sm text-neutral-800 dark:text-neutral-200 mb-1">
          {message.subject}
        </p>
      )}
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{message.content}</p>
    </div>
  );
}

function MilestoneItem({
  milestone,
  index,
  onToggle,
}: {
  milestone: BuyerMilestone;
  index: number;
  onToggle: () => void;
}) {
  const isCompleted = milestone.status === 'completed';

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer
        ${isCompleted
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
        }`}
      onClick={onToggle}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isCompleted
            ? 'bg-green-500 text-white'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
          }`}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" />
        ) : (
          <span className="text-sm font-medium">{index + 1}</span>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
          {milestone.name}
        </p>
        {milestone.completed_at && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Complété le {new Date(milestone.completed_at).toLocaleDateString('fr-CH')}
          </p>
        )}
        {milestone.due_date && !isCompleted && (
          <p className="text-xs text-neutral-500 mt-1">
            Échéance: {new Date(milestone.due_date).toLocaleDateString('fr-CH')}
          </p>
        )}
      </div>
    </div>
  );
}
