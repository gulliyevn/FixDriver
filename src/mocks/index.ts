// ===== ЦЕНТРАЛИЗОВАННЫЕ МОКИ =====

// Константы для всех моков
export * from './constants';

// Данные пользователей
export * from './data/users';

// Фабрики для создания моков
export * from './factories';

// Моки заказов и чатов
export * from './orders';

// Остальные моки (уведомления, пакеты, дети и т.д.)
export * from './other';

// Моки аутентификации (экспортируем только функции, не mockUsers)
export { 
  findAuthUserByCredentials, 
  findAuthUserByEmail, 
  createAuthMockUser 
} from './auth';

// Моки адресов
export * from './residenceMock';

// Моки помощи
export * from './paymentHelpMock';
export * from './safetyHelpMock';
export * from './bookingHelpMock';
export * from './rulesMock';

// Моки платежей и финансов
export * from './paymentHistoryMock';
export * from './balanceMock';
export * from './cardsMock';
export * from './debtsMock';

// Моки автомобилей
export * from './carsMock';

// Моки водителей
export * from './driversMock';

// Моки расписания
export * from './scheduleMock';

// Моки уведомлений
export * from './notificationsMock';

// Моки заказов (новые)
export * from './ordersMock'; 