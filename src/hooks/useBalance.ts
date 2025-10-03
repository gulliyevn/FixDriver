import { useBalanceContext } from "../context/BalanceContext";

/**
 * Хук для работы с балансом через централизованный контекст
 */
export const useBalance = () => {
  return useBalanceContext();
};
