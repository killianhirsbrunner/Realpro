import { type ReactNode, Fragment } from 'react';
import clsx from 'clsx';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL or path */
  href?: string;
  /** Icon to display */
  icon?: ReactNode;
  /** Is current page (last item) */
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Show home icon on first item */
  showHomeIcon?: boolean;
  /** Custom separator element */
  separator?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Maximum items to show (collapses middle items if exceeded) */
  maxItems?: number;
  /** Custom link renderer (for React Router, Next.js, etc.) */
  renderLink?: (href: string, children: ReactNode, props: { className: string; 'aria-current'?: 'page' }) => ReactNode;
  /** Additional classes */
  className?: string;
}

export function Breadcrumbs({
  items,
  showHomeIcon = true,
  separator,
  size = 'md',
  maxItems,
  renderLink,
  className,
}: BreadcrumbsProps) {
  const sizeStyles = {
    sm: {
      text: 'text-xs',
      icon: 'h-3 w-3',
      separator: 'h-3 w-3',
      gap: 'gap-1',
    },
    md: {
      text: 'text-sm',
      icon: 'h-4 w-4',
      separator: 'h-4 w-4',
      gap: 'gap-1.5',
    },
  };

  const styles = sizeStyles[size];

  // Handle collapsing if maxItems is set
  let displayItems = items;

  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, { label: '...', isCurrent: false }, ...lastItems];
  }

  const defaultSeparator = (
    <ChevronRight
      className={clsx(styles.separator, 'text-neutral-400 dark:text-neutral-500 flex-shrink-0')}
      aria-hidden="true"
    />
  );

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isFirst = index === 0;
    const showIcon = isFirst && showHomeIcon && !item.icon;

    const itemClasses = clsx(
      styles.text,
      'inline-flex items-center',
      styles.gap,
      'transition-colors duration-150',
      isLast || item.isCurrent
        ? 'font-medium text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
    );

    const content = (
      <>
        {showIcon && <Home className={styles.icon} aria-hidden="true" />}
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={item.label === '...' ? '' : 'truncate max-w-[200px]'}>
          {item.label}
        </span>
      </>
    );

    if (item.href && !isLast && !item.isCurrent && item.label !== '...') {
      if (renderLink) {
        return renderLink(item.href, content, { className: itemClasses });
      }
      return (
        <a href={item.href} className={itemClasses}>
          {content}
        </a>
      );
    }

    const ariaCurrent = (isLast || item.isCurrent) ? 'page' : undefined;

    return (
      <span className={itemClasses} aria-current={ariaCurrent}>
        {content}
      </span>
    );
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={clsx('flex items-center flex-wrap', styles.gap)}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="inline-flex items-center">
                {renderItem(item, index, isLast)}
              </li>
              {!isLast && (
                <li className="flex-shrink-0" aria-hidden="true">
                  {separator || defaultSeparator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
