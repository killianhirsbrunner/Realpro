import { type ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of siblings on each side of current page */
  siblings?: number;
  /** Show first/last page buttons */
  showBoundaries?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Additional classes */
  className?: string;
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblings: number
): (number | 'ellipsis')[] {
  const totalNumbers = siblings * 2 + 3; // siblings + current + first + last
  const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblings;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblings;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );

  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
  showBoundaries = true,
  showPrevNext = true,
  size = 'md',
  disabled = false,
  className,
}: PaginationProps) {
  const sizeStyles = {
    sm: {
      button: 'h-8 min-w-8 px-2 text-xs',
      icon: 'h-3.5 w-3.5',
      gap: 'gap-1',
    },
    md: {
      button: 'h-9 min-w-9 px-3 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-1',
    },
    lg: {
      button: 'h-10 min-w-10 px-3 text-sm',
      icon: 'h-5 w-5',
      gap: 'gap-1.5',
    },
  };

  const styles = sizeStyles[size];

  const pages = generatePageNumbers(currentPage, totalPages, siblings);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const baseButtonStyles = clsx(
    styles.button,
    'inline-flex items-center justify-center rounded-lg font-medium',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const pageButtonStyles = (isActive: boolean) =>
    clsx(
      baseButtonStyles,
      isActive
        ? 'bg-brand-400 text-white hover:bg-brand-500'
        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
    );

  const navButtonStyles = clsx(
    baseButtonStyles,
    'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
  );

  const renderPageButton = (
    page: number | 'ellipsis',
    index: number
  ): ReactNode => {
    if (page === 'ellipsis') {
      return (
        <span
          key={`ellipsis-${index}`}
          className={clsx(
            styles.button,
            'inline-flex items-center justify-center text-neutral-400'
          )}
        >
          ...
        </span>
      );
    }

    const isActive = page === currentPage;

    return (
      <button
        key={page}
        type="button"
        onClick={() => onPageChange(page)}
        disabled={disabled}
        className={pageButtonStyles(isActive)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Page ${page}`}
      >
        {page}
      </button>
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className={clsx('flex items-center', styles.gap, className)}
    >
      {/* First page button */}
      {showBoundaries && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious || disabled}
          className={navButtonStyles}
          aria-label="Aller à la première page"
        >
          <ChevronsLeft className={styles.icon} />
        </button>
      )}

      {/* Previous button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || disabled}
          className={navButtonStyles}
          aria-label="Page précédente"
        >
          <ChevronLeft className={styles.icon} />
        </button>
      )}

      {/* Page numbers */}
      <div className={clsx('flex items-center', styles.gap)}>
        {pages.map((page, index) => renderPageButton(page, index))}
      </div>

      {/* Next button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || disabled}
          className={navButtonStyles}
          aria-label="Page suivante"
        >
          <ChevronRight className={styles.icon} />
        </button>
      )}

      {/* Last page button */}
      {showBoundaries && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext || disabled}
          className={navButtonStyles}
          aria-label="Aller à la dernière page"
        >
          <ChevronsRight className={styles.icon} />
        </button>
      )}
    </nav>
  );
}
