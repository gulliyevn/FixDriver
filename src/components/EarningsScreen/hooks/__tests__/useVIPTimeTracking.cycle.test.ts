import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVIPTimeTracking } from '../useVIPTimeTracking';

// Mock dependencies
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
}));

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(),
  runOnJS: jest.fn((fn) => fn),
}));

describe('useVIPTimeTracking - 360-day auto reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resets VIP cycle fully after 360 days from vipCycleStartDate', async () => {
    const { result } = renderHook(() => useVIPTimeTracking());

    // Set up initial VIP data with old cycle start date
    const oldCycleStartDate = new Date();
    oldCycleStartDate.setDate(oldCycleStartDate.getDate() - 365); // 365 days ago

    const initialVIPData = {
      consecutiveQualifiedMonths: 5,
      vipCycleStartDate: oldCycleStartDate.toISOString(),
      qualifiedDaysHistory: [25, 22, 20, 18, 21],
      qualifiedDaysThisMonth: 15,
      periodStartDate: new Date().toISOString(),
    };

    await AsyncStorage.setItem('vipTimeData', JSON.stringify(initialVIPData));

    // Initialize hook
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for initialization
    });

    // Trigger day change check (simulate 360+ days passed)
    await act(async () => {
      result.current.checkDayChange();
    });

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Get updated data
    const storedData = await AsyncStorage.getItem('vipTimeData');
    const data = storedData ? JSON.parse(storedData) : null;

    // Verify full reset occurred
    expect(data).toBeTruthy();
    expect(data.consecutiveQualifiedMonths).toBe(0);
    expect(typeof data.vipCycleStartDate).toBe('string'); // Re-initialized to next midnight
    expect(data.qualifiedDaysHistory).toEqual([]);
    expect(data.qualifiedDaysThisMonth).toBe(0);
  });

  it('does not reset VIP cycle if less than 360 days passed', async () => {
    const { result } = renderHook(() => useVIPTimeTracking());

    // Set up initial VIP data with recent cycle start date
    const recentCycleStartDate = new Date();
    recentCycleStartDate.setDate(recentCycleStartDate.getDate() - 30); // 30 days ago

    const initialVIPData = {
      consecutiveQualifiedMonths: 3,
      vipCycleStartDate: recentCycleStartDate.toISOString(),
      qualifiedDaysHistory: [25, 22, 20],
      qualifiedDaysThisMonth: 15,
      periodStartDate: new Date().toISOString(),
    };

    await AsyncStorage.setItem('vipTimeData', JSON.stringify(initialVIPData));

    // Initialize hook
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for initialization
    });

    // Trigger day change check
    await act(async () => {
      result.current.checkDayChange();
    });

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Get updated data
    const storedData = await AsyncStorage.getItem('vipTimeData');
    const data = storedData ? JSON.parse(storedData) : null;

    // Verify no reset occurred
    expect(data).toBeTruthy();
    expect(data.consecutiveQualifiedMonths).toBe(3);
    expect(data.vipCycleStartDate).toBe(recentCycleStartDate.toISOString());
    expect(data.qualifiedDaysHistory).toEqual([25, 22, 20]);
    expect(data.qualifiedDaysThisMonth).toBe(15);
  });
});
