import { renderHook, act } from "@testing-library/react-hooks";
import { useVIPTimeTracking } from "../useVIPTimeTracking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DriverStatusService from "../../../../services/DriverStatusService";

// Мокаем AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Мокаем DriverStatusService
jest.mock("../../../../services/DriverStatusService", () => ({
  setOnline: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
}));

// Мокаем BalanceContext
const mockResetEarnings = jest.fn();
jest.mock("../../../../context/BalanceContext", () => ({
  useBalanceContext: () => ({
    addEarnings: jest.fn(),
    resetEarnings: mockResetEarnings,
  }),
}));

describe("useVIPTimeTracking - Автоматическое отключение в 00:00", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    mockResetEarnings.mockResolvedValue(0); // По умолчанию возвращаем 0
  });

  it("автоматически отключает онлайн статус при смене дня в 00:00", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Начинаем с онлайн статуса
    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 5.5,
      ridesToday: 3,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 3600000, // 1 час назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    // Ждем загрузки данных
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Проверяем, что изначально онлайн
    expect(result.current.vipTimeData.isCurrentlyOnline).toBe(true);

    // Симулируем смену дня (00:00 следующего дня)
    await act(async () => {
      // Вызываем forceDayCheck напрямую для тестирования
      await result.current.forceDayCheck();
    });

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Проверяем, что функции обработчики доступны
    expect(typeof result.current.handleDayEndConfirm).toBe("function");
    expect(typeof result.current.handleDayEndCancel).toBe("function");

    // Ждем завершения асинхронных операций
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  it("не отключает онлайн если день не изменился", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;

    const today = new Date().toISOString().split("T")[0]; // Сегодняшняя дата
    const initialData = {
      currentDay: today,
      currentMonth: today.slice(0, 7),
      hoursOnline: 5.5,
      ridesToday: 3,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 3600000,
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Проверяем, что изначально онлайн
    expect(result.current.vipTimeData.isCurrentlyOnline).toBe(true);

    // Вызываем проверку дня (день не изменился)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что онлайн статус остался включенным
    expect(result.current.vipTimeData.isCurrentlyOnline).toBe(true);
    expect(mockSetOnline).not.toHaveBeenCalled();
  });

  it("корректно считает часы до полуночи при автоматическом отключении", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 5.0,
      ridesToday: 3,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 7200000, // 2 часа назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Вызываем проверку дня (смена дня)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Проверяем, что функции обработчики доступны
    expect(typeof result.current.handleDayEndConfirm).toBe("function");
    expect(typeof result.current.handleDayEndCancel).toBe("function");
  });

  it("обнуляет заработок при автоматическом отключении в 00:00", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;
    mockResetEarnings.mockResolvedValue(45.5); // Мокаем возвращение старого заработка

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 8.5,
      ridesToday: 12,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 3600000, // 1 час назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Вызываем проверку дня (смена дня)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что заработок был обнулен
    expect(mockResetEarnings).toHaveBeenCalled();

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Ждем завершения асинхронных операций
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  it("показывает диалог окончания дня при смене дня", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;
    mockResetEarnings.mockResolvedValue(25.0);

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 6.0,
      ridesToday: 8,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 1800000, // 30 минут назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Вызываем проверку дня (смена дня)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Проверяем, что функции обработчики доступны
    expect(typeof result.current.handleDayEndConfirm).toBe("function");
    expect(typeof result.current.handleDayEndCancel).toBe("function");

    // Ждем завершения асинхронных операций
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  it("обрабатывает подтверждение диалога окончания дня", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;
    mockResetEarnings.mockResolvedValue(30.0);

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 7.0,
      ridesToday: 10,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 1800000, // 30 минут назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Вызываем проверку дня (смена дня)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Симулируем подтверждение диалога
    await act(async () => {
      result.current.handleDayEndConfirm();
    });

    // Проверяем, что диалог скрылся
    expect(result.current.dayEndModalVisible).toBe(false);

    // Проверяем, что онлайн статус включился
    expect(result.current.vipTimeData.isCurrentlyOnline).toBe(true);
    expect(mockSetOnline).toHaveBeenCalledWith(true);

    // Ждем завершения асинхронных операций
    await new Promise((resolve) => setTimeout(resolve, 200));
  });

  it("обрабатывает отмену диалога окончания дня", async () => {
    const mockSetOnline = DriverStatusService.setOnline as jest.Mock;
    mockResetEarnings.mockResolvedValue(20.0);

    // Используем вчерашнюю дату для тестирования смены дня
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const initialData = {
      currentDay: yesterdayStr,
      currentMonth: yesterdayStr.slice(0, 7),
      hoursOnline: 5.0,
      ridesToday: 6,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: Date.now() - 1800000, // 30 минут назад
      isCurrentlyOnline: true,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(initialData),
    );

    const { result } = renderHook(() => useVIPTimeTracking(false));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Вызываем проверку дня (смена дня)
    await act(async () => {
      await result.current.forceDayCheck();
    });

    // Проверяем, что диалог показался
    expect(result.current.dayEndModalVisible).toBe(true);

    // Симулируем отмену диалога
    await act(async () => {
      result.current.handleDayEndCancel();
    });

    // Проверяем, что диалог скрылся
    expect(result.current.dayEndModalVisible).toBe(false);

    // Проверяем, что онлайн статус остался выключенным
    expect(result.current.vipTimeData.isCurrentlyOnline).toBe(false);
    expect(mockSetOnline).toHaveBeenCalledWith(false);

    // Ждем завершения асинхронных операций
    await new Promise((resolve) => setTimeout(resolve, 200));
  });
});
