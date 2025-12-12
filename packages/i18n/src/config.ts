import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface I18nConfig {
  defaultLanguage?: string;
  supportedLanguages?: string[];
  resources?: Record<string, Record<string, unknown>>;
}

const defaultConfig: I18nConfig = {
  defaultLanguage: 'fr',
  supportedLanguages: ['fr', 'de', 'en', 'it'],
};

/**
 * Initialize i18next with the provided configuration
 * Apps should call this with their specific translations
 */
export function initI18n(config: I18nConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  return i18n.use(initReactI18next).init({
    lng: mergedConfig.defaultLanguage,
    fallbackLng: 'fr',
    supportedLngs: mergedConfig.supportedLanguages,
    resources: mergedConfig.resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export { i18n };
