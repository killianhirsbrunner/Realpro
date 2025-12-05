import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { CheckCircle2, Clock, AlertCircle, User, FileText, Send } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Signatory {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  sent_date?: string;
  viewed_date?: string;
  signed_date?: string;
  declined_date?: string;
  order: number;
  is_required: boolean;
}

interface SignatureProgressTrackerProps {
  signatories: Signatory[];
  documentName: string;
  onRemind?: (signatoryId: string) => void;
  onResend?: (signatoryId: string) => void;
  className?: string;
}

export function SignatureProgressTracker({
  signatories,
  documentName,
  onRemind,
  onResend,
  className = '',
}: SignatureProgressTrackerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function getStatusColor(status: string): string {
    switch (status) {
      case 'signed':
        return designTokens.colors.light.success;
      case 'viewed':
        return designTokens.colors.light.info;
      case 'sent':
        return designTokens.colors.light.warning;
      case 'declined':
        return designTokens.colors.light.danger;
      case 'pending':
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'viewed':
        return <FileText className="w-5 h-5" />;
      case 'sent':
        return <Send className="w-5 h-5" />;
      case 'declined':
        return <AlertCircle className="w-5 h-5" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5" />;
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      signed: 'Signé',
      viewed: 'Consulté',
      sent: 'Envoyé',
      declined: 'Refusé',
      pending: 'En attente',
    };
    return labels[status] || status;
  }

  const sortedSignatories = [...signatories].sort((a, b) => a.order - b.order);
  const totalSignatories = signatories.length;
  const signedCount = signatories.filter(s => s.status === 'signed').length;
  const pendingCount = signatories.filter(s => s.status === 'pending' || s.status === 'sent' || s.status === 'viewed').length;
  const declinedCount = signatories.filter(s => s.status === 'declined').length;
  const completionPercentage = (signedCount / totalSignatories) * 100;

  const allSigned = signatories.every(s => !s.is_required || s.status === 'signed');

  return (
    <div className={className}>
      {/* Header */}
      <div
        className="p-6 rounded-lg mb-6"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Suivi des signatures
            </h3>
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              {documentName}
            </p>
          </div>

          {allSigned && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: `${designTokens.colors.light.success}20`,
                color: designTokens.colors.light.success,
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Document complètement signé</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Progression des signatures
            </span>
            <span className="text-sm font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              {signedCount}/{totalSignatories} ({completionPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${completionPercentage}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: designTokens.colors.light.success }}>
              {signedCount}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Signé{signedCount > 1 ? 's' : ''}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: designTokens.colors.light.warning }}>
              {pendingCount}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              En attente
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: designTokens.colors.light.danger }}>
              {declinedCount}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Refusé{declinedCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Signatories List */}
      <div className="space-y-3">
        {sortedSignatories.map((signatory, index) => {
          const statusColor = getStatusColor(signatory.status);
          const statusIcon = getStatusIcon(signatory.status);
          const isActive = index === 0 || sortedSignatories[index - 1].status === 'signed';
          const daysSinceSent = signatory.sent_date
            ? differenceInDays(new Date(), parseISO(signatory.sent_date))
            : 0;
          const isOverdue = daysSinceSent > 7 && signatory.status !== 'signed';

          return (
            <div
              key={signatory.id}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                borderColor: signatory.status === 'signed'
                  ? designTokens.colors.light.success
                  : isOverdue
                  ? designTokens.colors.light.danger
                  : isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                borderWidth: '1px',
                borderLeftWidth: signatory.status === 'signed' || isOverdue ? '4px' : '1px',
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Order Badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${statusColor}20`,
                    color: statusColor,
                  }}
                >
                  {signatory.order}
                </div>

                {/* Signatory Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                          {signatory.name}
                        </h4>
                        {signatory.is_required && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${designTokens.colors.light.danger}20`,
                              color: designTokens.colors.light.danger,
                            }}
                          >
                            Obligatoire
                          </span>
                        )}
                        {isOverdue && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                            style={{
                              backgroundColor: `${designTokens.colors.light.warning}20`,
                              color: designTokens.colors.light.warning,
                            }}
                          >
                            <AlertCircle className="w-3 h-3" />
                            En retard
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                        {signatory.role}
                      </p>
                      <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                        {signatory.email}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: `${statusColor}20`,
                        color: statusColor,
                      }}
                    >
                      {statusIcon}
                      {getStatusLabel(signatory.status)}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                    {signatory.sent_date && (
                      <div className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Envoyé le {format(parseISO(signatory.sent_date), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    )}
                    {signatory.viewed_date && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Consulté le {format(parseISO(signatory.viewed_date), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    )}
                    {signatory.signed_date && (
                      <div className="flex items-center gap-1" style={{ color: designTokens.colors.light.success }}>
                        <CheckCircle2 className="w-3 h-3" />
                        Signé le {format(parseISO(signatory.signed_date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </div>
                    )}
                    {signatory.declined_date && (
                      <div className="flex items-center gap-1" style={{ color: designTokens.colors.light.danger }}>
                        <AlertCircle className="w-3 h-3" />
                        Refusé le {format(parseISO(signatory.declined_date), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {signatory.status !== 'signed' && signatory.status !== 'declined' && (
                    <div className="flex items-center gap-2 mt-3">
                      {onRemind && signatory.sent_date && (
                        <button
                          onClick={() => onRemind(signatory.id)}
                          className="px-3 py-1 rounded text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                            color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                          }}
                        >
                          Relancer
                        </button>
                      )}
                      {onResend && signatory.status === 'declined' && (
                        <button
                          onClick={() => onResend(signatory.id)}
                          className="px-3 py-1 rounded text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: designTokens.colors.light.brand,
                            color: '#ffffff',
                          }}
                        >
                          Renvoyer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning for overdue signatures */}
      {signatories.some(s => {
        const daysSinceSent = s.sent_date ? differenceInDays(new Date(), parseISO(s.sent_date)) : 0;
        return daysSinceSent > 7 && s.status !== 'signed';
      }) && (
        <div
          className="mt-6 p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderColor: designTokens.colors.light.warning,
            borderWidth: '1px',
            borderLeftWidth: '4px',
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: designTokens.colors.light.warning }} />
          <div>
            <p className="font-semibold mb-1" style={{ color: designTokens.colors.light.warning }}>
              Signatures en retard
            </p>
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Certains signataires n'ont pas encore signé malgré un délai de plus de 7 jours. Pensez à les relancer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
