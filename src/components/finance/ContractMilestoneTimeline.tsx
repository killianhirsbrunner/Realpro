import { Timeline } from '../ui/Timeline';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, Clock, AlertCircle, FileText, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContractMilestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  due_date: string;
  completed_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  payment_status?: 'unpaid' | 'paid' | 'partial';
  completion_percentage?: number;
  documents_count?: number;
}

interface ContractMilestoneTimelineProps {
  milestones: ContractMilestone[];
  contractName?: string;
  totalAmount?: number;
  className?: string;
}

export function ContractMilestoneTimeline({
  milestones,
  contractName,
  totalAmount,
  className = '',
}: ContractMilestoneTimelineProps) {
  const { theme } = useTheme();

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function getMilestoneStatus(milestone: ContractMilestone): 'success' | 'warning' | 'danger' | 'info' {
    if (milestone.status === 'completed') return 'success';
    if (milestone.status === 'overdue') return 'danger';
    if (milestone.status === 'in_progress') return 'warning';
    return 'info';
  }

  function getMilestoneIcon(milestone: ContractMilestone) {
    if (milestone.status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-white" />;
    }
    if (milestone.status === 'overdue') {
      return <AlertCircle className="w-5 h-5 text-white" />;
    }
    return <Clock className="w-5 h-5 text-white" />;
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'overdue':
        return 'En retard';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  }

  function getPaymentStatusLabel(status?: string): string {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'partial':
        return 'Paiement partiel';
      case 'unpaid':
        return 'Non payé';
      default:
        return '-';
    }
  }

  const completedAmount = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.amount, 0);

  const pendingAmount = milestones
    .filter(m => m.status !== 'completed')
    .reduce((sum, m) => sum + m.amount, 0);

  const completionPercentage = totalAmount
    ? (completedAmount / totalAmount) * 100
    : milestones.length > 0
    ? (milestones.filter(m => m.status === 'completed').length / milestones.length) * 100
    : 0;

  const timelineItems = milestones.map(milestone => ({
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || formatAmount(milestone.amount),
    timestamp: milestone.completed_date || milestone.due_date,
    icon: getMilestoneIcon(milestone),
    status: getMilestoneStatus(milestone),
    metadata: {
      Montant: formatAmount(milestone.amount),
      Statut: getStatusLabel(milestone.status),
      ...(milestone.payment_status && {
        Paiement: getPaymentStatusLabel(milestone.payment_status),
      }),
      ...(milestone.completion_percentage !== undefined && {
        'Avancement': `${milestone.completion_percentage}%`,
      }),
      ...(milestone.documents_count && {
        Documents: `${milestone.documents_count}`,
      }),
      ...(milestone.completed_date
        ? {
            Complété: format(parseISO(milestone.completed_date), 'dd MMM yyyy', {
              locale: fr,
            }),
          }
        : {
            Échéance: format(parseISO(milestone.due_date), 'dd MMM yyyy', {
              locale: fr,
            }),
          }),
    },
  }));

  return (
    <div className={className}>
      {/* Contract Summary */}
      {contractName && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {contractName}
          </h3>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Avancement du contrat
              </span>
              <span className="text-sm font-bold">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${completionPercentage}%`,
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                }}
              />
            </div>
          </div>

          {/* Amount Summary */}
          {totalAmount && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Total contrat
                </p>
                <p className="text-lg font-bold">
                  {formatAmount(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Complété
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatAmount(completedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Restant
                </p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {formatAmount(pendingAmount)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Milestones Timeline */}
      <div className="mt-6">
        <h4 className="text-base font-semibold mb-4">
          Jalons du contrat ({milestones.length})
        </h4>

        {milestones.length === 0 ? (
          <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun jalon défini pour ce contrat</p>
          </div>
        ) : (
          <Timeline items={timelineItems} variant="vertical" />
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-neutral-600 dark:text-neutral-400">Terminé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-neutral-600 dark:text-neutral-400">En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-neutral-600 dark:text-neutral-400">En retard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-neutral-600 dark:text-neutral-400">En attente</span>
        </div>
      </div>
    </div>
  );
}
