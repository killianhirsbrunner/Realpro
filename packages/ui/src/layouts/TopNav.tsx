import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Menu, Bell, Search } from 'lucide-react';

export interface TopNavProps {
  /** Left content (breadcrumbs, title, etc.) */
  left?: ReactNode;
  /** Center content (search, etc.) */
  center?: ReactNode;
  /** Right content (user menu, notifications, etc.) */
  right?: ReactNode;
  /** Mobile menu toggle handler */
  onMenuToggle?: () => void;
  /** Show mobile menu button */
  showMenuButton?: boolean;
  /** Sticky position */
  sticky?: boolean;
  /** Show border */
  bordered?: boolean;
  /** Additional classes */
  className?: string;
}

export function TopNav({
  left,
  center,
  right,
  onMenuToggle,
  showMenuButton = false,
  sticky = true,
  bordered = true,
  className,
}: TopNavProps) {
  return (
    <header
      className={clsx(
        'h-16 flex items-center gap-4 px-4 lg:px-6',
        'bg-white dark:bg-neutral-900',
        sticky && 'sticky top-0 z-40',
        bordered && 'border-b border-neutral-200 dark:border-neutral-800',
        className
      )}
    >
      {/* Mobile menu button */}
      {showMenuButton && (
        <button
          type="button"
          onClick={onMenuToggle}
          className={clsx(
            'lg:hidden p-2 -ml-2 rounded-lg',
            'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
            'dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800',
            'transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
          )}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Left */}
      <div className="flex items-center gap-4 flex-1 min-w-0">{left}</div>

      {/* Center */}
      {center && (
        <div className="hidden md:flex items-center justify-center flex-1 max-w-xl">
          {center}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOP NAV SEARCH
// ═══════════════════════════════════════════════════════════════════════════

export interface TopNavSearchProps {
  /** Placeholder text */
  placeholder?: string;
  /** Search handler */
  onSearch?: (value: string) => void;
  /** Additional classes */
  className?: string;
}

export function TopNavSearch({
  placeholder = 'Rechercher...',
  onSearch,
  className,
}: TopNavSearchProps) {
  return (
    <div className={clsx('relative w-full max-w-md', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className={clsx(
          'w-full h-10 pl-10 pr-4 rounded-lg',
          'bg-neutral-100 dark:bg-neutral-800',
          'text-sm text-neutral-900 dark:text-neutral-100',
          'placeholder-neutral-500',
          'border border-transparent',
          'focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20',
          'transition-colors'
        )}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION BUTTON
// ═══════════════════════════════════════════════════════════════════════════

export interface NotificationButtonProps {
  /** Unread count */
  count?: number;
  /** Click handler */
  onClick?: () => void;
  /** Additional classes */
  className?: string;
}

export function NotificationButton({
  count = 0,
  onClick,
  className,
}: NotificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative p-2 rounded-lg',
        'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
        'dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800',
        'transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
        className
      )}
      aria-label={count > 0 ? `${count} notifications non lues` : 'Notifications'}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span
          className={clsx(
            'absolute -top-0.5 -right-0.5 flex items-center justify-center',
            'min-w-[18px] h-[18px] px-1 rounded-full',
            'text-xs font-semibold text-white bg-error-500',
            'ring-2 ring-white dark:ring-neutral-900'
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USER MENU
// ═══════════════════════════════════════════════════════════════════════════

export interface UserMenuProps {
  /** User name */
  name: string;
  /** User email */
  email?: string;
  /** Avatar URL or element */
  avatar?: string | ReactNode;
  /** Initials (fallback) */
  initials?: string;
  /** Menu items */
  children?: ReactNode;
  /** Additional classes */
  className?: string;
}

export function UserMenu({
  name,
  email,
  avatar,
  initials,
  children,
  className,
}: UserMenuProps) {
  return (
    <div className={clsx('relative', className)}>
      <button
        type="button"
        className={clsx(
          'flex items-center gap-2 p-1.5 -mr-1.5 rounded-lg',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
        )}
      >
        {/* Avatar */}
        <div
          className={clsx(
            'h-8 w-8 rounded-full flex items-center justify-center',
            'bg-brand-100 dark:bg-brand-900',
            'text-sm font-semibold text-brand-600 dark:text-brand-400'
          )}
        >
          {typeof avatar === 'string' ? (
            <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
          ) : avatar ? (
            avatar
          ) : (
            initials || name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Name (hidden on mobile) */}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {name}
          </p>
          {email && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
              {email}
            </p>
          )}
        </div>
      </button>

      {/* Dropdown (if children provided) */}
      {children}
    </div>
  );
}
