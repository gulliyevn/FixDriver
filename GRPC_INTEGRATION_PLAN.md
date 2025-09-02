# 🔌 ПЛАН ИНТЕГРАЦИИ GRPC В FIXDRIVE

## 🎯 **ОБЩАЯ КОНЦЕПЦИЯ**

### **Текущее состояние:**
- **Фронтенд:** React Native + TypeScript
- **Бэкенд:** gRPC (не указан язык)
- **Коммуникация:** Нужно заменить REST на gRPC

### **Цель:**
- Интегрировать gRPC клиент в новую архитектуру
- Создать типизированные интерфейсы для всех сервисов
- Обеспечить совместимость с существующим кодом

---

## 🏗️ **АРХИТЕКТУРНЫЕ ИЗМЕНЕНИЯ**

### **Новая структура с gRPC:**

```
src-new/
├── presentation/           # UI слой (без изменений)
├── domain/                # Бизнес-логика (без изменений)
├── data/                  # Данные
│   ├── repositories/      # Реализации репозиториев
│   ├── datasources/       # Источники данных
│   │   ├── grpc/          # gRPC клиенты ⭐ НОВОЕ
│   │   │   ├── clients/   # gRPC клиенты
│   │   │   ├── services/  # gRPC сервисы
│   │   │   └── types/     # Proto типы
│   │   ├── api/           # REST API (для совместимости)
│   │   ├── local/         # Локальное хранилище
│   │   └── cache/         # Кэш
│   └── mappers/           # Преобразования данных
├── shared/                # Общие ресурсы
└── core/                  # Ядро приложения
```

---

## 📦 **GRPC ИНТЕГРАЦИЯ**

### **1. Установка зависимостей**

```bash
# gRPC для React Native
npm install @grpc/grpc-js
npm install @grpc/proto-loader
npm install react-native-grpc-bridge

# Для генерации типов из proto файлов
npm install --save-dev grpc-tools
npm install --save-dev @types/google-protobuf
```

### **2. Структура gRPC клиентов**

```typescript
// src-new/data/datasources/grpc/clients/GrpcClient.ts
export class GrpcClient {
  private static instance: GrpcClient;
  private client: any;

  private constructor() {
    this.initializeClient();
  }

  static getInstance(): GrpcClient {
    if (!GrpcClient.instance) {
      GrpcClient.instance = new GrpcClient();
    }
    return GrpcClient.instance;
  }

  private initializeClient(): void {
    // Инициализация gRPC клиента
    // Подключение к серверу
  }

  getClient(): any {
    return this.client;
  }
}
```

### **3. gRPC сервисы**

```typescript
// src-new/data/datasources/grpc/services/AuthGrpcService.ts
import { GrpcClient } from '../clients/GrpcClient';
import { AuthRequest, AuthResponse } from '../types/auth_pb';

export class AuthGrpcService {
  private client: GrpcClient;

  constructor() {
    this.client = GrpcClient.getInstance();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      const request = new AuthRequest();
      request.setEmail(email);
      request.setPassword(password);

      this.client.getClient().login(request, (error: any, response: AuthResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    // Реализация регистрации через gRPC
  }
}
```

### **4. Типы из proto файлов**

```typescript
// src-new/data/datasources/grpc/types/auth_pb.d.ts
export interface AuthRequest {
  getEmail(): string;
  setEmail(value: string): void;
  getPassword(): string;
  setPassword(value: string): void;
}

export interface AuthResponse {
  getToken(): string;
  setToken(value: string): void;
  getUserId(): string;
  setUserId(value: string): void;
  getSuccess(): boolean;
  setSuccess(value: boolean): void;
}
```

---

## 🔄 **МИГРАЦИЯ СЕРВИСОВ НА GRPC**

### **Фаза 1: Создание gRPC клиентов (2 дня)**

#### **День 1: Базовая настройка**
- [ ] Установить gRPC зависимости
- [ ] Создать базовый GrpcClient
- [ ] Настроить подключение к серверу
- [ ] Создать типы из proto файлов

#### **День 2: Основные сервисы**
- [ ] AuthGrpcService - аутентификация
- [ ] UserGrpcService - пользователи
- [ ] OrderGrpcService - заказы
- [ ] PaymentGrpcService - платежи

### **Фаза 2: Обновление репозиториев (3 дня)**

#### **День 3: AuthRepository**
```typescript
// src-new/data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private authGrpcService: AuthGrpcService,
    private jwtService: JWTService
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const grpcResponse = await this.authGrpcService.login(
        credentials.email, 
        credentials.password
      );
      
      // Преобразование gRPC ответа в доменную модель
      const authResponse: AuthResponse = {
        token: grpcResponse.getToken(),
        userId: grpcResponse.getUserId(),
        success: grpcResponse.getSuccess()
      };

      await this.jwtService.saveToken(authResponse.token);
      return authResponse;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
```

