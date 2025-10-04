import React, { useEffect, useRef } from "react";

// Типы для NodeJS
declare global {
  namespace NodeJS {
    interface Timeout {
      ref(): NodeJS.Timeout;
      unref(): NodeJS.Timeout;
      refresh(): NodeJS.Timeout;
    }
  }
}

/**
 * Hook that provides a safe way to handle cleanup in useEffect
 * Prevents memory leaks by ensuring cleanup functions are always called
 */
export const useSafeEffect = (
  effect: () => void | (() => void),
  deps?: React.DependencyList,
) => {
  const cleanupRef = useRef<(() => void) | void>();
  const isCleanedUpRef = useRef(false);

  useEffect(() => {
    // Reset cleanup flag
    isCleanedUpRef.current = false;

    // Execute effect
    cleanupRef.current = effect();

    // Return cleanup function
    return () => {
      if (!isCleanedUpRef.current && cleanupRef.current) {
        isCleanedUpRef.current = true;
        try {
          cleanupRef.current();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, deps);
};

/**
 * Hook for managing subscriptions with automatic cleanup
 */
export const useSubscription = <T>(
  subscribe: (callback: (value: T) => void) => () => void,
  deps?: React.DependencyList,
) => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Create new subscription
    unsubscribeRef.current = subscribe(() => {});

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, deps);
};

/**
 * Hook for managing timers with automatic cleanup
 */
export const useTimer = (
  callback: () => void,
  delay: number | null,
  deps?: React.DependencyList,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer if delay is provided
    if (delay !== null) {
      timerRef.current = setTimeout(() => {
        callback();
      }, delay);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callback, delay, ...(deps || [])]);
};

/**
 * Hook for managing intervals with automatic cleanup
 */
export const useInterval = (
  callback: () => void,
  delay: number | null,
  deps?: React.DependencyList,
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new interval if delay is provided
    if (delay !== null) {
      intervalRef.current = setInterval(() => {
        callback();
      }, delay);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, delay, ...(deps || [])]);
};

export default useSafeEffect;
