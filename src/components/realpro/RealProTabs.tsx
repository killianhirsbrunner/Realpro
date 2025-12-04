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
    <div className="flex gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          to={tab.href}
          className={`
            pb-2
            text-sm
            font-medium
            transition-colors
            ${
              active === tab.key
                ? 'border-b-2 border-primary-900 dark:border-primary-100 text-primary-900 dark:text-primary-100'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }
          `}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
