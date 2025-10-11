/**
 * Dev Mode Configuration
 * 
 * Этот файл управляет DEV режимом для регистрации/логина
 * для прохождения проверки маркетплейса
 */

// 🔧 ВКЛЮЧИ/ВЫКЛЮЧИ DEV РЕЖИМ ЗДЕСЬ:
export const DEV_MODE_ENABLED = true;

/**
 * Проверяет, включен ли DEV режим
 */
export const isDevModeEnabled = (): boolean => {
  return DEV_MODE_ENABLED;
};

/**
 * Показывает статус DEV режима
 */
export const getDevModeStatus = (): string => {
  return DEV_MODE_ENABLED 
    ? "✅ DEV режим ВКЛЮЧЕН (локальная регистрация/логин)" 
    : "❌ DEV режим ВЫКЛЮЧЕН (используется API)";
};

export default {
  DEV_MODE_ENABLED,
  isDevModeEnabled,
  getDevModeStatus,
};

