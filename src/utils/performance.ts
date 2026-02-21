import { useCallback, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
};

export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};

export const useLazyRef = <T>(init: () => T) => {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = init();
  }

  return [ref, () => {
    ref.current = null;
  }] as [MutableRefObject<T | null>, () => void];
};

export const useUpdateEffect = (effect: () => void | (() => void), deps: unknown[] = []): void => {
  const isMounted = useRef(false);
  const prevDepsRef = useRef(deps);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      prevDepsRef.current = deps;
      return;
    }

    if (JSON.stringify(deps) !== JSON.stringify(prevDepsRef.current)) {
      const cleanup = effect();
      prevDepsRef.current = deps;
      return cleanup;
    }
  }, [effect, deps]);
};