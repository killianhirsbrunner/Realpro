import { Link } from 'react-router-dom';

interface Tab {
  key: string;
  label: string;
  href: string;
}

interface RealProTabsProps {
  tabs: Tab[];
  active: string;
}

export function RealProTabs({ tabs, active }: RealProTabsProps) {
  return (
    <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          to={tab.href}
          className={`
            relative
            px-4
            py-3
            text-sm
            font-medium
            transition-all
            duration-200
            rounded-t-lg
            ${
              active === tab.key
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 dark:after:bg-brand-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
            }
          `}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
