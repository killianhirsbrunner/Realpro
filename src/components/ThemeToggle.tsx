import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import clsx from 'clsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light' as const, label: 'Clair', icon: Sun },
    { value: 'dark' as const, label: 'Sombre', icon: Moon },
    { value: 'system' as const, label: 'Système', icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <div className="relative z-[60]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors relative z-[60]"
        aria-label="Changer le thème"
      >
        <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[58]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-[60]">
            {themes.map((t) => {
              const ThemeIcon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center space-x-2',
                    {
                      'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300':
                        theme === t.value,
                      'text-neutral-700 dark:text-neutral-300': theme !== t.value,
                    }
                  )}
                >
                  <ThemeIcon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
