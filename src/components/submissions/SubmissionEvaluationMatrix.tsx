import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';
import { Star, TrendingUp, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

interface CompanyScore {
  company_id: string;
  company_name: string;
  criteria_scores: Record<string, number>;
  total_score: number;
  rank?: number;
  notes?: string;
}

interface SubmissionEvaluationMatrixProps {
  criteria: EvaluationCriteria[];
  companies: CompanyScore[];
  maxScore?: number;
  onScoreChange?: (companyId: string, criteriaId: string, score: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function SubmissionEvaluationMatrix({
  criteria,
  companies,
  maxScore = 10,
  onScoreChange,
  readOnly = false,
  className = '',
}: SubmissionEvaluationMatrixProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredCell, setHoveredCell] = useState<{
    companyId: string;
    criteriaId: string;
  } | null>(null);

  function getScoreColor(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return designTokens.colors.light.success;
    if (percentage >= 60) return designTokens.colors.light.info;
    if (percentage >= 40) return designTokens.colors.light.warning;
    return designTokens.colors.light.danger;
  }

  function getRankIcon(rank: number) {
    if (rank === 1) return <Award className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Award className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <Star className="w-4 h-4 text-neutral-400" />;
  }

  const sortedCompanies = [...companies].sort((a, b) => b.total_score - a.total_score);
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className={className}>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
              <Star className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Critères d'évaluation
              </p>
              <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                {criteria.length}
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
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Soumissions reçues
              </p>
              <p className="text-2xl font-bold" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                {companies.length}
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
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                Meilleure offre
              </p>
              <p className="text-lg font-bold" style={{ color: designTokens.colors.light.success }}>
                {sortedCompanies[0]?.company_name || '-'}
              </p>
              <p className="text-xs" style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                {sortedCompanies[0]?.total_score.toFixed(1)}/{maxScore * totalWeight} points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Matrix Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: isDark ? designTokens.colors.dark.secondary : '#ffffff',
          borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
          borderWidth: '1px',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                }}
              >
                <th
                  className="p-4 text-left font-semibold text-sm"
                  style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                >
                  Entreprise
                </th>
                {criteria.map((criterion) => (
                  <th
                    key={criterion.id}
                    className="p-4 text-center font-semibold text-sm"
                    style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{criterion.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                          color: isDark ? designTokens.colors.dark.background : designTokens.colors.light.background,
                        }}
                      >
                        Poids: {criterion.weight}
                      </span>
                    </div>
                  </th>
                ))}
                <th
                  className="p-4 text-center font-semibold text-sm"
                  style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                >
                  Total
                </th>
                <th
                  className="p-4 text-center font-semibold text-sm"
                  style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                >
                  Rang
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, companyIndex) => (
                <tr
                  key={company.company_id}
                  className="border-t"
                  style={{
                    borderColor: isDark ? designTokens.colors.dark.border : designTokens.colors.light.border,
                    backgroundColor: companyIndex === 0
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.05)'
                        : 'rgba(16, 185, 129, 0.05)'
                      : undefined,
                  }}
                >
                  {/* Company Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {companyIndex < 3 && getRankIcon(companyIndex + 1)}
                      <span
                        className="font-medium"
                        style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
                      >
                        {company.company_name}
                      </span>
                    </div>
                  </td>

                  {/* Criteria Scores */}
                  {criteria.map((criterion) => {
                    const score = company.criteria_scores[criterion.id] || 0;
                    const weightedScore = score * criterion.weight;
                    const maxWeightedScore = maxScore * criterion.weight;
                    const scoreColor = getScoreColor(score, maxScore);
                    const isHovered =
                      hoveredCell?.companyId === company.company_id &&
                      hoveredCell?.criteriaId === criterion.id;

                    return (
                      <td
                        key={criterion.id}
                        className="p-4 text-center"
                        onMouseEnter={() =>
                          setHoveredCell({
                            companyId: company.company_id,
                            criteriaId: criterion.id,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {/* Score Input/Display */}
                          {readOnly ? (
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all"
                              style={{
                                backgroundColor: `${scoreColor}20`,
                                color: scoreColor,
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                              }}
                            >
                              {score.toFixed(1)}
                            </div>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={maxScore}
                              step={0.5}
                              value={score}
                              onChange={(e) =>
                                onScoreChange?.(
                                  company.company_id,
                                  criterion.id,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 h-12 rounded-lg text-center font-bold text-lg border-2 transition-all"
                              style={{
                                backgroundColor: `${scoreColor}10`,
                                borderColor: isHovered ? scoreColor : 'transparent',
                                color: scoreColor,
                              }}
                            />
                          )}

                          {/* Weighted Score */}
                          <span
                            className="text-xs"
                            style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
                          >
                            {weightedScore.toFixed(1)}/{maxWeightedScore}
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Total Score */}
                  <td className="p-4 text-center">
                    <div
                      className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-lg font-bold"
                      style={{
                        backgroundColor: companyIndex === 0
                          ? `${designTokens.colors.light.success}20`
                          : isDark
                          ? designTokens.colors.dark.background
                          : designTokens.colors.light.secondary,
                        color: companyIndex === 0
                          ? designTokens.colors.light.success
                          : isDark
                          ? designTokens.colors.dark.foreground
                          : designTokens.colors.light.foreground,
                      }}
                    >
                      <span className="text-xl">{company.total_score.toFixed(1)}</span>
                      <span className="text-xs opacity-70">
                        /{maxScore * totalWeight}
                      </span>
                    </div>
                  </td>

                  {/* Rank */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getRankIcon(companyIndex + 1)}
                      <span
                        className="font-bold text-lg"
                        style={{
                          color: companyIndex === 0
                            ? designTokens.colors.light.success
                            : isDark
                            ? designTokens.colors.dark.foreground
                            : designTokens.colors.light.foreground,
                        }}
                      >
                        #{companyIndex + 1}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criteria Descriptions */}
      {criteria.some((c) => c.description) && (
        <div className="mt-6 space-y-2">
          <h4
            className="text-sm font-semibold mb-3"
            style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}
          >
            Détails des critères :
          </h4>
          {criteria.map((criterion) =>
            criterion.description ? (
              <div
                key={criterion.id}
                className="flex items-start gap-2 text-xs p-2 rounded"
                style={{
                  backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary,
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: designTokens.colors.light.info }} />
                <div>
                  <span className="font-medium" style={{ color: isDark ? designTokens.colors.dark.foreground : designTokens.colors.light.foreground }}>
                    {criterion.name}:
                  </span>{' '}
                  <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
                    {criterion.description}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Scoring Legend */}
      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: isDark ? designTokens.colors.dark.background : designTokens.colors.light.secondary }}>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: designTokens.colors.light.success }} />
            <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Excellent (8-10)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: designTokens.colors.light.info }} />
            <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Bon (6-8)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: designTokens.colors.light.warning }} />
            <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Moyen (4-6)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: designTokens.colors.light.danger }} />
            <span style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}>
              Faible (0-4)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
