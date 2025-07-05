# Стили FixDrive

Этот каталог содержит все стили приложения, организованные по категориям для лучшей структуры и поддерживаемости.

## Структура

```
src/styles/
├── components/          # Стили для переиспользуемых компонентов
│   ├── Button.styles.ts
│   ├── InputField.styles.ts
│   └── AppCard.styles.ts
├── screens/            # Стили для экранов
│   ├── auth/          # Экран аутентификации
│   │   ├── LoginScreen.styles.ts
│   │   ├── RoleSelectScreen.styles.ts
│   │   ├── ClientRegisterScreen.styles.ts
│   │   └── DriverRegisterScreen.styles.ts
│   ├── chat/          # Экран чатов
│   │   ├── ChatListScreen.styles.ts
│   │   └── ChatScreen.styles.ts
│   ├── profile/       # Экран профиля
│   │   └── ClientProfileScreen.styles.ts
│   └── MapScreen.styles.ts
├── navigation/         # Стили для навигации
│   └── TabBar.styles.ts
└── index.ts           # Экспорт всех стилей
```

## Использование

### Импорт стилей

```typescript
// Импорт конкретных стилей
import { LoginScreenStyles } from '../styles/screens/LoginScreen.styles';
import { ButtonStyles } from '../styles/components/Button.styles';

// Импорт всех стилей
import * as Styles from '../styles';
```

### Применение стилей

```typescript
// В компоненте
<View style={LoginScreenStyles.container}>
  <Text style={LoginScreenStyles.title}>Заголовок</Text>
  <TouchableOpacity style={ButtonStyles.button}>
    <Text style={ButtonStyles.buttonText}>Кнопка</Text>
  </TouchableOpacity>
</View>
```

## Цветовая схема

Все стили используют централизованную цветовую схему из `src/constants/colors.ts`:

- `lightColors.primary` - основной цвет
- `lightColors.secondary` - вторичный цвет
- `lightColors.background` - фон
- `lightColors.surface` - поверхность карточек
- `lightColors.text` - основной текст
- `lightColors.textSecondary` - вторичный текст
- `lightColors.border` - границы
- `lightColors.error` - ошибки
- `lightColors.success` - успех
- `lightColors.warning` - предупреждения

## Принципы

1. **Разделение ответственности** - стили отделены от логики компонентов
2. **Переиспользование** - общие стили вынесены в отдельные файлы
3. **Консистентность** - единая цветовая схема и размеры
4. **Масштабируемость** - легко добавлять новые стили
5. **Поддерживаемость** - четкая структура и именование

## Добавление новых стилей

1. Создайте файл стилей в соответствующей папке
2. Импортируйте `lightColors` из констант
3. Экспортируйте объект стилей
4. Добавьте экспорт в `index.ts`
5. Используйте в компоненте

## Пример создания стилей

```typescript
import { StyleSheet } from 'react-native';
import { lightColors } from '../../constants/colors';

export const MyComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightColors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: lightColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 