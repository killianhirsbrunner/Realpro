import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import Footer from './Footer';
import GlobalSearch from '../GlobalSearch';
import QuickActions from '../QuickActions';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { DemoBanner } from '../DemoBanner';
import { TrialBanner } from './TrialBanner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isOpen, close } = useGlobalSearch();

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DemoBanner />
        <TrialBanner />
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-5 bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="max-w-[1440px] mx-auto">
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
