import { useAuth } from '../context/AuthContext';
import { useClientBalance, ClientBalanceContextType } from './client/useClientBalance';
import { useDriverBalance, DriverBalanceContextType } from './driver/useDriverBalance';

// Объединяем типы для умного хука
export type BalanceContextType = ClientBalanceContextType | DriverBalanceContextType;

/**
 * Умный хук для работы с балансом
 * Автоматически выбирает клиентский или драйверский хук в зависимости от роли пользователя
 */
export const useBalance = (): BalanceContextType => {
  const { user } = useAuth();
  
  // Выбираем хук в зависимости от роли
  if (user?.role === 'driver') {
    return useDriverBalance();
  } else {
    return useClientBalance();
  }
}; 