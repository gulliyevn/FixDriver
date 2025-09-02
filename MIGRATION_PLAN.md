# 🚀 ПЛАН МИГРАЦИИ FIXDRIVE

## 📅 **ОБЩИЙ ТАЙМЛАЙН**

### **Общая продолжительность:** 12-15 дней
### **Команда:** 1 разработчик
### **Риски:** Средние (есть тесты)

---

## 🎯 **ФАЗА 1: ПОДГОТОВКА (1 день)**

### **День 1: Создание новой структуры**

#### **1.1 Создание папок**
```bash
mkdir -p src-new/{presentation,domain,data,shared,core}
mkdir -p src-new/presentation/{components,screens,navigation,styles}
mkdir -p src-new/presentation/components/{ui,forms,modals,cards}
mkdir -p src-new/presentation/screens/{auth,client,driver,common}
mkdir -p src-new/domain/{entities,usecases,repositories,services}
mkdir -p src-new/domain/entities/{user,order,payment,chat}
mkdir -p src-new/domain/usecases/{auth,profile,booking,payment}
mkdir -p src-new/data/{repositories,datasources,mappers}
mkdir -p src-new/data/datasources/{api,local,cache}
mkdir -p src-new/shared/{constants,utils,types,i18n,config}
mkdir -p src-new/core/{context,hooks,providers,container}
```

#### **1.2 Создание базовых файлов**
- [ ] `src-new/shared/types/index.ts` - базовые типы
- [ ] `src-new/shared/constants/index.ts` - базовые константы
- [ ] `src-new/core/container/ServiceContainer.ts` - DI контейнер
- [ ] `src-new/shared/config/environment.ts` - конфигурация

#### **1.3 Настройка конфигурации**
- [ ] Обновить `tsconfig.json` для новой структуры
- [ ] Создать `src-new/index.ts` - barrel exports
- [ ] Настроить пути в `package.json`

---

## 🔧 **ФАЗА 2: МИГРАЦИЯ БАЗОВЫХ ФАЙЛОВ (2 дня)**

### **День 2: Константы и типы**

#### **2.1 Миграция констант**
- [ ] `src/constants/colors.ts` → `src-new/shared/constants/colors.ts`
- [ ] `src/constants/index.ts` → `src-new/shared/constants/index.ts`
- [ ] `src/constants/tripPricing.ts` → `src-new/shared/constants/pricing.ts`
- [ ] `src/constants/vipPackages.ts` → `src-new/shared/constants/packages.ts`

#### **2.2 Миграция типов**
- [ ] `src/types/user.ts` → `src-new/shared/types/user.ts`
- [ ] `src/types/order.ts` → `src-new/shared/types/order.ts`
- [ ] `src/types/chat.ts` → `src-new/shared/types/chat.ts`
- [ ] `src/types/payment.ts` → `src-new/shared/types/payment.ts`
- [ ] `src/types/navigation.ts` → `src-new/shared/types/navigation.ts`

#### **2.3 Создание barrel exports**
```typescript
// src-new/shared/constants/index.ts
export * from './colors';
export * from './pricing';
export * from './packages';

// src-new/shared/types/index.ts
export * from './user';
export * from './order';
export * from './chat';
export * from './payment';
export * from './navigation';
```

### **День 3: Утилиты и конфигурация**

#### **3.1 Миграция утилит**
- [ ] `src/utils/formatters.ts` → `src-new/shared/utils/formatters.ts`
- [ ] `src/utils/validators.ts` → `src-new/shared/utils/validators.ts`
- [ ] `src/utils/storageKeys.ts` → `src-new/shared/utils/storage.ts`
- [ ] `src/utils/countries.ts` → `src-new/shared/utils/countries.ts`

#### **3.2 Миграция конфигурации**
- [ ] `src/config/environment.ts` → `src-new/shared/config/environment.ts`
- [ ] `src/config/security.ts` → `src-new/shared/config/security.ts`
- [ ] `src/config/database.ts` → `src-new/shared/config/database.ts`

#### **3.3 Создание ServiceContainer**
```typescript
// src-new/core/container/ServiceContainer.ts
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

## 🏗️ **ФАЗА 3: МИГРАЦИЯ СЕРВИСОВ (4 дня)**

### **День 4: Создание интерфейсов**

#### **4.1 Интерфейсы репозиториев**
```typescript
// src-new/domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
}

