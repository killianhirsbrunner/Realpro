import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frCH from './locales/fr-CH.json';
import deCH from './locales/de-CH.json';
import itCH from './locales/it-CH.json';
import enGB from './locales/en-GB.json';

export const locales = ['fr-CH', 'de-CH', 'it-CH', 'en-GB'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr-CH';

export const localeLabels: Record<Locale, string> = {
  'fr-CH': 'Français',
  'de-CH': 'Deutsch',
  'it-CH': 'Italiano',
  'en-GB': 'English',
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'fr-CH': { translation: frCH },
      'de-CH': { translation: deCH },
      'it-CH': { translation: itCH },
      'en-GB': { translation: enGB },
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
