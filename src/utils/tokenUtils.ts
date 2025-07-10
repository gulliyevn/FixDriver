import AsyncStorage from '@react-native-async-storage/async-storage';
import { JWTService } from '../services/JWTService';

/**
 * Утилиты для работы с токенами
 */
export class TokenUtils {
  private static readonly ACCESS_TOKEN_KEY = 'fixdrive_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'fixdrive_refresh_token';

  /**
   * Очищает все токены из AsyncStorage
   */
  static async clearAllTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
      ]);
      console.log('✅ Все токены успешно очищены');
    } catch (error) {
      console.error('❌ Ошибка при очистке токенов:', error);
    }
  }

  /**
   * Проверяет наличие токенов в AsyncStorage
   */
  static async checkTokens(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
  }> {
    try {
      const accessToken = await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);

      const hasAccessToken = !!accessToken;
      const hasRefreshToken = !!refreshToken;

      let accessTokenValid = false;
      let refreshTokenValid = false;

      if (accessToken) {
        try {
          const payload = await JWTService.verifyToken(accessToken);
          accessTokenValid = !!payload;
        } catch (error) {
          console.log('❌ Access token недействителен:', error.message);
        }
      }

      if (refreshToken) {
        try {
          const payload = await JWTService.verifyToken(refreshToken);
          refreshTokenValid = !!payload;
        } catch (error) {
          console.log('❌ Refresh token недействителен:', error.message);
        }
      }

      return {
        hasAccessToken,
        hasRefreshToken,
        accessTokenValid,
        refreshTokenValid,
      };
    } catch (error) {
      console.error('❌ Ошибка при проверке токенов:', error);
      return {
        hasAccessToken: false,
        hasRefreshToken: false,
        accessTokenValid: false,
        refreshTokenValid: false,
      };
    }
  }

  /**
   * Выводит информацию о токенах в консоль
   */
  static async debugTokens(): Promise<void> {
    console.log('🔍 Проверка токенов...');
    
    const tokenInfo = await this.checkTokens();
    
    console.log('📊 Статус токенов:');
    console.log(`  Access Token: ${tokenInfo.hasAccessToken ? '✅ Найден' : '❌ Отсутствует'} ${tokenInfo.accessTokenValid ? '(✅ Валиден)' : '(❌ Недействителен)'}`);
    console.log(`  Refresh Token: ${tokenInfo.hasRefreshToken ? '✅ Найден' : '❌ Отсутствует'} ${tokenInfo.refreshTokenValid ? '(✅ Валиден)' : '(❌ Недействителен)'}`);
    
    if (tokenInfo.hasAccessToken) {
      try {
        const accessToken = await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
        const payload = JWTService.decode(accessToken!);
        if (payload) {
          console.log('👤 Информация о пользователе:');
          console.log(`  ID: ${payload.userId}`);
          console.log(`  Email: ${payload.email}`);
          console.log(`  Role: ${payload.role}`);
          console.log(`  Phone: ${payload.phone}`);
          console.log(`  Issued: ${new Date(payload.iat! * 1000).toLocaleString()}`);
          console.log(`  Expires: ${new Date(payload.exp! * 1000).toLocaleString()}`);
        }
      } catch (error) {
        console.log('❌ Не удалось декодировать access token');
      }
    }
  }

  /**
   * Принудительно обновляет токены для текущего пользователя
   */
  static async forceRefreshTokens(): Promise<boolean> {
    try {
      const currentUser = await JWTService.getCurrentUser();
      
      if (!currentUser) {
        console.log('❌ Текущий пользователь не найден');
        return false;
      }

      console.log('🔄 Принудительное обновление токенов...');
      
      await JWTService.forceRefreshTokens({
        userId: currentUser.userId,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
      });

      console.log('✅ Токены успешно обновлены');
      return true;
    } catch (error) {
      console.error('❌ Ошибка при обновлении токенов:', error);
      return false;
    }
  }

  /**
   * Полная очистка и пересоздание токенов
   */
  static async resetTokens(): Promise<boolean> {
    try {
      console.log('🔄 Полный сброс токенов...');
      
      // Очищаем все токены
      await this.clearAllTokens();
      
      // Проверяем, что токены очищены
      const tokenInfo = await this.checkTokens();
      
      if (tokenInfo.hasAccessToken || tokenInfo.hasRefreshToken) {
        console.log('❌ Токены не были полностью очищены');
        return false;
      }

      console.log('✅ Токены успешно сброшены');
      return true;
    } catch (error) {
      console.error('❌ Ошибка при сбросе токенов:', error);
      return false;
    }
  }
}

// Экспортируем для использования в консоли разработчика
if (__DEV__) {
  (global as Record<string, unknown>).TokenUtils = TokenUtils;
  console.log('🔧 TokenUtils доступен в консоли как global.TokenUtils');
  console.log('📝 Доступные методы:');
  console.log('  TokenUtils.clearAllTokens() - очистить все токены');
  console.log('  TokenUtils.debugTokens() - показать информацию о токенах');
  console.log('  TokenUtils.forceRefreshTokens() - принудительно обновить токены');
  console.log('  TokenUtils.resetTokens() - полный сброс токенов');
} 