/**
 * RealPro | useClickOutside Hook
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { useEffect, useRef, RefObject } from 'react';

/**
 * Detect clicks outside of a referenced element
 * @param callback - Function to call when clicked outside
 * @returns Ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}