// src-new/domain/repositories/ILocationRepository.ts
export interface ILocationRepository {
  getCurrentLocation(): Promise<Location>;
  getAddressFromCoords(coords: Coordinates): Promise<Address>;
  getCoordsFromAddress(address: string): Promise<Coordinates>;
  calculateDistance(from: Coordinates, to: Coordinates): Promise<number>;
}

// src-new/domain/repositories/IOrderRepository.ts
export interface IOrderRepository {
  getOrders(filters?: OrderFilters): Promise<Order[]>;
  createOrder(orderData: CreateOrderData): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  cancelOrder(id: string): Promise<void>;
}
```

#### **4.2 Интерфейсы UseCase**
```typescript
// src-new/domain/usecases/auth/IAuthUseCase.ts
export interface IAuthUseCase {
  login(email: string, password: string): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}

// src-new/domain/usecases/map/IMapUseCase.ts
export interface IMapUseCase {
  getCurrentLocation(): Promise<Location>;
  searchAddresses(query: string): Promise<Address[]>;
  calculateRoute(from: Address, to: Address): Promise<Route>;
}
```

### **День 5: Реализация репозиториев**

#### **5.1 AuthRepository**
```typescript
// src-new/data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private apiClient: APIClient,
    private jwtService: JWTService
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.apiClient.post('/auth/login', credentials);
    await this.jwtService.saveToken(response.token);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.apiClient.post('/auth/register', userData);
    await this.jwtService.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.jwtService.clearToken();
  }
}
```

#### **5.2 LocationRepository**
```typescript
// src-new/data/repositories/LocationRepositoryImpl.ts
export class LocationRepositoryImpl implements ILocationRepository {
  constructor(
    private mapService: MapService,
    private placesService: PlacesService
  ) {}

  async getCurrentLocation(): Promise<Location> {
    return await this.mapService.getCurrentLocation();
  }

  async getAddressFromCoords(coords: Coordinates): Promise<Address> {
    return await this.placesService.reverseGeocode(coords);
  }

  async getCoordsFromAddress(address: string): Promise<Coordinates> {
    return await this.placesService.geocode(address);
  }
}
```

### **День 6: Реализация UseCase**

#### **6.1 AuthUseCase**
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
      const user = await this.userRepository.getUser(response.userId);
      return { success: true, user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const response = await this.authRepository.register(userData);
      const user = await this.userRepository.createUser(userData);
      return { success: true, user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

#### **6.2 MapUseCase**
```typescript
// src-new/domain/usecases/map/MapUseCase.ts
export class MapUseCase implements IMapUseCase {
  constructor(
    private locationRepository: ILocationRepository,
    private routeRepository: IRouteRepository
  ) {}

  async getCurrentLocation(): Promise<Location> {
    return await this.locationRepository.getCurrentLocation();
  }

  async searchAddresses(query: string): Promise<Address[]> {
    // Бизнес-логика поиска адресов
    return await this.locationRepository.searchAddresses(query);
  }

  async calculateRoute(from: Address, to: Address): Promise<Route> {
    const fromCoords = await this.locationRepository.getCoordsFromAddress(from);
    const toCoords = await this.locationRepository.getCoordsFromAddress(to);
    return await this.routeRepository.calculateRoute(fromCoords, toCoords);
  }
}
```

### **День 7: Настройка DI и тестирование**

#### **7.1 Настройка ServiceContainer**
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
    // Репозитории
    const apiClient = new APIClient();
    const jwtService = new JWTService();
    
    const authRepository = new AuthRepositoryImpl(apiClient, jwtService);
    const locationRepository = new LocationRepositoryImpl();
    const orderRepository = new OrderRepositoryImpl(apiClient);

    // UseCase
    const authUseCase = new AuthUseCase(authRepository);
    const mapUseCase = new MapUseCase(locationRepository);

    // Регистрация сервисов
    this.register('authRepository', authRepository);
    this.register('locationRepository', locationRepository);
    this.register('orderRepository', orderRepository);
    this.register('authUseCase', authUseCase);
    this.register('mapUseCase', mapUseCase);
  }

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  get<T>(key: string): T {
    return this.services.get(key);
  }
}
```

#### **7.2 Тестирование сервисов**
- [ ] Создать тесты для AuthUseCase
- [ ] Создать тесты для MapUseCase
- [ ] Проверить все зависимости
- [ ] Убедиться в отсутствии циклов

