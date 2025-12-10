import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import Footer from './Footer';
import GlobalSearch from '../GlobalSearch';
import QuickActions from '../QuickActions';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { DemoBanner } from '../DemoBanner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen, close } = useGlobalSearch();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DemoBanner />
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        <Footer />
      </div>

      <GlobalSearch isOpen={isOpen} onClose={close} />
      <QuickActions />
    </div>
  );
}
