import { renderHook, act } from "../../../../test-utils/testWrapper";
// Clean unit tests for VIP time tracking logic
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVIPTimeTracking } from "../../hooks/useVIPTimeTracking";
import { VIP_CONFIG } from "../../types/levels.config";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Haptics
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
  ImpactFeedbackStyle: { Light: "light" },
}));

// Mock BalanceContext
const mockAddEarnings = jest.fn();
jest.mock("../../../../context/BalanceContext", () => ({
  useBalanceContext: () => ({ addEarnings: mockAddEarnings }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  mockAddEarnings.mockResolvedValue({});
});

describe("useVIPTimeTracking - 30-day periods", () => {
  it("qualifies VIP day with 10h online and 3 rides", async () => {
    const { result } = renderHook(() => useVIPTimeTracking(true));
    await act(async () => {
      await result.current.addManualOnlineHours(10);
      await result.current.registerRide();
      await result.current.registerRide();
      await result.current.registerRide();
      const res = await result.current.simulateDayChange();
      expect(res.isQualified).toBe(true);
      expect(res.newQualifiedDays).toBe(1);
    });
  });

  it("applies monthly bonus for 25 qualified days", async () => {
    const { result } = renderHook(() => useVIPTimeTracking(true));
    await act(async () => {
      for (let i = 0; i < 25; i++) {
        await result.current.addManualOnlineHours(10);
        await result.current.registerRide();
        await result.current.registerRide();
        await result.current.registerRide();
        await result.current.simulateDayChange();
      }
      const month = await result.current.simulateMonthChange();
      expect(month.monthlyBonus).toBe(VIP_CONFIG.monthlyBonuses.days25);
    });
  });

  it("adds quarterly bonus on 3rd consecutive month (>=20 days)", async () => {
    const { result } = renderHook(() => useVIPTimeTracking(true));
    for (let m = 1; m <= 3; m++) {
      await act(async () => {
        for (let d = 0; d < 20; d++) {
          await result.current.addManualOnlineHours(10);
          await result.current.registerRide();
          await result.current.registerRide();
          await result.current.registerRide();
          await result.current.simulateDayChange();
        }
        const month = await result.current.simulateMonthChange();
        if (m === 3) {
          expect(month.quarterlyBonus).toBe(
            VIP_CONFIG.quarterlyBonuses.months3,
          );
          expect(month.consecutiveMonths).toBe(3);
        }
      });
    }
  });
});
