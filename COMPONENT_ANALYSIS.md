# 🔍 Анализ Компонентов и Экранов FixDrive

## 📋 Цель
Проанализировать что реально рендерится в приложении и создать чистый код с новой архитектурой.

## 🎯 Стратегия
1. **Анализ экранов** - что показывается пользователю
2. **Выборка нужного** - только рабочие компоненты
3. **Создание чистого кода** - с новой архитектурой
4. **Подготовка к бэкенду** - с заглушками

---

## 📱 Экраны для анализа

### 👤 **Клиентские экраны:**
- [ ] **BalanceScreen.tsx** (620 строк) - баланс и пополнение
- [ ] **DriversScreen.tsx** (619 строк) - выбор водителей
- [ ] **PaymentHistoryScreen.tsx** (250 строк) - история платежей
- [ ] **CardsScreen.tsx** (469 строк) - карты оплаты
- [ ] **SettingsScreen.tsx** (311 строк) - настройки
- [ ] **TripsScreen.tsx** (214 строк) - поездки
- [ ] **AddressPickerScreen.tsx** (333 строки) - выбор адреса
- [ ] **ChangePasswordScreen.tsx** (248 строк) - смена пароля
- [ ] **AboutScreen.tsx** (190 строк) - о приложении
- [ ] **HelpScreen.tsx** (191 строка) - помощь
- [ ] **ResidenceScreen.tsx** (237 строк) - место жительства

### 🚗 **Водительские экраны:**
- [ ] **DriverProfileScreen.tsx** (214 строк) - профиль водителя

### 👤 **Профили:**
- [ ] **ClientProfileScreen.tsx** (214 строк) - профиль клиента
- [ ] **EditClientProfileScreen.tsx** (534 строки) - редактирование профиля клиента
- [ ] **EditDriverProfileScreen.tsx** (489 строк) - редактирование профиля водителя
- [ ] **DriverVehiclesScreen.tsx** (239 строк) - транспорт водителя
- [ ] **PremiumPackagesScreen.tsx** (440 строк) - премиум пакеты

### 🔐 **Аутентификация:**
- [ ] **LoginScreen.tsx** (247 строк) - вход
- [ ] **ClientRegisterScreen.tsx** (253 строки) - регистрация клиента
- [ ] **DriverRegisterScreen.tsx** (288 строк) - регистрация водителя
- [ ] **RoleSelectScreen.tsx** (200 строк) - выбор роли
- [ ] **OTPVerificationScreen.tsx** (173 строки) - верификация OTP
- [ ] **ForgotPasswordScreen.tsx** (189 строк) - восстановление пароля

### 🔄 **Общие экраны:**
- [ ] **NotificationsScreen.tsx** (353 строки) - уведомления
- [ ] **SupportChatScreen.tsx** (587 строк) - чат поддержки
- [ ] **ChatScreen.tsx** (578 строк) - чат
- [ ] **ChatListScreen.tsx** (445 строк) - список чатов

### 🗺️ **Карта и заказы:**
- [ ] **FixDriveScreen/index.tsx** (397 строк) - главный экран FixDrive
- [ ] **OrdersMapScreen/index.tsx** (107 строк) - карта заказов
- [ ] **ScheduleScreen.tsx** (43 строки) - расписание

### 💰 **Заработки:**
- [ ] **EarningsScreen.tsx** (525 строк) - экран заработков

---

## 🧩 Компоненты для анализа

### 🎨 **UI компоненты:**
- [ ] **Button.tsx** (194 строки) - кнопки
- [ ] **AppCard.tsx** (94 строки) - карточки
- [ ] **AppAvatar.tsx** (81 строка) - аватар
- [ ] **Select.tsx** (260 строк) - выпадающий список
- [ ] **ToggleButton.tsx** (112 строк) - переключатель
- [ ] **DatePicker.tsx** (245 строк) - выбор даты
- [ ] **TimePicker.tsx** (247 строк) - выбор времени
- [ ] **PhotoUpload.tsx** (140 строк) - загрузка фото
- [ ] **ErrorDisplay.tsx** (144 строки) - отображение ошибок
- [ ] **LoadingFooter.tsx** (21 строка) - загрузка
- [ ] **DynamicStatusBar.tsx** (17 строк) - статус бар

