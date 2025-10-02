import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import DriverStatsService, { EarningsChartData } from '../services/DriverStatsService';

// Кэш для данных графика
const chartDataCache = new Map<string, {
  data: EarningsChartData;
  timestamp: number;
  ttl: number;
}>();

// TTL для кэша (5 минут)
const CACHE_TTL = 5 * 60 * 1000;

// Дебаунс для запросов (300ms)
const DEBOUNCE_DELAY = 300;

export const useEarningsChartData = (driverId: string, period: 'today' | 'week' | 'month' | 'year') => {
  const [chartData, setChartData] = useState<EarningsChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  
  // Рефы для дебаунсинга и отмены запросов
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ключ кэша
  const cacheKey = useMemo(() => `chart_${period}`, [period]);

  // Проверка кэша
  const getCachedData = useCallback((key: string): EarningsChartData | null => {
    const cached = chartDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    // Удаляем устаревшие данные
    if (cached) {
      chartDataCache.delete(key);
    }
    return null;
  }, []);

  // Сохранение в кэш
  const setCachedData = useCallback((key: string, data: EarningsChartData) => {
    chartDataCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    });
  }, []);

  // Очистка кэша
  const clearCache = useCallback(() => {
    chartDataCache.clear();
  }, []);

  // Оптимизированная загрузка данных
  const loadChartData = useCallback(async (forceRefresh = false) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    // Проверяем кэш, если не принудительное обновление
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
      const service = DriverStatsService.getInstance();
      const data = await service.getEarningsChartData(driverId, period);
      
      // Проверяем, не был ли запрос отменен
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setChartData(data);
      setLastUpdated(Date.now());
      setCachedData(cacheKey, data);
    } catch (err) {
      // Проверяем, не был ли запрос отменен
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения данных графика';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [period, cacheKey, getCachedData, setCachedData]);

  // Дебаунсированная загрузка
  const debouncedLoadData = useCallback((forceRefresh = false) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      loadChartData(forceRefresh);
    }, DEBOUNCE_DELAY);
  }, [loadChartData]);

  // Загружаем данные при изменении периода
  useEffect(() => {
    debouncedLoadData();
    
    // Очистка при размонтировании
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedLoadData]);

  // Функция для принудительного обновления данных
  const refreshData = useCallback(() => {
    debouncedLoadData(true);
  }, [debouncedLoadData]);

  // Функция для очистки кэша
  const clearDataCache = useCallback(() => {
    clearCache();
    setChartData(null);
    setLastUpdated(0);
  }, [clearCache]);

  // Проверка, нужно ли обновление данных
  const needsRefresh = useMemo(() => {
    const now = Date.now();
    const timeSinceUpdate = now - lastUpdated;
    return timeSinceUpdate > CACHE_TTL;
  }, [lastUpdated]);

  // Автоматическое обновление устаревших данных
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
