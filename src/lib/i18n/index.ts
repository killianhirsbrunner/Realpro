import { useState, useEffect } from 'react';
import fr from './locales/fr.json';
import de from './locales/de.json';
import en from './locales/en.json';
import it from './locales/it.json';

export type LanguageCode = 'FR' | 'DE' | 'EN' | 'IT';

const translations = { fr, de, en, it };

export function useI18n() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('language');
    return (stored as LanguageCode) || 'FR';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language.toLowerCase() as 'fr' | 'de' | 'en' | 'it'];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { language, setLanguage, t };
}

export function getTranslation(key: string, lang: LanguageCode): string {
  const keys = key.split('.');
  let value: any = translations[lang.toLowerCase() as 'fr' | 'de' | 'en' | 'it'];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
