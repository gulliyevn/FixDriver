import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEarningsHandlers } from '../useEarningsHandlers';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

// Мокаем useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Мокаем Animated.timing отдельно
const mockAnimatedTiming = jest.fn(() => ({
  start: jest.fn(),
}));

jest.mock('react-native', () => ({
  Animated: {
    timing: mockAnimatedTiming,
  },
}));

describe('useEarningsHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('confirmStatusChange', () => {
    it('sets online status and starts online time tracking', async () => {
      const mockStartOnlineTime = jest.fn();
      const mockStopOnlineTime = jest.fn();

      const { result } = renderHook(() => useEarningsHandlers(
        false, // filterExpanded
        jest.fn(), // setFilterExpanded
        {} as any, // filterExpandAnim
        jest.fn(), // setSelectedPeriod
        jest.fn(), // setStatusModalVisible
        false, // isOnline
        jest.fn(), // setIsOnline
        mockStartOnlineTime, // startOnlineTime
        mockStopOnlineTime // stopOnlineTime
      ));

      await act(async () => {
        result.current.confirmStatusChange();
      });

      expect(mockStartOnlineTime).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@driver_online_status', 'true');
    });

    it('sets offline status and stops online time tracking', async () => {
      const mockStartOnlineTime = jest.fn();
      const mockStopOnlineTime = jest.fn();

      const { result } = renderHook(() => useEarningsHandlers(
        false, // filterExpanded
        jest.fn(), // setFilterExpanded
        {} as any, // filterExpandAnim
        jest.fn(), // setSelectedPeriod
        jest.fn(), // setStatusModalVisible
        true, // isOnline
        jest.fn(), // setIsOnline
        mockStartOnlineTime, // startOnlineTime
        mockStopOnlineTime // stopOnlineTime
      ));

      await act(async () => {
        result.current.confirmStatusChange();
      });

      expect(mockStopOnlineTime).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@driver_online_status', 'false');
    });

    it('persists status change to AsyncStorage', async () => {
      const mockStartOnlineTime = jest.fn();
      const mockStopOnlineTime = jest.fn();
      const mockSetIsOnline = jest.fn();
      const mockSetStatusModalVisible = jest.fn();

      const { result } = renderHook(() => useEarningsHandlers(
        false, // filterExpanded
        jest.fn(), // setFilterExpanded
        {} as any, // filterExpandAnim
        jest.fn(), // setSelectedPeriod
        mockSetStatusModalVisible, // setStatusModalVisible
        false, // isOnline
        mockSetIsOnline, // setIsOnline
        mockStartOnlineTime, // startOnlineTime
        mockStopOnlineTime // stopOnlineTime
      ));

      await act(async () => {
        result.current.confirmStatusChange();
      });

      expect(mockSetIsOnline).toHaveBeenCalledWith(true);
      expect(mockSetStatusModalVisible).toHaveBeenCalledWith(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@driver_online_status', 'true');
    });
  });
});
