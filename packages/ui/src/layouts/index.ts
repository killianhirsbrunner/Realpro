/**
 * Layout Components for Realpro Suite
 * Provides consistent layout structures across all applications
 */

// ═══════════════════════════════════════════════════════════════════════════
// PAGE LAYOUTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  PageShell,
  PageSection,
  ContentCard,
  type PageShellProps,
  type PageSectionProps,
  type ContentCardProps,
} from './PageShell';

// ═══════════════════════════════════════════════════════════════════════════
// APP LAYOUTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  AppShell,
  SplitView,
  DetailPanel,
  type AppShellProps,
  type SplitViewProps,
  type DetailPanelProps,
} from './AppShell';

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

export {
  SideNav,
  NavSection,
  NavItem,
  NavDivider,
  useSideNav,
  type SideNavProps,
  type NavSectionProps,
  type NavItemProps,
} from './SideNav';

export {
  TopNav,
  TopNavSearch,
  NotificationButton,
  UserMenu,
  type TopNavProps,
  type TopNavSearchProps,
  type NotificationButtonProps,
  type UserMenuProps,
} from './TopNav';
