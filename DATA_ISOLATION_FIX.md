# 🔒 Исправление изоляции данных по пользователям

## ❌ Проблема
Все пользователи одной роли видели одни и те же данные:
- `user_profile` - общий профиль для всех
- `client_balance` - общий баланс для всех клиентов  
- `cards` - общие карты для всех
- `user_subscription` - общие пакеты для всех

## ✅ Решение
Добавлена изоляция по ID пользователя во все ключи AsyncStorage.

## 🛠️ Реализация

### 1. Утилита для ключей (`src/utils/storageKeys.ts`)
```typescript
// Генерирует ключ с ID пользователя
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
  if (userId) {
    return `${baseKey}_${userId}`;
  }
  return baseKey; // Обратная совместимость
};

// Хук для получения ключа с изоляцией
export const useUserStorageKey = (baseKey: string): string => {
  const { user } = useAuth();
  return getUserStorageKey(baseKey, user?.id);
};
```

### 2. Централизованные ключи
```typescript
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  CLIENT_BALANCE: 'client_balance',
  DRIVER_BALANCE: 'driver_balance',
  USER_CARDS: 'cards',
  USER_SUBSCRIPTION: 'user_subscription',
  // ... и другие
} as const;
```

### 3. Пример использования

#### До (общие данные):
```typescript
// ❌ Все клиенты видят один баланс
const storedBalance = await AsyncStorage.getItem('client_balance');
```

#### После (изолированные данные):
```typescript
// ✅ Каждый пользователь видит свой баланс
const balanceKey = useUserStorageKey(STORAGE_KEYS.CLIENT_BALANCE);
const storedBalance = await AsyncStorage.getItem(balanceKey);
// Результат: client_balance_user123
```

## 📁 Обновленные файлы

### ✅ Уже исправлено:
- `src/utils/storageKeys.ts` - утилита для ключей
- `src/hooks/useProfile.ts` - профиль пользователя
- `src/hooks/client/useClientBalance.ts` - баланс клиентов
- `src/hooks/driver/useDriverBalance.ts` - баланс водителей
- `src/services/cardService.ts` - карты
- `src/hooks/useCards.ts` - хук карт

### 🔄 Нужно исправить:
- `src/context/PackageContext.tsx` - пакеты и подписки
- `src/hooks/useNotifications.ts` - настройки уведомлений
- `src/context/ThemeContext.tsx` - тема
- `src/context/LanguageContext.tsx` - язык
- `src/services/AvatarService.ts` - аватары
- `src/services/driver/DriverAvatarService.ts` - аватары водителей

## 🎯 Результат

### До исправления:
```
user1 (client) → client_balance = 1000
user2 (client) → client_balance = 1000 (тот же!)
user3 (client) → client_balance = 1000 (тот же!)
```

### После исправления:
```
user1 (client) → client_balance_user1 = 1000
user2 (client) → client_balance_user2 = 500  
user3 (client) → client_balance_user3 = 750
```

## 🔄 Миграция данных

При первом запуске после обновления:
1. Старые данные остаются доступными (обратная совместимость)
2. Новые данные сохраняются с ID пользователя
3. Можно добавить миграцию для переноса старых данных

## 🚀 Следующие шаги

1. Исправить оставшиеся файлы (PackageContext, ThemeContext, etc.)
2. Добавить тесты для проверки изоляции
3. Создать миграцию данных
4. Обновить документацию API
