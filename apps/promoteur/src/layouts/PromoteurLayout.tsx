import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Button, Avatar, Dropdown, DropdownItem, DropdownSeparator } from '@realpro/ui';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Bell,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Prospects', href: '/prospects', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function PromoteurLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-white">Realpro</span>
              <span className="ml-1 text-xs text-primary-600 font-medium">Promoteur</span>
            </div>
          </div>
          <button
            className="lg:hidden p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Avatar fallback="MD" alt="Marie Dupont" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                Marie Dupont
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                marie@promoteur.ch
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <button
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
              </Button>

              {/* User menu */}
              <Dropdown
                align="right"
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar fallback="MD" alt="Marie Dupont" size="xs" />
                    <span className="hidden sm:inline text-sm">Marie Dupont</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                }
              >
                <DropdownItem icon={<User className="w-4 h-4" />}>
                  Mon profil
                </DropdownItem>
                <DropdownItem icon={<Settings className="w-4 h-4" />}>
                  Paramètres
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<LogOut className="w-4 h-4" />} destructive>
                  Se déconnecter
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
