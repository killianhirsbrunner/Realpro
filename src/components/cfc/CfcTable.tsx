import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import type { CFCLine } from '../../hooks/useCFC';

interface CfcTableProps {
  cfcLines: CFCLine[];
  projectId: string;
}

export function CfcTable({ cfcLines, projectId }: CfcTableProps) {
  const navigate = useNavigate();

  const getVarianceColor = (line: CFCLine) => {
    const variance = line.budget_current - line.engaged;
    if (variance < 0) return 'text-red-600 dark:text-red-400';
    if (variance < line.budget_current * 0.1) return 'text-brand-600 dark:text-brand-400';
    return 'text-green-600 dark:text-green-400';
  };

  const hasOverrun = (line: CFCLine) => {
    return line.engaged > line.budget_current;
  };

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <th className="text-left py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              CFC
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Description
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Budget
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Engagé
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Facturé
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Payé
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Écart
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {cfcLines.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                Aucune ligne CFC définie
              </td>
            </tr>
          ) : (
            cfcLines.map((line) => {
              const variance = line.budget_current - line.engaged;
              const percentEngaged = line.budget_current > 0
                ? (line.engaged / line.budget_current) * 100
                : 0;

              return (
                <tr
                  key={line.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${projectId}/cfc/${line.id}`)}
                >
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      {line.cfc_number}
                      {hasOverrun(line) && (
                        <span title="Dépassement">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    {line.label}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-neutral-900 dark:text-white">
                    CHF {line.budget_current.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                    <div>
                      CHF {line.engaged.toLocaleString()}
                      <div className="text-xs text-neutral-500 mt-1">
                        {percentEngaged.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                    CHF {line.invoiced.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                    CHF {line.paid.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${getVarianceColor(line)}`}>
                    CHF {variance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Card>
  );
}
