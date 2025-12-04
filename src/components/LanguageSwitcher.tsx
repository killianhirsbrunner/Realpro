import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n, locales, localeLabels, Locale } from '../lib/i18n';
import clsx from 'clsx';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (newLang: Locale) => {
    await setLanguage(newLang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {localeLabels[language]}
        </span>
        <svg
          className={clsx('w-4 h-4 text-gray-500 transition-transform', {
            'rotate-180': isOpen,
          })}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={clsx(
                  'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between',
                  {
                    'bg-brand-50 text-brand-700': language === locale,
                    'text-gray-700': language !== locale,
                  }
                )}
              >
                <span>{localeLabels[locale]}</span>
                {language === locale && (
                  <Check className="w-4 h-4 text-brand-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
