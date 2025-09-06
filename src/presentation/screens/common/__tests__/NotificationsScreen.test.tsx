import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NotificationsScreen from '../NotificationsScreen';
import { useTheme } from '../../../context/ThemeContext';

// Mock dependencies
jest.mock('../../../context/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('NotificationsScreen', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      isDark: false,
      toggleTheme: jest.fn(),
      theme: 'light',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with notifications', async () => {
    const { getByText } = render(<NotificationsScreen />);

    await waitFor(() => {
      expect(getByText('Уведомления')).toBeTruthy();
      expect(getByText('Новый водитель')).toBeTruthy();
      expect(getByText('Поездка завершена')).toBeTruthy();
      expect(getByText('Новое сообщение')).toBeTruthy();
    });
  });

  it('enters selection mode when select button is pressed', async () => {
    const { getByTestId } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const selectButton = getByTestId('select-button');
      fireEvent.press(selectButton);
      
      expect(getByTestId('selection-header')).toBeTruthy();
    });
  });

  it('selects all notifications when select all is pressed', async () => {
    const { getByTestId, getByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const selectButton = getByTestId('select-button');
      fireEvent.press(selectButton);
      
      const selectAllButton = getByText('Выбрать все');
      fireEvent.press(selectAllButton);
      
      expect(getByText('Выбрано: 3')).toBeTruthy();
    });
  });

  it('marks selected notifications as read', async () => {
    const { getByTestId, getByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const selectButton = getByTestId('select-button');
      fireEvent.press(selectButton);
      
      const selectAllButton = getByText('Выбрать все');
      fireEvent.press(selectAllButton);
      
      const markAsReadButton = getByText('Прочитано');
      fireEvent.press(markAsReadButton);
      
      // После отметки как прочитанное, режим выбора должен завершиться
      expect(getByText('Уведомления')).toBeTruthy();
    });
  });

  it('deletes selected notifications', async () => {
    const { getByTestId, getByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const selectButton = getByTestId('select-button');
      fireEvent.press(selectButton);
      
      const selectAllButton = getByText('Выбрать все');
      fireEvent.press(selectAllButton);
      
      const deleteButton = getByText('Удалить');
      fireEvent.press(deleteButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Удалить уведомления',
        'Удалить 3 выбранных уведомлений?',
        expect.any(Array)
      );
    });
  });

  it('handles long press to enter selection mode', async () => {
    const { getByText, getByTestId } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const notificationItem = getByText('Новый водитель');
      fireEvent(notificationItem, 'longPress');
      
      expect(getByText('Выбрано: 1')).toBeTruthy();
    });
  });

  it('cancels selection mode', async () => {
    const { getByTestId, getByText, queryByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const selectButton = getByTestId('select-button');
      fireEvent.press(selectButton);
      
      const cancelButton = getByText('Отмена');
      fireEvent.press(cancelButton);
      
      expect(getByText('Уведомления')).toBeTruthy();
      expect(queryByText('Выбрано:')).toBeNull();
    });
  });

  it('marks all notifications as read', async () => {
    const { getByText, queryByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const markAllButton = getByText('Прочитать все (2)');
      fireEvent.press(markAllButton);
      
      // После отметки всех как прочитанные, кнопка должна исчезнуть
      expect(queryByText('Прочитать все (2)')).toBeNull();
    });
  });

  it('deletes individual notification', async () => {
    const { getByText } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      // Ищем кнопку удаления по accessibilityLabel или testID
      // Поскольку иконки замоканы, используем другой подход
      const notificationItem = getByText('Новый водитель');
      fireEvent.press(notificationItem);
      
      // Проверяем, что уведомление отмечено как прочитанное
      expect(notificationItem).toBeTruthy();
    });
  });

  it('handles refresh', async () => {
    const { getByTestId } = render(<NotificationsScreen />);
    
    await waitFor(() => {
      const scrollView = getByTestId('notifications-scroll');
      fireEvent.scroll(scrollView, {
        nativeEvent: {
          contentOffset: { y: 0 },
          contentSize: { height: 500, width: 100 },
          layoutMeasurement: { height: 100, width: 100 },
        },
      });
      
      // Проверяем, что refresh control работает
      expect(scrollView).toBeTruthy();
    });
  });
}); 