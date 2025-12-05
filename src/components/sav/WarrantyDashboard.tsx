import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { Shield, Clock, AlertTriangle, CheckCircle2, Calendar, FileText, TrendingUp } from 'lucide-react';
import { format, differenceInDays, parseISO, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Warranty {
  id: string;
  lot_number: string;
  buyer_name: string;
  category: string;
  description: string;
  start_date: string;
  duration_years: number;
  end_date: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'claimed';
  claims_count: number;
  last_inspection_date?: string;
  next_inspection_date?: string;
  documents_count: number;
}

interface WarrantyDashboardProps {
  warranties: Warranty[];
  onWarrantyClick?: (warrantyId: string) => void;
  onInspectionSchedule?: (warrantyId: string) => void;
  className?: string;
}

export function WarrantyDashboard({
  warranties,
  onWarrantyClick,
  onInspectionSchedule,
  className = '',
}: WarrantyDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function getWarrantyStatus(warranty: Warranty): {
    status: string;
    color: string;
    icon: React.ReactNode;
    daysRemaining: number;
  } {
    const endDate = parseISO(warranty.end_date);
    const daysRemaining = differenceInDays(endDate, new Date());

    if (daysRemaining < 0) {
      return {
        status: 'Expirée',
        color: designTokens.colors.light.danger,
        icon: <AlertTriangle className="w-4 h-4" />,
        daysRemaining: 0,
      };
    }

    if (daysRemaining <= 90) {
      return {
        status: 'Expire bientôt',
        color: designTokens.colors.light.warning,
        icon: <Clock className="w-4 h-4" />,
        daysRemaining,
      };
    }

    if (warranty.status === 'claimed') {
      return {
        status: 'Réclamation en cours',
        color: designTokens.colors.light.info,
        icon: <FileText className="w-4 h-4" />,
        daysRemaining,
      };
    }

    return {
      status: 'Active',
      color: designTokens.colors.light.success,
      icon: <CheckCircle2 className="w-4 h-4" />,
      daysRemaining,
    };
  }

  function getProgressPercentage(warranty: Warranty): number {
    const startDate = parseISO(warranty.start_date);
    const endDate = parseISO(warranty.end_date);
    const totalDays = differenceInDays(endDate, startDate);
    const daysPassed = differenceInDays(new Date(), startDate);
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  }

  const activeWarranties = warranties.filter(w => {
    const daysRemaining = differenceInDays(parseISO(w.end_date), new Date());
    return daysRemaining > 0;
  });

  const expiringWarranties = warranties.filter(w => {
    const daysRemaining = differenceInDays(parseISO(w.end_date), new Date());
    return daysRemaining > 0 && daysRemaining <= 90;
  });

  const expiredWarranties = warranties.filter(w => {
    const daysRemaining = differenceInDays(parseISO(w.end_date), new Date());
    return daysRemaining <= 0;
  });

  const claimedWarranties = warranties.filter(w => w.status === 'claimed');

  const totalClaims = warranties.reduce((sum, w) => sum + w.claims_count, 0);

  return (
    <div className={className}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
            borderWidth: '1px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Total Garanties
              </p>
              <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                {warranties.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.light.success,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Actives
              </p>
              <p className="text-2xl font-bold" style={{ color: designTokens.colors.light.success }}>
                {activeWarranties.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.light.warning,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Expirent bientôt
              </p>
              <p className="text-2xl font-bold" style={{ color: designTokens.colors.light.warning }}>
                {expiringWarranties.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.light.danger,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Expirées
              </p>
              <p className="text-2xl font-bold" style={{ color: designTokens.colors.light.danger }}>
                {expiredWarranties.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
            borderColor: designTokens.colors.light.info,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Réclamations
              </p>
              <p className="text-2xl font-bold" style={{ color: designTokens.colors.light.info }}>
                {totalClaims}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warranties Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border }}>
          <h3 className="text-lg font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
            Registre des garanties
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                }}
              >
                <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Lot / Acheteur
                </th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Catégorie
                </th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Durée
                </th>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Progression
                </th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Statut
                </th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Réclamations
                </th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {warranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }} />
                    <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                      Aucune garantie enregistrée
                    </p>
                  </td>
                </tr>
              ) : (
                warranties.map((warranty) => {
                  const { status, color, icon, daysRemaining } = getWarrantyStatus(warranty);
                  const progress = getProgressPercentage(warranty);

                  return (
                    <tr
                      key={warranty.id}
                      className="border-t cursor-pointer hover:bg-opacity-50 transition-colors"
                      style={{
                        borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                      }}
                      onClick={() => onWarrantyClick?.(warranty.id)}
                    >
                      {/* Lot / Buyer */}
                      <td className="p-4">
                        <div>
                          <p className="font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                            Lot {warranty.lot_number}
                          </p>
                          <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                            {warranty.buyer_name}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <div>
                          <p className="font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                            {warranty.category}
                          </p>
                          <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                            {warranty.description}
                          </p>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="p-4">
                        <div>
                          <p className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                            {warranty.duration_years} ans
                          </p>
                          <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                            {format(parseISO(warranty.start_date), 'dd MMM yyyy', { locale: fr })}
                            {' → '}
                            {format(parseISO(warranty.end_date), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="p-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                              {progress.toFixed(0)}%
                            </span>
                            <span className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                              {daysRemaining}j restants
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-300"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                            }}
                          >
                            {icon}
                            {status}
                          </div>
                        </div>
                      </td>

                      {/* Claims */}
                      <td className="p-4">
                        <div className="flex justify-center">
                          {warranty.claims_count > 0 ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{
                                backgroundColor: `${designTokens.colors.light.warning}20`,
                                color: designTokens.colors.light.warning,
                              }}
                            >
                              {warranty.claims_count}
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                              -
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          {warranty.next_inspection_date && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onInspectionSchedule?.(warranty.id);
                              }}
                              className="p-2 rounded hover:bg-opacity-10 transition-colors"
                              style={{ color: designTokens.colors.light.info }}
                              title="Planifier inspection"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onWarrantyClick?.(warranty.id);
                            }}
                            className="px-3 py-1 rounded text-xs font-medium transition-colors"
                            style={{
                              backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                              color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                            }}
                          >
                            Voir détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiring Soon Alert */}
      {expiringWarranties.length > 0 && (
        <div
          className="mt-6 p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderColor: designTokens.colors.light.warning,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: designTokens.colors.light.warning }} />
          <div>
            <p className="font-semibold mb-1" style={{ color: designTokens.colors.light.warning }}>
              {expiringWarranties.length} garantie{expiringWarranties.length > 1 ? 's' : ''} expire{expiringWarranties.length > 1 ? 'nt' : ''} dans les 90 prochains jours
            </p>
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Planifiez des inspections de fin de garantie pour ces lots
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
