/**
 * RealPro | Formatting Utilities
 * Swiss formatting (CHF, dates, numbers)
 * © 2024-2025 Realpro SA. Tous droits réservés.
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

  const cleaned = value
    .replace(/CHF/g, '')
    .replace(/\s/g, '')
    .replace(/'/g, '')
    .trim();

  return parseFloat(cleaned) || 0;
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

/**
 * Format phone number for Switzerland
 * @example formatPhone("0791234567") => "+41 79 123 45 67"
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle Swiss numbers
  if (digits.startsWith('0') && digits.length === 10) {
    return `+41 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }

  if (digits.startsWith('41') && digits.length === 11) {
    return `+41 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }

  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate initials from name
 * @example getInitials("Jean-Pierre Dupont") => "JD"
 */
export function getInitials(name: string): string {
  if (!name) return '??';

  const parts = name.trim().split(/[\s-]+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
