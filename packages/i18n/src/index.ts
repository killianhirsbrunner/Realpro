/**
 * @realpro/i18n
 * Internationalization package for Realpro Suite
 *
 * This package provides:
 * - i18next configuration
 * - Common translations (generic labels, errors, validation)
 * - useI18n hook
 *
 * IMPORTANT: Business-specific translations must stay in individual apps.
 */

export { initI18n, type I18nConfig } from './config';
export { useI18n } from './hooks';

// Re-export from react-i18next for convenience
export { Trans, useTranslation } from 'react-i18next';
