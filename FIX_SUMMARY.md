# Исправление смены цвета карт в BalanceScreen

## Проблема
Цвета карт в экране баланса не менялись в зависимости от пакета пользователя, хотя иконки работали правильно.

## Причина
В компоненте `BalanceCardDecoration.tsx` не было обработки суффиксов периода (`_month`, `_year`) в названиях пакетов.

### До исправления:
- `currentPackage` = `"plus_month"` 
- `BalanceCardDecoration` получал `packageType="plus_month"`
- В `getDecorationStyle()` не было case для `"plus_month"`
- Возвращался `default: 'lead'` (свинцовый металл)

### После исправления:
- Добавлена логика `const basePackageType = packageType.replace(/_month$|_year$/, '');`
- Теперь `"plus_month"` → `"plus"` → свинцовый металл
- Теперь `"premium_year"` → `"premium"` → платиновый металл

## Изменения

### 1. Обновлен интерфейс `BalanceCardDecorationProps`:
```tsx
interface BalanceCardDecorationProps {
  isDark?: boolean;
  packageType?: 'free' | 'plus' | 'premium' | 'premiumPlus' | 
                'plus_month' | 'plus_year' | 'premium_month' | 
                'premium_year' | 'premiumPlus_month' | 'premiumPlus_year';
  isBackSide?: boolean;
}
```

### 2. Добавлена обработка периодов:
```tsx
const BalanceCardDecoration: React.FC<BalanceCardDecorationProps> = ({ 
  packageType = 'basic',
  isBackSide = false
}) => {
  // Убираем суффикс периода для определения базового типа пакета
  const basePackageType = packageType.replace(/_month$|_year$/, '');
  
  // Теперь используем basePackageType вместо packageType
  if (basePackageType === 'free') {
    // ...
  }
  
  const getDecorationStyle = () => {
    switch (basePackageType) {
      case 'free': return 'leaf';
      case 'plus': return 'lead';
      case 'premium': return 'platinum';
      case 'premiumPlus': return 'gold';
      default: return 'lead';
    }
  };
  // ...
}
```

## Результат
Теперь цвета карт правильно меняются для всех 7 пакетов:

1. **Free** → без декорации
2. **Plus** (месячный/годовой) → свинцовый металл
3. **Premium** (месячный/годовой) → платиновый металл  
4. **Premium+** (месячный/годовой) → золотой металл

Цвета карт теперь зависят от базового типа пакета, а не от периода подписки. 