### 🗺️ **Карта и адреса:**
- [ ] **FixDriveMapInput.tsx** (683 строки) - карта с вводом
- [ ] **AddressAutocomplete.tsx** (468 строк) - автодополнение адресов
- [ ] **FixDriveAddressInput.tsx** (189 строк) - ввод адреса
- [ ] **AddressModal.tsx** (454 строки) - модальное окно адреса
- [ ] **MapView/index.tsx** (331 строка) - основная карта
- [ ] **MapView/components/MapMarkers.tsx** (101 строка) - маркеры карты
- [ ] **MapView/components/MapControls.tsx** (73 строки) - элементы управления картой

### 💳 **Платежи и баланс:**
- [ ] **BalanceCardDecoration.tsx** (223 строки) - декорации карты баланса
- [ ] **BalanceTopUpHistory.tsx** (162 строки) - история пополнений
- [ ] **PaymentHistoryFilter.tsx** (285 строк) - фильтр истории платежей
- [ ] **VipPackages.tsx** (314 строк) - VIP пакеты

### 🚗 **Водители и заказы:**
- [ ] **DriversHeader.tsx** (142 строки) - заголовок водителей
- [ ] **DriversSearchBar.tsx** (37 строк) - поиск водителей
- [ ] **DriversSelectionBar.tsx** (36 строк) - выбор водителей
- [ ] **TripsFilter.tsx** (239 строк) - фильтр поездок
- [ ] **EarningsHeader.tsx** (126 строк) - заголовок заработков
- [ ] **DriverModal/index.tsx** (404 строки) - модальное окно водителя
- [ ] **DriverModal/components/DriverCallSheet.tsx** (76 строк) - вызов водителя

### 💰 **Заработки:**
- [ ] **EarningsScreen/components/EarningsListContainer.tsx** (225 строк) - список заработков
- [ ] **EarningsScreen/components/EarningsDetailView.tsx** (322 строки) - детали заработков
- [ ] **EarningsScreen/components/EarningsStats.tsx** (258 строк) - статистика заработков
- [ ] **EarningsScreen/components/EarningsLevel.tsx** (203 строки) - уровень заработков
- [ ] **EarningsScreen/components/EarningsProgressLine.tsx** (154 строки) - прогресс заработков

### 🔐 **Аутентификация:**
- [ ] **SocialAuthButtons.tsx** (96 строк) - соц. авторизация
- [ ] **PasswordStrengthIndicator.tsx** (125 строк) - индикатор пароля
- [ ] **AgreementCheckbox.tsx** (87 строк) - чекбокс соглашения

### 🎯 **Модальные окна:**
- [ ] **DayEndModal.tsx** (136 строк) - модальное окно конца дня
- [ ] **NotificationsModal.tsx** (72 строки) - модальное окно уведомлений
- [ ] **RulesModal.tsx** (105 строк) - модальное окно правил
- [ ] **SafetyHelpModal.tsx** (134 строки) - модальное окно безопасности
- [ ] **PaymentHelpModal.tsx** (105 строк) - модальное окно помощи по платежам
- [ ] **BookingHelpModal.tsx** (105 строк) - модальное окно помощи по бронированию

### 📅 **Расписание и планирование:**
- [ ] **FixDriveScreen/components/FixDriveConfirm.tsx** (427 строк) - подтверждение FixDrive
- [ ] **FixDriveScreen/components/WeekDaysSelector.tsx** (221 строка) - выбор дней недели
- [ ] **FixDriveScreen/components/ScheduleTypeSelector.tsx** (227 строк) - выбор типа расписания
- [ ] **FixDriveScreen/components/CustomizationModal.tsx** (207 строк) - настройка
- [ ] **FixDriveScreen/components/ProgressBar.tsx** (88 строк) - прогресс бар
- [ ] **FixDriveScreen/components/FixDriveAddressPage.tsx** (213 строк) - страница адреса
- [ ] **FixDriveScreen/components/sections/FlexibleScheduleSection.tsx** (244 строки) - гибкое расписание
- [ ] **FixDriveScreen/components/sections/WeekdaysSection.tsx** (98 строк) - дни недели

### 🗺️ **Карта заказов:**
- [ ] **OrdersMapScreen/components/MapControls.tsx** (214 строк) - элементы управления картой заказов
- [ ] **OrdersMapScreen/components/ReportModal.tsx** (90 строк) - модальное окно отчета
- [ ] **OrdersMapScreen/components/SimpleDialog.tsx** (58 строк) - простой диалог

---

## 📊 Статус анализа

