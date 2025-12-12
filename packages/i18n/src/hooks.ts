import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * Hook for internationalization
 * Provides translation function and language utilities
 */
export function useI18n(namespace?: string) {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = useCallback(
    (lang: string) => {
      return i18n.changeLanguage(lang);
    },
    [i18n]
  );

  const currentLanguage = i18n.language;
  const supportedLanguages = i18n.options.supportedLngs as string[] | undefined;

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
    supportedLanguages: supportedLanguages?.filter((l) => l !== 'cimode') || [],
  };
}
