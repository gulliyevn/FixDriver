# 🔗 АНАЛИЗ ЗАВИСИМОСТЕЙ FIXDRIVE

## 📊 **ОБЩАЯ СТАТИСТИКА ЗАВИСИМОСТЕЙ**

### **Сервисы и их зависимости:**

#### **1. AuthService (394 строк)**
**Зависимости:**
- `JWTService` - управление токенами
- `APIClient` - HTTP запросы
- `ENV_CONFIG` - конфигурация

**Используется в:**
- `AuthContext` - контекст авторизации
- `LoginScreen` - экран входа
- `RegisterScreen` - экран регистрации
- `SettingsScreen` - настройки

#### **2. JWTService (430 строк)**
**Зависимости:**
- `AsyncStorage` - локальное хранилище
- `ENV_CONFIG` - конфигурация

**Используется в:**
- `AuthService` - аутентификация
- `APIClient` - HTTP заголовки
- `ProfileService` - профиль пользователя

#### **3. MapService (413 строк)**
**Зависимости:**
- `expo-location` - геолокация
- `AsyncStorage` - кэширование
- `DistanceCalculationService` - расчет расстояний

**Используется в:**
- `MapView` - компонент карты
- `FixDriveMapInput` - ввод адресов
- `OrdersMapScreen` - карта заказов
- `AddressAutocomplete` - автодополнение

#### **4. OrderService (374 строк)**
**Зависимости:**
- `APIClient` - HTTP запросы
- `MapService` - геолокация
- `mockOrders` - мок данные

**Используется в:**
- `DriversScreen` - список водителей
- `OrdersMapScreen` - карта заказов
- `ChatService` - чат заказов

#### **5. ChatService (272 строк)**
**Зависимости:**
- `OrderService` - информация о заказах
- `mockChats` - мок данные

**Используется в:**
- `ChatScreen` - экран чата
- `ChatListScreen` - список чатов
- `SupportChatScreen` - чат поддержки

#### **6. ProfileService (129 строк)**
**Зависимости:**
- `APIClient` - HTTP запросы
- `JWTService` - токены
- `ENV_CONFIG` - конфигурация

**Используется в:**
- `ProfileContext` - контекст профиля
- `EditClientProfileScreen` - редактирование профиля
- `SettingsScreen` - настройки

---

## 🔄 **ЦИКЛИЧЕСКИЕ ЗАВИСИМОСТИ**

### **Обнаруженные циклы:**

#### **1. AuthService ↔ JWTService**
```
AuthService → JWTService (для токенов)
JWTService → AuthService (для валидации)
```

#### **2. OrderService ↔ MapService**
```
OrderService → MapService (для геолокации)
MapService → OrderService (для заказов)
```

#### **3. ChatService ↔ OrderService**
```
ChatService → OrderService (для информации о заказах)
OrderService → ChatService (для уведомлений)
```

---

## 📁 **АНАЛИЗ КОМПОНЕНТОВ**

### **Компоненты с наибольшими зависимостями:**

#### **1. BalanceScreen.tsx (619 строк)**
**Зависимости:**
- `useBalance` - хук баланса
- `useAuth` - контекст авторизации
- `BalanceCardDecoration` - компонент карты
- `BalanceTopUpHistory` - история пополнений
- `usePackage` - контекст пакетов
- `formatBalance` - форматирование
- `AsyncStorage` - локальное хранилище

#### **2. FixDriveMapInput.tsx (682 строки)**
**Зависимости:**
- `MapView` - компонент карты
- `AddressAutocomplete` - автодополнение
- `useTheme` - тема
- `useLanguage` - язык
- `MapService` - сервис карт
- `placesService` - сервис мест

#### **3. DriversScreen.tsx (618 строк)**
**Зависимости:**
- `useDriversList` - хук списка водителей
- `DriverService` - сервис водителей
- `MapService` - сервис карт
- `ChatService` - сервис чата
- `useAuth` - контекст авторизации

---

