# 🔧 ПЛАН РЕФАКТОРА С ЗАГЛУШКАМИ И МОКОМ БД

## 🎯 **ЦЕЛЬ**

### **Подготовить архитектуру для gRPC без блокировки разработки:**
- ✅ Рефакторить фронтенд архитектуру
- ✅ Убрать все моки кроме БД
- ✅ Создать заглушки для будущих gRPC сервисов
- ✅ Подготовить интерфейсы для легкого подключения бэкенда

---

## 🏗️ **НОВАЯ АРХИТЕКТУРА С ЗАГЛУШКАМИ**

### **Структура:**
```
src-new/
├── presentation/           # UI слой
├── domain/                # Бизнес-логика
├── data/                  # Данные
│   ├── repositories/      # Реализации репозиториев
│   ├── datasources/       # Источники данных
│   │   ├── grpc/          # gRPC заглушки ⭐
│   │   │   ├── stubs/     # Заглушки сервисов
│   │   │   ├── types/     # Интерфейсы для будущих типов
│   │   │   └── config/    # Конфигурация gRPC
│   │   ├── local/         # Локальное хранилище (AsyncStorage)
│   │   └── cache/         # Кэш
│   └── mappers/           # Преобразования данных
├── shared/                # Общие ресурсы
└── core/                  # Ядро приложения
```

---

## 📋 **ПЛАН РЕАЛИЗАЦИИ (12 дней)**

### **ФАЗА 1: ПОДГОТОВКА (1 день)**

#### **День 1: Создание структуры и заглушек**
```bash
# Создание папок
mkdir -p src-new/{presentation,domain,data,shared,core}
mkdir -p src-new/presentation/{components,screens,navigation,styles}
mkdir -p src-new/presentation/components/{ui,forms,modals,cards}
mkdir -p src-new/presentation/screens/{auth,client,driver,common}
mkdir -p src-new/domain/{entities,usecases,repositories,services}
mkdir -p src-new/domain/entities/{user,order,payment,chat}
mkdir -p src-new/domain/usecases/{auth,profile,booking,payment}
mkdir -p src-new/data/{repositories,datasources,mappers}
mkdir -p src-new/data/datasources/{grpc,local,cache}
mkdir -p src-new/data/datasources/grpc/{stubs,types,config}
mkdir -p src-new/shared/{constants,utils,types,i18n,config}
mkdir -p src-new/core/{context,hooks,providers,container}
```

### **ФАЗА 2: СОЗДАНИЕ ЗАГЛУШЕК (2 дня)**

#### **День 2: Интерфейсы и заглушки gRPC**

```typescript
// src-new/data/datasources/grpc/types/IAuthService.ts
export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
}

// src-new/data/datasources/grpc/types/IUserService.ts
export interface IUserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// src-new/data/datasources/grpc/types/IOrderService.ts
export interface IOrderService {
  getOrders(filters?: OrderFilters): Promise<Order[]>;
  createOrder(orderData: CreateOrderData): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  cancelOrder(id: string): Promise<void>;
}

// src-new/data/datasources/grpc/types/IPaymentService.ts
export interface IPaymentService {
  getPayments(userId: string): Promise<Payment[]>;
  createPayment(paymentData: CreatePaymentData): Promise<Payment>;
  getBalance(userId: string): Promise<Balance>;
}
```

#### **День 3: Реализация заглушек**

```typescript
// src-new/data/datasources/grpc/stubs/AuthServiceStub.ts
export class AuthServiceStub implements IAuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Заглушка - возвращает мок данные
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          userId: 'mock-user-id',
          success: true
        });
      }, 500); // Имитация задержки сети
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          userId: 'new-user-id',
          success: true
        });
      }, 500);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'new-mock-jwt-token',
          userId: 'mock-user-id',
          success: true
        });
      }, 300);
    });
  }
}
```

### **ФАЗА 3: РЕПОЗИТОРИИ С ЗАГЛУШКАМИ (3 дня)**

#### **День 4: AuthRepository**

```typescript
// src-new/data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private authService: IAuthService,
    private jwtService: JWTService
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.authService.login(
        credentials.email, 
        credentials.password
      );
      
      if (response.success) {
        await this.jwtService.saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.authService.register(userData);
      
      if (response.success) {
        await this.jwtService.saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      await this.jwtService.clearToken();
    } catch (error) {
      console.warn('Logout error:', error);
      // Все равно очищаем локальный токен
      await this.jwtService.clearToken();
    }
  }
}
```

#### **День 5: OrderRepository**

```typescript
// src-new/data/repositories/OrderRepositoryImpl.ts
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    private orderService: IOrderService,
    private cache: ICacheService
  ) {}

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      // Проверяем кэш
      const cacheKey = `orders_${JSON.stringify(filters)}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const orders = await this.orderService.getOrders(filters);
      
      // Кэшируем результат
      this.cache.set(cacheKey, orders, 5 * 60 * 1000); // 5 минут
      
      return orders;
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const order = await this.orderService.createOrder(orderData);
      
      // Инвалидируем кэш
      this.cache.invalidate('orders_*');
      
      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}
```

#### **День 6: PaymentRepository**

```typescript
// src-new/data/repositories/PaymentRepositoryImpl.ts
export class PaymentRepositoryImpl implements IPaymentRepository {
  constructor(
    private paymentService: IPaymentService,
    private cache: ICacheService
  ) {}

