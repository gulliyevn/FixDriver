import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomizedDays } from '../useCustomizedDays';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useCustomizedDays', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с пустыми значениями по умолчанию', () => {
      const { result } = renderHook(() => useCustomizedDays());

      expect(result.current.showCustomizationModal).toBe(false);
      expect(result.current.customizedDays).toEqual({});
      expect(result.current.selectedCustomDays).toEqual([]);
      expect(result.current.tempCustomizedDays).toEqual({});
      expect(result.current.validationError).toBeNull();
    });

    it('должен инициализироваться с переданными начальными данными', () => {
      const initialData = {
        mon: { there: '09:00', back: '18:00' },
        tue: { there: '10:00', back: '19:00' },
      };

      const { result } = renderHook(() => useCustomizedDays(initialData));

      expect(result.current.customizedDays).toEqual(initialData);
    });
  });

  describe('Управление модальным окном', () => {
    it('должен открывать модальное окно и копировать данные в временные', () => {
      const initialData = {
        mon: { there: '09:00', back: '18:00' }
      };

      const { result } = renderHook(() => useCustomizedDays(initialData));

      act(() => {
        result.current.openModal();
      });

      expect(result.current.showCustomizationModal).toBe(true);
      expect(result.current.tempCustomizedDays).toEqual(initialData);
      expect(result.current.validationError).toBeNull();
    });

    it('должен закрывать модальное окно и сбрасывать ошибки', () => {
      const { result } = renderHook(() => useCustomizedDays());

      // Сначала открываем и добавляем ошибку
      act(() => {
        result.current.openModal();
      });

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.showCustomizationModal).toBe(false);
      expect(result.current.validationError).toBeNull();
    });
  });

  describe('Валидация', () => {
    it('должен проходить валидацию с корректными данными без обратной поездки', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      // Настраиваем данные
      act(() => {
        result.current.setSelectedCustomDays(['mon', 'tue']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '' },
          tue: { there: '10:00', back: '' },
        });
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      // Сохраняем без обратной поездки
      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveModal(false);
      });

      expect(saveResult).toBe(true);
      expect(result.current.validationError).toBeNull();
      expect(result.current.showCustomizationModal).toBe(false);
    });

    it('должен проходить валидацию с корректными данными с обратной поездкой', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '18:00' },
        });
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveModal(true);
      });

      expect(saveResult).toBe(true);
      expect(result.current.validationError).toBeNull();
    });

    it('должен не проходить валидацию если время "туда" не заполнено', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '', back: '18:00' },
        });
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveModal(false);
      });

      expect(saveResult).toBe(false);
      expect(result.current.validationError).toEqual({
        message: 'Выберите время "туда"',
        field: 'mon-there'
      });
    });

    it('должен не проходить валидацию если время "обратно" не заполнено при включенной обратной поездке', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '' },
        });
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveModal(true); // isReturnTrip = true
      });

      expect(saveResult).toBe(false);
      expect(result.current.validationError).toEqual({
        message: 'Выберите время "обратно"',
        field: 'mon-back'
      });
    });

    it('должен не проходить валидацию если данные дня отсутствуют', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({}); // Пустые данные
      });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveModal(false);
      });

      expect(saveResult).toBe(false);
      expect(result.current.validationError).toEqual({
        message: 'Выберите время "туда"',
        field: 'mon-there'
      });
    });
  });

  describe('Сохранение в AsyncStorage', () => {
    it('должен сохранять данные в AsyncStorage при успешной валидации', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      const testData = {
        mon: { there: '09:00', back: '18:00' },
      };

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays(testData);
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      await act(async () => {
        await result.current.saveModal(true);
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'customizedSchedule',
        JSON.stringify(testData)
      );
    });

    it('должен логировать ошибку при неудачном сохранении в AsyncStorage', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '' },
        });
      });

      const saveError = new Error('AsyncStorage error');
      mockAsyncStorage.setItem.mockRejectedValue(saveError);

      await act(async () => {
        await result.current.saveModal(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        '❌ useCustomizedDays: Ошибка сохранения в localStorage:',
        saveError
      );
    });
  });

  describe('Обновление состояния', () => {
    it('должен обновлять customizedDays после успешного сохранения', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      const testData = {
        mon: { there: '09:00', back: '18:00' },
        tue: { there: '10:00', back: '19:00' },
      };

      act(() => {
        result.current.setSelectedCustomDays(['mon', 'tue']);
        result.current.setTempCustomizedDays(testData);
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      await act(async () => {
        await result.current.saveModal(true);
      });

      expect(result.current.customizedDays).toEqual(testData);
      expect(result.current.selectedCustomDays).toEqual([]);
    });

    it('должен сохранять состояние при неудачной валидации', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      const originalData = { tue: { there: '10:00', back: '19:00' } };
      
      // Устанавливаем начальные данные
      act(() => {
        result.current.setCustomizedDays(originalData);
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '', back: '' }, // Невалидные данные
        });
      });

      await act(async () => {
        await result.current.saveModal(false);
      });

      // Исходные данные должны остаться неизменными
      expect(result.current.customizedDays).toEqual(originalData);
      expect(result.current.selectedCustomDays).toEqual(['mon']);
    });
  });

  describe('Логирование', () => {
    it('должен логировать начало валидации', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '18:00' },
        });
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      await act(async () => {
        await result.current.saveModal(true);
      });

      expect(console.log).toHaveBeenCalledWith('🔄 useCustomizedDays: Начинаем валидацию модального окна...');
      expect(console.log).toHaveBeenCalledWith('📋 Выбранные дни для кастомизации:', ['mon']);
      expect(console.log).toHaveBeenCalledWith('🔄 Обратная поездка:', true);
    });

    it('должен логировать успешную валидацию', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '09:00', back: '18:00' },
        });
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      await act(async () => {
        await result.current.saveModal(true);
      });

      expect(console.log).toHaveBeenCalledWith('✅ useCustomizedDays: Валидация пройдена успешно');
      expect(console.log).toHaveBeenCalledWith('💾 useCustomizedDays: Применяем кастомизацию к основному состоянию');
    });

    it('должен логировать ошибки валидации', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({
          mon: { there: '', back: '' },
        });
      });

      await act(async () => {
        await result.current.saveModal(false);
      });

      expect(console.log).toHaveBeenCalledWith(
        '❌ useCustomizedDays: Ошибка валидации:',
        expect.objectContaining({
          message: 'Выберите время "туда"',
          field: 'mon-there'
        })
      );
    });

    it('должен логировать данные сохранения', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      const testData = {
        mon: { there: '09:00', back: '18:00' },
      };

      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays(testData);
      });

      mockAsyncStorage.setItem.mockResolvedValue();

      await act(async () => {
        await result.current.saveModal(true);
      });

      expect(console.log).toHaveBeenCalledWith('🔄 useCustomizedDays: Сохранение кастомизированных дней...');
      expect(console.log).toHaveBeenCalledWith('📊 Кастомизированные дни:', JSON.stringify(testData, null, 2));
      expect(console.log).toHaveBeenCalledWith('✅ useCustomizedDays: Кастомизированные дни сохранены в localStorage');
    });
  });

  describe('Обработка ошибок', () => {
    it('должен сбрасывать ошибку при открытии модального окна', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      // Устанавливаем ошибку валидации
      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({});
      });

      await act(async () => {
        await result.current.saveModal(false); // Создаст ошибку
      });

      expect(result.current.validationError).toEqual({
        message: 'Выберите время "туда"',
        field: 'mon-there'
      });

      // Открываем модальное окно - ошибка должна сброситься
      act(() => {
        result.current.openModal();
      });

      expect(result.current.validationError).toBeNull();
    });

    it('должен сбрасывать ошибку при закрытии модального окна', async () => {
      const { result } = renderHook(() => useCustomizedDays());

      // Создаем ошибку
      act(() => {
        result.current.setSelectedCustomDays(['mon']);
        result.current.setTempCustomizedDays({});
      });

      await act(async () => {
        await result.current.saveModal(false);
      });

      expect(result.current.validationError).toEqual({
        message: 'Выберите время "туда"',
        field: 'mon-there'
      });

      // Закрываем модальное окно
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.validationError).toBeNull();
    });
  });
});
