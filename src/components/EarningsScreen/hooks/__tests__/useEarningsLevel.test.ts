import { renderHook, act } from "@testing-library/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEarningsLevel } from "../useEarningsLevel";

// Mock dependencies
jest.mock("../../../../context/BalanceContext", () => ({
  useBalanceContext: () => ({
    addEarnings: jest.fn(),
  }),
}));

jest.mock("../../../../context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "ru",
    setLanguage: jest.fn(),
  }),
}));

jest.mock("../../../../i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("useEarningsLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe("base levels and VIP activation", () => {
    it("starts at level 1.0 with 0 rides", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      expect(result.current.driverLevel.currentLevel).toBe(1);
      expect(result.current.driverLevel.currentSubLevel).toBe(1);
      expect(result.current.driverLevel.currentProgress).toBe(0);
      expect(result.current.driverLevel.isVIP).toBe(false);
    });

    it("advances to sublevel 1.1 after 30 rides", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // Add 30 rides
      for (let i = 0; i < 30; i++) {
        await act(async () => {
          await result.current.incrementProgress();
        });
      }

      expect(result.current.driverLevel.currentLevel).toBe(1);
      expect(result.current.driverLevel.currentSubLevel).toBe(2);
      expect(result.current.driverLevel.currentProgress).toBe(0);
    });

    it("awards bonus and advances sublevel on completing sublevel 1.1 (30 rides)", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // Add 29 rides first
      for (let i = 0; i < 29; i++) {
        await act(async () => {
          await result.current.incrementProgress();
        });
      }

      // 30th ride should trigger bonus and level up
      await act(async () => {
        const levelUp = await result.current.incrementProgress();
        expect(levelUp).toBeTruthy();
        expect(levelUp?.bonusAmount).toBe(2); // Bonus for completing sublevel 1.1
      });

      expect(result.current.driverLevel.currentLevel).toBe(1);
      expect(result.current.driverLevel.currentSubLevel).toBe(2);
      expect(result.current.driverLevel.currentProgress).toBe(0);
    });

    it("activates VIP at 4320+ rides", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // Add 4319 rides first
      for (let i = 0; i < 4319; i++) {
        await act(async () => {
          await result.current.incrementProgress();
        });
      }

      expect(result.current.driverLevel.isVIP).toBe(false);

      // 4320th ride should activate VIP
      await act(async () => {
        await result.current.incrementProgress();
      });

      // Wait for VIP activation to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // VIP should be activated
      expect(result.current.driverLevel.isVIP).toBe(true);
      expect(result.current.driverLevel.vipLevel).toBe(1);
    });

    it("calculates VIP level based on qualified days in periods", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // First activate VIP
      await act(async () => {
        await result.current.activateVIPLevel();
      });

      // Mock qualified days data: 3 successful periods (20+ days each)
      const qualifiedDaysInPeriods = [25, 22, 18, 20]; // 3 successful, 1 failed

      await act(async () => {
        await result.current.updateVIPLevel(qualifiedDaysInPeriods);
      });

      expect(result.current.driverLevel.vipLevel).toBe(4); // 1 + 3 successful periods
    });
  });

  describe("level progression", () => {
    it("advances through all sublevels correctly", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // Level 1: 30+40+50 = 120 rides total
      for (let i = 0; i < 120; i++) {
        await act(async () => {
          await result.current.incrementProgress();
        });
      }

      expect(result.current.driverLevel.currentLevel).toBe(2);
      expect(result.current.driverLevel.currentSubLevel).toBe(1);
      expect(result.current.driverLevel.currentProgress).toBe(0);
    });

    it("resets progress correctly", async () => {
      const { result } = renderHook(() => useEarningsLevel());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization
      });

      // Add some progress
      for (let i = 0; i < 15; i++) {
        await act(async () => {
          await result.current.incrementProgress();
        });
      }

      expect(result.current.driverLevel.currentProgress).toBe(15);

      // Reset progress
      await act(async () => {
        await result.current.resetProgress();
      });

      expect(result.current.driverLevel.currentLevel).toBe(1);
      expect(result.current.driverLevel.currentSubLevel).toBe(1);
      expect(result.current.driverLevel.currentProgress).toBe(0);
      expect(result.current.driverLevel.isVIP).toBe(false);
    });
  });
});
