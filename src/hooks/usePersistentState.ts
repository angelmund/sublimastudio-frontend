import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * useState que persiste en localStorage.
 * - SSR-safe (no explota si no hay window).
 * - Acepta cualquier tipo serializable a JSON (bool, string, number, objeto, array).
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : (JSON.parse(stored) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded o modo privado: lo ignoramos */
    }
  }, [key, value]);

  return [value, setValue];
}