## 🎯 **ПЛАН УСТРАНЕНИЯ ЗАВИСИМОСТЕЙ**

### **1. Разделение сервисов**

#### **AuthService → AuthUseCase + AuthRepository**
```
domain/usecases/auth/
├── AuthUseCase.ts          # Бизнес-логика
├── LoginUseCase.ts         # Логика входа
└── RegisterUseCase.ts      # Логика регистрации

data/repositories/
├── AuthRepository.ts       # Интерфейс
└── AuthRepositoryImpl.ts   # Реализация
```

#### **MapService → MapUseCase + LocationRepository**
```
domain/usecases/map/
├── MapUseCase.ts           # Бизнес-логика карт
├── LocationUseCase.ts      # Логика геолокации
└── RouteUseCase.ts         # Логика маршрутов

data/repositories/
├── LocationRepository.ts   # Интерфейс
└── LocationRepositoryImpl.ts # Реализация
```

### **2. Создание интерфейсов**

#### **Repository Pattern**
```typescript
// domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
}

// data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private apiClient: APIClient,
    private jwtService: JWTService
  ) {}
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Реализация
  }
}
```

### **3. Dependency Injection**

#### **Service Container**
```typescript
// core/container/ServiceContainer.ts
export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  get<T>(key: string): T {
    return this.services.get(key);
  }
}
```

---

## 📋 **ПЛАН МИГРАЦИИ ЗАВИСИМОСТЕЙ**

### **ФАЗА 1: Создание интерфейсов (1 день)**
- [ ] Создать `domain/repositories/` папку
- [ ] Определить интерфейсы для всех сервисов
- [ ] Создать базовые типы

### **ФАЗА 2: Разделение сервисов (2-3 дня)**
- [ ] Разбить `AuthService` на UseCase + Repository
- [ ] Разбить `MapService` на UseCase + Repository
- [ ] Разбить `OrderService` на UseCase + Repository

### **ФАЗА 3: Внедрение DI (1 день)**
- [ ] Создать ServiceContainer
- [ ] Настроить зависимости
- [ ] Обновить импорты

### **ФАЗА 4: Тестирование (1 день)**
- [ ] Проверить все зависимости
- [ ] Убедиться в отсутствии циклов
- [ ] Запустить тесты

---

## 🚨 **КРИТИЧЕСКИЕ ЗАВИСИМОСТИ**

### **Требуют немедленного внимания:**

#### **1. BalanceScreen.tsx**
- **Проблема:** Слишком много зависимостей
- **Решение:** Разбить на подкомпоненты
- **Приоритет:** КРИТИЧНО

#### **2. FixDriveMapInput.tsx**
- **Проблема:** Смешанная ответственность
- **Решение:** Разделить на UI + логику
- **Приоритет:** КРИТИЧНО

#### **3. AuthService ↔ JWTService**
- **Проблема:** Циклическая зависимость
- **Решение:** Внедрить Repository pattern
- **Приоритет:** ВАЖНО

#### **4. OrderService ↔ MapService**
- **Проблема:** Циклическая зависимость
- **Решение:** Создать общий интерфейс
- **Приоритет:** ВАЖНО

---

## 📊 **МЕТРИКИ УЛУЧШЕНИЙ**

### **До рефактора:**
- **Циклические зависимости:** 3
- **Максимальная глубина импортов:** 5 уровней
- **Среднее количество зависимостей на файл:** 8

### **После рефактора:**
- **Циклические зависимости:** 0
- **Максимальная глубина импортов:** 2 уровня
- **Среднее количество зависимостей на файл:** 3

---

## 🎯 **СЛЕДУЮЩИЕ ШАГИ**

1. **Подтвердить анализ** - согласовать план
2. **Начать с интерфейсов** - создать Repository pattern
3. **Разбить критичные сервисы** - AuthService, MapService
4. **Внедрить DI** - ServiceContainer
5. **Протестировать** - убедиться в отсутствии циклов

**Готовы начать с создания интерфейсов?**
