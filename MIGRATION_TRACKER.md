# 🔄 Трекер Миграции FixDrive

## 📋 Цель
Отслеживать миграцию компонентов и экранов, предотвращать дубликаты ключей переводов и компонентов.

---

## 🎯 **ПРИОРИТЕТ 1: RoleSelectScreen**

### **📁 Структура файлов:**
- [ ] `src/presentation/screens/auth/RoleSelectScreen.tsx`
- [ ] `src/presentation/screens/auth/RoleSelectScreen.styles.ts`
- [ ] `src/presentation/components/ui/Button.tsx`
- [ ] `src/presentation/components/ui/Button.styles.ts`
- [ ] `src/presentation/components/ui/LanguageSelector.tsx`
- [ ] `src/presentation/components/ui/LanguageSelector.styles.ts`

### **🔑 Ключи переводов (RoleSelectScreen):**
- [ ] `common.roleSelect.clientTitle`
- [ ] `common.roleSelect.clientSubtitle`
- [ ] `common.roleSelect.clientSafe`
- [ ] `common.roleSelect.clientTracking`
- [ ] `common.roleSelect.driverTitle`
- [ ] `common.roleSelect.driverSubtitle`
- [ ] `common.roleSelect.driverEarnings`
- [ ] `common.roleSelect.driverFlexible`
- [ ] `common.roleSelect.loginButton`
- [ ] `common.roleSelect.registerButton`

### **🧩 Компоненты (RoleSelectScreen):**
- [x] `Button` - кнопка ✅
- [x] `LanguageSelector` - селектор языка ✅
- [x] `LanguageButton` - кнопка языка ✅

---

## 📊 **ОТСЛЕЖИВАНИЕ ДУБЛИКАТОВ**

### **🔑 Ключи переводов:**
```typescript
// Файл: src/shared/i18n/translationKeys.ts
export const TRANSLATION_KEYS = {
  // Аутентификация
  AUTH: {
    ROLE_SELECT: {
      CLIENT_TITLE: 'common.roleSelect.clientTitle',
      CLIENT_SUBTITLE: 'common.roleSelect.clientSubtitle',
      CLIENT_SAFE: 'common.roleSelect.clientSafe',
      CLIENT_TRACKING: 'common.roleSelect.clientTracking',
      DRIVER_TITLE: 'common.roleSelect.driverTitle',
      DRIVER_SUBTITLE: 'common.roleSelect.driverSubtitle',
      DRIVER_EARNINGS: 'common.roleSelect.driverEarnings',
      DRIVER_FLEXIBLE: 'common.roleSelect.driverFlexible',
      LOGIN_BUTTON: 'common.roleSelect.loginButton',
      REGISTER_BUTTON: 'common.roleSelect.registerButton',
    },
    LOGIN: {
      // Добавим позже
    },
  },
  // Общие
  COMMON: {
    BUTTONS: {
      LOGIN: 'common.buttons.login',
      REGISTER: 'common.buttons.register',
      CANCEL: 'common.buttons.cancel',
      SAVE: 'common.buttons.save',
    },
  },
};
```

### **🧩 Компоненты:**
```typescript
// Файл: src/presentation/components/index.ts
export { Button } from './ui/Button';
export { LanguageSelector } from './ui/LanguageSelector';
export { LanguageButton } from './ui/LanguageButton';
export { AppCard } from './ui/AppCard';
export { AppAvatar } from './ui/AppAvatar';
```

---

## 🚀 **ПЛАН МИГРАЦИИ**

### **Этап 1: Создание структуры**
1. ✅ Создать папки в `src/presentation/`
2. ✅ Создать файл отслеживания ключей
3. ✅ Создать файл отслеживания компонентов

### **Этап 2: Базовые компоненты**
1. [x] Button.tsx + Button.styles.ts ✅
2. [x] LanguageSelector.tsx + LanguageSelector.styles.ts ✅
3. [x] LanguageButton.tsx + LanguageButton.styles.ts ✅

### **Этап 3: RoleSelectScreen**
1. [x] RoleSelectScreen.tsx ✅
2. [x] RoleSelectScreen.styles.ts ✅
3. [x] Подключить AuthUseCase ✅
4. [ ] Протестировать

---

## 🔍 **ПРОВЕРКА ДУБЛИКАТОВ**

### **Автоматическая проверка:**
```bash
# Проверка дубликатов ключей переводов
grep -r "common\." src/presentation/ | sort | uniq -d

# Проверка дубликатов компонентов
find src/presentation/ -name "*.tsx" | grep -E "(Button|Card|Modal)" | sort
```

### **Ручная проверка:**
- [ ] Проверять TRANSLATION_KEYS перед добавлением
- [ ] Проверять index.ts файлы компонентов
- [ ] Использовать TypeScript для проверки импортов

---

## 📝 **ЗАМЕТКИ**
- Все ключи переводов должны быть в TRANSLATION_KEYS
- Все компоненты должны быть в index.ts файлах
- Использовать TypeScript для предотвращения дубликатов
- Тестировать каждый компонент после создания

## 🌐 **I18N СТРАТЕГИЯ**

### **Правила для переводов:**
1. **Используем правильные ключи** из `TRANSLATION_KEYS`
2. **Временные переводы** в `src/shared/i18n/index.ts`
3. **Нет дубликатов** - один ключ = один перевод
4. **Консистентность** - одинаковые слова = одинаковые ключи

### **Пример использования:**
```typescript
import { useI18n } from '@/shared/i18n';
import { TRANSLATION_KEYS } from '@/shared/i18n/translationKeys';

const Component = () => {
  const { t } = useI18n();
  
  return (
    <Text>{t(TRANSLATION_KEYS.AUTH.ROLE_SELECT.CLIENT_TITLE)}</Text>
  );
};
```

### **План i18n:**
1. ✅ Создать правильную архитектуру
2. [ ] Использовать правильные ключи в компонентах
3. [ ] В конце создать полные файлы переводов
4. [ ] Убрать дубликаты из старого кода

## 💾 **ASYNCSTORAGE СИСТЕМА**

### **✅ Что создано:**
1. ✅ **AsyncStorageService** - основной сервис
2. ✅ **STORAGE_KEYS** - константы ключей
3. ✅ **CacheItem<T>** - типы для кэширования
4. ✅ **TTL поддержка** - автоматическое истечение кэша
5. ✅ **AuthRepository** - обновлен для AsyncStorage
6. ✅ **AuthUseCase** - обновлен для async операций

### **🎯 Возможности:**
- ✅ **Постоянное хранение** - данные не теряются при перезапуске
- ✅ **Кэширование с TTL** - автоматическое обновление
- ✅ **Офлайн поддержка** - работает без интернета
- ✅ **Batch операции** - массовые операции
- ✅ **Очистка кэша** - автоматическая очистка устаревших данных

## 🔄 **СИСТЕМА ПЕРЕКЛЮЧЕНИЯ АРХИТЕКТУР**

### **✅ Что создано:**
1. ✅ **Feature Flag** - `USE_NEW_ARCHITECTURE = true/false`
2. ✅ **NewApp** - новый компонент приложения
3. ✅ **OldApp** - старый компонент приложения
4. ✅ **Безопасное переключение** - без потери данных

### **🎯 Как использовать:**
```typescript
// В app/App.tsx
const USE_NEW_ARCHITECTURE = true; // Новый код
const USE_NEW_ARCHITECTURE = false; // Старый код
```

### **📱 Что видите сейчас:**
- ✅ **Новый экран** - показывает прогресс миграции
- ✅ **Старый экран** - показывает оригинальное приложение
- ✅ **Консоль логи** - показывает какая архитектура используется
