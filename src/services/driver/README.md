# Driver Vehicle Service - Интеграция с БД

## Обзор

Сервис для управления автомобилями водителя с полной интеграцией с базой данных через REST API.

## Структура данных

### DriverVehicle (Основная модель)
```typescript
interface DriverVehicle {
  id: string;                    // Уникальный идентификатор
  driverId: string;              // ID водителя
  vehicleNumber: string;         // Номер автомобиля
  tariff: string;                // Тариф (Стандарт/Премиум/Эконом)
  carBrand: string;              // Марка автомобиля
  carModel: string;              // Модель автомобиля
  carYear: string;               // Год выпуска
  carMileage: string;            // Пробег в км
  passportPhoto?: string;        // URL фото техпаспорта
  isActive: boolean;             // Активен ли автомобиль
  createdAt: string;             // Дата создания
  updatedAt: string;             // Дата обновления
}
```

## API Endpoints

### Получение списка автомобилей
```
GET /driver/vehicles
```
**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "driverId": "driver-1",
      "vehicleNumber": "АА 123 ББ",
      "tariff": "Стандарт",
      "carBrand": "Toyota",
      "carModel": "Camry",
      "carYear": "2020",
      "carMileage": "45000",
      "passportPhoto": "https://example.com/passport1.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Получение конкретного автомобиля
```
GET /driver/vehicles/{vehicleId}
```

### Создание нового автомобиля
```
POST /driver/vehicles
```
**Тело запроса:**
```json
{
  "vehicleNumber": "АА 123 ББ",
  "tariff": "Стандарт",
  "carBrand": "Toyota",
  "carModel": "Camry",
  "carYear": "2020",
  "carMileage": "45000",
  "passportPhoto": "https://example.com/passport1.jpg"
}
```

### Обновление автомобиля
```
PUT /driver/vehicles/{vehicleId}
```

### Удаление автомобиля
```
DELETE /driver/vehicles/{vehicleId}
```

### Активация/деактивация автомобиля
```
PATCH /driver/vehicles/{vehicleId}/toggle
```
**Тело запроса:**
```json
{
  "isActive": true
}
```

### Загрузка фото техпаспорта
```
POST /driver/vehicles/{vehicleId}/passport-photo
```
**Content-Type:** `multipart/form-data`

## Использование в компонентах

### Хук useDriverVehicles

```typescript
import { useDriverVehicles } from '../../hooks/driver/useDriverVehicles';

const MyComponent = () => {
  const {
    vehicles,
    loading,
    error,
    currentVehicle,
    loadVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleActive,
    uploadPassportPhoto,
    validateVehicleForm,
    getActiveVehicle,
    clearError,
    clearCurrentVehicle,
  } = useDriverVehicles();

  // Загрузка автомобилей при монтировании
  useEffect(() => {
    loadVehicles();
  }, []);

  // Создание нового автомобиля
  const handleCreateVehicle = async (formData) => {
    const errors = validateVehicleForm(formData);
    if (Object.keys(errors).length === 0) {
      const result = await createVehicle(formData);
      if (result) {
        // Успешно создан
        console.log('Автомобиль создан:', result);
      }
    }
  };

  return (
    <View>
      {loading && <Text>Загрузка...</Text>}
      {error && <Text>Ошибка: {error}</Text>}
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </View>
  );
};
```

## Переводы

Все тексты поддерживают 8 языков:
- Русский (ru)
- Английский (en)
- Немецкий (de)
- Французский (fr)
- Испанский (es)
- Турецкий (tr)
- Азербайджанский (az)
- Арабский (ar)

### Ключи переводов

```typescript
// Основные ключи
t('profile.vehicles.title')           // "Мои Автомобили"
t('profile.vehicles.addVehicle')      // "Добавить автомобиль"
t('profile.vehicles.editVehicle')     // "Редактировать автомобиль"

// Поля формы
t('profile.vehicles.vehicleNumber')   // "Номер автомобиля"
t('profile.vehicles.tariff')          // "Тариф"
t('profile.vehicles.carBrand')        // "Марка автомобиля"
t('profile.vehicles.carModel')        // "Модель автомобиля"
t('profile.vehicles.carYear')         // "Год выпуска"
t('profile.vehicles.carMileage')      // "Пробег автомобиля"
t('profile.vehicles.passportPhoto')   // "Фото техпаспорта"

// Ошибки
t('profile.vehicles.loadError')       // "Не удалось загрузить автомобили"
t('profile.vehicles.createError')     // "Не удалось создать автомобиль"
t('profile.vehicles.updateError')     // "Не удалось обновить автомобиль"
t('profile.vehicles.deleteError')     // "Не удалось удалить автомобиль"
```

## Валидация

Форма автомобиля включает валидацию всех обязательных полей:

- **vehicleNumber**: Обязательное поле
- **tariff**: Обязательное поле
- **carBrand**: Обязательное поле
- **carModel**: Обязательное поле
- **carYear**: Обязательное поле
- **carMileage**: Обязательное поле
- **passportPhoto**: Опциональное поле

## Тестирование

Для тестирования используются мок-данные из `src/mocks/driverVehiclesMock.ts`:

```typescript
import { mockDriverVehicles, mockVehicleResponse } from '../mocks/driverVehiclesMock';

// Использование в тестах
test('should load vehicles', () => {
  // Тест с мок-данными
});
```

## Обработка ошибок

Все методы API возвращают стандартизированный ответ:

```typescript
interface VehicleResponse {
  success: boolean;
  data?: DriverVehicle;
  error?: string;
}
```

## Безопасность

- Все запросы требуют аутентификации
- Валидация данных на клиенте и сервере
- Проверка прав доступа к автомобилям водителя
- Безопасная загрузка файлов с валидацией типов

## Производительность

- Кэширование списка автомобилей
- Ленивая загрузка фото
- Оптимизированные запросы к БД
- Пагинация для больших списков (если потребуется)
