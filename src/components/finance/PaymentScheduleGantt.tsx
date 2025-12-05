import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { format, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Payment {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'buyer' | 'supplier' | 'contractor';
}

interface PaymentScheduleGanttProps {
  payments: Payment[];
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

export function PaymentScheduleGantt({
  payments,
  startDate,
  endDate,
  className = '',
}: PaymentScheduleGanttProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (payments.length === 0) {
      return {
        minDate: startDate || new Date(),
        maxDate: endDate || new Date(),
        totalDays: 30,
      };
    }

    const dates = payments.map(p => parseISO(p.due_date));
    const min = startDate || new Date(Math.min(...dates.map(d => d.getTime())));
    const max = endDate || new Date(Math.max(...dates.map(d => d.getTime())));
    const days = differenceInDays(max, min) || 30;

    return {
      minDate: min,
      maxDate: max,
      totalDays: days,
    };
  }, [payments, startDate, endDate]);

  function getPositionAndWidth(payment: Payment) {
    const dueDate = parseISO(payment.due_date);
    const daysSinceStart = differenceInDays(dueDate, minDate);
    const position = (daysSinceStart / totalDays) * 100;

    return {
      left: `${Math.max(0, Math.min(100, position))}%`,
      width: '4px',
    };
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'paid':
        return designTokens.colors.status.paid;
      case 'pending':
        return designTokens.colors.status.pending;
      case 'overdue':
        return designTokens.colors.status.overdue;
      case 'cancelled':
        return designTokens.colors.status.draft;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const months = useMemo(() => {
    const result: Array<{ month: string; position: number; width: number }> = [];
    const current = new Date(minDate);
    let lastMonth = current.getMonth();

    while (current <= maxDate) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

      const startPos = Math.max(0, differenceInDays(monthStart, minDate));
      const endPos = Math.min(totalDays, differenceInDays(monthEnd, minDate));
      const position = (startPos / totalDays) * 100;
      const width = ((endPos - startPos) / totalDays) * 100;

      result.push({
        month: format(monthStart, 'MMM yyyy', { locale: fr }),
        position,
        width,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }, [minDate, maxDate, totalDays]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className={className}>
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
            borderWidth: '1px',
          }}
        >
          <div className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
            Total
          </div>
          <div className="text-xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            {formatAmount(totalAmount)}
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.status.paid,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
            Payé
          </div>
          <div className="text-xl font-bold" style={{ color: designTokens.colors.status.paid }}>
            {formatAmount(paidAmount)}
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.status.pending,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
            En attente
          </div>
          <div className="text-xl font-bold" style={{ color: designTokens.colors.status.pending }}>
            {formatAmount(pendingAmount)}
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.status.overdue,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
            En retard
          </div>
          <div className="text-xl font-bold" style={{ color: designTokens.colors.status.overdue }}>
            {formatAmount(overdueAmount)}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
          Calendrier des paiements
        </h3>

        {/* Timeline Header (Months) */}
        <div className="relative h-10 mb-4">
          <div
            className="absolute inset-0 flex"
            style={{
              borderBottom: `1px solid ${isDark ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
            }}
          >
            {months.map((month, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-xs font-medium"
                style={{
                  position: 'absolute',
                  left: `${month.position}%`,
                  width: `${month.width}%`,
                  color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                  borderLeft: `1px solid ${isDark ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
                }}
              >
                {month.month}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Rows */}
        <div className="space-y-2">
          {payments.map((payment) => {
            const position = getPositionAndWidth(payment);
            const statusColor = getStatusColor(payment.status);

            return (
              <div
                key={payment.id}
                className="relative h-16 rounded group hover:bg-opacity-50 transition-all"
                style={{
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Payment Info (Left) */}
                <div className="absolute left-0 top-0 bottom-0 w-64 flex items-center px-3 z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: statusColor }}
                    >
                      <span className="text-white">{getStatusIcon(payment.status)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                      >
                        {payment.description}
                      </p>
                      <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                        {formatAmount(payment.amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Area */}
                <div className="absolute left-64 right-0 top-0 bottom-0">
                  <div className="relative h-full">
                    {/* Payment Marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 cursor-pointer group/marker"
                      style={{
                        left: position.left,
                        zIndex: 20,
                      }}
                    >
                      <div
                        className="w-4 h-12 rounded-full transition-all group-hover/marker:scale-125"
                        style={{ backgroundColor: statusColor }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                      </div>

                      {/* Tooltip on hover */}
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
                          boxShadow: designTokens.shadows.card,
                          border: `1px solid ${isDark ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
                        }}
                      >
                        <div className="font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                          {payment.description}
                        </div>
                        <div style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                          Échéance: {format(parseISO(payment.due_date), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        {payment.paid_date && (
                          <div style={{ color: designTokens.colors.status.paid }}>
                            Payé: {format(parseISO(payment.paid_date), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today Marker */}
        <div className="relative h-0 -mt-2">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30"
            style={{
              left: `${(differenceInDays(new Date(), minDate) / totalDays) * 100}%`,
              marginLeft: '16rem',
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-red-500 whitespace-nowrap">
              Aujourd'hui
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
