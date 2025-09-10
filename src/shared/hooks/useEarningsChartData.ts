import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EarningsChartData } from '../../data/datasources/driverStats/DriverStatsTypes';
import { earningsChartOperations } from '../../domain/usecases/earnings/earningsChartOperations';

// Cache for chart data
const chartDataCache = new Map<string, {
  data: EarningsChartData;
  timestamp: number;
  ttl: number;
}>();

// TTL for cache (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Debounce for requests (300ms)
const DEBOUNCE_DELAY = 300;

export const useEarningsChartData = (period: 'today' | 'week' | 'month' | 'year') => {
  const [chartData, setChartData] = useState<EarningsChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  
  // Refs for debouncing and request cancellation
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cache key
  const cacheKey = useMemo(() => `chart_${period}`, [period]);

  // Check cache
  const getCachedData = useCallback((key: string): EarningsChartData | null => {
    const cached = chartDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    // Remove stale data
    if (cached) {
      chartDataCache.delete(key);
    }
    return null;
  }, []);

  // Save to cache
  const setCachedData = useCallback((key: string, data: EarningsChartData) => {
    chartDataCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    });
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    chartDataCache.clear();
  }, []);

  // Optimized data loading
  const loadChartData = useCallback(async (forceRefresh = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    // Check cache if not forced refresh
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setChartData(cachedData);
        setLastUpdated(Date.now());
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await earningsChartOperations.getEarningsChartData(period);
      
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setChartData(data);
      setLastUpdated(Date.now());
      setCachedData(cacheKey, data);
    } catch (err) {
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Error loading chart data';
      setError(errorMessage);
      console.error('[useEarningsChartData] Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [period, cacheKey, getCachedData, setCachedData]);

  // Debounced loading
  const debouncedLoadData = useCallback((forceRefresh = false) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      loadChartData(forceRefresh);
    }, DEBOUNCE_DELAY);
  }, [loadChartData]);

  // Load data when period changes
  useEffect(() => {
    debouncedLoadData();
    
    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedLoadData]);

  // Function for forced data refresh
  const refreshData = useCallback(() => {
    debouncedLoadData(true);
  }, [debouncedLoadData]);

  // Function for cache clearing
  const clearDataCache = useCallback(() => {
    clearCache();
    setChartData(null);
    setLastUpdated(0);
  }, [clearCache]);

  // Check if data needs refresh
  const needsRefresh = useMemo(() => {
    const now = Date.now();
    const timeSinceUpdate = now - lastUpdated;
    return timeSinceUpdate > CACHE_TTL;
  }, [lastUpdated]);

  // Automatic refresh of stale data
  useEffect(() => {
    if (needsRefresh && !loading && chartData) {
      debouncedLoadData(true);
    }
  }, [needsRefresh, loading, chartData, debouncedLoadData]);

  return {
    chartData,
    loading,
    error,
    lastUpdated,
    needsRefresh,
    refreshData,
    clearDataCache,
  };
};
