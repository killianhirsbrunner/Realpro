import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { FileText, GitCompare, Plus, Minus, ArrowRight, Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActVersion {
  id: string;
  version: number;
  date: string;
  author: string;
  changes_summary: string;
  content: string;
  status: 'draft' | 'review' | 'approved' | 'signed';
}

interface Change {
  type: 'addition' | 'deletion' | 'modification';
  oldText?: string;
  newText?: string;
  lineNumber: number;
  section: string;
}

interface ActVersionComparisonProps {
  versions: ActVersion[];
  selectedVersions?: [string, string];
  onVersionSelect?: (v1: string, v2: string) => void;
  className?: string;
}

export function ActVersionComparison({
  versions,
  selectedVersions,
  onVersionSelect,
  className = '',
}: ActVersionComparisonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [version1, setVersion1] = useState<string>(selectedVersions?.[0] || versions[versions.length - 2]?.id || '');
  const [version2, setVersion2] = useState<string>(selectedVersions?.[1] || versions[versions.length - 1]?.id || '');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('unified');

  const v1 = versions.find(v => v.id === version1);
  const v2 = versions.find(v => v.id === version2);

  function getStatusColor(status: string): string {
    switch (status) {
      case 'signed':
        return designTokens.colors.light.success;
      case 'approved':
        return designTokens.colors.light.info;
      case 'review':
        return designTokens.colors.light.warning;
      case 'draft':
        return designTokens.colors.light.accent;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      signed: 'Signé',
      approved: 'Approuvé',
      review: 'En révision',
      draft: 'Brouillon',
    };
    return labels[status] || status;
  }

  function compareVersions(v1: ActVersion | undefined, v2: ActVersion | undefined): Change[] {
    if (!v1 || !v2) return [];

    const changes: Change[] = [];
    const lines1 = v1.content.split('\n');
    const lines2 = v2.content.split('\n');

    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 !== line2) {
        if (line1 && !line2) {
          changes.push({
            type: 'deletion',
            oldText: line1,
            lineNumber: i + 1,
            section: 'Article ' + Math.floor((i / 10) + 1),
          });
        } else if (!line1 && line2) {
          changes.push({
            type: 'addition',
            newText: line2,
            lineNumber: i + 1,
            section: 'Article ' + Math.floor((i / 10) + 1),
          });
        } else {
          changes.push({
            type: 'modification',
            oldText: line1,
            newText: line2,
            lineNumber: i + 1,
            section: 'Article ' + Math.floor((i / 10) + 1),
          });
        }
      }
    }

    return changes;
  }

  const changes = compareVersions(v1, v2);
  const additions = changes.filter(c => c.type === 'addition').length;
  const deletions = changes.filter(c => c.type === 'deletion').length;
  const modifications = changes.filter(c => c.type === 'modification').length;

  return (
    <div className={className}>
      {/* Version Selectors */}
      <div
        className="p-6 rounded-lg mb-6"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Version 1 (ancienne)
            </label>
            <select
              value={version1}
              onChange={(e) => {
                setVersion1(e.target.value);
                onVersionSelect?.(e.target.value, version2);
              }}
              className="w-full px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: isDark ? designTokens.colors.dark.background : '#ffffff',
                borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                borderWidth: '1px',
                color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
              }}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  Version {v.version} - {format(parseISO(v.date), 'dd MMM yyyy', { locale: fr })} ({getStatusLabel(v.status)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center pt-6">
            <GitCompare className="w-6 h-6" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }} />
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium mb-2 block" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Version 2 (nouvelle)
            </label>
            <select
              value={version2}
              onChange={(e) => {
                setVersion2(e.target.value);
                onVersionSelect?.(version1, e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: isDark ? designTokens.colors.dark.background : '#ffffff',
                borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                borderWidth: '1px',
                color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
              }}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  Version {v.version} - {format(parseISO(v.date), 'dd MMM yyyy', { locale: fr })} ({getStatusLabel(v.status)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('unified')}
              className="px-3 py-1 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: viewMode === 'unified'
                  ? designTokens.colors.light.brand
                  : isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                color: viewMode === 'unified'
                  ? '#ffffff'
                  : isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
              }}
            >
              Vue unifiée
            </button>
            <button
              onClick={() => setViewMode('split')}
              className="px-3 py-1 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: viewMode === 'split'
                  ? designTokens.colors.light.brand
                  : isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                color: viewMode === 'split'
                  ? '#ffffff'
                  : isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
              }}
            >
              Vue côte à côte
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1" style={{ color: designTokens.colors.light.success }}>
              <Plus className="w-4 h-4" />
              <span className="font-medium">{additions}</span>
              <span className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                ajouts
              </span>
            </div>
            <div className="flex items-center gap-1" style={{ color: designTokens.colors.light.danger }}>
              <Minus className="w-4 h-4" />
              <span className="font-medium">{deletions}</span>
              <span className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                suppressions
              </span>
            </div>
            <div className="flex items-center gap-1" style={{ color: designTokens.colors.light.warning }}>
              <FileText className="w-4 h-4" />
              <span className="font-medium">{modifications}</span>
              <span className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                modifications
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info Cards */}
      {v1 && v2 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
              borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
              borderWidth: '1px',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                Version {v1.version}
              </h4>
              <div
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getStatusColor(v1.status)}20`,
                  color: getStatusColor(v1.status),
                }}
              >
                {getStatusLabel(v1.status)}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                <Calendar className="w-4 h-4" />
                {format(parseISO(v1.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </div>
              <div className="flex items-center gap-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                <User className="w-4 h-4" />
                {v1.author}
              </div>
              <p className="text-xs mt-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                {v1.changes_summary}
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
              borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
              borderWidth: '1px',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                Version {v2.version}
              </h4>
              <div
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getStatusColor(v2.status)}20`,
                  color: getStatusColor(v2.status),
                }}
              >
                {getStatusLabel(v2.status)}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                <Calendar className="w-4 h-4" />
                {format(parseISO(v2.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </div>
              <div className="flex items-center gap-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                <User className="w-4 h-4" />
                {v2.author}
              </div>
              <p className="text-xs mt-2" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                {v2.changes_summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Changes List */}
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
            Différences ({changes.length} modifications)
          </h3>
        </div>

        <div className="p-4">
          {changes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }} />
              <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Aucune différence entre ces deux versions
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {changes.map((change, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Change Type Icon */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: change.type === 'addition'
                          ? `${designTokens.colors.light.success}20`
                          : change.type === 'deletion'
                          ? `${designTokens.colors.light.danger}20`
                          : `${designTokens.colors.light.warning}20`,
                      }}
                    >
                      {change.type === 'addition' ? (
                        <Plus className="w-4 h-4" style={{ color: designTokens.colors.light.success }} />
                      ) : change.type === 'deletion' ? (
                        <Minus className="w-4 h-4" style={{ color: designTokens.colors.light.danger }} />
                      ) : (
                        <ArrowRight className="w-4 h-4" style={{ color: designTokens.colors.light.warning }} />
                      )}
                    </div>

                    {/* Change Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                          {change.section} - Ligne {change.lineNumber}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: change.type === 'addition'
                              ? `${designTokens.colors.light.success}20`
                              : change.type === 'deletion'
                              ? `${designTokens.colors.light.danger}20`
                              : `${designTokens.colors.light.warning}20`,
                            color: change.type === 'addition'
                              ? designTokens.colors.light.success
                              : change.type === 'deletion'
                              ? designTokens.colors.light.danger
                              : designTokens.colors.light.warning,
                          }}
                        >
                          {change.type === 'addition' ? 'Ajout' : change.type === 'deletion' ? 'Suppression' : 'Modification'}
                        </span>
                      </div>

                      {viewMode === 'unified' ? (
                        <div className="space-y-1">
                          {change.oldText && (
                            <div
                              className="px-3 py-2 rounded font-mono text-xs"
                              style={{
                                backgroundColor: `${designTokens.colors.light.danger}10`,
                                color: designTokens.colors.light.danger,
                              }}
                            >
                              - {change.oldText}
                            </div>
                          )}
                          {change.newText && (
                            <div
                              className="px-3 py-2 rounded font-mono text-xs"
                              style={{
                                backgroundColor: `${designTokens.colors.light.success}10`,
                                color: designTokens.colors.light.success,
                              }}
                            >
                              + {change.newText}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className="px-3 py-2 rounded font-mono text-xs"
                            style={{
                              backgroundColor: `${designTokens.colors.light.danger}10`,
                              color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                            }}
                          >
                            {change.oldText || '(vide)'}
                          </div>
                          <div
                            className="px-3 py-2 rounded font-mono text-xs"
                            style={{
                              backgroundColor: `${designTokens.colors.light.success}10`,
                              color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground,
                            }}
                          >
                            {change.newText || '(vide)'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
