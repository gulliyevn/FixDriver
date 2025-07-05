// Простой тест для проверки JWT системы
import JWTService from '../services/JWTService';

// Отключено для production - только для разработки
const ENABLE_JWT_TESTS = false;

export const runJWTTests = async () => {
  if (!ENABLE_JWT_TESTS) return;
  
  try {
    console.log('🧪 Тестирование JWT системы...');
    
    // Генерация токенов
    console.log('📝 Генерация токенов...');
    const tokens = JWTService.generateTokens({
      userId: 'test_user_123',
      email: 'test@example.com',
      role: 'client',
      phone: '+1234567890',
    });
    console.log('✅ Токены сгенерированы:', {
      accessToken: tokens.accessToken.substring(0, 50) + '...',
      expiresIn: tokens.expiresIn,
      refreshToken: tokens.refreshToken.substring(0, 50) + '...',
    });

    // Проверка access token
    console.log('🔍 Проверка access token...');
    const decodedAccess = JWTService.verifyToken(tokens.accessToken);
    console.log('✅ Access token декодирован:', decodedAccess);

    // Проверка refresh token
    console.log('🔍 Проверка refresh token...');
    const decodedRefresh = JWTService.verifyToken(tokens.refreshToken);
    console.log('✅ Refresh token декодирован:', decodedRefresh);

    // Проверка истечения
    console.log('⏰ Проверка истечения токена...');
    const isExpired = JWTService.isTokenExpired(tokens.accessToken);
    console.log('✅ Токен истек:', isExpired);
    
    const expiration = JWTService.getTokenExpiration(tokens.accessToken);
    console.log('✅ Время истечения:', expiration);

    console.log('🎉 Все тесты JWT прошли успешно!');
  } catch (error) {
    console.error('❌ Ошибка в тестах JWT:', error);
  }
};

export default runJWTTests; 