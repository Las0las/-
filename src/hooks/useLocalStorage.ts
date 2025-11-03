import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with TypeScript support
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [storedValue, setValue, error]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, Error | null] {
  const [error, setError] = useState<Error | null>(null);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item);

      // Validate the parsed data
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        console.warn(`Expected array for key "${key}" but got ${typeof parsed}`);
        return initialValue;
      }

      return parsed as T;
    } catch (err) {
      console.error(`Error loading localStorage key "${key}":`, err);
      setError(err instanceof Error ? err : new Error('Failed to load from localStorage'));
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setError(null);

        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (err) {
        console.error(`Error saving to localStorage key "${key}":`, err);
        const error = err instanceof Error ? err : new Error('Failed to save to localStorage');
        setError(error);

        // Check if quota exceeded
        if (err instanceof Error && err.name === 'QuotaExceededError') {
          setError(new Error('Storage quota exceeded. Please clear some data.'));
        }
      }
    },
    [key, storedValue]
  );

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (err) {
          console.error(`Error parsing storage event for key "${key}":`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, error];
}