---

## 🎨 **ФАЗА 4: МИГРАЦИЯ КОМПОНЕНТОВ (5 дней)**

### **День 8: Базовые UI компоненты**

#### **8.1 Миграция базовых компонентов**
- [ ] `src/components/Button.tsx` → `src-new/presentation/components/ui/Button.tsx`
- [ ] `src/components/Select.tsx` → `src-new/presentation/components/ui/Select.tsx`
- [ ] `src/components/DatePicker.tsx` → `src-new/presentation/components/ui/DatePicker.tsx`
- [ ] `src/components/TimePicker.tsx` → `src-new/presentation/components/ui/TimePicker.tsx`

#### **8.2 Создание общих стилей**
```typescript
// src-new/presentation/styles/ui/index.ts
export * from './Button.styles';
export * from './Select.styles';
export * from './DatePicker.styles';
export * from './TimePicker.styles';
```

### **День 9: Формы и модальные окна**

#### **9.1 Миграция форм**
- [ ] `src/components/AddressAutocomplete.tsx` → `src-new/presentation/components/forms/AddressAutocomplete.tsx`
- [ ] `src/components/FixDriveAddressInput.tsx` → `src-new/presentation/components/forms/AddressInput.tsx`
- [ ] `src/components/FixDriveDropdown.tsx` → `src-new/presentation/components/forms/Dropdown.tsx`

#### **9.2 Миграция модальных окон**
- [ ] `src/components/AddressModal.tsx` → `src-new/presentation/components/modals/AddressModal.tsx`
- [ ] `src/components/NotificationsModal.tsx` → `src-new/presentation/components/modals/NotificationsModal.tsx`
- [ ] `src/components/RulesModal.tsx` → `src-new/presentation/components/modals/RulesModal.tsx`

### **День 10: Карточки и специализированные компоненты**

#### **10.1 Миграция карточек**
- [ ] `src/components/VipPackages.tsx` → `src-new/presentation/components/cards/VipPackages.tsx`
- [ ] `src/components/AppCard.tsx` → `src-new/presentation/components/cards/AppCard.tsx`
- [ ] `src/components/BalanceCardDecoration.tsx` → `src-new/presentation/components/cards/BalanceCard.tsx`

#### **10.2 Миграция специализированных компонентов**
- [ ] `src/components/MapView/` → `src-new/presentation/components/ui/MapView/`
- [ ] `src/components/LanguageSelector.tsx` → `src-new/presentation/components/ui/LanguageSelector.tsx`
- [ ] `src/components/PhotoUpload.tsx` → `src-new/presentation/components/ui/PhotoUpload.tsx`

### **День 11: Экраны (часть 1)**

#### **11.1 Миграция экранов авторизации**
- [ ] `src/screens/auth/LoginScreen.tsx` → `src-new/presentation/screens/auth/LoginScreen.tsx`
- [ ] `src/screens/auth/RegisterScreen.tsx` → `src-new/presentation/screens/auth/RegisterScreen.tsx`
- [ ] `src/screens/auth/ForgotPasswordScreen.tsx` → `src-new/presentation/screens/auth/ForgotPasswordScreen.tsx`

#### **11.2 Миграция клиентских экранов (часть 1)**
- [ ] `src/screens/client/SettingsScreen.tsx` → `src-new/presentation/screens/client/SettingsScreen.tsx`
- [ ] `src/screens/client/AboutScreen.tsx` → `src-new/presentation/screens/client/AboutScreen.tsx`
- [ ] `src/screens/client/HelpScreen.tsx` → `src-new/presentation/screens/client/HelpScreen.tsx`

### **День 12: Экраны (часть 2)**

#### **12.1 Миграция критичных экранов**
- [ ] `src/screens/client/BalanceScreen.tsx` → `src-new/presentation/screens/client/BalanceScreen.tsx`
- [ ] `src/screens/client/DriversScreen.tsx` → `src-new/presentation/screens/client/DriversScreen.tsx`
- [ ] `src/screens/client/CardsScreen.tsx` → `src-new/presentation/screens/client/CardsScreen.tsx`

