import { type ReactNode, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

export interface DataGridColumn<T> {
  /** Unique column ID */
  id: string;
  /** Column header */
  header: string | ReactNode;
  /** Cell renderer */
  cell: (row: T, rowIndex: number) => ReactNode;
  /** Column width (CSS value) */
  width?: string;
  /** Minimum width */
  minWidth?: string;
  /** Enable sorting */
  sortable?: boolean;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Header classes */
  headerClassName?: string;
  /** Cell classes */
  cellClassName?: string;
  /** Sticky column */
  sticky?: 'left' | 'right';
}

export interface DataGridProps<T> {
  /** Column definitions */
  columns: DataGridColumn<T>[];
  /** Data rows */
  data: T[];
  /** Row key extractor */
  getRowKey: (row: T, index: number) => string | number;
  /** Loading state */
  isLoading?: boolean;
  /** Number of skeleton rows to show when loading */
  loadingRows?: number;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedKeys?: Set<string | number>;
  /** Callback when selection changes */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Sort state */
  sort?: { column: string; direction: 'asc' | 'desc' } | null;
  /** Callback when sort changes */
  onSortChange?: (sort: { column: string; direction: 'asc' | 'desc' } | null) => void;
  /** Enable pagination */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  /** Empty state configuration */
  emptyState?: {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Row hover effect */
  hoverable?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Bordered style */
  bordered?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

export function DataGrid<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  loadingRows = 5,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  sort,
  onSortChange,
  pagination,
  emptyState,
  onRowClick,
  hoverable = true,
  striped = false,
  bordered = false,
  size = 'md',
  className,
}: DataGridProps<T>) {
  const sizeStyles = {
    sm: {
      header: 'px-3 py-2 text-xs',
      cell: 'px-3 py-2 text-sm',
      checkbox: 'px-2',
    },
    md: {
      header: 'px-4 py-3 text-xs',
      cell: 'px-4 py-3 text-sm',
      checkbox: 'px-3',
    },
    lg: {
      header: 'px-5 py-4 text-sm',
      cell: 'px-5 py-4 text-base',
      checkbox: 'px-4',
    },
  };

  const styles = sizeStyles[size];

  // Selection logic
  const allSelected = data.length > 0 && data.every((row, i) => selectedKeys.has(getRowKey(row, i)));
  const someSelected = data.some((row, i) => selectedKeys.has(getRowKey(row, i)));

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;

    if (allSelected) {
      // Deselect all
      onSelectionChange(new Set());
    } else {
      // Select all
      const newKeys = new Set(data.map((row, i) => getRowKey(row, i)));
      onSelectionChange(newKeys);
    }
  }, [allSelected, data, getRowKey, onSelectionChange]);

  const handleSelectRow = useCallback(
    (key: string | number) => {
      if (!onSelectionChange) return;

      const newKeys = new Set(selectedKeys);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      onSelectionChange(newKeys);
    },
    [onSelectionChange, selectedKeys]
  );

  // Sort logic
  const handleSort = useCallback(
    (columnId: string) => {
      if (!onSortChange) return;

      if (sort?.column === columnId) {
        if (sort.direction === 'asc') {
          onSortChange({ column: columnId, direction: 'desc' });
        } else {
          onSortChange(null);
        }
      } else {
        onSortChange({ column: columnId, direction: 'asc' });
      }
    },
    [onSortChange, sort]
  );

  const getSortIcon = (columnId: string) => {
    if (sort?.column !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-neutral-400" />;
    }
    return sort.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-brand-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-brand-500" />
    );
  };

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Empty/Loading states
  if (isLoading) {
    return (
      <div className={clsx('w-full', className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                {selectable && (
                  <th className={clsx(styles.header, styles.checkbox)}>
                    <Skeleton className="h-5 w-5" />
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.id} className={clsx(styles.header, getAlignClass(col.align))}>
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: loadingRows }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-100 dark:border-neutral-800"
                >
                  {selectable && (
                    <td className={clsx(styles.cell, styles.checkbox)}>
                      <Skeleton className="h-5 w-5" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.id} className={styles.cell}>
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={clsx('w-full', className)}>
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          icon={emptyState.icon || <Search className="h-6 w-6" />}
          action={emptyState.action}
        />
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="overflow-x-auto">
        <table
          className={clsx(
            'w-full',
            bordered && 'border border-neutral-200 dark:border-neutral-700 rounded-lg'
          )}
        >
          {/* Header */}
          <thead>
            <tr
              className={clsx(
                'border-b border-neutral-200 dark:border-neutral-700',
                'bg-neutral-50 dark:bg-neutral-800/50'
              )}
            >
              {selectable && (
                <th className={clsx(styles.header, styles.checkbox, 'w-10')}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={handleSelectAll}
                    aria-label="Sélectionner tout"
                    size="sm"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={clsx(
                    styles.header,
                    'font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider',
                    getAlignClass(col.align),
                    col.headerClassName
                  )}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                >
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.id)}
                      className={clsx(
                        'inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200',
                        'transition-colors'
                      )}
                    >
                      {col.header}
                      {getSortIcon(col.id)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => {
              const key = getRowKey(row, rowIndex);
              const isSelected = selectedKeys.has(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={clsx(
                    'border-b border-neutral-100 dark:border-neutral-800 last:border-0',
                    'transition-colors',
                    hoverable && 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                    striped && rowIndex % 2 === 1 && 'bg-neutral-25 dark:bg-neutral-900',
                    isSelected && 'bg-brand-50 dark:bg-brand-950/50',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {selectable && (
                    <td
                      className={clsx(styles.cell, styles.checkbox)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        aria-label={`Sélectionner la ligne ${rowIndex + 1}`}
                        size="sm"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={clsx(
                        styles.cell,
                        'text-neutral-700 dark:text-neutral-300',
                        getAlignClass(col.align),
                        col.cellClassName
                      )}
                    >
                      {col.cell(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Page {pagination.currentPage} sur {pagination.totalPages}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
