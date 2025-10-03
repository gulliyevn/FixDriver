// Константы для иконок функций пакетов
export const PACKAGE_FEATURE_ICONS = [
  { name: "card-outline", color: "#F59E0B" }, // Комиссия
  { name: "cash-outline", color: "#10B981" }, // Кэшбэк
  { name: "star-outline", color: "#3B82F6" }, // Приоритет
  { name: "headset-outline", color: "#8B5CF6" }, // Поддержка
  { name: "time-outline", color: "#EF4444" }, // Гарантия ожидания
  { name: "refresh-outline", color: "#06B6D4" }, // Отмена
  { name: "map-outline", color: "#84CC16" }, // Маршрут
  { name: "calendar-outline", color: "#F97316" }, // Календарь
  { name: "gift-outline", color: "#EC4899" }, // Акции
] as const;

// Константы для карусели
export const CAROUSEL_CONFIG = {
  CARD_WIDTH: 372, // ширина карточки (340) + отступы (16*2)
  LEFT_PADDING: 20,
  RIGHT_PADDING: 20,
  CARD_SPACING: 16,
} as const;

// Константы для анимации
export const ANIMATION_CONFIG = {
  PERIOD_SWITCH_DURATION: 220,
  PERIOD_SWITCH_EASING: "inOut" as const,
} as const;

// Константы для градиента скидки
export const DISCOUNT_GRADIENT = {
  COLORS: ["#00FFFF", "#FF00FF", "#FFFF00"],
  START: { x: 0, y: 0 },
  END: { x: 1, y: 1 },
} as const;

// Константы для иконок
export const ICON_SIZES = {
  FEATURE_ICON: 14,
  CHECKMARK: 16,
  CLOSE: 12,
  SELECTED_INDICATOR: 24,
} as const;

// Константы для цветов
export const COLORS = {
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  PRIMARY: "#3B82F6",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
} as const;

// Интерфейс для функций пакета
export interface PackageFeature {
  name: string;
  free: string | boolean;
  plus: string | boolean;
  premium: string | boolean;
  premiumPlus: string | boolean;
}

// Константы для функций пакетов
export const getPackageFeatures = (
  t: (key: string) => string,
): PackageFeature[] => [
  {
    name: t("premium.features.commission"),
    free: "5%",
    plus: "3%",
    premium: "1%",
    premiumPlus: "0%",
  },
  {
    name: t("premium.features.cashback"),
    free: false,
    plus: "2%",
    premium: "5%",
    premiumPlus: "10%",
  },
  {
    name: t("premium.features.priority"),
    free: false,
    plus: true,
    premium: t("premium.values.high"),
    premiumPlus: t("premium.values.maximum"),
  },
  {
    name: t("premium.features.support"),
    free: t("premium.values.standard"),
    plus: t("premium.values.fast"),
    premium: t("premium.values.vip"),
    premiumPlus: t("premium.values.personal"),
  },
  {
    name: t("premium.features.waitGuarantee"),
    free: false,
    plus: "5 мин",
    premium: "3 мин",
    premiumPlus: "2 мин",
  },
  {
    name: t("premium.features.freeCancellation"),
    free: false,
    plus: "1/мес",
    premium: "2/мес",
    premiumPlus: "5/мес",
  },
  {
    name: t("premium.features.multiRoute"),
    free: false,
    plus: true,
    premium: true,
    premiumPlus: true,
  },
  {
    name: t("premium.features.calendarIntegration"),
    free: false,
    plus: false,
    premium: true,
    premiumPlus: true,
  },
  {
    name: t("premium.features.earlyAccess"),
    free: false,
    plus: false,
    premium: true,
    premiumPlus: true,
  },
];
