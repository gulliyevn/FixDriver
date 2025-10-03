import { renderHook, act } from "@testing-library/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVIPTimeTracking } from "../useVIPTimeTracking";

// Моки
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("../../../../context/BalanceContext", () => ({
  useBalanceContext: () => ({ addEarnings: jest.fn() }),
}));

describe("useVIPTimeTracking - periodStartDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets periodStartDate to next local midnight on first startOnlineTime (VIP)", async () => {
    const { result } = renderHook(() => useVIPTimeTracking(true));

    // Дождаться инициализации (loadVIPTimeData)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // До первого старта период не установлен
    expect(result.current.vipTimeData.periodStartDate).toBeNull();

    await act(async () => {
      result.current.startOnlineTime();
      await new Promise((r) => setTimeout(r, 0));
    });

    // Ожидаем 00:00 следующего дня
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    const expected = d.toISOString().split("T")[0];
    expect(result.current.vipTimeData.periodStartDate).toBe(expected);
  });

  it("does not override periodStartDate if already set", async () => {
    // Предзаписываем состояние в хранилище
    const preset = {
      currentDay: "2099-01-01",
      currentMonth: "2099-01",
      hoursOnline: 0,
      ridesToday: 0,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: null,
      isCurrentlyOnline: false,
      vipCycleStartDate: null,
      periodStartDate: "2099-02-01",
      qualifiedDaysHistory: [],
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(preset),
    );

    const { result } = renderHook(() => useVIPTimeTracking(true));

    await act(async () => {
      result.current.startOnlineTime();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.vipTimeData.periodStartDate).toBe("2099-02-01");
  });
});
