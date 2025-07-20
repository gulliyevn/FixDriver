import APIClient from './APIClient';
import { ENV_CONFIG, ConfigUtils } from '../config/environment';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class ProfileService {
  /**
   * Изменение пароля пользователя
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // В dev режиме используем мок для тестирования
      if (__DEV__) {
        return this.mockChangePassword(data);
      }

      // Проверяем доступность сервера
      const isServerAvailable = await ConfigUtils.checkServerHealth();
      
      if (!isServerAvailable) {
        console.warn('Server unavailable, falling back to mock data');
        return this.mockChangePassword(data);
      }

      const response = await APIClient.post<{ message: string }>('/profile/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || 'Password changed successfully',
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to change password',
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Change password failed',
      };
    }
  }

  /**
   * Мок для изменения пароля в dev режиме
   */
  private static async mockChangePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Проверяем текущий пароль (в реальном приложении это будет проверка с базой)
    if (data.currentPassword !== 'current123') {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Проверяем что новый пароль отличается от текущего
    if (data.currentPassword === data.newPassword) {
      return {
        success: false,
        error: 'New password must be different from current password',
      };
    }

    // Проверяем сложность нового пароля
    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    // Имитируем успешное изменение пароля
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