### ✅ **Готово к анализу:**
- [ ] Найти все экраны в src1/screens/
- [ ] Определить какие компоненты используются
- [ ] Выявить неиспользуемые файлы
- [ ] Составить план миграции

### ⏳ **Следующий шаг:**
- [ ] Начать анализ с главных экранов
- [ ] Скопировать рабочий код
- [ ] Адаптировать под новую архитектуру

---

## 🚀 План действий

### **Этап 1: Анализ (Сейчас)**
1. ✅ Просмотреть структуру src1/screens/
2. ✅ Определить основные экраны
3. ✅ Найти используемые компоненты

### **Этап 2: Выборка приоритетов**
1. **🔥 КРИТИЧНО (начать с этого):**
   - RoleSelectScreen.tsx - начальный экран
   - LoginScreen.tsx - вход в систему
   - Button.tsx - базовый UI компонент
   - AppCard.tsx, AppAvatar.tsx - базовые UI

2. **⚡ ВАЖНО (второй этап):**
   - OrdersMapScreen - главный экран карты
   - DriversScreen - выбор водителей/заказы
   - EarningsScreen.tsx - экран заработков
   - MapView/index.tsx - компоненты карты

3. **📱 ВАЖНО (третий этап):**
   - ScheduleScreen - расписание
   - ChatStack - чаты
   - ClientProfileStack - профиль клиента
   - DriverProfileStack - профиль водителя

4. **🔄 ДОПОЛНИТЕЛЬНО (четвертый этап):**
   - Остальные экраны и компоненты
   - BalanceScreen, PaymentHistoryScreen
   - Настройки, помощь

### **Этап 3: Миграция**
1. Создать новые экраны в src/presentation/screens/
2. Адаптировать под новую архитектуру
3. Подключить Use Cases и заглушки

## 🎯 **РЕАЛЬНО ИСПОЛЬЗУЕМЫЕ ЭКРАНЫ**

### **🔐 Аутентификация (всегда активны):**
- [ ] **RoleSelectScreen** - выбор роли (начальный экран)
- [ ] **LoginScreen** - вход
- [ ] **ClientRegisterScreen** - регистрация клиента
- [ ] **DriverRegisterScreen** - регистрация водителя
- [ ] **ForgotPasswordScreen** - восстановление пароля
- [ ] **OTPVerificationScreen** - верификация OTP

### **👤 Клиентские экраны (основные табы):**
- [ ] **OrdersMapScreen** - карта заказов (главный таб)
- [ ] **DriversScreen** - выбор водителей (второй таб)
- [ ] **ScheduleScreen** - расписание (третий таб)
- [ ] **ChatStack** - чаты (четвертый таб)
  - [ ] **ChatListScreen** - список чатов
  - [ ] **ChatScreen** - чат
- [ ] **ClientProfileStack** - профиль клиента (пятый таб)
  - [ ] **ClientProfileScreen** - профиль клиента
  - [ ] **CardsScreen** - карты оплаты
  - [ ] **TripsScreen** - поездки
  - [ ] **PaymentHistoryScreen** - история платежей
  - [ ] **SettingsScreen** - настройки
  - [ ] **ResidenceScreen** - место жительства
  - [ ] **HelpScreen** - помощь
  - [ ] **AboutScreen** - о приложении
  - [ ] **BalanceScreen** - баланс
  - [ ] **AddressPickerScreen** - выбор адреса
  - [ ] **ChangePasswordScreen** - смена пароля
  - [ ] **SupportChatScreen** - чат поддержки
  - [ ] **EditClientProfileScreen** - редактирование профиля
  - [ ] **DriverProfileScreen** - профиль водителя
  - [ ] **PremiumPackagesScreen** - премиум пакеты
  - [ ] **NotificationsScreen** - уведомления

### **🚗 Водительские экраны (основные табы):**
- [ ] **OrdersMapScreen** - карта заказов (главный таб)
- [ ] **DriversScreen** - заказы (второй таб)
- [ ] **EarningsScreen** - заработки (третий таб)
- [ ] **ChatStack** - чаты (четвертый таб)
  - [ ] **ChatListScreen** - список чатов
  - [ ] **ChatScreen** - чат