  async getPayments(userId: string): Promise<Payment[]> {
    try {
      const cacheKey = `payments_${userId}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const payments = await this.paymentService.getPayments(userId);
      
      this.cache.set(cacheKey, payments, 10 * 60 * 1000); // 10 минут
      
      return payments;
    } catch (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
  }

  async getBalance(userId: string): Promise<Balance> {
    try {
      const cacheKey = `balance_${userId}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const balance = await this.paymentService.getBalance(userId);
      
      this.cache.set(cacheKey, balance, 2 * 60 * 1000); // 2 минуты
      
      return balance;
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
}
```

### **ФАЗА 4: USECASE С ЗАГЛУШКАМИ (2 дня)**

#### **День 7: AuthUseCase**

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

  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const response = await this.authRepository.register(userData);
      
      if (response.success) {
        const user = await this.userRepository.createUser(userData);
        return { success: true, user, token: response.token };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<void> {
    await this.authRepository.logout();
  }

  isAuthenticated(): boolean {
    // Проверяем наличие токена
    return this.authRepository.hasValidToken();
  }
}
```

#### **День 8: OrderUseCase**

```typescript
// src-new/domain/usecases/booking/OrderUseCase.ts
export class OrderUseCase implements IOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentRepository: IPaymentRepository
  ) {}

  async createOrder(orderData: CreateOrderData): Promise<OrderResult> {
    try {
      // Валидация данных
      if (!orderData.from || !orderData.to) {
        return { success: false, error: 'Missing required fields' };
      }

      // Проверка баланса
      const balance = await this.paymentRepository.getBalance(orderData.userId);
      if (balance.amount < orderData.estimatedPrice) {
        return { success: false, error: 'Insufficient balance' };
      }

      const order = await this.orderRepository.createOrder(orderData);
      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrders(filters?: OrderFilters): Promise<OrderResult> {
    try {
      const orders = await this.orderRepository.getOrders(filters);
      return { success: true, orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### **ФАЗА 5: МИГРАЦИЯ КОМПОНЕНТОВ (3 дня)**

#### **День 9-11: Миграция UI**
- [ ] Миграция базовых компонентов
- [ ] Миграция экранов
- [ ] Обновление импортов
- [ ] Разбиение монолитных файлов

### **ФАЗА 6: ИНТЕГРАЦИЯ И ТЕСТИРОВАНИЕ (1 день)**

#### **День 12: Финальная интеграция**
- [ ] Настройка ServiceContainer
- [ ] Подключение всех заглушек
- [ ] Тестирование функциональности
- [ ] Проверка работы с моком БД

---

## 🔧 **SERVICE CONTAINER С ЗАГЛУШКАМИ**

```typescript
// src-new/core/container/ServiceContainer.ts
export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
      ServiceContainer.instance.initializeServices();
    }
    return ServiceContainer.instance;
  }

  private initializeServices(): void {
    // Заглушки сервисов
    const authService = new AuthServiceStub();
    const userService = new UserServiceStub();
    const orderService = new OrderServiceStub();
    const paymentService = new PaymentServiceStub();

    // Локальные сервисы
    const jwtService = new JWTService();
    const cacheService = new CacheService();

    // Репозитории
    const authRepository = new AuthRepositoryImpl(authService, jwtService);
    const userRepository = new UserRepositoryImpl(userService, cacheService);
    const orderRepository = new OrderRepositoryImpl(orderService, cacheService);
    const paymentRepository = new PaymentRepositoryImpl(paymentService, cacheService);

    // UseCase
    const authUseCase = new AuthUseCase(authRepository, userRepository);
    const orderUseCase = new OrderUseCase(orderRepository, paymentRepository);
    const paymentUseCase = new PaymentUseCase(paymentRepository);

    // Регистрация сервисов
    this.register('authService', authService);
    this.register('userService', userService);
    this.register('orderService', orderService);
    this.register('paymentService', paymentService);
    this.register('authRepository', authRepository);
    this.register('userRepository', userRepository);
    this.register('orderRepository', orderRepository);
    this.register('paymentRepository', paymentRepository);
    this.register('authUseCase', authUseCase);
    this.register('orderUseCase', orderUseCase);
    this.register('paymentUseCase', paymentUseCase);
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

## 🎯 **ПРЕИМУЩЕСТВА ПОДХОДА**

### **1. Независимость от бэкенда**
- ✅ Можно разрабатывать фронтенд параллельно
- ✅ Нет блокировки на API
- ✅ Полный контроль над данными

### **2. Легкая замена на gRPC**
- ✅ Интерфейсы уже готовы
- ✅ Заглушки легко заменить на реальные сервисы
- ✅ Минимальные изменения в коде

### **3. Тестирование**
- ✅ Можно тестировать все сценарии
- ✅ Предсказуемые данные
- ✅ Быстрые тесты без сети

### **4. Подготовка к продакшену**
- ✅ Архитектура готова для gRPC
- ✅ Обработка ошибок настроена
- ✅ Кэширование реализовано

---

## 🚀 **СЛЕДУЮЩИЕ ШАГИ**

1. **Создать структуру папок** - подготовить архитектуру
2. **Реализовать заглушки** - создать все интерфейсы
3. **Мигрировать компоненты** - перенести UI
4. **Протестировать** - убедиться в работоспособности

**Готовы начать с создания структуры и заглушек?**
