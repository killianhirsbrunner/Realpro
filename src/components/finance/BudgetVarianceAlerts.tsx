import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { AlertTriangle, TrendingUp, TrendingDown, Info, X } from 'lucide-react';

interface BudgetVariance {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  severity: 'info' | 'warning' | 'danger';
  description?: string;
}

interface BudgetVarianceAlertsProps {
  variances: BudgetVariance[];
  onDismiss?: (id: string) => void;
  showDismissed?: boolean;
  className?: string;
}

export function BudgetVarianceAlerts({
  variances,
  onDismiss,
  showDismissed = false,
  className = '',
}: BudgetVarianceAlertsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'danger':
        return designTokens.colors.light.danger;
      case 'warning':
        return designTokens.colors.light.warning;
      case 'info':
        return designTokens.colors.light.info;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getSeverityIcon(severity: string) {
    switch (severity) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  }

  function getSeverityLabel(severity: string) {
    switch (severity) {
      case 'danger':
        return 'Dépassement critique';
      case 'warning':
        return 'Attention requise';
      case 'info':
        return 'Information';
      default:
        return '';
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

  function formatPercent(percent: number) {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  }

  const sortedVariances = [...variances].sort((a, b) => {
    const severityOrder = { danger: 0, warning: 1, info: 2 };
    return (
      severityOrder[a.severity] - severityOrder[b.severity] ||
      Math.abs(b.variance) - Math.abs(a.variance)
    );
  });

  const criticalCount = variances.filter(v => v.severity === 'danger').length;
  const warningCount = variances.filter(v => v.severity === 'warning').length;

  return (
    <div className={className}>
      {/* Summary Header */}
      {variances.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          {criticalCount > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isDark
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                color: designTokens.colors.light.danger,
              }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {criticalCount} dépassement{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {warningCount > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isDark
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(245, 158, 11, 0.1)',
                color: designTokens.colors.light.warning,
              }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {warningCount} avertissement{warningCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {sortedVariances.length === 0 ? (
          <div
            className="p-6 rounded-lg text-center"
            style={{
              backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
              borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
              borderWidth: '1px',
            }}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary }}>
              <Info className="w-6 h-6" style={{ color: designTokens.colors.light.success }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Budget sous contrôle
            </p>
            <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Aucun dépassement budgétaire détecté
            </p>
          </div>
        ) : (
          sortedVariances.map((variance) => {
            const severityColor = getSeverityColor(variance.severity);
            const isOverBudget = variance.variance > 0;

            return (
              <div
                key={variance.id}
                className="p-4 rounded-lg relative group"
                style={{
                  backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                  borderColor: severityColor,
                  borderWidth: '1px',
                  borderLeftWidth: '4px',
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${severityColor}20` }}
                  >
                    <span style={{ color: severityColor }}>
                      {getSeverityIcon(variance.severity)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                        >
                          {variance.category}
                        </h4>
                        <p
                          className="text-xs"
                          style={{ color: severityColor }}
                        >
                          {getSeverityLabel(variance.severity)}
                        </p>
                      </div>

                      {/* Variance Badge */}
                      <div
                        className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: `${severityColor}20`,
                          color: severityColor,
                        }}
                      >
                        {isOverBudget ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatPercent(variance.variancePercent)}
                      </div>
                    </div>

                    {/* Budget Details */}
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                          Budgété
                        </p>
                        <p className="text-sm font-medium" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                          {formatAmount(variance.budgeted)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                          Réel
                        </p>
                        <p className="text-sm font-medium" style={{ color: severityColor }}>
                          {formatAmount(variance.actual)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                          Écart
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: severityColor }}
                        >
                          {isOverBudget ? '+' : ''}
                          {formatAmount(variance.variance)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {variance.description && (
                      <p
                        className="text-xs"
                        style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
                      >
                        {variance.description}
                      </p>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(variance.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-opacity-10"
                      style={{
                        color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                      }}
                      title="Ignorer cette alerte"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
