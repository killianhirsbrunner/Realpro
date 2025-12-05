import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { Shield, Plus, Download, AlertTriangle, CheckCircle2, Clock, FileText, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SafetyPlan {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived';
  created_date: string;
  approved_date?: string;
  approved_by?: string;
  last_review_date?: string;
  next_review_date?: string;
  sections_count: number;
  risks_identified: number;
  measures_implemented: number;
  compliance_score: number;
}

export default function SafetyPlansManager() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [plans, setPlans] = useState<SafetyPlan[]>([
    {
      id: '1',
      project_id: 'proj-1',
      project_name: 'Les Jardins du Lac',
      title: 'Plan de Sécurité Principal',
      version: '2.1',
      status: 'active',
      created_date: '2024-01-15',
      approved_date: '2024-02-01',
      approved_by: 'Jean Dupont',
      last_review_date: '2024-11-01',
      next_review_date: '2025-02-01',
      sections_count: 12,
      risks_identified: 45,
      measures_implemented: 42,
      compliance_score: 93,
    },
  ]);

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return designTokens.colors.light.success;
      case 'approved':
        return designTokens.colors.light.info;
      case 'review':
        return designTokens.colors.light.warning;
      case 'draft':
        return designTokens.colors.light.accent;
      case 'archived':
        return designTokens.colors.light.accent;
      default:
        return isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent;
    }
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Actif',
      approved: 'Approuvé',
      review: 'En révision',
      draft: 'Brouillon',
      archived: 'Archivé',
    };
    return labels[status] || status;
  }

  function getComplianceColor(score: number): string {
    if (score >= 90) return designTokens.colors.light.success;
    if (score >= 70) return designTokens.colors.light.info;
    if (score >= 50) return designTokens.colors.light.warning;
    return designTokens.colors.light.danger;
  }

  const activePlans = plans.filter(p => p.status === 'active').length;
  const avgCompliance = plans.reduce((sum, p) => sum + p.compliance_score, 0) / plans.length;
  const totalRisks = plans.reduce((sum, p) => sum + p.risks_identified, 0);
  const totalMeasures = plans.reduce((sum, p) => sum + p.measures_implemented, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
              Plans de Sécurité
            </h1>
            <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Gestion des plans de sécurité et conformité réglementaire
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: designTokens.colors.light.brand,
              color: '#ffffff',
            }}
          >
            <Plus className="w-5 h-5" />
            Nouveau plan
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                  Plans actifs
                </p>
                <p className="text-2xl font-bold" style={{ color: designTokens.colors.light.success }}>
                  {activePlans}
                </p>
              </div>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                  Conformité moyenne
                </p>
                <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  {avgCompliance.toFixed(0)}%
                </p>
              </div>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                  Risques identifiés
                </p>
                <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  {totalRisks}
                </p>
              </div>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                  Mesures appliquées
                </p>
                <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                  {totalMeasures}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Table */}
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
              Plans de sécurité ({plans.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary }}>
                  <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Projet / Plan
                  </th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Statut
                  </th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Conformité
                  </th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Risques
                  </th>
                  <th className="p-4 text-left text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Prochaine révision
                  </th>
                  <th className="p-4 text-right text-sm font-semibold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const statusColor = getStatusColor(plan.status);
                  const complianceColor = getComplianceColor(plan.compliance_score);

                  return (
                    <tr
                      key={plan.id}
                      className="border-t hover:bg-opacity-50 transition-colors"
                      style={{ borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border }}
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                            {plan.title}
                          </p>
                          <p className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                            {plan.project_name} • v{plan.version}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center">
                          <div
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                            }}
                          >
                            {plan.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {getStatusLabel(plan.status)}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: complianceColor }}
                          >
                            {plan.compliance_score}%
                          </div>
                          <div className="w-20 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${plan.compliance_score}%`,
                                backgroundColor: complianceColor,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-center">
                          <p className="text-sm font-medium mb-1" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                            {plan.risks_identified}
                          </p>
                          <p className="text-xs" style={{ color: designTokens.colors.light.success }}>
                            {plan.measures_implemented} traitées
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        {plan.next_review_date && (
                          <div className="text-sm" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                            {format(parseISO(plan.next_review_date), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded hover:bg-opacity-10 transition-colors"
                            style={{ color: designTokens.colors.light.info }}
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
