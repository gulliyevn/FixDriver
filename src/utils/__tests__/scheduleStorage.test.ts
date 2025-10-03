import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFlexibleSchedule,
  getCustomizedSchedule,
  getAllScheduleData,
  clearScheduleData,
  FlexibleScheduleData,
  CustomizedScheduleData,
} from "../scheduleStorage";

// Мокаем AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("scheduleStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("getFlexibleSchedule", () => {
    it("должен возвращать данные гибкого расписания", async () => {
      const mockData: FlexibleScheduleData = {
        selectedDays: ["mon", "tue", "wed"],
        selectedTime: "09:00",
        returnTime: "18:00",
        isReturnTrip: true,
        customizedDays: {
          tue: { there: "10:00", back: "19:00" },
        },
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getFlexibleSchedule();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("flexibleSchedule");
      expect(result).toEqual(mockData);
    });

    it("должен возвращать null если данные не найдены", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getFlexibleSchedule();

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        "⚠️ scheduleStorage: Гибкое расписание не найдено в localStorage",
      );
    });

    it("должен возвращать null при ошибке парсинга", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("invalid json");

      const result = await getFlexibleSchedule();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "❌ scheduleStorage: Ошибка получения гибкого расписания:",
        expect.any(Error),
      );
    });

    it("должен логировать получение данных", async () => {
      const mockData: FlexibleScheduleData = {
        selectedDays: ["mon"],
        selectedTime: "09:00",
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      await getFlexibleSchedule();

      expect(console.log).toHaveBeenCalledWith(
        "🔄 scheduleStorage: Получение гибкого расписания из localStorage...",
      );
      expect(console.log).toHaveBeenCalledWith(
        "✅ scheduleStorage: Гибкое расписание получено из localStorage",
      );
      expect(console.log).toHaveBeenCalledWith(
        "📊 Данные гибкого расписания:",
        JSON.stringify(mockData, null, 2),
      );
    });
  });

  describe("getCustomizedSchedule", () => {
    it("должен возвращать данные кастомизированного расписания", async () => {
      const mockData: CustomizedScheduleData = {
        mon: { there: "09:00", back: "18:00" },
        tue: { there: "10:00", back: "19:00" },
        wed: { there: "11:00", back: "20:00" },
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getCustomizedSchedule();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        "customizedSchedule",
      );
      expect(result).toEqual(mockData);
    });

    it("должен возвращать null если данные не найдены", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getCustomizedSchedule();

      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(
        "⚠️ scheduleStorage: Кастомизированное расписание не найдено в localStorage",
      );
    });

    it("должен возвращать null при ошибке парсинга", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("invalid json");

      const result = await getCustomizedSchedule();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "❌ scheduleStorage: Ошибка получения кастомизированного расписания:",
        expect.any(Error),
      );
    });

    it("должен логировать получение данных", async () => {
      const mockData: CustomizedScheduleData = {
        fri: { there: "14:00", back: "22:00" },
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      await getCustomizedSchedule();

      expect(console.log).toHaveBeenCalledWith(
        "🔄 scheduleStorage: Получение кастомизированного расписания из localStorage...",
      );
      expect(console.log).toHaveBeenCalledWith(
        "✅ scheduleStorage: Кастомизированное расписание получено из localStorage",
      );
      expect(console.log).toHaveBeenCalledWith(
        "📊 Данные кастомизированного расписания:",
        JSON.stringify(mockData, null, 2),
      );
    });
  });

  describe("getAllScheduleData", () => {
    it("должен возвращать все данные расписания", async () => {
      const flexibleData: FlexibleScheduleData = {
        selectedDays: ["mon", "tue"],
        selectedTime: "09:00",
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      const customizedData: CustomizedScheduleData = {
        tue: { there: "10:00", back: "19:00" },
      };

      // Мокаем вызовы для разных ключей
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(flexibleData)) // для flexibleSchedule
        .mockResolvedValueOnce(JSON.stringify(customizedData)); // для customizedSchedule

      const result = await getAllScheduleData();

      expect(result.flexibleSchedule).toEqual(flexibleData);
      expect(result.customizedSchedule).toEqual(customizedData);
      expect(result.timestamp).toBeDefined();
    });

    it("должен работать с отсутствующими данными", async () => {
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(null) // flexibleSchedule отсутствует
        .mockResolvedValueOnce(null); // customizedSchedule отсутствует

      const result = await getAllScheduleData();

      expect(result.flexibleSchedule).toBeNull();
      expect(result.customizedSchedule).toBeNull();
      expect(result.timestamp).toBeDefined();
    });

    it("должен логировать начало получения всех данных", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      await getAllScheduleData();

      expect(console.log).toHaveBeenCalledWith(
        "🚀 scheduleStorage: Получение ВСЕХ данных расписания для следующей страницы...",
      );
      expect(console.log).toHaveBeenCalledWith(
        "📦 scheduleStorage: ВСЕ данные для передачи на следующую страницу:",
      );
    });

    it("должен логировать полные данные в JSON формате", async () => {
      const flexibleData: FlexibleScheduleData = {
        selectedDays: ["mon"],
        selectedTime: "09:00",
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(flexibleData))
        .mockResolvedValueOnce(null);

      await getAllScheduleData();

      // Проверяем что логируется JSON строка
      const logCalls = (console.log as jest.Mock).mock.calls;
      const jsonLogCall = logCalls.find(
        (call) =>
          typeof call[0] === "string" && call[0].includes("flexibleSchedule"),
      );
      expect(jsonLogCall).toBeDefined();
    });
  });

  describe("clearScheduleData", () => {
    it("должен очищать все данные расписания", async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await clearScheduleData();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        "flexibleSchedule",
      );
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        "customizedSchedule",
      );
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(2);
    });

    it("должен логировать успешную очистку", async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await clearScheduleData();

      expect(console.log).toHaveBeenCalledWith(
        "🧹 scheduleStorage: Очистка данных расписания...",
      );
      expect(console.log).toHaveBeenCalledWith(
        "✅ scheduleStorage: Данные расписания очищены",
      );
    });

    it("должен обрабатывать ошибки при очистке", async () => {
      const clearError = new Error("Clear error");
      mockAsyncStorage.removeItem.mockRejectedValue(clearError);

      await clearScheduleData();

      expect(console.error).toHaveBeenCalledWith(
        "❌ scheduleStorage: Ошибка очистки данных расписания:",
        clearError,
      );
    });

    it("должен продолжать очистку даже если один из вызовов removeItem не удался", async () => {
      const clearError = new Error("Clear error");
      mockAsyncStorage.removeItem.mockRejectedValue(clearError);

      await clearScheduleData();

      // Проверяем что функция вызывалась минимум один раз
      expect(mockAsyncStorage.removeItem).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "❌ scheduleStorage: Ошибка очистки данных расписания:",
        clearError,
      );
    });
  });

  describe("Интеграция с логированием", () => {
    it("должен логировать каждый шаг процесса получения данных", async () => {
      const flexibleData: FlexibleScheduleData = {
        selectedDays: ["mon", "tue", "wed"],
        selectedTime: "09:00",
        returnTime: "18:00",
        isReturnTrip: true,
        customizedDays: {
          tue: { there: "10:00", back: "19:00" },
        },
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      const customizedData: CustomizedScheduleData = {
        wed: { there: "11:00", back: "20:00" },
      };

      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(flexibleData))
        .mockResolvedValueOnce(JSON.stringify(customizedData));

      await getAllScheduleData();

      // Проверяем последовательность логов
      const logCalls = (console.log as jest.Mock).mock.calls.map(
        (call) => call[0],
      );

      expect(logCalls).toContain(
        "🚀 scheduleStorage: Получение ВСЕХ данных расписания для следующей страницы...",
      );
      expect(logCalls).toContain(
        "🔄 scheduleStorage: Получение гибкого расписания из localStorage...",
      );
      expect(logCalls).toContain(
        "✅ scheduleStorage: Гибкое расписание получено из localStorage",
      );
      expect(logCalls).toContain(
        "🔄 scheduleStorage: Получение кастомизированного расписания из localStorage...",
      );
      expect(logCalls).toContain(
        "✅ scheduleStorage: Кастомизированное расписание получено из localStorage",
      );
      expect(logCalls).toContain(
        "📦 scheduleStorage: ВСЕ данные для передачи на следующую страницу:",
      );
    });

    it("должен правильно форматировать данные в логах", async () => {
      const testData: FlexibleScheduleData = {
        selectedDays: ["fri"],
        selectedTime: "15:30",
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: "2024-12-31T23:59:59.999Z",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));

      await getFlexibleSchedule();

      expect(console.log).toHaveBeenCalledWith(
        "📊 Данные гибкого расписания:",
        JSON.stringify(testData, null, 2),
      );
    });
  });

  describe("Типизация данных", () => {
    it("должен правильно типизировать FlexibleScheduleData", async () => {
      const mockData: FlexibleScheduleData = {
        selectedDays: ["mon", "tue"],
        selectedTime: "09:00",
        returnTime: "18:00",
        isReturnTrip: true,
        customizedDays: {
          tue: { there: "10:00", back: "19:00" },
        },
        timestamp: "2024-01-01T12:00:00.000Z",
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getFlexibleSchedule();

      // TypeScript проверки
      if (result) {
        expect(Array.isArray(result.selectedDays)).toBe(true);
        expect(typeof result.selectedTime).toBe("string");
        expect(typeof result.isReturnTrip).toBe("boolean");
        expect(typeof result.customizedDays).toBe("object");
        expect(typeof result.timestamp).toBe("string");
      }
    });

    it("должен правильно типизировать CustomizedScheduleData", async () => {
      const mockData: CustomizedScheduleData = {
        mon: { there: "09:00", back: "18:00" },
        fri: { there: "14:00", back: "22:00" },
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getCustomizedSchedule();

      // TypeScript проверки
      if (result) {
        Object.keys(result).forEach((day) => {
          expect(typeof result[day].there).toBe("string");
          expect(typeof result[day].back).toBe("string");
        });
      }
    });
  });
});
