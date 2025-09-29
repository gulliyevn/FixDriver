// Централизованное управление ассетами
// Предотвращает дубликаты путей и облегчает обновление

export const ASSETS = {
  // Логотипы
  LOGO_ICON: require('../../../assets/icon.png'),
  LOGO_MAIN: require('../../../assets/Logo.png'),
  
  // Иконки приложения
  ADAPTIVE_ICON: require('../../../assets/adaptive-icon.png'),
  NOTIFICATION_ICON: require('../../../assets/notification-icon.png'),
  FAVICON: require('../../../assets/favicon.png'),
  SPLASH: require('../../../assets/splash.png'),
  
  // Другие ассеты
  DACO: require('../../../assets/Daco_822024.png'),
  
  // Vehicles
  VEHICLES: {
    TOYOTA_CAMRY: require('../../../assets/vehicles/toyota-camry.jpg'),
  },
} as const;

export default ASSETS;
