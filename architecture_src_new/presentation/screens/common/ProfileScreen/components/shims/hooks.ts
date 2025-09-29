export const useBalance = () => ({ balance: 0, topUpBalance: async (_: number) => true });
export const useDriverBalance = () => ({ balance: 0, earnings: 0, topUpBalance: async (_: number) => true, withdrawBalance: async (_: number) => true });
export type DriverBalanceContextType = ReturnType<typeof useDriverBalance>;


