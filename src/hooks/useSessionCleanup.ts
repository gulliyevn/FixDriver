import { useEffect, useRef } from 'react';
import { fixwaveOrderService } from '../services/fixwaveOrderService';

export const useSessionCleanup = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Функция для проверки и очистки устаревшей сессии
    const checkAndClearSession = async () => {
      try {
        await fixwaveOrderService.checkAndClearExpiredSession();
      } catch (error) {
        console.error('Error in session cleanup:', error);
      }
    };

    // Проверяем сразу при запуске
    checkAndClearSession();

    // Устанавливаем интервал для проверки каждые 5 минут
    intervalRef.current = setInterval(checkAndClearSession, 5 * 60 * 1000);

    // Очистка при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Функция для принудительной очистки сессии
  const forceClearSession = async () => {
    try {
      await fixwaveOrderService.clearSessionData();
      console.log('Session forcefully cleared');
    } catch (error) {
      console.error('Error forcefully clearing session:', error);
    }
  };

  return { forceClearSession };
};
