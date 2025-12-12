import { type ReactNode, useState, createContext, useContext } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface SideNavContextValue {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SideNavContext = createContext<SideNavContextValue | null>(null);

export const useSideNav = () => {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error('useSideNav must be used within SideNavProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDE NAV
// ═══════════════════════════════════════════════════════════════════════════

export interface SideNavProps {
  /** Navigation items */
  children: ReactNode;
  /** Logo/brand element */
  logo?: ReactNode;
  /** Collapsed logo (for collapsed state) */
  logoCollapsed?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Enable collapse toggle button */
  collapsible?: boolean;
  /** Width when expanded */
  expandedWidth?: string;
  /** Width when collapsed */
  collapsedWidth?: string;
  /** Additional classes */
  className?: string;
}

export function SideNav({
  children,
  logo,
  logoCollapsed,
  footer,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  collapsible = true,
  expandedWidth = '256px',
  collapsedWidth = '64px',
  className,
}: SideNavProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  return (
    <SideNavContext.Provider value={{ isCollapsed, setIsCollapsed: handleCollapsedChange }}>
      <aside
        className={clsx(
          'h-screen flex flex-col',
          'bg-white dark:bg-neutral-900',
          'border-r border-neutral-200 dark:border-neutral-800',
          'transition-all duration-300 ease-in-out',
          className
        )}
        style={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
      >
        {/* Logo */}
        {(logo || logoCollapsed) && (
          <div
            className={clsx(
              'h-16 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
          >
            {isCollapsed && logoCollapsed ? logoCollapsed : logo}
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">{children}</div>
        </nav>

        {/* Footer */}
        {footer && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
            {footer}
          </div>
        )}

        {/* Collapse toggle */}
        {collapsible && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
            <button
              type="button"
              onClick={() => handleCollapsedChange(!isCollapsed)}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg',
                'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
              )}
              aria-label={isCollapsed ? 'Développer le menu' : 'Réduire le menu'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span className="text-sm font-medium">Réduire</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </SideNavContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV SECTION
// ═══════════════════════════════════════════════════════════════════════════

export interface NavSectionProps {
  /** Section title */
  title?: string;
  /** Navigation items */
  children: ReactNode;
  /** Additional classes */
  className?: string;
}

export function NavSection({ title, children, className }: NavSectionProps) {
  const { isCollapsed } = useSideNav();

  return (
    <div className={clsx('mb-6', className)}>
      {title && !isCollapsed && (
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV ITEM
// ═══════════════════════════════════════════════════════════════════════════

export interface NavItemProps {
  /** Item label */
  label: string;
  /** Icon element */
  icon: ReactNode;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Is currently active */
  isActive?: boolean;
  /** Badge content */
  badge?: string | number;
  /** Disabled state */
  disabled?: boolean;
  /** Custom link renderer (for React Router, Next.js, etc.) */
  renderLink?: (props: { children: ReactNode; className: string; href: string }) => ReactNode;
  /** Additional classes */
  className?: string;
}

export function NavItem({
  label,
  icon,
  href,
  onClick,
  isActive = false,
  badge,
  disabled = false,
  renderLink,
  className,
}: NavItemProps) {
  const { isCollapsed } = useSideNav();

  const itemClasses = clsx(
    'group w-full flex items-center gap-3 rounded-lg',
    'transition-all duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
    isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
    isActive
      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const content = (
    <>
      <span
        className={clsx(
          'flex-shrink-0 [&>svg]:h-5 [&>svg]:w-5',
          isActive ? 'text-brand-500' : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300'
        )}
      >
        {icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium truncate">{label}</span>
          {badge !== undefined && (
            <span
              className={clsx(
                'flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full',
                isActive
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </>
  );

  if (href && renderLink) {
    return renderLink({ children: content, className: itemClasses, href });
  }

  if (href) {
    return (
      <a href={href} className={itemClasses} title={isCollapsed ? label : undefined}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={itemClasses}
      title={isCollapsed ? label : undefined}
    >
      {content}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV DIVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function NavDivider() {
  return <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-800" />;
}
