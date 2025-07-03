// Простой тест для проверки JWT системы
import JWTService from '../services/JWTService';

export const testJWT = async () => {
  console.log('🧪 Тестирование JWT системы...');

  try {
    // Очищаем существующие токены перед тестированием
    await JWTService.clearTokens();
    
    // Тестовые данные пользователя
    const testUserData = {
      userId: 'test_user_123',
      email: 'test@example.com',
      role: 'client' as const,
      phone: '+1234567890',
    };

    // Генерируем токены
    console.log('📝 Генерация токенов...');
    const tokens = JWTService.generateTokens(testUserData);
    console.log('✅ Токены сгенерированы:', {
      accessToken: tokens.accessToken.substring(0, 50) + '...',
      refreshToken: tokens.refreshToken.substring(0, 50) + '...',
      expiresIn: tokens.expiresIn,
    });

    // Проверяем access token
    console.log('🔍 Проверка access token...');
    const decodedAccess = JWTService.verifyToken(tokens.accessToken);
    console.log('✅ Access token декодирован:', decodedAccess);

    // Проверяем refresh token
    console.log('🔍 Проверка refresh token...');
    const decodedRefresh = JWTService.verifyToken(tokens.refreshToken);
    console.log('✅ Refresh token декодирован:', decodedRefresh);

    // Проверяем истечение токена
    console.log('⏰ Проверка истечения токена...');
    const isExpired = JWTService.isTokenExpired(tokens.accessToken);
    console.log('✅ Токен истек:', isExpired);

    // Проверяем время истечения
    const expiration = JWTService.getTokenExpiration(tokens.accessToken);
    console.log('✅ Время истечения:', expiration);

    console.log('🎉 Все тесты JWT прошли успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка в тестах JWT:', error);
    return false;
  }
};

export default testJWT; 