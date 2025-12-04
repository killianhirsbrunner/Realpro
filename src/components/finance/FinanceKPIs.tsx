import { TrendingUp, DollarSign, FileText, CheckCircle } from 'lucide-react';

interface FinanceKPIsProps {
  data: {
    totalBudget: number;
    engaged: number;
    invoiced: number;
    paid: number;
    totalEngagements: number;
    totalInvoices: number;
    totalPaid: number;
    pendingPayments: number;
  };
}

export function FinanceKPIs({ data }: FinanceKPIsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const kpis = [
    {
      label: 'Budget total CFC',
      value: formatCurrency(data.totalBudget),
      icon: DollarSign,
      color: 'bg-brand-600'
    },
    {
      label: 'Engagé',
      value: `${data.engaged.toFixed(1)}%`,
      subtitle: formatCurrency(data.totalEngagements),
      icon: TrendingUp,
      color: 'bg-secondary-600'
    },
    {
      label: 'Facturé',
      value: `${data.invoiced.toFixed(1)}%`,
      subtitle: formatCurrency(data.totalInvoices),
      icon: FileText,
      color: 'bg-blue-600'
    },
    {
      label: 'Payé',
      value: `${data.paid.toFixed(1)}%`,
      subtitle: formatCurrency(data.totalPaid),
      icon: CheckCircle,
      color: 'bg-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${kpi.color} flex items-center justify-center shadow-lg`}>
              <kpi.icon className="w-6 h-6 text-white" />
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            {kpi.label}
          </p>

          <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
            {kpi.value}
          </p>

          {kpi.subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {kpi.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
