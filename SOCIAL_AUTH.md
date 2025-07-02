# Социальная аутентификация в FixDrive

## Обзор

FixDrive поддерживает вход через популярные социальные сети:
- **Google** - для Android и iOS
- **Facebook** - для Android и iOS  
- **Apple** - только для iOS (требование Apple)

## Архитектура

### Компоненты

1. **SocialAuthService** (`src/services/SocialAuthService.ts`)
   - Центральный сервис для управления социальной аутентификацией
   - Поддерживает мок данные для разработки
   - Готов к интеграции с реальными SDK

2. **SocialAuthButtons** (`src/components/SocialAuthButtons.tsx`)
   - Переиспользуемый компонент кнопок
   - Автоматически скрывает недоступные провайдеры
   - Поддерживает темную тему

3. **AuthService** (`src/services/AuthService.ts`)
   - Обновлен для поддержки социальной аутентификации
   - Единый интерфейс для всех методов входа

### Типы данных

```typescript
interface SocialUser {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  provider: 'google' | 'facebook' | 'apple';
  accessToken?: string;
  refreshToken?: string;
}

interface SocialAuthResult {
  success: boolean;
  user?: SocialUser;
  error?: string;
}
```

## Текущая реализация

### Мок данные (разработка)

В режиме разработки (`__DEV__`) используются мок данные:

```typescript
// Google
{
  id: 'google_user_123',
  email: 'user@gmail.com',
  name: 'Google User',
  photo: 'https://via.placeholder.com/150',
  provider: 'google'
}

// Facebook
{
  id: 'facebook_user_456',
  email: 'user@facebook.com',
  name: 'Facebook User',
  photo: 'https://via.placeholder.com/150',
  provider: 'facebook'
}

// Apple
{
  id: 'apple_user_789',
  email: 'user@icloud.com',
  name: 'Apple User',
  photo: null,
  provider: 'apple'
}
```

### Интеграция с AuthContext

Социальная аутентификация интегрирована в основной контекст аутентификации:

```typescript
const login = async (email: string, password: string, authMethod?: string) => {
  // Поддержка email, google_auth, facebook_auth, apple_auth
}
```

## Подготовка к продакшену

### 1. Google Sign-In

**Установка:**
```bash
npm install @react-native-google-signin/google-signin
```

**Настройка:**
- Android: `google-services.json` в `android/app/`
- iOS: `GoogleService-Info.plist` в iOS проект

**Использование:**
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Инициализация
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',
  iosClientId: 'YOUR_IOS_CLIENT_ID',
});

// Вход
const userInfo = await GoogleSignin.signIn();
```

### 2. Facebook Login

**Установка:**
```bash
npm install react-native-fbsdk-next
```

**Настройка:**
- Android: `facebook_app_id` в `android/app/src/main/res/values/strings.xml`
- iOS: `FacebookAppID` в `Info.plist`

**Использование:**
```typescript
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

// Вход
const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
const data = await AccessToken.getCurrentAccessToken();
```

### 3. Apple Sign-In

**Установка:**
```bash
expo install expo-apple-authentication
```

**Настройка:**
- iOS: Добавить "Sign In with Apple" capability в Xcode
- Требуется Apple Developer Account

**Использование:**
```typescript
import * as AppleAuthentication from 'expo-apple-authentication';

// Вход
const credential = await AppleAuthentication.signInAsync({
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
});
```

## Безопасность

### Рекомендации

1. **Валидация токенов на сервере**
   - Всегда проверяйте токены на бэкенде
   - Не доверяйте только клиентской валидации

2. **Безопасное хранение**
   - Используйте SecureStore для токенов
   - Не храните чувствительные данные в AsyncStorage

3. **Обработка ошибок**
   - Логируйте ошибки аутентификации
   - Предоставляйте понятные сообщения пользователю

### Пример валидации на сервере

```typescript
// Google
const ticket = await client.verifyIdToken({
  idToken: token,
  audience: 'YOUR_CLIENT_ID'
});

// Facebook
const response = await fetch(
  `https://graph.facebook.com/me?access_token=${token}`
);
const userData = await response.json();

// Apple
const applePublicKeys = await fetch('https://appleid.apple.com/auth/keys');
// Валидация JWT токена Apple
```

## UI/UX

### Дизайн кнопок

- **Google**: Белый фон с цветным логотипом
- **Facebook**: Синий фон с белым логотипом  
- **Apple**: Черный/белый фон в зависимости от темы

### Состояния

- **Обычное**: Полная функциональность
- **Загрузка**: Показывается индикатор, кнопки отключены
- **Ошибка**: Показывается сообщение об ошибке
- **Недоступно**: Кнопки скрыты (например, Apple на Android)

### Адаптивность

- Кнопки автоматически адаптируются под размер экрана
- Поддержка темной темы
- Доступность (accessibility) для скринридеров

## Тестирование

### Мок тесты

```typescript
// Тест Google входа
const result = await SocialAuthService.signInWithGoogle();
expect(result.success).toBe(true);
expect(result.user?.provider).toBe('google');

// Тест Facebook входа
const result = await SocialAuthService.signInWithFacebook();
expect(result.success).toBe(true);
expect(result.user?.provider).toBe('facebook');

// Тест Apple входа
const result = await SocialAuthService.signInWithApple();
expect(result.success).toBe(true);
expect(result.user?.provider).toBe('apple');
```

### Интеграционные тесты

```typescript
// Тест полного флоу
const loginResult = await login('user@gmail.com', 'password', 'google_auth');
expect(loginResult).toBe(true);
expect(user?.name).toBe('Google User');
```

## Миграция

### Включение реальной аутентификации

1. Установите необходимые SDK
2. Настройте конфигурацию для каждой платформы
3. Раскомментируйте код в `SocialAuthService.ts`
4. Обновите `__DEV__` проверки
5. Протестируйте на реальных устройствах

### Обратная совместимость

- Мок данные остаются доступными для разработки
- Переключение между мок и реальными данными через переменные окружения
- Graceful fallback при ошибках

## Мониторинг

### Метрики

- Успешность входа по провайдерам
- Время входа
- Частота ошибок
- Популярность методов входа

### Логирование

```typescript
// Успешный вход
console.log('✅ Social auth success:', {
  provider: user.provider,
  email: user.email,
  timestamp: new Date().toISOString()
});

// Ошибка входа
console.error('❌ Social auth error:', {
  provider: provider,
  error: error.message,
  timestamp: new Date().toISOString()
});
```

## Заключение

Система социальной аутентификации готова к использованию в разработке и подготовлена к интеграции с реальными SDK для продакшена. Архитектура позволяет легко добавлять новые провайдеры и поддерживает все современные стандарты безопасности. 