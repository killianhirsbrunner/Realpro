import { CheckCircle, Circle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { WorkflowInstance, WorkflowStepInstance } from '../../hooks/useWorkflow';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkflowProgressProps {
  instance: WorkflowInstance;
  onStepClick?: (step: WorkflowStepInstance) => void;
}

export function WorkflowProgress({ instance, onStepClick }: WorkflowProgressProps) {
  if (!instance.workflow_steps) {
    return null;
  }

  const steps = [...instance.workflow_steps].sort((a, b) => a.step_order - b.step_order);

  const getStepIcon = (step: WorkflowStepInstance) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'skipped':
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const getStepStatusColor = (step: WorkflowStepInstance) => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'skipped':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStepStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      skipped: 'Ignoré',
      failed: 'Échoué',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progression du workflow
          </span>
          <span className="text-sm text-gray-600">
            {steps.filter(s => s.status === 'completed').length} / {steps.length} étapes
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-realpro-turquoise h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative flex items-start p-4 border rounded-lg transition-all ${
              getStepStatusColor(step)
            } ${
              onStepClick ? 'cursor-pointer hover:shadow-md' : ''
            }`}
            onClick={() => onStepClick?.(step)}
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-gray-300 -mb-3" />
            )}

            {/* Step icon */}
            <div className="flex-shrink-0 relative z-10">
              {getStepIcon(step)}
            </div>

            {/* Step content */}
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {step.step_name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      step.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStepStatusLabel(step.status)}
                    </span>
                  </div>

                  {/* Step metadata */}
                  <div className="mt-1 space-y-1">
                    {step.assigned_user && (
                      <p className="text-xs text-gray-600">
                        Assigné à : {step.assigned_user.first_name} {step.assigned_user.last_name}
                      </p>
                    )}
                    {step.assigned_role && !step.assigned_user && (
                      <p className="text-xs text-gray-600">
                        Rôle requis : <span className="font-medium">{step.assigned_role}</span>
                      </p>
                    )}
                    {step.requires_approval && step.status === 'in_progress' && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>Nécessite une approbation</span>
                      </div>
                    )}
                    {step.approved_by && step.approved_user && (
                      <p className="text-xs text-green-600">
                        ✓ Approuvé par {step.approved_user.first_name} {step.approved_user.last_name}
                        {step.approved_at && ` il y a ${formatDistanceToNow(new Date(step.approved_at), { locale: fr })}`}
                      </p>
                    )}
                    {step.rejection_reason && (
                      <p className="text-xs text-red-600">
                        ✗ Rejeté : {step.rejection_reason}
                      </p>
                    )}
                  </div>

                  {/* Timing */}
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    {step.started_at && (
                      <span>
                        Démarré {formatDistanceToNow(new Date(step.started_at), { locale: fr, addSuffix: true })}
                      </span>
                    )}
                    {step.completed_at && (
                      <span>
                        Terminé {formatDistanceToNow(new Date(step.completed_at), { locale: fr, addSuffix: true })}
                      </span>
                    )}
                    {step.due_date && step.status !== 'completed' && (
                      <span className={
                        new Date(step.due_date) < new Date() ? 'text-red-600 font-medium' : ''
                      }>
                        Échéance : {formatDistanceToNow(new Date(step.due_date), { locale: fr, addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow metadata */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Informations du workflow</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Statut :</span>
            <span className={`ml-2 font-medium ${
              instance.status === 'completed' ? 'text-green-600' :
              instance.status === 'active' ? 'text-blue-600' :
              instance.status === 'cancelled' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {instance.status === 'completed' ? 'Terminé' :
               instance.status === 'active' ? 'En cours' :
               instance.status === 'cancelled' ? 'Annulé' :
               instance.status === 'on_hold' ? 'En pause' :
               'Échoué'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Démarré :</span>
            <span className="ml-2 text-gray-900">
              {formatDistanceToNow(new Date(instance.started_at), { locale: fr, addSuffix: true })}
            </span>
          </div>
          {instance.initiator && (
            <div>
              <span className="text-gray-600">Initié par :</span>
              <span className="ml-2 text-gray-900">
                {instance.initiator.first_name} {instance.initiator.last_name}
              </span>
            </div>
          )}
          {instance.completed_at && (
            <div>
              <span className="text-gray-600">Terminé :</span>
              <span className="ml-2 text-gray-900">
                {formatDistanceToNow(new Date(instance.completed_at), { locale: fr, addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
