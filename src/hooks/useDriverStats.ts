import { useState, useEffect, useCallback } from 'react';
import DriverStatsService, { DayStats, PeriodStats } from '../services/DriverStatsService';

export const useDriverStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получение статистики за период
  const getPeriodStats = useCallback(async (startDate: string, endDate: string): Promise<PeriodStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await DriverStatsService.getPeriodStats(startDate, endDate);
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
      const stats = await DriverStatsService.getLastNDaysStats(days);
      return stats;
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
      const stats = await DriverStatsService.getCurrentMonthStats();
      return stats;
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
      const stats = await DriverStatsService.getCurrentYearStats();
      return stats;
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
      const stats = await DriverStatsService.getDayStats(date);
      return stats;
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
    
    return getPeriodStats(startDateStr, endDate);
  }, [getPeriodStats]);

  // Получение статистики за месяц (последние 30 дней)
  const getMonthStats = useCallback(async (): Promise<PeriodStats | null> => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return getPeriodStats(startDateStr, endDate);
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
