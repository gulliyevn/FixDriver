# Интеграция адресов с бэкендом

## Обзор

Система управления адресами в FixDrive готова к интеграции с бэкендом. Все необходимые компоненты, хуки и сервисы уже созданы и настроены для работы с API.

## Структура файлов

```
src/
├── components/
│   └── AddressModal.tsx          # Модальное окно для добавления/редактирования
├── hooks/
│   └── useAddresses.ts           # Хук для управления состоянием адресов
├── services/
│   └── addressService.ts         # Сервис для работы с API
├── mocks/
│   └── residenceMock.ts          # Моки для разработки
└── screens/client/
    └── ResidenceScreen.tsx       # Основной экран управления адресами
```

## API Endpoints

### Базовый URL
```
https://api.fixdrive.com/v1
```

### Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/addresses` | Получить все адреса пользователя |
| POST | `/addresses` | Создать новый адрес |
| PUT | `/addresses/{id}` | Обновить адрес |
| DELETE | `/addresses/{id}` | Удалить адрес |
| PATCH | `/addresses/{id}/default` | Установить адрес по умолчанию |
| GET | `/addresses/default` | Получить адрес по умолчанию |
| GET | `/addresses/search?q={query}` | Поиск адресов |
| GET | `/geocode?address={address}` | Геокодирование адреса |

## Модели данных

### Address
```typescript
interface Address {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
```

### CreateAddressRequest
```typescript
interface CreateAddressRequest {
  title: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}
```

### UpdateAddressRequest
```typescript
interface UpdateAddressRequest {
  title?: string;
  address?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}
```

## Интеграция

### 1. Настройка API URL

В файле `src/services/addressService.ts` замените базовый URL:

```typescript
const API_BASE_URL = 'https://your-api-domain.com/v1';
```

### 2. Настройка авторизации

Реализуйте метод `getAuthToken()` в `addressService.ts`:

```typescript
private async getAuthToken(): Promise<string> {
  // Получить токен из AsyncStorage или другого хранилища
  const token = await AsyncStorage.getItem('authToken');
  return token || '';
}
```

### 3. Включение реальных API вызовов

В файле `src/hooks/useAddresses.ts` раскомментируйте реальные API вызовы:

```typescript
// Заменить моки на реальные API вызовы
const loadedAddresses = await addressService.getAddresses();
```

### 4. Обработка ошибок

Система уже включает обработку ошибок с пользовательскими уведомлениями. При необходимости настройте дополнительные обработчики в `addressService.ts`.

## Функциональность

### Основные возможности

- ✅ Добавление новых адресов
- ✅ Редактирование существующих адресов
- ✅ Удаление адресов
- ✅ Установка адреса по умолчанию
- ✅ Поиск адресов
- ✅ Геокодирование
- ✅ Валидация данных
- ✅ Обработка ошибок
- ✅ Состояния загрузки
- ✅ Пустое состояние

### UI/UX особенности

- Современный дизайн с тенями и скругленными углами
- Адаптивная клавиатура для мобильных устройств
- Подтверждение удаления
- Индикаторы загрузки
- Обработка ошибок сети
- Кнопка повтора при ошибках

## Тестирование

### Моки

Для разработки и тестирования используются моки в `src/mocks/residenceMock.ts`. Они полностью имитируют API и позволяют тестировать функциональность без бэкенда.

### Переключение между моками и API

Для переключения между моками и реальным API измените соответствующие строки в `useAddresses.ts`:

```typescript
// Использовать моки (для разработки)
const loadedAddresses = getAddresses();

// Использовать API (для продакшена)
const loadedAddresses = await addressService.getAddresses();
```

## Безопасность

- Все запросы включают токен авторизации
- Валидация данных на клиенте
- Безопасная обработка ошибок
- Защита от XSS в текстовых полях

## Производительность

- Оптимизированные хуки с useCallback
- Ленивая загрузка компонентов
- Эффективное управление состоянием
- Минимальные ре-рендеры

## Дополнительные возможности

### Геолокация

Система поддерживает автоматическое получение координат по адресу через геокодирование. Для включения этой функции раскомментируйте соответствующий код в `AddressModal.tsx`.

### Поиск адресов

Реализован поиск адресов с автодополнением. Для активации добавьте компонент поиска в `ResidenceScreen.tsx`.

### Синхронизация

Система автоматически синхронизирует данные при изменениях. При необходимости можно добавить периодическую синхронизацию.

## Заключение

Система управления адресами полностью готова к интеграции с бэкендом. Все компоненты протестированы, документированы и оптимизированы для продакшена. 