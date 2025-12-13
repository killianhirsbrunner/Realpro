import { type ReactNode, useState } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export interface AppShellProps {
  /** Sidebar content */
  sidebar: ReactNode;
  /** Header content */
  header?: ReactNode;
  /** Main content */
  children: ReactNode;
  /** Sidebar width when expanded */
  sidebarWidth?: string;
  /** Sidebar width when collapsed */
  sidebarCollapsedWidth?: string;
  /** Enable responsive sidebar */
  responsiveSidebar?: boolean;
  /** Additional classes */
  className?: string;
}

export function AppShell({
  sidebar,
  header,
  children,
  sidebarWidth: _sidebarWidth = '256px',
  sidebarCollapsedWidth: _sidebarCollapsedWidth = '64px',
  responsiveSidebar = true,
  className,
}: AppShellProps) {
  // Note: sidebarWidth and sidebarCollapsedWidth are reserved for future CSS variable support
  void _sidebarWidth;
  void _sidebarCollapsedWidth;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={clsx('flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950', className)}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {responsiveSidebar && (
        <>
          {/* Backdrop */}
          <div
            className={clsx(
              'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
              isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Mobile sidebar */}
          <div
            className={clsx(
              'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 shadow-xl',
              'transform transition-transform duration-300 ease-in-out lg:hidden',
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={clsx(
                'absolute top-4 right-4 p-2 rounded-lg',
                'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                'dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800',
                'transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
              )}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header with mobile menu toggle */}
        {header && (
          <div
            onClick={() => setIsMobileSidebarOpen(true)}
            data-mobile-menu-trigger
          >
            {header}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT VIEW
// ═══════════════════════════════════════════════════════════════════════════

export interface SplitViewProps {
  /** Left panel content */
  left: ReactNode;
  /** Right panel content */
  right: ReactNode;
  /** Left panel width */
  leftWidth?: string;
  /** Show/hide right panel */
  showRight?: boolean;
  /** Divider type */
  divider?: 'line' | 'space' | 'none';
  /** Additional classes */
  className?: string;
}

export function SplitView({
  left,
  right,
  leftWidth = '320px',
  showRight = true,
  divider = 'line',
  className,
}: SplitViewProps) {
  return (
    <div className={clsx('flex h-full', className)}>
      {/* Left panel */}
      <div
        className={clsx(
          'flex-shrink-0 overflow-y-auto',
          !showRight && 'flex-1'
        )}
        style={{ width: showRight ? leftWidth : '100%' }}
      >
        {left}
      </div>

      {/* Divider */}
      {showRight && divider === 'line' && (
        <div className="w-px bg-neutral-200 dark:bg-neutral-800" />
      )}
      {showRight && divider === 'space' && <div className="w-4" />}

      {/* Right panel */}
      {showRight && (
        <div className="flex-1 min-w-0 overflow-y-auto">{right}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════

export interface DetailPanelProps {
  /** Panel title */
  title?: string;
  /** Panel subtitle */
  subtitle?: string;
  /** Close handler */
  onClose?: () => void;
  /** Header actions */
  actions?: ReactNode;
  /** Panel content */
  children: ReactNode;
  /** Panel footer */
  footer?: ReactNode;
  /** Additional classes */
  className?: string;
}

export function DetailPanel({
  title,
  subtitle,
  onClose,
  actions,
  children,
  footer,
  className,
}: DetailPanelProps) {
  return (
    <div
      className={clsx(
        'flex flex-col h-full bg-white dark:bg-neutral-900',
        className
      )}
    >
      {/* Header */}
      {(title || onClose) && (
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  'p-2 -mr-2 rounded-lg',
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                  'dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800',
                  'transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
                )}
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
          {footer}
        </div>
      )}
    </div>
  );
}
