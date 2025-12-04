import { Building2, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface Contract {
  id: string;
  number: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  signed_at: string | null;
  start_date: string | null;
  end_date: string | null;
  company?: {
    name: string;
    type: string;
  };
  cfc_line?: {
    code: string;
    label: string;
  };
}

interface ContractCardProps {
  contract: Contract;
  onClick?: () => void;
}

export function ContractCard({ contract, onClick }: ContractCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-CH');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ACTIVE':
        return 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400';
      case 'COMPLETED':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case 'DRAFT':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SIGNED':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'ACTIVE':
        return <Clock className="w-4 h-4 animate-pulse" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800',
        'shadow-sm hover:shadow-md transition-all duration-200',
        onClick && 'cursor-pointer hover:border-brand-300 dark:hover:border-brand-700'
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
              <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                {contract.number}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {contract.name}
              </h3>
            </div>
          </div>
          <div className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
            getStatusColor(contract.status)
          )}>
            {getStatusIcon(contract.status)}
            {contract.status}
          </div>
        </div>

        {contract.company && (
          <div className="mb-4">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {contract.company.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {contract.company.type}
            </p>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Montant</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(contract.amount)}
            </span>
          </div>

          {contract.cfc_line && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">CFC</span>
              <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                {contract.cfc_line.code} - {contract.cfc_line.label}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Début: {formatDate(contract.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Fin: {formatDate(contract.end_date)}</span>
          </div>
        </div>

        {contract.signed_at && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            Signé le {formatDate(contract.signed_at)}
          </div>
        )}
      </div>
    </div>
  );
}
