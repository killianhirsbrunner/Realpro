/**
 * Format utilities - Technical formatters only
 * No business logic (e.g., no PPE-specific, Régie-specific formatting)
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr, de, enGB, it } from 'date-fns/locale';

// Locale map
const locales: Record<string, Locale> = {
  fr,
  de,
  en: enGB,
  it,
};

/**
 * Format a date string to a localized display format
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'dd.MM.yyyy',
  locale: string = 'fr'
): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: locales[locale] || fr });
}

/**
 * Format a date to relative time (e.g., "il y a 2 heures")
 */
export function formatRelativeTime(
  date: string | Date | null | undefined,
  locale: string = 'fr'
): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: locales[locale] || fr });
}

/**
 * Format a number as currency (Swiss Franc by default)
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'CHF',
  locale: string = 'fr-CH'
): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(
  value: number | null | undefined,
  locale: string = 'fr-CH',
  decimals: number = 0
): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format surface area (m²)
 */
export function formatSurface(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined) return '-';
  return `${formatNumber(value, 'fr-CH', decimals)} m²`;
}

/**
 * Format a phone number (Swiss format)
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // Swiss format: +41 XX XXX XX XX
  if (digits.startsWith('41') && digits.length === 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  // Default: return as-is with spaces
  return phone;
}
