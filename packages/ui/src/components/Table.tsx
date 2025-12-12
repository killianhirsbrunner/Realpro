import { type ReactNode } from 'react';
import clsx from 'clsx';

// Table Root
export interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className={clsx('min-w-full divide-y divide-neutral-200 dark:divide-neutral-800', className)}>
        {children}
      </table>
    </div>
  );
}

// Table Header
export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={clsx('bg-neutral-50 dark:bg-neutral-900', className)}>
      {children}
    </thead>
  );
}

// Table Body
export interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx('bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800', className)}>
      {children}
    </tbody>
  );
}

// Table Row
export interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TableRow({ children, className, onClick, isSelected }: TableRowProps) {
  return (
    <tr
      className={clsx(
        onClick && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors',
        isSelected && 'bg-brand-50 dark:bg-brand-900/20',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// Table Head Cell
export interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function TableHead({ children, className, sortable, sorted, onSort }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 select-none transition-colors',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className={clsx('text-neutral-400', sorted && 'text-brand-500')}>
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

// Table Cell
export interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100', className)}>
      {children}
    </td>
  );
}

// Attach subcomponents
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