- [ ] **DriverProfileStack** - профиль водителя (пятый таб)
  - [ ] **DriverProfileScreen** - профиль водителя
  - [ ] **CardsScreen** - карты оплаты
  - [ ] **TripsScreen** - поездки
  - [ ] **PaymentHistoryScreen** - история платежей
  - [ ] **SettingsScreen** - настройки
  - [ ] **ResidenceScreen** - место жительства
  - [ ] **HelpScreen** - помощь
  - [ ] **AboutScreen** - о приложении
  - [ ] **BalanceScreen** - баланс
  - [ ] **AddressPickerScreen** - выбор адреса
  - [ ] **ChangePasswordScreen** - смена пароля
  - [ ] **SupportChatScreen** - чат поддержки
  - [ ] **EditDriverProfileScreen** - редактирование профиля водителя
  - [ ] **DriverVehiclesScreen** - транспорт водителя
  - [ ] **PremiumPackagesScreen** - премиум пакеты
  - [ ] **NotificationsScreen** - уведомления

## 🎯 **ПРИОРИТЕТ 1: Начинаем с RoleSelectScreen**

**Почему RoleSelectScreen?**
- Это **начальный экран** приложения
- Показывается всем неавторизованным пользователям
- Самый простой экран
- Основа для всей системы

**План для RoleSelectScreen:**
1. Скопировать код из src1/screens/auth/RoleSelectScreen.tsx
2. Создать новый в src/presentation/screens/auth/
3. Адаптировать под новую архитектуру
4. Подключить AuthUseCase
5. Протестировать

---

## 📊 **ИТОГОВАЯ СТАТИСТИКА**

### **📱 Экраны (всего ~50+ файлов):**
- **Аутентификация:** 6 экранов
- **Основные табы (клиент):** 5 экранов
- **Основные табы (водитель):** 5 экранов
- **Подэкраны профиля (клиент):** 16 экранов
- **Подэкраны профиля (водитель):** 17 экранов
- **Подэкраны чатов:** 2 экрана
- **Общие экраны:** 4 экрана

### **🧩 Компоненты (всего ~60+ файлов):**
- **UI компоненты:** 11 файлов
- **Карта и адреса:** 7 файлов
- **Платежи и баланс:** 4 файла
- **Водители и заказы:** 7 файлов
- **Заработки:** 6 файлов
- **Аутентификация:** 3 файла
- **Модальные окна:** 6 файлов
- **Расписание:** 8 файлов
- **Карта заказов:** 3 файла

### **🔧 Сервисы (всего ~30 файлов):**
- **Основные сервисы:** 25 файлов
- **Водительские сервисы:** 5 файлов
- **Самые большие:** MapService.ts (414 строк), DriverStatsService.ts (431 строк), JWTService.ts (431 строк)

### **🎣 Хуки (всего ~20 файлов):**
- **Основные хуки:** 16 файлов
- **Водительские хуки:** 4 файла
- **Клиентские хуки:** 2 файла
- **Самые большие:** useFamilyMembers.ts (317 строк), useDriverVehicles.ts (283 строк)

### **🌐 Контексты (всего ~8 файлов):**
- **Основные контексты:** 8 файлов
- **Самые большие:** PackageContext.tsx (568 строк), AuthContext.tsx (267 строк)

### **🧭 Навигация (всего ~10 файлов):**
- **Основные навигаторы:** 8 файлов
- **Водительские навигаторы:** 2 файла
- **Самые большие:** TabBar.tsx (245 строк)

### **📝 Типы (всего ~12 файлов):**
- **Основные типы:** 10 файлов
- **Водительские типы:** 2 файла

### **🎨 Стили (всего ~50+ файлов):**
- **Компоненты:** 30+ файлов стилей
- **Экраны:** 20+ файлов стилей
- **Самые большие:** MapView.styles.ts (406 строк), EarningsScreen.styles.ts (443 строк), ChatScreen.styles.ts (470 строк)

### **📈 Самые большие файлы:**
1. **FixDriveMapInput.tsx** - 683 строки
2. **SupportChatScreen.tsx** - 587 строк
3. **ChatScreen.tsx** - 578 строк
4. **EditClientProfileScreen.tsx** - 534 строки
5. **EarningsScreen.tsx** - 525 строк
6. **FixDriveConfirm.tsx** - 427 строк
7. **DriverModal/index.tsx** - 404 строки
8. **FixDriveScreen/index.tsx** - 397 строк
9. **PackageContext.tsx** - 568 строк
10. **DriverStatsService.ts** - 431 строк

## 📝 Заметки
- Фокус на **рабочий код**
- Игнорировать **неиспользуемые файлы**
- Создавать **чистую архитектуру**
- Готовить к **подключению бэкенда**
- **Много больших файлов** - нужно разбивать на компоненты
