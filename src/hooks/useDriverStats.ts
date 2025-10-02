import { useState, useCallback } from 'react';
import DriverStatsService, { DayStats, PeriodStats } from '../services/DriverStatsService';

export const useDriverStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получение статистики за период
  const getPeriodStats = useCallback(async (startDate: string, endDate: string, period: 'week' | 'month' | 'year' = 'month'): Promise<PeriodStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const service = DriverStatsService.getInstance();
      const stats = await service.getPeriodStats('driver_id', period, startDate, endDate);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения статистики';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статистики за последние N дней
  const getLastNDaysStats = useCallback(async (days: number): Promise<DayStats[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const service = DriverStatsService.getInstance();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const endDate = new Date();
      const stats = await service.getPeriodStats(
        'driver_id',
        'month',
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      );
      return Array.isArray(stats) ? stats : [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения статистики';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статистики за текущий месяц
  const getCurrentMonthStats = useCallback(async (): Promise<DayStats[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const service = DriverStatsService.getInstance();
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endDate = new Date();
      const stats = await service.getPeriodStats(
        'driver_id',
        'month',
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      );
      return Array.isArray(stats) ? stats : [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения статистики';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статистики за текущий год
  const getCurrentYearStats = useCallback(async (): Promise<DayStats[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const service = DriverStatsService.getInstance();
      const startDate = new Date(new Date().getFullYear(), 0, 1);
      const endDate = new Date();
      const stats = await service.getPeriodStats(
        'driver_id',
        'year',
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      );
      return Array.isArray(stats) ? stats : [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения статистики';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статистики за конкретный день
  const getDayStats = useCallback(async (date: string): Promise<DayStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const service = DriverStatsService.getInstance();
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj.getTime() + 24 * 60 * 60 * 1000);
      const stats = await service.getPeriodStats(
        'driver_id',
        'month',
        dateObj.toISOString().split('T')[0], 
        nextDay.toISOString().split('T')[0]
      );
      return Array.isArray(stats) && stats.length > 0 ? stats[0] : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения статистики дня';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статистики за сегодня
  const getTodayStats = useCallback(async (): Promise<DayStats | null> => {
    const today = new Date().toISOString().split('T')[0];
    return getDayStats(today);
  }, [getDayStats]);

  // Получение статистики за вчера
  const getYesterdayStats = useCallback(async (): Promise<DayStats | null> => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return getDayStats(yesterdayStr);
  }, [getDayStats]);

  // Получение статистики за неделю (последние 7 дней)
  const getWeekStats = useCallback(async (): Promise<PeriodStats | null> => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return getPeriodStats(startDateStr, endDate, 'week');
  }, [getPeriodStats]);

  // Получение статистики за месяц (последние 30 дней)
  const getMonthStats = useCallback(async (): Promise<PeriodStats | null> => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return getPeriodStats(startDateStr, endDate, 'month');
  }, [getPeriodStats]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getPeriodStats,
    getLastNDaysStats,
    getCurrentMonthStats,
    getCurrentYearStats,
    getDayStats,
    getTodayStats,
    getYesterdayStats,
    getWeekStats,
    getMonthStats,
    clearError,
  };
};
