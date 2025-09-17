import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DayEndModal from '../DayEndModal';

// Мокаем контексты
jest.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'common.dayEnd.title': 'День закончился',
        'common.dayEnd.subtitle': 'Включить Онлайн?',
        'common.cancel': 'Отмена',
        'common.ok': 'OK',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    colors: {
      card: '#FFFFFF',
      background: '#FFFFFF',
      text: '#000000',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
    },
  }),
}));

describe('DayEndModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерится корректно когда видимый', () => {
    const { getByText } = render(
      <DayEndModal
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(getByText('День закончился')).toBeTruthy();
    expect(getByText('Включить Онлайн?')).toBeTruthy();
    expect(getByText('Отмена')).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
  });

  it('не рендерится когда не видимый', () => {
    const { queryByText } = render(
      <DayEndModal
        visible={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(queryByText('День закончился')).toBeNull();
    expect(queryByText('Включить Онлайн?')).toBeNull();
  });

  it('вызывает onConfirm при нажатии OK', () => {
    const { getByText } = render(
      <DayEndModal
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.press(getByText('OK'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('вызывает onCancel при нажатии Отмена', () => {
    const { getByText } = render(
      <DayEndModal
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.press(getByText('Отмена'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
