import { useState, useCallback, useEffect } from "react";
import { FixWavePage } from "../types/fix-wave.types";
import type { FixWaveOrderData } from "../types/fix-wave.types";
import type { SessionAddressData, SessionTimeScheduleData } from "../../../../services/fixwaveOrderService";
import {
  getProgressForPage,
  getNextPage,
  getPreviousPage,
} from "../utils/progressUtils";
import { fixwaveOrderService } from "../../../../services/fixwaveOrderService";

export const useFixWaveNavigation = () => {
  const [currentPage, setCurrentPage] = useState<FixWavePage>("addresses");
  const [progress, setProgress] = useState(0);
  type SessionData = {
    currentPage: FixWavePage;
    addressData?: SessionAddressData;
    timeScheduleData?: SessionTimeScheduleData;
    lastUpdate?: number;
  };

  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Загружаем данные сессии при инициализации
  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await fixwaveOrderService.loadSessionData();
        if (data) {
          const currentPage = (data.currentPage as FixWavePage) || "addresses";
          setSessionData({
            addressData: data.addressData as SessionAddressData | undefined,
            timeScheduleData: data.timeScheduleData as SessionTimeScheduleData | undefined,
            currentPage,
            lastUpdate: data.lastUpdate,
          });
          // Всегда начинаем с первой страницы при загрузке
          setCurrentPage("addresses");
          updateProgress("addresses");
        }
      } catch (error) {
        console.warn('Failed to load session:', error);
      }
    };
    loadSession();
  }, []);

  const updateProgress = useCallback((page: FixWavePage) => {
    const newProgress = getProgressForPage(page);
    setProgress(newProgress);
  }, []);

  const saveSession = useCallback(
    async (page: FixWavePage, data?: Partial<FixWaveOrderData>) => {
    try {
      // Сначала загружаем существующие данные сессии
      const existingSession = await fixwaveOrderService.loadSessionData();

      const sessionData: SessionData = {
        currentPage: page,
        addressData: (data?.addressData as SessionAddressData | undefined) ?? existingSession?.addressData,
        timeScheduleData:
          (data?.timeScheduleData as SessionTimeScheduleData | undefined) ?? existingSession?.timeScheduleData,
      };
      await fixwaveOrderService.saveSessionData(sessionData);
      setSessionData(sessionData);
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  }, []);

  const goToPage = useCallback(
    async (page: FixWavePage, data?: Partial<FixWaveOrderData>) => {
      setCurrentPage(page);
      updateProgress(page);
      await saveSession(page, data);
    },
    [updateProgress, saveSession],
  );

  const nextPage = useCallback(
    async (data?: Partial<FixWaveOrderData>) => {
      const next = getNextPage(currentPage);
      if (next) {
        await goToPage(next, data);
      }
    },
    [currentPage, goToPage],
  );

  const previousPage = useCallback(async () => {
    const previous = getPreviousPage(currentPage);
    if (previous) {
      await goToPage(previous);
    }
  }, [currentPage, goToPage]);

  const resetToFirstPage = useCallback(async () => {
    await goToPage("addresses");
  }, [goToPage]);

  const clearSession = useCallback(async () => {
    try {
      await fixwaveOrderService.clearSessionData();
      setSessionData(null);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
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
