/**
 * Utility functions for Swiss formatting (CHF, dates, numbers)
 */

/**
 * Format amount in Swiss Francs (CHF)
 * @example formatCHF(1234567.89) => "CHF 1'234'567.89"
 */
export function formatCHF(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'CHF 0.00';

  const formatted = new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `CHF ${formatted}`;
}

/**
 * Format amount without currency symbol (for inputs)
 * @example formatAmount(1234567.89) => "1'234'567.89"
 */
export function formatAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0.00';

  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in Swiss format (DD.MM.YYYY)
 * @example formatDateCH(new Date('2025-12-31')) => "31.12.2025"
 */
export function formatDateCH(date: Date | string | null | undefined): string {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
}

/**
 * Format datetime in Swiss format (DD.MM.YYYY HH:mm)
 */
export function formatDateTimeCH(date: Date | string | null | undefined): string {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;

  const datePart = formatDateCH(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${datePart} ${hours}:${minutes}`;
}

/**
 * Format percentage (0-100)
 * @example formatPercent(67.5) => "67.5%"
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%';

  return `${value.toFixed(1)}%`;
}

/**
 * Format surface area in m²
 * @example formatSurface(125.5) => "125.5 m²"
 */
export function formatSurface(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  return `${value.toFixed(1)} m²`;
}

/**
 * Parse Swiss formatted amount to number
 * @example parseAmount("1'234'567.89") => 1234567.89
 */
export function parseAmount(value: string): number {
  if (!value) return 0;

  // Remove CHF, spaces, and apostrophes
  const cleaned = value
    .replace(/CHF/g, '')
    .replace(/\s/g, '')
    .replace(/'/g, '')
    .trim();

  return parseFloat(cleaned) || 0;
}

/**
 * Get Swiss canton name
 */
export function getCantonName(code: string): string {
  const cantons: Record<string, string> = {
    'AG': 'Argovie',
    'AI': 'Appenzell Rhodes-Intérieures',
    'AR': 'Appenzell Rhodes-Extérieures',
    'BE': 'Berne',
    'BL': 'Bâle-Campagne',
    'BS': 'Bâle-Ville',
    'FR': 'Fribourg',
    'GE': 'Genève',
    'GL': 'Glaris',
    'GR': 'Grisons',
    'JU': 'Jura',
    'LU': 'Lucerne',
    'NE': 'Neuchâtel',
    'NW': 'Nidwald',
    'OW': 'Obwald',
    'SG': 'Saint-Gall',
    'SH': 'Schaffhouse',
    'SO': 'Soleure',
    'SZ': 'Schwyz',
    'TG': 'Thurgovie',
    'TI': 'Tessin',
    'UR': 'Uri',
    'VD': 'Vaud',
    'VS': 'Valais',
    'ZG': 'Zoug',
    'ZH': 'Zurich',
  };

  return cantons[code] || code;
}

/**
 * Format relative time (e.g., "il y a 2 heures")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "à l'instant";
  if (diffMins === 1) return 'il y a 1 minute';
  if (diffMins < 60) return `il y a ${diffMins} minutes`;
  if (diffHours === 1) return 'il y a 1 heure';
  if (diffHours < 24) return `il y a ${diffHours} heures`;
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays} jours`;

  return formatDateCH(d);
}

/**
 * Alias for formatDateCH (for convenience)
 */
export const formatDate = formatDateCH;
