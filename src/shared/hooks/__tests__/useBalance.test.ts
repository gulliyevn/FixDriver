import { renderHook, act } from '@testing-library/react-native';
import { useBalance } from '../useBalance';
import { useAuth } from '../../context/AuthContext';
import { useClientBalance } from '../client/useClientBalance';
import { useDriverBalance } from '../driver/useDriverBalance';

// Мокаем контексты
jest.mock('../../context/AuthContext');
jest.mock('../client/useClientBalance');
jest.mock('../driver/useDriverBalance');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseClientBalance = useClientBalance as jest.MockedFunction<typeof useClientBalance>;
const mockUseDriverBalance = useDriverBalance as jest.MockedFunction<typeof useDriverBalance>;

describe('useBalance - Smart Role Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Client Role', () => {
    const mockClientBalance = {
      balance: 1000,
      transactions: [],
      cashback: 50,
      topUpBalance: jest.fn(),
      deductBalance: jest.fn(),
      addTransaction: jest.fn(),
      getCashback: jest.fn(),
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'client' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      mockUseClientBalance.mockReturnValue(mockClientBalance);
      mockUseDriverBalance.mockReturnValue({
        balance: 0,
        transactions: [],
        earnings: 0,
        topUpBalance: jest.fn(),
        withdrawBalance: jest.fn(),
        addTransaction: jest.fn(),
        getEarnings: jest.fn(),
      });
    });

    it('should use client balance hook when user role is client', () => {
      const { result } = renderHook(() => useBalance());

      expect(mockUseClientBalance).toHaveBeenCalled();
      expect(mockUseDriverBalance).not.toHaveBeenCalled();
      expect(result.current).toEqual(mockClientBalance);
    });

    it('should have client-specific properties', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current).toHaveProperty('cashback');
      expect(result.current).toHaveProperty('topUpBalance');
      expect(result.current).toHaveProperty('deductBalance');
      expect(result.current).toHaveProperty('getCashback');
    });

    it('should not have driver-specific properties', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current).not.toHaveProperty('earnings');
      expect(result.current).not.toHaveProperty('withdrawBalance');
      expect(result.current).not.toHaveProperty('getEarnings');
    });

    it('should handle topUpBalance correctly for client', async () => {
      const { result } = renderHook(() => useBalance());

      await act(async () => {
        await result.current.topUpBalance(500);
      });

      expect(mockClientBalance.topUpBalance).toHaveBeenCalledWith(500);
    });

    it('should handle deductBalance correctly for client', async () => {
      const { result } = renderHook(() => useBalance());

      await act(async () => {
        await result.current.deductBalance(100, 'Test payment');
      });

      expect(mockClientBalance.deductBalance).toHaveBeenCalledWith(100, 'Test payment');
    });

    it('should return correct balance for client', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current.balance).toBe(1000);
    });

    it('should return correct cashback for client', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current.cashback).toBe(50);
    });
  });

  describe('Driver Role', () => {
    const mockDriverBalance = {
      balance: 2500,
      transactions: [],
      earnings: 1500,
      topUpBalance: jest.fn(),
      withdrawBalance: jest.fn(),
      addTransaction: jest.fn(),
      getEarnings: jest.fn(),
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'driver' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      mockUseDriverBalance.mockReturnValue(mockDriverBalance);
      mockUseClientBalance.mockReturnValue({
        balance: 0,
        transactions: [],
        cashback: 0,
        topUpBalance: jest.fn(),
        deductBalance: jest.fn(),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      });
    });

    it('should use driver balance hook when user role is driver', () => {
      const { result } = renderHook(() => useBalance());

      expect(mockUseDriverBalance).toHaveBeenCalled();
      expect(mockUseClientBalance).not.toHaveBeenCalled();
      expect(result.current).toEqual(mockDriverBalance);
    });

    it('should have driver-specific properties', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current).toHaveProperty('earnings');
      expect(result.current).toHaveProperty('topUpBalance');
      expect(result.current).toHaveProperty('withdrawBalance');
      expect(result.current).toHaveProperty('getEarnings');
    });

    it('should not have client-specific properties', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current).not.toHaveProperty('cashback');
      expect(result.current).not.toHaveProperty('deductBalance');
      expect(result.current).not.toHaveProperty('getCashback');
    });

    it('should handle topUpBalance correctly for driver', async () => {
      const { result } = renderHook(() => useBalance());

      await act(async () => {
        await result.current.topUpBalance(500);
      });

      expect(mockDriverBalance.topUpBalance).toHaveBeenCalledWith(500);
    });

    it('should handle withdrawBalance correctly for driver', async () => {
      const { result } = renderHook(() => useBalance());

      await act(async () => {
        await result.current.withdrawBalance(100);
      });

      expect(mockDriverBalance.withdrawBalance).toHaveBeenCalledWith(100);
    });

    it('should return correct balance for driver', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current.balance).toBe(2500);
    });

    it('should return correct earnings for driver', () => {
      const { result } = renderHook(() => useBalance());

      expect(result.current.earnings).toBe(1500);
    });
  });

  describe('Role Switching', () => {
    it('should switch from client to driver balance when role changes', () => {
      // Начинаем с роли клиента
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'client' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      const { rerender } = renderHook(() => useBalance());

      expect(mockUseClientBalance).toHaveBeenCalled();
      expect(mockUseDriverBalance).not.toHaveBeenCalled();

      // Переключаемся на роль водителя
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'driver' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      rerender();

      expect(mockUseDriverBalance).toHaveBeenCalled();
    });

    it('should maintain separate balance states for different roles', () => {
      const mockClientBalance = {
        balance: 1000,
        transactions: [],
        cashback: 50,
        topUpBalance: jest.fn(),
        deductBalance: jest.fn(),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      };

      const mockDriverBalance = {
        balance: 2500,
        transactions: [],
        earnings: 1500,
        topUpBalance: jest.fn(),
        withdrawBalance: jest.fn(),
        addTransaction: jest.fn(),
        getEarnings: jest.fn(),
      };

      mockUseClientBalance.mockReturnValue(mockClientBalance);
      mockUseDriverBalance.mockReturnValue(mockDriverBalance);

      // Клиент
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'client' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      const { result: clientResult, rerender } = renderHook(() => useBalance());

      expect(clientResult.current.balance).toBe(1000);
      expect(clientResult.current.cashback).toBe(50);

      // Водитель
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'driver' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      rerender();

      const { result: driverResult } = renderHook(() => useBalance());

      expect(driverResult.current.balance).toBe(2500);
      expect(driverResult.current.earnings).toBe(1500);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined user role gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: undefined,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      const { result } = renderHook(() => useBalance());

      // Должен использовать клиентский хук по умолчанию
      expect(mockUseClientBalance).toHaveBeenCalled();
      expect(mockUseDriverBalance).not.toHaveBeenCalled();
    });

    it('should handle unknown role gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'unknown' as any },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      const { result } = renderHook(() => useBalance());

      // Должен использовать клиентский хук по умолчанию
      expect(mockUseClientBalance).toHaveBeenCalled();
      expect(mockUseDriverBalance).not.toHaveBeenCalled();
    });
  });

  describe('Integration with Package Context', () => {
    it('should work correctly with package purchases for client', async () => {
      const mockClientBalance = {
        balance: 1000,
        transactions: [],
        cashback: 50,
        topUpBalance: jest.fn(),
        deductBalance: jest.fn().mockResolvedValue(true),
        addTransaction: jest.fn(),
        getCashback: jest.fn(),
      };

      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'client' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      mockUseClientBalance.mockReturnValue(mockClientBalance);

      const { result } = renderHook(() => useBalance());

      // Симулируем покупку пакета
      await act(async () => {
        const success = await result.current.deductBalance(100, 'Premium package purchase', 'premium');
        expect(success).toBe(true);
      });

      expect(mockClientBalance.deductBalance).toHaveBeenCalledWith(100, 'Premium package purchase', 'premium');
    });

    it('should work correctly with earnings for driver', async () => {
      const mockDriverBalance = {
        balance: 2500,
        transactions: [],
        earnings: 1500,
        topUpBalance: jest.fn(),
        withdrawBalance: jest.fn().mockResolvedValue(true),
        addTransaction: jest.fn(),
        getEarnings: jest.fn(),
      };

      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john@example.com', role: 'driver' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });

      mockUseDriverBalance.mockReturnValue(mockDriverBalance);

      const { result } = renderHook(() => useBalance());

      // Симулируем вывод средств
      await act(async () => {
        const success = await result.current.withdrawBalance(500);
        expect(success).toBe(true);
      });

      expect(mockDriverBalance.withdrawBalance).toHaveBeenCalledWith(500);
    });
  });
}); 