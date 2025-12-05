import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  WorkflowInstance,
  useApproveWorkflowStep,
  useRejectWorkflowStep,
  useCancelWorkflow,
  getCurrentStep,
  canApproveCurrentStep,
} from '../../hooks/useWorkflow';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'sonner';

interface WorkflowActionsProps {
  instance: WorkflowInstance;
  onActionComplete?: () => void;
}

export function WorkflowActions({ instance, onActionComplete }: WorkflowActionsProps) {
  const { user } = useCurrentUser();
  const { approve, loading: approving } = useApproveWorkflowStep();
  const { reject, loading: rejecting } = useRejectWorkflowStep();
  const { cancel, loading: cancelling } = useCancelWorkflow();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [approveComment, setApproveComment] = useState('');

  const currentStep = getCurrentStep(instance);
  const canApprove = user ? canApproveCurrentStep(instance, user.id) : false;

  const handleApprove = async () => {
    if (!currentStep) {
      toast.error('Aucune étape en cours');
      return;
    }

    const success = await approve({
      instanceId: instance.id,
      stepId: currentStep.id,
      comment: approveComment,
    });

    if (success) {
      toast.success('Étape approuvée avec succès');
      setApproveComment('');
      onActionComplete?.();
    } else {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!currentStep) {
      toast.error('Aucune étape en cours');
      return;
    }

    if (!rejectReason.trim()) {
      toast.error('Veuillez indiquer une raison');
      return;
    }

    const success = await reject({
      instanceId: instance.id,
      stepId: currentStep.id,
      reason: rejectReason,
    });

    if (success) {
      toast.success('Étape rejetée');
      setShowRejectDialog(false);
      setRejectReason('');
      onActionComplete?.();
    } else {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Veuillez indiquer une raison');
      return;
    }

    const success = await cancel({
      instanceId: instance.id,
      reason: cancelReason,
    });

    if (success) {
      toast.success('Workflow annulé');
      setShowCancelDialog(false);
      setCancelReason('');
      onActionComplete?.();
    } else {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  // Don't show actions if workflow is not active
  if (instance.status !== 'active') {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          Ce workflow est {instance.status === 'completed' ? 'terminé' : 'inactif'}.
        </p>
      </div>
    );
  }

  // Don't show approval actions if user can't approve
  if (!canApprove && !currentStep) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              En attente
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Ce workflow est en cours de traitement par une autre personne.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Approval section */}
      {canApprove && currentStep?.requires_approval && (
        <div className="p-6 bg-white border-2 border-realpro-turquoise rounded-lg shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-realpro-turquoise flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">
                Approbation requise
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                L'étape actuelle "<span className="font-medium">{currentStep.step_name}</span>" nécessite votre approbation pour continuer.
              </p>
            </div>
          </div>

          {/* Comment input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-realpro-turquoise focus:border-transparent"
              rows={3}
              placeholder="Ajoutez un commentaire..."
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Approuver
            </button>
            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={rejecting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-5 h-5" />
              Rejeter
            </button>
          </div>
        </div>
      )}

      {/* Cancel workflow button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCancelDialog(true)}
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Annuler le workflow
        </button>
      </div>

      {/* Reject dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rejeter l'étape
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer la raison du rejet. Le workflow sera annulé.
            </p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows={4}
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectReason.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel workflow dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Annuler le workflow
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Êtes-vous sûr de vouloir annuler ce workflow ? Cette action est irréversible.
            </p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-4"
              rows={3}
              placeholder="Raison de l'annulation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling || !cancelReason.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
