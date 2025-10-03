// ===== ЦЕНТРАЛИЗОВАННЫЕ МОКИ =====

// Данные пользователей
export * from "./data/users";

// Моки аутентификации (экспортируем только функции, не mockUsers)
export {
  findAuthUserByCredentials,
  findAuthUserByEmail,
  createAuthMockUser,
} from "./auth";

// Моки платежей и финансов
export * from "./balanceMock";

// Моки водителей удалены - используем данные из data/users.ts

// Моки расписания удалены

// Моки уведомлений удалены

// Моки заказов удалены
