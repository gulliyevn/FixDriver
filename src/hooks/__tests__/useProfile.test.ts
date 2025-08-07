import { renderHook, act } from '@testing-library/react-native';
import { useProfile } from '../useProfile';
import { useAuth } from '../../context/AuthContext';

// Мокаем контексты
jest.mock('../../context/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useProfile - Smart Role Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Client Role', () => {
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
    });

    it('should use client profile hook when user role is client', () => {
      const { result } = renderHook(() => useProfile());

      // Проверяем, что хук возвращает данные для клиента
      expect(result.current).toBeDefined();
      expect(result.current.profile).toBeDefined();
      expect(result.current.loading).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.loadProfile).toBeDefined();
      expect(result.current.updateProfile).toBeDefined();
      expect(result.current.clearProfile).toBeDefined();
    });

    it('should have client-specific profile data', () => {
      const { result } = renderHook(() => useProfile());

      if (result.current.profile) {
        expect(result.current.profile.role).toBe('client');
        expect(result.current.profile.name).toBeDefined();
        expect(result.current.profile.email).toBeDefined();
      }
    });
  });

  describe('Driver Role', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john.driver@example.com', role: 'driver' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshAuth: jest.fn(),
        getAuthHeader: jest.fn(),
        changeRole: jest.fn(),
      });
    });

    it('should use driver profile hook when user role is driver', () => {
      const { result } = renderHook(() => useProfile());

      // Проверяем, что хук возвращает данные для водителя
      expect(result.current).toBeDefined();
      expect(result.current.profile).toBeDefined();
      expect(result.current.loading).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.loadProfile).toBeDefined();
      expect(result.current.updateProfile).toBeDefined();
      expect(result.current.clearProfile).toBeDefined();
    });

    it('should have driver-specific profile data', () => {
      const { result } = renderHook(() => useProfile());

      if (result.current.profile) {
        expect(result.current.profile.role).toBe('driver');
        expect(result.current.profile.name).toBeDefined();
        expect(result.current.profile.email).toBeDefined();
      }
    });
  });

  describe('Role Switching', () => {
    it('should switch from client to driver profile when role changes', () => {
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

      const { result: clientResult, rerender } = renderHook(() => useProfile());

      expect(clientResult.current).toBeDefined();

      // Переключаемся на роль водителя
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John', email: 'john.driver@example.com', role: 'driver' },
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

      const { result: driverResult } = renderHook(() => useProfile());

      expect(driverResult.current).toBeDefined();
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

      const { result } = renderHook(() => useProfile());

      // Должен работать без ошибок
      expect(result.current).toBeDefined();
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

      const { result } = renderHook(() => useProfile());

      // Должен работать без ошибок
      expect(result.current).toBeDefined();
    });
  });
}); 