#### **12.2 Разбиение монолитных экранов**
```typescript
// BalanceScreen разбить на:
// - BalanceScreen.tsx (основной экран)
// - components/BalanceCard.tsx (карта баланса)
// - components/BalanceActions.tsx (действия)
// - components/BalanceHistory.tsx (история)
// - hooks/useBalanceScreen.ts (логика)
```

---

## 🔧 **ФАЗА 5: ОПТИМИЗАЦИЯ (2 дня)**

### **День 13: Разбиение монолитных файлов**

#### **13.1 Разбиение BalanceScreen**
```typescript
// src-new/presentation/screens/client/BalanceScreen/
├── index.tsx              # Основной экран (150 строк)
├── components/
│   ├── BalanceCard.tsx    # Карта баланса (100 строк)
│   ├── BalanceActions.tsx # Действия (80 строк)
│   └── BalanceHistory.tsx # История (120 строк)
├── hooks/
│   └── useBalanceScreen.ts # Логика (100 строк)
└── styles/
    └── BalanceScreen.styles.ts # Стили (150 строк)
```

#### **13.2 Разбиение FixDriveMapInput**
```typescript
// src-new/presentation/components/forms/FixDriveMapInput/
├── index.tsx              # Основной компонент (150 строк)
├── components/
│   ├── MapContainer.tsx   # Контейнер карты (100 строк)
│   ├── AddressList.tsx    # Список адресов (80 строк)
│   └── MapControls.tsx    # Элементы управления (70 строк)
├── hooks/
│   ├── useMapInput.ts     # Основная логика (120 строк)
│   └── useAddresses.ts    # Логика адресов (100 строк)
└── styles/
    └── FixDriveMapInput.styles.ts # Стили (100 строк)
```

### **День 14: Удаление дублирования**

#### **14.1 Объединение похожих компонентов**
- [ ] Объединить `DriverListItem` и `DriverInfoBar`
- [ ] Создать общий `Card` компонент
- [ ] Унифицировать стили модальных окон

#### **14.2 Создание общих хуков**
```typescript
// src-new/core/hooks/useAsync.ts
export const useAsync = <T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error };
};
```

---

## 🧪 **ФАЗА 6: ТЕСТИРОВАНИЕ И ФИНАЛИЗАЦИЯ (2 дня)**

### **День 15: Тестирование**

#### **15.1 Запуск тестов**
- [ ] Запустить все существующие тесты
- [ ] Создать тесты для новых компонентов
- [ ] Проверить покрытие кода

#### **15.2 Проверка функциональности**
- [ ] Проверить все основные экраны
- [ ] Протестировать навигацию
- [ ] Убедиться в работе авторизации

### **День 16: Финальная миграция**

#### **16.1 Замена папок**
```bash
# Создать резервную копию
mv src src-backup

# Переименовать новую структуру
mv src-new src

# Обновить импорты в app/App.tsx
```

#### **16.2 Обновление конфигурации**
- [ ] Обновить `tsconfig.json`
- [ ] Проверить `package.json`
- [ ] Обновить `metro.config.js`

#### **16.3 Финальная проверка**
- [ ] Запустить приложение
- [ ] Проверить все функции
- [ ] Убедиться в отсутствии ошибок

---

## 📊 **МЕТРИКИ УСПЕХА**

### **До рефактора:**
- **Максимальный размер файла:** 881 строка
- **Средний размер файла:** 160 строк
- **Циклические зависимости:** 3
- **Глубина импортов:** до 5 уровней

### **После рефактора:**
- **Максимальный размер файла:** 300 строк
- **Средний размер файла:** 150 строк
- **Циклические зависимости:** 0
- **Глубина импортов:** до 2 уровней

---

## 🚨 **РИСКИ И МИТИГАЦИЯ**

### **Риски:**
1. **Потеря функциональности** - создание резервных копий
2. **Ошибки в импортах** - пошаговое тестирование
3. **Увеличение времени сборки** - оптимизация

### **Митогирование:**
1. **Резервные копии** на каждом этапе
2. **Пошаговое тестирование** после каждого файла
3. **Постепенная миграция** без полной замены

---

## 🎯 **СЛЕДУЮЩИЕ ШАГИ**

1. **Подтвердить план** - согласовать подход
2. **Создать резервную копию** - `git branch backup-before-refactor`
3. **Начать с Фазы 1** - создание структуры
4. **Пошагово мигрировать** - файл за файлом

**Готовы начать с создания новой структуры?**