#### **День 4: OrderRepository**
```typescript
// src-new/data/repositories/OrderRepositoryImpl.ts
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    private orderGrpcService: OrderGrpcService
  ) {}

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const grpcResponse = await this.orderGrpcService.getOrders(filters);
    return grpcResponse.getOrdersList().map(order => this.mapGrpcOrderToDomain(order));
  }

  private mapGrpcOrderToDomain(grpcOrder: any): Order {
    return {
      id: grpcOrder.getId(),
      status: grpcOrder.getStatus(),
      // ... остальные поля
    };
  }
}
```

#### **День 5: PaymentRepository**
- [ ] Реализовать PaymentRepository с gRPC
- [ ] Создать маппинги для платежных данных
- [ ] Добавить обработку ошибок

### **Фаза 3: Обновление UseCase (2 дня)**

#### **День 6: AuthUseCase**
```typescript
// src-new/domain/usecases/auth/AuthUseCase.ts
export class AuthUseCase implements IAuthUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository
  ) {}

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await this.authRepository.login({ email, password });
      
      if (response.success) {
        const user = await this.userRepository.getUser(response.userId);
        return { success: true, user, token: response.token };
      } else {
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

#### **День 7: OrderUseCase**
- [ ] Обновить OrderUseCase для работы с gRPC
- [ ] Добавить обработку gRPC ошибок
- [ ] Создать fallback механизмы

---

## 🔧 **ТЕХНИЧЕСКИЕ ДЕТАЛИ**

### **1. Конфигурация gRPC**

```typescript
// src-new/shared/config/grpc.ts
export const GRPC_CONFIG = {
  server: {
    host: process.env.GRPC_HOST || 'localhost',
    port: process.env.GRPC_PORT || 50051,
  },
  timeout: 30000, // 30 секунд
  retries: 3,
  keepAlive: {
    keepAliveTimeMs: 30000,
    keepAliveTimeoutMs: 5000,
    keepAlivePermitWithoutCalls: true,
  }
};
```

### **2. Обработка ошибок**

```typescript
// src-new/data/datasources/grpc/utils/GrpcErrorHandler.ts
export class GrpcErrorHandler {
  static handleError(error: any): AppError {
    if (error.code === grpc.status.UNAUTHENTICATED) {
      return {
        code: 'AUTH_001',
        message: 'Необходима повторная авторизация',
        retryable: true
      };
    }
    
    if (error.code === grpc.status.UNAVAILABLE) {
      return {
        code: 'NET_001',
        message: 'Сервер недоступен',
        retryable: true
      };
    }

    return {
      code: 'UNKNOWN',
      message: error.message || 'Неизвестная ошибка',
      retryable: false
    };
  }
}
```

### **3. Кэширование**

```typescript
// src-new/data/datasources/grpc/utils/GrpcCache.ts
export class GrpcCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 минут

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }
}
```

---

## 📋 **ОБНОВЛЕННЫЙ ПЛАН МИГРАЦИИ**

### **Новый таймлайн: 18-20 дней**

#### **Фаза 1: Подготовка (1 день)**
- [ ] Создание новой структуры
- [ ] Установка gRPC зависимостей
- [ ] Настройка конфигурации

#### **Фаза 2: gRPC интеграция (4 дня)**
- [ ] Создание базового GrpcClient
- [ ] Реализация основных gRPC сервисов
- [ ] Создание типов из proto файлов
- [ ] Настройка обработки ошибок

#### **Фаза 3: Миграция сервисов (5 дней)**
- [ ] Обновление репозиториев для работы с gRPC
- [ ] Создание маппингов данных
- [ ] Обновление UseCase
- [ ] Добавление fallback механизмов

#### **Фаза 4: Миграция компонентов (5 дней)**
- [ ] Миграция UI компонентов
- [ ] Обновление экранов
- [ ] Разбиение монолитных файлов

#### **Фаза 5: Оптимизация (3 дня)**
- [ ] Добавление кэширования
- [ ] Оптимизация производительности
- [ ] Удаление дублирования

#### **Фаза 6: Тестирование (2 дня)**
- [ ] Тестирование gRPC соединений
- [ ] Проверка всех функций
- [ ] Финальная миграция

---

## 🚨 **РИСКИ И МИТИГАЦИЯ**

### **Риски gRPC интеграции:**

#### **1. Сложность отладки**
- **Риск:** gRPC сложнее отлаживать чем REST
- **Митогирование:** Добавить подробное логирование, использовать gRPC UI

#### **2. Совместимость с React Native**
- **Риск:** Проблемы с нативными модулями
- **Митогирование:** Использовать проверенные библиотеки, создать fallback

#### **3. Производительность**
- **Риск:** gRPC может быть медленнее на мобильных устройствах
- **Митогирование:** Добавить кэширование, оптимизировать запросы

#### **4. Размер приложения**
- **Риск:** gRPC увеличивает размер APK/IPA
- **Митогирование:** Использовать tree-shaking, оптимизировать зависимости

---

## 🎯 **СЛЕДУЮЩИЕ ШАГИ**

1. **Подтвердить proto файлы** - получить схемы от бэкенда
2. **Настроить gRPC окружение** - установить зависимости
3. **Создать базовый клиент** - протестировать соединение
4. **Начать миграцию** - по одному сервису

**Нужны ли proto файлы от бэкенда для начала?**
