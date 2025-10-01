import APIClient from './APIClient';

export interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  isValid: boolean;
  token?: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: string;
}

export class OTPService {
  private static readonly OTP_LENGTH = 6;
  private static readonly OTP_EXPIRY_MINUTES = 10;

  /**
   * Отправляет OTP код на указанный номер телефона
   */
  static async sendOTP(phoneNumber: string, purpose: 'registration' | 'password_reset' | 'phone_verification' = 'phone_verification'): Promise<OTPResponse> {
    try {
      const response = await APIClient.post<OTPResponse>('/otp/send', {
        phoneNumber,
        purpose
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return {
        success: false,
        message: response.error || 'Ошибка при отправке OTP кода'
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Ошибка при отправке OTP кода'
      };
    }
  }

  /**
   * Проверяет введенный OTP код
   */
  static async verifyOTP(phoneNumber: string, otpCode: string, otpId?: string): Promise<VerifyOTPResponse> {
    try {
      const response = await APIClient.post<VerifyOTPResponse>('/otp/verify', {
        phoneNumber,
        otpCode,
        otpId
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return {
        success: false,
        message: response.error || 'Ошибка при проверке OTP кода',
        isValid: false
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Ошибка при проверке OTP кода',
        isValid: false
      };
    }
  }

  /**
   * Повторно отправляет OTP код
   */
  static async resendOTP(phoneNumber: string, otpId?: string): Promise<ResendOTPResponse> {
    try {
      const response = await APIClient.post<ResendOTPResponse>('/otp/resend', {
        phoneNumber,
        otpId
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return {
        success: false,
        message: response.error || 'Ошибка при повторной отправке OTP кода'
      };
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Ошибка при повторной отправке OTP кода'
      };
    }
  }

  /**
   * Проверяет статус OTP (активен ли, сколько попыток осталось)
   */
  static async checkOTPStatus(otpId: string): Promise<{ isActive: boolean; attemptsLeft: number; expiresAt: string } | null> {
    try {
      const response = await APIClient.get<{ isActive: boolean; attemptsLeft: number; expiresAt: string }>(`/otp/status/${otpId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Error checking OTP status:', error);
      return null;
    }
  }

  /**
   * Отменяет OTP код
   */
  static async cancelOTP(otpId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/otp/cancel/${otpId}`, {});
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Error canceling OTP:', error);
      return false;
    }
  }

  /**
   * Валидация номера телефона
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Простая валидация - можно расширить
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Валидация OTP кода
   */
  static validateOTPCode(otpCode: string): boolean {
    return /^\d{6}$/.test(otpCode);
  }

  /**
   * Форматирование номера телефона для отображения
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Убираем все символы кроме цифр и +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Если номер начинается с +, оставляем как есть
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Если номер начинается с 994 (Азербайджан), добавляем +
    if (cleaned.startsWith('994')) {
      return '+' + cleaned;
    }
    
    // Если номер начинается с 0, заменяем на +994
    if (cleaned.startsWith('0')) {
      return '+994' + cleaned.substring(1);
    }
    
    // По умолчанию добавляем +994
    return '+994' + cleaned;
  }
}

export default OTPService;