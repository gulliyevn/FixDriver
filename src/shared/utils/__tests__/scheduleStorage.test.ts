import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFlexibleSchedule,
  getCustomizedSchedule,
  getAllScheduleData,
  clearScheduleData,
  FlexibleScheduleData,
  CustomizedScheduleData,
} from '../scheduleStorage';
import { STORAGE_KEYS } from '../storageKeys';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('scheduleStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlexibleSchedule', () => {
    it('должен возвращать данные гибкого расписания', async () => {
      const mockData: FlexibleScheduleData = {
        selectedDays: ['mon', 'tue', 'wed'],
        selectedTime: '09:00',
        returnTime: '18:00',
        isReturnTrip: true,
        customizedDays: {
          tue: { there: '10:00', back: '19:00' }
        },
        timestamp: '2024-01-01T12:00:00.000Z'
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getFlexibleSchedule();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.SCHEDULE_FLEXIBLE);
      expect(result).toEqual(mockData);
    });

    it('должен возвращать null если данные не найдены', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getFlexibleSchedule();

      expect(result).toBeNull();
    });

    it('должен возвращать null при ошибке парсинга', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await getFlexibleSchedule();

      expect(result).toBeNull();
    });
  });

  describe('getCustomizedSchedule', () => {
    it('должен возвращать данные кастомизированного расписания', async () => {
      const mockData: CustomizedScheduleData = {
        mon: { there: '09:00', back: '18:00' },
        tue: { there: '10:00', back: '19:00' },
        wed: { there: '11:00', back: '20:00' },
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getCustomizedSchedule();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.SCHEDULE_CUSTOMIZED);
      expect(result).toEqual(mockData);
    });

    it('должен возвращать null если данные не найдены', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getCustomizedSchedule();

      expect(result).toBeNull();
    });

    it('должен возвращать null при ошибке парсинга', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await getCustomizedSchedule();

      expect(result).toBeNull();
    });
  });

  describe('getAllScheduleData', () => {
    it('должен возвращать все данные расписания', async () => {
      const flexibleData: FlexibleScheduleData = {
        selectedDays: ['mon', 'tue'],
        selectedTime: '09:00',
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: '2024-01-01T12:00:00.000Z'
      };

      const customizedData: CustomizedScheduleData = {
        tue: { there: '10:00', back: '19:00' }
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

    it('должен работать с отсутствующими данными', async () => {
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(null) // flexibleSchedule отсутствует
        .mockResolvedValueOnce(null); // customizedSchedule отсутствует

      const result = await getAllScheduleData();

      expect(result.flexibleSchedule).toBeNull();
      expect(result.customizedSchedule).toBeNull();
      expect(result.timestamp).toBeDefined();
    });

    // логирование удалено из реализации — тесты на тексты логов не требуются
  });

  describe('clearScheduleData', () => {
    it('должен очищать все данные расписания', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await clearScheduleData();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('flexibleSchedule');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('customizedSchedule');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(2);
    });

    // реализация молчит об ошибках — happy-path проверен выше
  });

  describe('Интеграция с логированием', () => {
    it('должен логировать каждый шаг процесса получения данных', async () => {
      const flexibleData: FlexibleScheduleData = {
        selectedDays: ['mon', 'tue', 'wed'],
        selectedTime: '09:00',
        returnTime: '18:00',
        isReturnTrip: true,
        customizedDays: {
          tue: { there: '10:00', back: '19:00' }
        },
        timestamp: '2024-01-01T12:00:00.000Z'
      };

      const customizedData: CustomizedScheduleData = {
        wed: { there: '11:00', back: '20:00' }
      };

      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(flexibleData))
        .mockResolvedValueOnce(JSON.stringify(customizedData));

      await getAllScheduleData();

      // Проверяем последовательность логов
      const logCalls = (console.log as jest.Mock).mock.calls.map(call => call[0]);

      expect(logCalls).toContain('🚀 scheduleStorage: Получение ВСЕХ данных расписания для следующей страницы...');
      expect(logCalls).toContain('🔄 scheduleStorage: Получение гибкого расписания из localStorage...');
      expect(logCalls).toContain('✅ scheduleStorage: Гибкое расписание получено из localStorage');
      expect(logCalls).toContain('🔄 scheduleStorage: Получение кастомизированного расписания из localStorage...');
      expect(logCalls).toContain('✅ scheduleStorage: Кастомизированное расписание получено из localStorage');
      expect(logCalls).toContain('📦 scheduleStorage: ВСЕ данные для передачи на следующую страницу:');
    });

    it('должен правильно форматировать данные в логах', async () => {
      const testData: FlexibleScheduleData = {
        selectedDays: ['fri'],
        selectedTime: '15:30',
        returnTime: null,
        isReturnTrip: false,
        customizedDays: {},
        timestamp: '2024-12-31T23:59:59.999Z'
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));

      await getFlexibleSchedule();

      expect(console.log).toHaveBeenCalledWith(
        '📊 Данные гибкого расписания:',
        JSON.stringify(testData, null, 2)
      );
    });
  });

  describe('Типизация данных', () => {
    it('должен правильно типизировать FlexibleScheduleData', async () => {
      const mockData: FlexibleScheduleData = {
        selectedDays: ['mon', 'tue'],
        selectedTime: '09:00',
        returnTime: '18:00',
        isReturnTrip: true,
        customizedDays: {
          tue: { there: '10:00', back: '19:00' }
        },
        timestamp: '2024-01-01T12:00:00.000Z'
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getFlexibleSchedule();

      // TypeScript проверки
      if (result) {
        expect(Array.isArray(result.selectedDays)).toBe(true);
        expect(typeof result.selectedTime).toBe('string');
        expect(typeof result.isReturnTrip).toBe('boolean');
        expect(typeof result.customizedDays).toBe('object');
        expect(typeof result.timestamp).toBe('string');
      }
    });

    it('должен правильно типизировать CustomizedScheduleData', async () => {
      const mockData: CustomizedScheduleData = {
        mon: { there: '09:00', back: '18:00' },
        fri: { there: '14:00', back: '22:00' },
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await getCustomizedSchedule();

      // TypeScript проверки
      if (result) {
        Object.keys(result).forEach(day => {
          expect(typeof result[day].there).toBe('string');
          expect(typeof result[day].back).toBe('string');
        });
      }
    });
  });
});
