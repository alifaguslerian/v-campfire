import { useCallback, useEffect, useRef } from "react";

/**
 * Debounced autosave helper - used by sticky notes now, journal next (both
 * need "save a few hundred ms after the user stops typing", not on every
 * keystroke - see docs/PERFORMANCE.md).
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number,
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delayMs,
      );
    },
    [delayMs],
  ) as T;
}
