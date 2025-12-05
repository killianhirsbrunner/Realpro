import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { CheckCircle2, Circle, AlertCircle, Camera, FileText, Download } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description?: string;
  status: 'pending' | 'ok' | 'issue' | 'na';
  photos?: string[];
  notes?: string;
  responsible?: string;
}

interface HandoverInspectionChecklistProps {
  lotNumber: string;
  buyerName: string;
  items: ChecklistItem[];
  onItemUpdate: (itemId: string, status: ChecklistItem['status'], notes?: string) => void;
  onPhotoAdd: (itemId: string, photo: File) => void;
  onExport?: () => void;
  readOnly?: boolean;
  className?: string;
}

export function HandoverInspectionChecklist({
  lotNumber,
  buyerName,
  items,
  onItemUpdate,
  onPhotoAdd,
  onExport,
  readOnly = false,
  className = '',
}: HandoverInspectionChecklistProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  function toggleExpanded(itemId: string) {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'ok':
        return designTokens.colors.light.success;
      case 'issue':
        return designTokens.colors.light.danger;
      case 'na':
        return designTokens.colors.light.accent;
      case 'pending':
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'issue':
        return <AlertCircle className="w-5 h-5" />;
      case 'na':
        return <Circle className="w-5 h-5" />;
      case 'pending':
      default:
        return <Circle className="w-5 h-5" />;
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ok: 'Conforme',
      issue: 'À corriger',
      na: 'Non applicable',
      pending: 'En attente',
    };
    return labels[status] || status;
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const totalItems = items.length;
  const completedItems = items.filter(i => i.status !== 'pending').length;
  const issuesCount = items.filter(i => i.status === 'issue').length;
  const okCount = items.filter(i => i.status === 'ok').length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

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
            <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Checklist de réception
            </h2>
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Lot {lotNumber} - {buyerName}
            </p>
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: designTokens.colors.light.brand,
                color: '#ffffff',
              }}
            >
              <Download className="w-4 h-4" />
              Exporter PDF
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Progression
            </span>
            <span className="text-sm font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              {completedItems}/{totalItems} ({completionPercentage.toFixed(0)}%)
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
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: designTokens.colors.light.success }}>
              {okCount}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Conformes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: designTokens.colors.light.danger }}>
              {issuesCount}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              À corriger
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              {totalItems - completedItems}
            </div>
            <div className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              En attente
            </div>
          </div>
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const categoryCompleted = categoryItems.filter(i => i.status !== 'pending').length;
          const categoryTotal = categoryItems.length;
          const categoryPercentage = (categoryCompleted / categoryTotal) * 100;

          return (
            <div
              key={category}
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
                borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                borderWidth: '1px',
              }}
            >
              {/* Category Header */}
              <div className="p-4 border-b" style={{ borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    {category}
                  </h3>
                  <span className="text-sm font-medium" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                    {categoryCompleted}/{categoryTotal}
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${categoryPercentage}%`,
                      backgroundColor: designTokens.colors.light.brand,
                    }}
                  />
                </div>
              </div>

              {/* Category Items */}
              <div className="divide-y" style={{ borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border }}>
                {categoryItems.map((item) => {
                  const isExpanded = expandedItems.has(item.id);
                  const statusColor = getStatusColor(item.status);

                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Status Buttons */}
                        {!readOnly && (
                          <div className="flex flex-col gap-1">
                            {(['ok', 'issue', 'na'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => onItemUpdate(item.id, status, item.notes)}
                                className="p-2 rounded transition-colors"
                                style={{
                                  backgroundColor: item.status === status
                                    ? `${getStatusColor(status)}20`
                                    : 'transparent',
                                  color: getStatusColor(status),
                                }}
                                title={getStatusLabel(status)}
                              >
                                {getStatusIcon(status)}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Item Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                                {item.item}
                              </h4>
                              {item.description && (
                                <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Status Badge */}
                            <div
                              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                              style={{
                                backgroundColor: `${statusColor}20`,
                                color: statusColor,
                              }}
                            >
                              {getStatusIcon(item.status)}
                              {getStatusLabel(item.status)}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 space-y-3">
                              {/* Notes */}
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                                  Remarques
                                </label>
                                {editingNotes === item.id && !readOnly ? (
                                  <textarea
                                    value={item.notes || ''}
                                    onChange={(e) => onItemUpdate(item.id, item.status, e.target.value)}
                                    onBlur={() => setEditingNotes(null)}
                                    className="w-full px-3 py-2 rounded-lg text-sm"
                                    style={{
                                      backgroundColor: isDark ? designTokens.colors.dark.background : '#ffffff',
                                      borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                                      borderWidth: '1px',
                                      color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                                    }}
                                    rows={3}
                                    autoFocus
                                  />
                                ) : (
                                  <p
                                    onClick={() => !readOnly && setEditingNotes(item.id)}
                                    className="text-sm p-2 rounded cursor-text"
                                    style={{
                                      backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                                      color: item.notes
                                        ? isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground
                                        : isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                                    }}
                                  >
                                    {item.notes || 'Cliquez pour ajouter des remarques...'}
                                  </p>
                                )}
                              </div>

                              {/* Photos */}
                              {item.photos && item.photos.length > 0 && (
                                <div>
                                  <label className="text-xs font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                                    Photos ({item.photos.length})
                                  </label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {item.photos.map((photo, index) => (
                                      <div
                                        key={index}
                                        className="aspect-square rounded-lg overflow-hidden"
                                        style={{
                                          backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                                        }}
                                      >
                                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Add Photo Button */}
                              {!readOnly && (
                                <button
                                  onClick={() => {}}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                  style={{
                                    backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                                    color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                                  }}
                                >
                                  <Camera className="w-4 h-4" />
                                  Ajouter une photo
                                </button>
                              )}
                            </div>
                          )}

                          {/* Toggle Details */}
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="text-xs font-medium mt-2 transition-colors"
                            style={{ color: designTokens.colors.light.brand }}
                          >
                            {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
