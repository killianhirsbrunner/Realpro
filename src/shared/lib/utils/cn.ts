/**
 * RealPro | Tailwind Class Merge Utility
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution
 * @example cn('px-2 py-1', 'px-4') => 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
