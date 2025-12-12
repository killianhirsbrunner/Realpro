/**
 * Validation utilities - Generic validators only
 * No business-specific validation rules
 */

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Swiss phone number format
 */
export function isValidSwissPhone(phone: string): boolean {
  // Swiss phone: +41 or 0 followed by 9 digits
  const swissPhoneRegex = /^(\+41|0)\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  return swissPhoneRegex.test(phone.replace(/\s/g, ' ').trim());
}

/**
 * Validate Swiss postal code (4 digits)
 */
export function isValidSwissPostalCode(code: string): boolean {
  return /^\d{4}$/.test(code);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate that a number is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate string length
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}
