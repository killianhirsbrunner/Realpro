import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import clsx from 'clsx';

interface CfcLine {
  id: string;
  code: string;
  label: string;
  amount_budgeted: number;
  amount_committed: number;
  amount_spent: number;
}

interface CfcTableProps {
  lines: CfcLine[];
  totals: {
    budget: number;
    engaged: number;
    invoiced: number;
    paid: number;
  };
  onUpdateLine: (lineId: string, field: string, value: number) => Promise<void>;
}

export function CfcTable({ lines, totals, onUpdateLine }: CfcTableProps) {
  const [editingCell, setEditingCell] = useState<{ lineId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const startEdit = (lineId: string, field: string, currentValue: number) => {
    setEditingCell({ lineId, field });
    setEditValue(currentValue.toString());
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async (lineId: string, field: string) => {
    const value = parseFloat(editValue) || 0;
    await onUpdateLine(lineId, field, value);
    setEditingCell(null);
    setEditValue('');
  };

  const renderEditableCell = (line: CfcLine, field: 'amount_budgeted' | 'amount_committed' | 'amount_spent') => {
    const isEditing = editingCell?.lineId === line.id && editingCell?.field === field;
    const value = line[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-3 py-1.5 border border-brand-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit(line.id, field);
              if (e.key === 'Escape') cancelEdit();
            }}
          />
          <button
            onClick={() => saveEdit(line.id, field)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={cancelEdit}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className="group flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded px-2 py-1"
        onClick={() => startEdit(line.id, field, value)}
      >
        <span>{formatCurrency(value)}</span>
        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    );
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    if (percentage > 100) return 'text-red-600';
    if (percentage > 90) return 'text-brand-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                CFC
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Engagé
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Dépensé
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Disponible
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                % Utilisé
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {lines.map((line) => {
              const available = line.amount_budgeted - line.amount_spent;
              const usedPercentage = line.amount_budgeted > 0
                ? (line.amount_spent / line.amount_budgeted) * 100
                : 0;

              return (
                <tr
                  key={line.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {line.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {line.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-900 dark:text-neutral-100">
                    {renderEditableCell(line, 'amount_budgeted')}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-700 dark:text-neutral-300">
                    {renderEditableCell(line, 'amount_committed')}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-700 dark:text-neutral-300">
                    {renderEditableCell(line, 'amount_spent')}
                  </td>
                  <td className={clsx(
                    'px-6 py-4 text-sm text-right font-semibold',
                    available < 0 ? 'text-red-600' : 'text-green-600'
                  )}>
                    {formatCurrency(available)}
                  </td>
                  <td className={clsx(
                    'px-6 py-4 text-sm text-right font-semibold',
                    getProgressColor(line.amount_spent, line.amount_budgeted)
                  )}>
                    {usedPercentage.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase">
                TOTAL
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100">
                {formatCurrency(totals.budget)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100">
                {formatCurrency(totals.engaged)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100">
                {formatCurrency(totals.invoiced)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100">
                {formatCurrency(totals.budget - totals.invoiced)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-neutral-900 dark:text-neutral-100">
                {((totals.invoiced / totals.budget) * 100 || 0).toFixed(1)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
