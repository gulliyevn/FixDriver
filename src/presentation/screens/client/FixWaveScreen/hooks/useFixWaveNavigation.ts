import { useState, useCallback, useEffect } from 'react';
import { FixWavePage } from '../types/fix-wave.types';
import { getProgressForPage, getNextPage, getPreviousPage } from '../utils/progressUtils';
import { fixwaveOrderService } from '../../../../services/fixwaveOrderService';

export const useFixWaveNavigation = () => {
  const [currentPage, setCurrentPage] = useState<FixWavePage>('addresses');
  const [progress, setProgress] = useState(0);
  const [sessionData, setSessionData] = useState<any>(null);

  // Загружаем данные сессии при инициализации
  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await fixwaveOrderService.loadSessionData();
        if (data) {
          setSessionData(data);
          // Всегда начинаем с первой страницы при загрузке
          setCurrentPage('addresses');
          updateProgress('addresses');
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };
    loadSession();
  }, []);

  const updateProgress = useCallback((page: FixWavePage) => {
    const newProgress = getProgressForPage(page);
    setProgress(newProgress);
  }, []);

  const saveSession = useCallback(async (page: FixWavePage, data?: any) => {
    try {
      // Сначала загружаем существующие данные сессии
      const existingSession = await fixwaveOrderService.loadSessionData();
      
      const sessionData = {
        ...existingSession, // Сохраняем существующие данные
        currentPage: page,
        ...data,
      };
      await fixwaveOrderService.saveSessionData(sessionData);
      setSessionData(sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, []);

  const goToPage = useCallback(async (page: FixWavePage, data?: any) => {
    setCurrentPage(page);
    updateProgress(page);
    await saveSession(page, data);
  }, [updateProgress, saveSession]);

  const nextPage = useCallback(async (data?: any) => {
    const next = getNextPage(currentPage);
    if (next) {
      await goToPage(next, data);
    }
  }, [currentPage, goToPage]);

  const previousPage = useCallback(async () => {
    const previous = getPreviousPage(currentPage);
    if (previous) {
      await goToPage(previous);
    }
  }, [currentPage, goToPage]);

  const resetToFirstPage = useCallback(async () => {
    await goToPage('addresses');
  }, [goToPage]);

  const clearSession = useCallback(async () => {
    try {
      await fixwaveOrderService.clearSessionData();
      setSessionData(null);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }, []);

  return {
    currentPage,
    progress,
    sessionData,
    goToPage,
    nextPage,
    previousPage,
    resetToFirstPage,
    updateProgress,
    clearSession,
  };
};
