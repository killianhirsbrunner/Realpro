import { useTranslation } from 'react-i18next';
import i18n, { locales, defaultLocale, localeLabels } from './config';
import type { Locale } from './config';

export { i18n, locales, defaultLocale, localeLabels };
export type { Locale };
// Alias for backward compatibility
export type LanguageCode = Locale;

export function useI18n() {
  const { t, i18n: i18nInstance } = useTranslation();

  const language = i18nInstance.language as Locale;

  const setLanguage = async (newLang: Locale) => {
    await i18nInstance.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  return { language, setLanguage, t };
}

export * from './helpers';
