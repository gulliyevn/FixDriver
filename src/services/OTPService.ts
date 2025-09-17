import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  isValid: boolean;
}

export class OTPService {
  private static readonly OTP_LENGTH = 6;
  private static readonly OTP_EXPIRY_MINUTES = 10;

  /**
   * Отправляет OTP код на указанный номер телефона
   */
  static async sendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      // Генерируем mock OTP код для разработки
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // В реальном приложении код будет отправлен через SMS API
  
      
      // Сохраняем в AsyncStorage для mock проверки (в реальном приложении будет на сервере)
      await AsyncStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
        code: otpCode,
        timestamp: Date.now(),
        attempts: 0
      }));

      // Симуляция задержки отправки SMS
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        message: `OTP код отправлен на номер ${phoneNumber}`,
        otpId: `otp_${phoneNumber}`
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
  static async verifyOTP(phoneNumber: string, code: string): Promise<VerifyOTPResponse> {
    try {
      // В режиме разработки - спеиальный мок-код
      if (__DEV__ && code === '123456') {

        return {
          success: true,
          message: 'Телефон успешно подтвержден (DEV мок)',
          isValid: true
        };
      }

      // Симуляция задержки проверки
      await new Promise(resolve => setTimeout(resolve, 1000));

      const storedData = await AsyncStorage.getItem(`otp_${phoneNumber}`);
      
      if (!storedData) {
        return {
          success: false,
          message: 'OTP код не найден. Запросите новый код.',
          isValid: false
        };
      }

      const { code: storedCode, timestamp, attempts } = JSON.parse(storedData);
      
      // Проверяем срок действия (10 минут)
      const isExpired = Date.now() - timestamp > this.OTP_EXPIRY_MINUTES * 60 * 1000;
      
      if (isExpired) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: false,
          message: 'OTP код истек. Запросите новый код.',
          isValid: false
        };
      }

      // Проверяем количество попыток (максимум 3)
      if (attempts >= 3) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: false,
          message: 'Превышено количество попыток. Запросите новый код.',
          isValid: false
        };
      }

      // Проверяем код
      if (code === storedCode) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: true,
          message: 'Телефон успешно подтвержден',
          isValid: true
        };
      } else {
        // Увеличиваем счетчик попыток
        await AsyncStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
          code: storedCode,
          timestamp,
          attempts: attempts + 1
        }));

        return {
          success: false,
          message: `Неверный код. Осталось попыток: ${2 - attempts}`,
          isValid: false
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Ошибка при проверке кода',
        isValid: false
      };
    }
  }

  /**
   * Повторно отправляет OTP код
   */
  static async resendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      // Удаляем старый код
      await AsyncStorage.removeItem(`otp_${phoneNumber}`);
      
      // Отправляем новый
      return this.sendOTP(phoneNumber);
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Ошибка при повторной отправке кода'
      };
    }
  }

  /**
   * Форматирует номер телефона для отображения
   */
  static formatPhoneForDisplay(phoneNumber: string): string {
    // Убираем все символы кроме цифр и +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+7')) {
      return `+7 (***) ***-**-${cleaned.slice(-2)}`;
    }
    
    // Для других стран показываем последние 2 цифры
    return `${cleaned.slice(0, 3)}***-**-${cleaned.slice(-2)}`;
  }

  /**
   * Проверяет валидность OTP кода (6 цифр)
   */
  static isValidOTPFormat(code: string): boolean {
    return /^\d{6}$/.test(code);
  }
}

export default OTPService; 